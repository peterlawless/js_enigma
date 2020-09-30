import advanceRotors from "./advance-rotors";
import makeRotorScrambler from "./make-rotor-scrambler";
import {
  compose,
  getLetterFromNumericKey,
  getNumericKeyFromLetter,
  isSingleLetter,
  rotorEncrypt,
  validateIsSingleLetter
} from "../utils";

// function instead of fat arrow to make it "bindable"
function validateArrayLengthOf(arrLength) {
  return function (arr) {
    if (!(arr instanceof Array)) {
      throw new Error(
        `Expected an array but instead received: ${arr.constructor.name}`
      );
    }
    if (arr.length !== arrLength) {
      throw new Error(
        `Expected ${arrLength} elements but instead received: ${arr.length}`
      );
    }
  };
}

class Enigma {
  // private instance fields
  #rotorSettings;
  #plugboard;
  #reflector;
  #withNumericKeys = false;

  constructor(rotorCount = 3) {
    this.validateArrayLength = validateArrayLengthOf(rotorCount).bind(this);
    this.#rotorSettings = new Array(rotorCount).fill({}, 0, rotorCount); // empty configuration but ready for mapping
    this.#plugboard = letter => letter; // sensible default: no patch cables installed
  }

  encryptLetter = letter => {
    // punctuation, whitespace, NUMBERS, etc., will just be appended as-is
    // If the objective is to be truly authentic, the plaintext should be "cleaned"
    // with letter encodings or abbreviations for numbers and punctuation
    // https://en.wikipedia.org/wiki/Enigma_machine#Additional_details
    const uppercaseLetter = letter.toUpperCase();
    if (isSingleLetter(uppercaseLetter)) {
      this.#rotorSettings = advanceRotors(this.#rotorSettings);
      const rotorScrambler = makeRotorScrambler(this.#rotorSettings);
      return compose(
        this.#plugboard,
        rotorScrambler.backward,
        this.#reflector,
        rotorScrambler.forward,
        this.#plugboard
      )(letter);
    } else {
      return letter;
    }
  };

  encryptMessage = plainText => {
    plainText.split("").map(this.encryptLetter).join("");
  };

  withPlugboard = plugBoard => {
    this.#plugboard = plugBoard;
    return this;
  };

  withReflector = reflector => {
    this.#reflector = reflector;
    return this;
  };

  withRotors = (...rotors) => {
    this.validateArrayLength(rotors);
    this.#rotorSettings = this.#rotorSettings.map((rotorSetting, index) => ({
      ...rotorSetting,
      rotor: rotors[index]
    }));
    return this;
  };

  withRingSettings = (...ringSettings) => {
    this.validateArrayLength(ringSettings);
    ringSettings.forEach(validateIsSingleLetter);
    this.#rotorSettings = this.#rotorSettings.map((rotorSetting, index) => ({
      ...rotorSetting,
      ringSetting: ringSettings[index]
    }));
    return this;
  };

  withRotorPositions = (...rotorPositions) => {
    this.validateArrayLength(rotorPositions);
    rotorPositions.forEach(validateIsSingleLetter);
    this.#rotorSettings = this.#rotorSettings.map((rotorSetting, index) => ({
      ...rotorSetting,
      rotorPosition: rotorPositions[index]
    }));
    return this;
  };

  get rotorPositions() {
    return this.#rotorSettings.map(({ rotorPosition }) => rotorPosition);
  }
}

export default Enigma;

// map over inputs
// make sure they are either all letters or numeric keys
// if (typeof element === "string") {
//   validateIsSingleLetter(element)
// } else if (typeof element === "number") {
//   getLetterFromNumericKey(element)
// }
