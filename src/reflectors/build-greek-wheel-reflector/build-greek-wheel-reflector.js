import { compose, rotorEncrypt, getLetterMappingFrom } from "../../utils";
import { THIN_REFLECTORS, GREEK_WHEELS } from "./constants";

const buildGreekWheelReflector = (
  thinReflector = THIN_REFLECTORS.b,
  greekWheel = GREEK_WHEELS.beta,
  ringPosition = "A"
) =>
  compose(
    rotorEncrypt(greekWheel.inverse, ringPosition),
    getLetterMappingFrom(thinReflector),
    rotorEncrypt(greekWheel, ringPosition)
  );

export default buildGreekWheelReflector;
