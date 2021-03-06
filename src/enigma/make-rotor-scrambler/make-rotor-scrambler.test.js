import makeRotorScrambler from "./make-rotor-scrambler";
import { ROTORS } from "../../constants";

describe("makeRotorScrambler", () => {
  const rotorScrambler = makeRotorScrambler([
    { rotorPosition: "A", rotor: ROTORS.I },
    { rotorPosition: "A", rotor: ROTORS.II },
    { rotorPosition: "A", rotor: ROTORS.III }
  ]);

  it("should return an object containing a 'forward' function and a 'backward' function", () => {
    expect(rotorScrambler).toStrictEqual({
      forward: expect.any(Function),
      backward: expect.any(Function)
    });
  });

  describe("forward function", () => {
    it("should encrypt from right to left", () => {
      expect(rotorScrambler.forward("C")).toEqual("V");
    });
  });

  describe("backward function", () => {
    it("should encrypt from left to right", () => {
      expect(rotorScrambler.backward("V")).toEqual("C");
    });
  });
});
