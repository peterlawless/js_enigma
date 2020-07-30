import { compose } from "../../utils";
import makeM4Reflector from "../make-m4-reflector";

// TODO: rotor/plugboard/reflector getters and builders with input validation
const makeEnigma = (
  reflector = makeM4Reflector(),
  plugBoard = letter => letter
) => rotorScrambler =>
  compose(
    plugBoard,
    rotorScrambler.backward,
    reflector,
    rotorScrambler.forward,
    plugBoard
  );

export default makeEnigma;
