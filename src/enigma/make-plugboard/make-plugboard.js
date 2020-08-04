import BiMap from "mnemonist/bi-map";
import { getLetterMappingFrom, isSingleLetter } from "../../utils";

const validateIsSingleLetter = letter => {
  if (!isSingleLetter(letter)) {
    throw new Error(`invalid letter: ${letter}`);
  }
};

const validateUniqueMapping = (letter, biMap) => {
  if (biMap.has(letter)) {
    throw new Error(`dual mapping for letter: ${letter}`);
  }
};

const makePlugboard = letterPairs => {
  const plugboard = BiMap.from(letterPairs);
  for (let [key, value] of plugboard) {
    validateIsSingleLetter(key);
    validateIsSingleLetter(value);
    validateUniqueMapping(key, plugboard.inverse);
    validateUniqueMapping(value, plugboard);
  }
  return getLetterMappingFrom(plugboard);
};

export default makePlugboard;
