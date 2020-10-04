import Enigma from "./enigma";
import { buildGreekWheelReflector } from "../m4";
import { ROTORS } from "../constants";

describe("Enigma", () => {
  let realConsoleWarn;
  const tooFewArgsError = new Error("expected 3 arguments but got 2 instead");
  const enigma = new Enigma();
  enigma
    .withReflector(buildGreekWheelReflector())
    .withRotors(ROTORS.I, ROTORS.II, ROTORS.III)
    .withRingSettings("F", "O", "O")
    .withRotorPositions("B", "A", "R");

  // const consoleWarnSpy = jest.spyOn(console, "warn");

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  beforeAll(() => {
    realConsoleWarn = console.warn;
    console.warn = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    console.warn = realConsoleWarn;
  });

  it("should successfully set the plugboard", () => {
    expect(() =>
      enigma.withPlugboard(buildGreekWheelReflector())
    ).not.toThrow();
  });

  describe("setting the Ringstellung", () => {
    describe("when provided 3 arguments", () => {
      describe("when provided numeric keys", () => {
        it("should successfully set the Ringstellung", () => {
          expect(() => enigma.withRingSettings(6, 15, 15)).not.toThrow();
        });

        it("should return the rotorPositions property with numeric keys", () => {
          expect(enigma.rotorPositions).toEqual([2, 1, 18]);
        });

        it("should log a warning for switching between key formats", () => {
          expect(console.warn).toHaveBeenCalledTimes(1);
        });
      });

      describe("when provided alphabetic keys", () => {
        it("should successfully set the Ringstellung", () => {
          expect(() => enigma.withRingSettings("F", "O", "O")).not.toThrow();
        });

        it("should return the rotorPositions property with alphabetic keys", () => {
          expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
        });
      });

      describe("when provided mixed keys", () => {});
      describe("when provided neither alphabetic nor numeric keys", () => {});
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
