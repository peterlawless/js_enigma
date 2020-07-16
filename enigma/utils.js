import {
  ALPHABET_BI_MAP,
  ROTOR_TURNOVER_LETTERS,
  GREEK_WHEELS,
  REFLECTORS
} from "./constants";

export const distanceBetweenLetters = (letter1, letter2) =>
  (ALPHABET_BI_MAP.get(letter2) - ALPHABET_BI_MAP.get(letter1) + 26) % 26;

export const getLetterPlusShift = (letter, number) =>
  getLetterFromNumber(ALPHABET_BI_MAP.get(letter) + number);

export const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

export const makeRotorScrambler = ringPosition => rotor => letter => {
  // how many elements is the ring displaced from the 'A' position?
  const ringOffset = distanceBetweenLetters("A", ringPosition);
  // what ring element (i.e., letter) is our input letter connecting to?
  const ringElementToPerformShift = getLetterPlusShift(letter, ringOffset);
  // how how many elements does that ring element shift our input letter?
  const ringElementShift = distanceBetweenLetters(
    ringElementToPerformShift,
    rotor.get(ringElementToPerformShift)
  );
  // what is the resulting letter after that shift?
  const cipherLetter = getLetterPlusShift(letter, ringElementShift);
  return cipherLetter;
};

export const makeM4Reflector = (
  thinReflector = REFLECTORS.b,
  greekWheel = GREEK_WHEELS.beta,
  ringPosition = "A"
) => letter => {
  const greekWheelScrambler = makeRotorScrambler(ringPosition);
  return compose(
    greekWheelScrambler(greekWheel.inverse),
    getLetterMappingFrom(thinReflector),
    greekWheelScrambler(greekWheel)
  )(letter);
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
