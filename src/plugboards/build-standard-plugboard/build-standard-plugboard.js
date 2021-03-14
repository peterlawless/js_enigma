import BiMap from "mnemonist/bi-map";
import { getLetterMappingFrom, validateUniqueMapping } from "../../utils";

const makeStandardPlugboard = letterPairs => {
  const plugboard = BiMap.from(letterPairs);
  validateUniqueMapping(plugboard);
  return getLetterMappingFrom(plugboard);
};

export default makeStandardPlugboard;
