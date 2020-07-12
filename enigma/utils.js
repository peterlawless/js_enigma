import {
  ALPHABET_BI_MAP,
  ROTOR_TURNOVER_LETTERS,
  ROTORS,
  GREEK_WHEELS,
  REFLECTORS,
  GREEK_WHEEL,
  SLOW_ROTOR,
  CENTER_ROTOR,
  FAST_ROTOR,
  MODEL,
  EXPOSED_LETTER,
} from "./constants";

export function shiftNumber(letter1, letter2) {
  return (
    (ALPHABET_BI_MAP.get(letter2) - ALPHABET_BI_MAP.get(letter1) + 26) % 26
  );
}

export function shiftLetter(letter, number) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + number);
}

export function isSingleLetter(letter) {
  return /^[A-Z]{1}$/.test(letter);
}

export function getLetterMappingFrom(letter, biMap) {
  return biMap.get(letter) || biMap.inverse.get(letter) || letter;
}

export function alphabetLoopIncrement(letter) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + 1);
}

export function alphabetLoopDecrement(letter) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) - 1);
}

function getLetterFromNumber(number) {
  return ALPHABET_BI_MAP.inverse.get((number + 26) % 26);
}

export function isOnTurnoverLetter(rotor) {
  return !!ROTOR_TURNOVER_LETTERS[rotor.model][rotor.exposedLetter];
}

export function enigmaAdvance(scrambler) {
  return {
    ...scrambler,
    [FAST_ROTOR]: {
      ...scrambler[FAST_ROTOR],
      exposedLetter: alphabetLoopIncrement(scrambler[FAST_ROTOR].exposedLetter),
    },
    [CENTER_ROTOR]: {
      ...scrambler[CENTER_ROTOR],
      exposedLetter: isOnTurnoverLetter(scrambler[FAST_ROTOR])
        ? alphabetLoopIncrement(scrambler[CENTER_ROTOR].exposedLetter)
        : scrambler[CENTER_ROTOR].exposedLetter,
    },
    [SLOW_ROTOR]: {
      ...scrambler[SLOW_ROTOR],
      exposedLetter:
        isOnTurnoverLetter(scrambler[FAST_ROTOR]) &&
        isOnTurnoverLetter(scrambler[CENTER_ROTOR])
          ? alphabetLoopIncrement(scrambler[SLOW_ROTOR].exposedLetter)
          : scrambler[SLOW_ROTOR].exposedLetter,
    },
  };
}

function makeScrambler(
  scramblerConfig = {
    [GREEK_WHEEL]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: "",
    },
    [SLOW_ROTOR]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: "",
    },
    [CENTER_ROTOR]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: "",
    },
    [FAST_ROTOR]: {
      [MODEL]: "",
      [EXPOSED_LETTER]: "",
    },
  }
) {
  return [
    {
      wheel: ROTORS[scramblerConfig[FAST_ROTOR][MODEL]],
      rotorOffset: shiftNumber(
        "A",
        scramblerConfig[FAST_ROTOR][EXPOSED_LETTER]
      ),
    },
    {
      wheel: ROTORS[scramblerConfig[CENTER_ROTOR][MODEL]],
      rotorOffset: shiftNumber(
        "A",
        scramblerConfig[CENTER_ROTOR][EXPOSED_LETTER]
      ),
    },
    {
      wheel: ROTORS[scramblerConfig[SLOW_ROTOR][MODEL]],
      rotorOffset: shiftNumber(
        "A",
        scramblerConfig[SLOW_ROTOR][EXPOSED_LETTER]
      ),
    },
    {
      wheel: GREEK_WHEELS[scramblerConfig[GREEK_WHEEL][MODEL]],
      rotorOffset: shiftNumber(
        "A",
        scramblerConfig[GREEK_WHEEL][EXPOSED_LETTER]
      ),
    },
  ];
}

export const rotorScramble = (scrambler) => (reflector) => (letter) =>
  scrambler.reduceRight(
    function (previousValue, currentValue) {
      // after hitting the reflector, enigma works the same way, but the wiring connections are reversed from this perspective,
      // so we use the inverse mapping of the rotor/wheel
      const connectionElement = shiftLetter(
        previousValue,
        currentValue.rotorOffset
      );
      const totalShift = shiftNumber(
        connectionElement,
        currentValue.wheel.inverse.get(connectionElement)
      );
      return shiftLetter(previousValue, totalShift);
    },
    REFLECTORS[reflector].get(
      scrambler.reduce(function (accumulator, currentValue) {
        // accumulator is a LETTER, not a number
        // currentValue is an element in scrambler

        // all shifts are calculated with respect to the orientation of the entrywheel,
        // whose elements are in alphabetical order with 'A' as the 'exposedLetter'

        // find which letter is actually in currentValue's 'accumulator' position
        const connectionElement = shiftLetter(
          accumulator,
          currentValue.rotorOffset
        );

        // find the shift associated with that letter
        const totalShift = shiftNumber(
          connectionElement,
          currentValue.wheel.get(connectionElement)
        );

        // return the letter having undergone that shift
        return shiftLetter(accumulator, totalShift);
      }, letter)
    )
  );
