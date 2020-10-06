import advanceRotors from "./advance-rotors";
import makeRotorScrambler from "./make-rotor-scrambler";
import {
  compose,
  getLetterFromNumericKey,
  getNumericKeyFromLetter,
  isSingleLetter,
  validateIsSingleLetter
} from "../utils";

class Enigma {
  // private instance fields
  #rotorSettings;
  #plugboard;
  #reflector;
  #rotorCount;
  #hasNumericRotorKeys;

  constructor(rotorCount = 3) {
    this.#rotorCount = rotorCount;
    this.#rotorSettings = new Array(rotorCount).fill({}, 0, rotorCount); // empty configuration but ready for mapping
    this.#plugboard = letter => letter; // sensible default: no patch cables installed
  }

  #validateArgumentsLength = args => {
    if (!(args.length === this.#rotorCount)) {
      throw new Error(
        `expected ${this.#rotorCount} arguments but got ${args.length} instead`
      );
    }
  };

  #validateRotorConfiguration = args => {
    const validatedSettings = [];
    this.#validateArgumentsLength(args);
    const warningStatement =
      "Avoid switching between alphabetic and numeric settings keys as this will change the format of read-only rotorPositions property";
    for (const element of args) {
      if (typeof element === "string") {
        validatedSettings.push(validateIsSingleLetter(element));
        if (this.#hasNumericRotorKeys === undefined) {
          this.#hasNumericRotorKeys = false;
        } else if (this.#hasNumericRotorKeys) {
          console.warn(warningStatement);
          this.#hasNumericRotorKeys = false;
        }
      } else if (typeof element === "number") {
        validatedSettings.push(getLetterFromNumericKey(element));
        if (this.#hasNumericRotorKeys === undefined) {
          this.#hasNumericRotorKeys = true;
        } else if (!this.#hasNumericRotorKeys) {
          console.warn(warningStatement);
          this.#hasNumericRotorKeys = true;
        }
      } else {
        throw new Error(
          `only capital letters A-Z or numbers 1-26 are permitted input`
        );
      }
    }
    return validatedSettings;
  };

  encryptCharacter = letter => {
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
    plainText.split("").map(this.encryptCharacter).join("");
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
    this.#validateArgumentsLength(rotors);
    this.#rotorSettings = this.#rotorSettings.map((rotorSetting, index) => ({
      ...rotorSetting,
      rotor: rotors[index]
    }));
    return this;
  };

  withRingSettings = (...ringSettings) => {
    const validatedRingSettings = this.#validateRotorConfiguration(
      ringSettings
    );
    this.#rotorSettings = this.#rotorSettings.map((rotorSetting, index) => ({
      ...rotorSetting,
      ringSetting: validatedRingSettings[index]
    }));
    return this;
  };

  withRotorPositions = (...rotorPositions) => {
    const validatedRotorPositions = this.#validateRotorConfiguration(
      rotorPositions
    );
    this.#rotorSettings = this.#rotorSettings.map((rotorSetting, index) => ({
      ...rotorSetting,
      rotorPosition: validatedRotorPositions[index]
    }));
    return this;
  };

  get rotorPositions() {
    return this.#rotorSettings.map(({ rotorPosition }) =>
      this.#hasNumericRotorKeys
        ? getNumericKeyFromLetter(rotorPosition)
        : rotorPosition
    );
  }
}

export default Enigma;
