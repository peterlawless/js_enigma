import Enigma from "./enigma";
import { buildGreekWheelReflector } from "../m4";
import { ROTORS } from "../constants";

describe("Enigma", () => {
  const tooFewArgsError = new Error("expected 3 arguments but got 2 instead");
  const enigma = new Enigma();
  enigma
    .withReflector(buildGreekWheelReflector())
    .withRotors(ROTORS.I, ROTORS.II, ROTORS.III)
    .withRingSettings("F", "O", "O")
    .withRotorPositions("B", "A", "R");

  it("should successfully set the plugboard", () => {
    expect(() =>
      enigma.withPlugboard(buildGreekWheelReflector())
    ).not.toThrow();
  });

  describe("setting the Ringstellung", () => {
    describe("when provided 3 arguments", () => {
      it("should successfully set the Ringstellung", () => {
        expect(() => enigma.withRingSettings("F", "O", "O")).not.toThrow();
      });
    });

    describe("when provided more or less than 3 arguments", () => {
      it("should throw an error", () => {
        expect(() => enigma.withRingSettings("F", "0")).toThrow(
          tooFewArgsError
        );
      });
    });
  });

  describe("setting the Grundstellung", () => {
    describe("when provided 3 arguments", () => {
      it("should successfully set the Grundstellung", () => {
        expect(() => enigma.withRotorPositions("B", "A", "R")).not.toThrow();
      });
    });

    describe("when provided more or less than 3 arguments", () => {
      it("should throw an error", () => {
        expect(() => enigma.withRotorPositions("B", "A")).toThrow(
          tooFewArgsError
        );
      });
    });
  });

  it("should return the correct rotor positions", () => {
    expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
  });

  describe("encryption", () => {
    let cipherLetter;

    beforeAll(() => {
      cipherLetter = enigma.encryptLetter("A");
    });

    it("should not map a letter back onto itself", () => {
      expect(cipherLetter).not.toEqual("A");
    });

    test("the rotors should advance", () => {
      expect(enigma.rotorPositions).toEqual(["B", "A", "S"]);
    });
  });
});
