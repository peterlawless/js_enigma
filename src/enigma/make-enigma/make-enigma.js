import { compose, makeM4Reflector } from "../../utils";

// TODO: rotor/plugboard/reflector getters and builders with input validation
const makeEnigma = (
  rotorScrambler,
  reflector = makeM4Reflector(),
  plugBoard = letter => letter
) =>
  compose(
    plugBoard,
    rotorScrambler.backward,
    reflector,
    rotorScrambler.forward,
    plugBoard
  );

export default makeEnigma;
