import { ALPHABET_BI_MAP, ROTOR_TURNOVER_LETTERS } from "../constants";

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
 * @function getRingElementWithRespectToRingPosition
 * @param {string} ringPosition the letter a rotor is set to (Ringstellung)
 * @returns {(letter: string) => string}
 * @description Given a rotor setting, returns a function that determines which ring element a plaintext letter connects to
 */
export const getRingElementWithRespectToRingPosition = ringPosition => letter => {
  // how many elements is the ring displaced from the 'A' position?
  const ringOffset = getDistanceBetweenLetters("A", ringPosition);
  // what ring element (i.e., letter) is our input letter connecting to?
  return getLetterPlusShift(letter, ringOffset);
};

// Thanks, Eric Elliot!
export const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

export const rotorEncrypt = (ringPosition, rotor) => {
  // how many elements is the ring displaced from the 'A' position?
  const ringOffset = getDistanceBetweenLetters("A", ringPosition);
  return letter => {
    // what ring element (i.e., letter) is our input letter connecting to?
    const ringElementToPerformShift = getLetterPlusShift(letter, ringOffset);
    // how how many elements does that ring element shift our input letter?
    const ringElementShift = getDistanceBetweenLetters(
      ringElementToPerformShift,
      rotor.get(ringElementToPerformShift)
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
  return /^[A-Z]{1}$/.test(letter);
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

export function isOnTurnoverLetter(rotor) {
  return !!ROTOR_TURNOVER_LETTERS[rotor.model][rotor.exposedLetter];
}