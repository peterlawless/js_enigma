import { rotorEncrypt } from "../utils";

/**
 *
 * @param {Array.<{rotor: rotor, ringPosition: string}>} settings ring settings including the rotor bimap and the ringStellung in an array read from left to right
 */
const makeRotorScrambler = settings => {
  const forward = letter =>
    settings
      .map(({ ringPosition, rotor }) => rotorEncrypt(ringPosition, rotor))
      .reduceRight(
        (cipherLetter, rotorScramble) => rotorScramble(cipherLetter),
        letter
      );

  const backward = letter =>
    settings
      .map(({ ringPosition, rotor }) =>
        rotorEncrypt(ringPosition, rotor.inverse)
      )
      .reduce(
        (cipherLetter, rotorScramble) => rotorScramble(cipherLetter),
        letter
      );

  return { forward, backward };
};

export default makeRotorScrambler;
