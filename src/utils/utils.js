import { ALPHABET_BI_MAP } from "../constants";

export const getDistanceBetweenLetters = (letter1, letter2) =>
  (ALPHABET_BI_MAP.get(letter2) - ALPHABET_BI_MAP.get(letter1) + 26) % 26;

/**
 *
 * @param {string} letter single uppercase letter
 * @param {number} shift positive integer
 * @returns {string} letter found 'shift' elements away from the input letter
 */
export const getLetterPlusShift = (letter, shift) =>
  getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + shift);

// Thanks, Eric Elliot!
export const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

export const rotorEncrypt = (rotorWiring, rotorPosition, ringSetting = "A") => {
  // https://www.cryptomuseum.com/crypto/enigma/working.htm
  // Each wheel has a ring that can be used to rotate the wiring independently of the index.
  // This can be regarded as creating an offset in the opposite direction.
  // The wheel-turnover notches are fixed to the index ring.
  // Therefore the turnover of the next wheel, will always happen at the same letter in the window,
  // but the wiring might be rotated.
  const rotorOffset = getDistanceBetweenLetters(ringSetting, rotorPosition);
  return letter => {
    // what wiring element (i.e., letter key on the rotor wiring) is our input letter connecting to?
    const wiringElementToPerformShift = getLetterPlusShift(letter, rotorOffset);
    // how how many elements does that ring element shift our input letter?
    const wiringElementShift = getDistanceBetweenLetters(
      wiringElementToPerformShift,
      rotorWiring.get(wiringElementToPerformShift)
    );
    // what is the resulting letter after that shift?
    const cipherLetter = getLetterPlusShift(letter, wiringElementShift);
    return cipherLetter;
  };
};

export function shiftLetter(letter, number) {
  return getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + number);
}

export function isSingleLetter(letter) {
  return ALPHABET_BI_MAP.has(letter);
}

export const validateIsSingleLetter = letter => {
  if (!isSingleLetter(letter)) {
    throw new Error(`invalid letter: ${letter}`);
  } else {
    return true;
  }
};

export const getLetterFromNumericKey = int => {
  const letter = ALPHABET_BI_MAP.inverse.get(int - 1);
  if (!letter) {
    throw new Error(`invalid numeric key: ${int}`);
  } else {
    return letter;
  }
};

export const getNumericKeyFromLetter = letter =>
  ALPHABET_BI_MAP.get(letter) + 1;

export const validateUniqueMapping = biMap => {
  for (let [key, value] of biMap) {
    validateIsSingleLetter(key);
    validateIsSingleLetter(value);
    if (biMap.has(value)) {
      throw new Error(`dual mapping for letter: ${value}`);
    } else if (biMap.inverse.has(key)) {
      throw new Error(`dual mapping for letter: ${key}`);
    }
  }
};

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
