import advanceRotors from "../advance-rotors";
import makeEnigma from "../make-enigma";
import { isSingleLetter } from "../../utils";

/**
 * @description this function will likely be useful for an "interactive mode" simulator where the user wants to encrypt one letter at a time
 * @returns {Array} first element is the encrypted letter, second element is the settings after the rotors have been advanced
 */
export const singleKeyDepress = (enigma, rotorSettings, letter) => {
  const newSettings = advanceRotors(rotorSettings);
  const encrypt = enigma(newSettings);
  return [encrypt(letter), newSettings];
};

const enigmaEncrypt = (plugboard, reflector, initialSettings) => {
  const staticEnigmaConfig = makeEnigma(reflector, plugboard);
  return plainText => {
    const cipherText = [];
    let cipherChar;
    let rotorSettings = initialSettings;

    plainText
      .toUpperCase()
      .split("")
      .forEach(char => {
        if (isSingleLetter(char)) {
          [cipherChar, rotorSettings] = singleKeyDepress(
            staticEnigmaConfig,
            rotorSettings,
            char
          );
          cipherText.push(cipherChar);
        } else {
          // punctuation, whitespace, NUMBERS, etc., will just be appended as-is
          // If the objective is to be truly authentic, the plaintext should be "cleaned"
          // with letter encodings or abbreviations for numbers and punctuation
          // https://en.wikipedia.org/wiki/Enigma_machine#Additional_details
          cipherText.push(char);
        }
      });
    return cipherText.join("");
  };
};

export default enigmaEncrypt;
