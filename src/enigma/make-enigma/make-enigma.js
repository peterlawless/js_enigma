import { compose } from "../../utils";
import { makeM4Reflector } from "../reflectors";
import makeRotorScrambler from "../make-rotor-scrambler";

// rotorScrambler is applied via a second function because it changes with each
// button depress (i.e., plaintext letter), whereas the reflector and plugboard
// remain static for the duration of the message
const makeEnigma = (
  reflector = makeM4Reflector(),
  plugBoard = letter => letter
) => settings => {
  const rotorScrambler = makeRotorScrambler(settings);
  return compose(
    plugBoard,
    rotorScrambler.backward,
    reflector,
    rotorScrambler.forward,
    plugBoard
  );
};

export default makeEnigma;
