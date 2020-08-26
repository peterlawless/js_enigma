import { compose, rotorEncrypt, getLetterMappingFrom } from "../../../utils";
import { REFLECTORS, GREEK_WHEELS } from "../../../constants";

const makeM4Reflector = (
  thinReflector = REFLECTORS.b,
  greekWheel = GREEK_WHEELS.beta,
  ringPosition = "A"
) =>
  compose(
    rotorEncrypt(greekWheel.inverse, ringPosition),
    getLetterMappingFrom(thinReflector),
    rotorEncrypt(greekWheel, ringPosition)
  );

export default makeM4Reflector;
