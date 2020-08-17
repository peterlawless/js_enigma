import { ALPHABET_BI_MAP } from "../constants";

export const getDistanceBetweenLetters = (letter1, letter2) =>
  (ALPHABET_BI_MAP.get(letter2) - ALPHABET_BI_MAP.get(letter1) + 26) % 26;

/**
 * @function getRingElementShiftForRotor
 * @param {BiMap} rotor
 * @returns {(ringElementToPerformShift: string) => number}
 * @description Given a rotor, returns the shift (number) associated with a particular ring element (letter)
 */
export const getRingElementShiftForRotor = rotor => ringElementToPerformShift =>
  getDistanceBetweenLetters(
    ringElementToPerformShift,
    rotor.get(ringElementToPerformShift)
  );

/**
 *
 * @param {string} letter single uppercase letter
 * @param {number} shift positive integer
 * @returns {string} letter found 'shift' elements away from the input letter
 */
export const getLetterPlusShift = (letter, shift) =>
  getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + shift);

/**
 * @function getRingElementWithRespectToRotorPosition
 * @param {string} rotorPosition the letter a rotor is set to
 * @returns {(letter: string) => string}
 * @description Given a rotor setting, returns a function that determines which ring element a plaintext letter connects to
 */
export const getRingElementWithRespectToRotorPosition = rotorPosition => letter => {
  // how many elements is the ring displaced from the 'A' position?
  const ringOffset = getDistanceBetweenLetters("A", rotorPosition);
  // what ring element (i.e., letter) is our input letter connecting to?
  return getLetterPlusShift(letter, ringOffset);
};

// Thanks, Eric Elliot!
export const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

export const rotorEncrypt = (rotorPosition, rotorWiring) => {
  // how many elements is the ring displaced from the 'A' position?
  const ringOffset = getDistanceBetweenLetters("A", rotorPosition);
  return letter => {
    // what ring element (i.e., letter) is our input letter connecting to?
    const ringElementToPerformShift = getLetterPlusShift(letter, ringOffset);
    // how how many elements does that ring element shift our input letter?
    const ringElementShift = getDistanceBetweenLetters(
      ringElementToPerformShift,
      rotorWiring.get(ringElementToPerformShift)
    );
    // what is the resulting letter after that shift?
    const cipherLetter = getLetterPlusShift(letter, ringElementShift);
    return cipherLetter;
  };
};

export function shiftLetter(letter, number) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + number);
}

export function isSingleLetter(letter) {
  return ALPHABET_BI_MAP.has(letter);
}

export const getLetterMappingFrom = biMap => letter =>
  biMap.get(letter) || biMap.inverse.get(letter) || letter;

export function alphabetLoopIncrement(letter) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + 1);
}

export function alphabetLoopDecrement(letter) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) - 1);
}

function getLetterFromNumber(number) {
  return ALPHABET_BI_MAP.inverse.get((number + 26) % 26);
}
