import { rotorEncrypt } from "../../utils";

/**
 *
 * @typedef {Object} ringStellung
 * @property {Object} rotor
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
 * @param {Array.<ringStellung>} settings ring settings including the rotor bimap and the ringStellung in an array read from left to right
 * @returns {rotorScrambler}
 */
const makeRotorScrambler = settings => {
  const forward = letter =>
    settings
      .map(({ ringPosition, rotor: { wiring } }) =>
        rotorEncrypt(ringPosition, wiring)
      )
      .reduceRight(
        (cipherLetter, rotorScramble) => rotorScramble(cipherLetter),
        letter
      );

  const backward = letter =>
    settings
      .map(({ ringPosition, rotor: { wiring } }) =>
        rotorEncrypt(ringPosition, wiring.inverse)
      )
      .reduce(
        (cipherLetter, rotorScramble) => rotorScramble(cipherLetter),
        letter
      );

  return { forward, backward };
};

export default makeRotorScrambler;
