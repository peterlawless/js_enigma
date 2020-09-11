import BiMap from "mnemonist/bi-map";
import { getLetterMappingFrom, validateIsSingleLetter } from "../../utils";

const validateUniqueMapping = (letter, biMap) => {
  if (biMap.has(letter)) {
    throw new Error(`dual mapping for letter: ${letter}`);
  }
};

const makeStandardPlugboard = letterPairs => {
  const plugboard = BiMap.from(letterPairs);
  for (let [key, value] of plugboard) {
    validateIsSingleLetter(key);
    validateIsSingleLetter(value);
    validateUniqueMapping(key, plugboard.inverse);
    validateUniqueMapping(value, plugboard);
  }
  return getLetterMappingFrom(plugboard);
};

export default makeStandardPlugboard;
