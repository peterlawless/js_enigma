import { rotorEncrypt } from "../../utils";

/**
 *
 * @typedef {Object} rotorSetting
 * @property {Object} rotor
 * @property {string} rotorPosition
 * @property {string} ringPosition
 */

/**
 * 
 * @typedef {Object} rotorScrambler 
 * @property {function forward(letter: string) {
   cipherLetter: string
 }}
 @property {function backward(letter: string) {
  cipherLetter: string
}}
 */

/**
 *
 * @param {Array.<rotorSetting>} settings ring settings including the rotor bimap and the ringStellung in an array read from left to right
 * @returns {rotorScrambler}
 */
const makeRotorScrambler = settings => {
  const forward = letter =>
    settings
      .map(({ rotorPosition, rotor: { wiring } }) =>
        rotorEncrypt(wiring, rotorPosition)
      )
      .reduceRight(
        (cipherLetter, rotorScramble) => rotorScramble(cipherLetter),
        letter
      );

  const backward = letter =>
    settings
      .map(({ rotorPosition, rotor: { wiring } }) =>
        rotorEncrypt(wiring.inverse, rotorPosition)
      )
      .reduce(
        (cipherLetter, rotorScramble) => rotorScramble(cipherLetter),
        letter
      );

  return { forward, backward };
};

export default makeRotorScrambler;
