import BiMap from "mnemonist/bi-map";

import {
  compose,
  getLetterPlusShift,
  distanceBetweenLetters,
  isSingleLetter,
  getLetterMappingFrom
} from "./utils";

import {
  ROTORS,
  GREEK_WHEELS,
  REFLECTORS,
  REFLECTOR,
  GREEK_WHEEL,
  SLOW_ROTOR,
  CENTER_ROTOR,
  FAST_ROTOR,
  MODEL,
  EXPOSED_LETTER
} from "./constants";

// what doesn't change?
// reflector, plugboard, greek wheel, rotor MODELS
// what does change?
// plaintext letter, rotor exposed letters

// Needed utilities: makeM4Reflector(reflectorModel, greekWheelModel, greekWheelExposedLetter),
// makeRotor(rotorModel, exposedLetter) these can handle validation, too

// (reflector, greekwheel = , [rotorModels], plugboard ) => ([rotorLetters], plaintextLeter) => ciphertextLetter
// const enigma = (reflector, greekWheel, rotorModels, plugBoard) =>

export default function enigma(
  plainletter,
  scrambler = {
    [REFLECTOR]: "",
    [GREEK_WHEEL]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: ""
    },
    [SLOW_ROTOR]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: ""
    },
    [CENTER_ROTOR]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: ""
    },
    [FAST_ROTOR]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: ""
    }
  },
  plugBoard = {}
) {
  const plugBoardBiMap = BiMap.from(plugBoard);

  // one iteration for input validation
  plugBoardBiMap.forEach((value, key) => {
    if (!(isSingleLetter(key) || isSingleLetter(value))) {
      throw Error(
        "all keys and values in input 'plugBoard' must be single uppercase letters"
      );
    }
    if (plugBoardBiMap.inverse.has(key)) {
      throw Error(`duplicate mapping to letter '${key}' in plugBoard`);
    }
  });

  const getPlugboardLetter = getLetterMappingFrom(plugBoardBiMap);
  const getReflectorLetter = getLetterMappingFrom(
    REFLECTORS[scrambler[REFLECTOR]]
  );

  // TODO: limit size of plugBoard to 7(?) or however many cables were issued with the machine

  // Create an array expressing the scrambler configuration of the enigma
  var arr = [
    {
      wheel: ROTORS[scrambler[FAST_ROTOR][MODEL]],
      rotorOffset: distanceBetweenLetters(
        "A",
        scrambler[FAST_ROTOR][EXPOSED_LETTER]
      )
    },
    {
      wheel: ROTORS[scrambler[CENTER_ROTOR][MODEL]],
      rotorOffset: distanceBetweenLetters(
        "A",
        scrambler[CENTER_ROTOR][EXPOSED_LETTER]
      )
    },
    {
      wheel: ROTORS[scrambler[SLOW_ROTOR][MODEL]],
      rotorOffset: distanceBetweenLetters(
        "A",
        scrambler[SLOW_ROTOR][EXPOSED_LETTER]
      )
    },
    {
      wheel: GREEK_WHEELS[scrambler[GREEK_WHEEL][MODEL]],
      rotorOffset: distanceBetweenLetters(
        "A",
        scrambler[GREEK_WHEEL][EXPOSED_LETTER]
      )
    }
  ];

  function rotorScramble(letter) {
    return arr.reduceRight(
      function (previousValue, currentValue) {
        // after hitting the reflector, enigma works the same way, but the wiring connections are reversed from this perspective,
        // so we use the inverse mapping of the rotor/wheel
        const connectionElement = getLetterPlusShift(
          previousValue,
          currentValue.rotorOffset
        );
        const totalShift = distanceBetweenLetters(
          connectionElement,
          currentValue.wheel.inverse.get(connectionElement)
        );
        return getLetterPlusShift(previousValue, totalShift);
      },
      getReflectorLetter(
        arr.reduce(function (accumulator, currentValue) {
          // accumulator is a LETTER, not a number
          // currentValue is an element in arr

          // all shifts are calculated with respect to the orientation of the entrywheel,
          // whose elements are in alphabetical order with 'A' as the 'exposedLetter'

          // find which letter is actually in currentValue's 'accumulator' position
          const connectionElement = getLetterPlusShift(
            accumulator,
            currentValue.rotorOffset
          );

          // find the shift associated with that letter
          const totalShift = distanceBetweenLetters(
            connectionElement,
            currentValue.wheel.get(connectionElement)
          );

          // return the letter having undergone that shift
          return getLetterPlusShift(accumulator, totalShift);
        }, letter)
      )
    );
  }

  return compose(
    getPlugboardLetter,
    rotorScramble,
    getPlugboardLetter
  )(plainletter);
}
