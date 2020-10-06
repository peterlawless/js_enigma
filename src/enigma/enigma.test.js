import Enigma from "./enigma";
import { buildGreekWheelReflector } from "../m4";
import { ROTORS } from "../constants";

describe("Enigma", () => {
  let realConsoleWarn;
  const tooFewArgsError = new Error("expected 3 arguments but got 2 instead");
  const avoidSwitchingWarning =
    "Avoid switching between alphabetic and numeric settings keys as this will change the format of read-only rotorPositions property";
  const enigma = new Enigma();
  enigma
    .withReflector(buildGreekWheelReflector())
    .withRotors(ROTORS.I, ROTORS.II, ROTORS.III)
    .withRingSettings("F", "O", "O")
    .withRotorPositions("B", "A", "R");

  beforeAll(() => {
    realConsoleWarn = console.warn;
    console.warn = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        describe("when switching from alphabetic keys to numeric keys", () => {
          beforeEach(() => {
            enigma.withRingSettings("F", "O", "O");
            enigma.withRingSettings(6, 15, 15);
          });

          it("should log a warning about switching between alphabetic and numeric settings", () => {
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith(avoidSwitchingWarning);
          });
        });

        it("should return the rotorPositions property with numeric keys", () => {
          enigma.withRingSettings(6, 15, 15);
          expect(enigma.rotorPositions).toEqual([2, 1, 18]);
        });
      });

      describe("when provided alphabetic keys", () => {
        describe("when switching from numeric keys to alphabetic keys", () => {
          beforeEach(() => {
            enigma.withRingSettings(6, 15, 15);
            enigma.withRingSettings("F", "O", "O");
          });

          it("should log a warning about switching between alphabetic and numeric settings", () => {
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith(avoidSwitchingWarning);
          });
        });

        it("should return the rotorPositions property with alphabetic keys", () => {
          enigma.withRingSettings("F", "O", "O");
          expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
        });
      });

      describe("when provided mixed keys", () => {
        beforeEach(() => {
          enigma.withRingSettings("F", 15, "O");
        });

        it("should log a warning about switching between alphabetic and numeric settings", () => {
          expect(console.warn).toHaveBeenCalledTimes(2);
          expect(console.warn).toHaveBeenNthCalledWith(
            1,
            avoidSwitchingWarning
          );
          expect(console.warn).toHaveBeenNthCalledWith(
            2,
            avoidSwitchingWarning
          );
        });

        it("should return the rotorPositions property according to the _last_ setting type provided", () => {
          expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
        });
      });

      describe("when provided neither alphabetic nor numeric keys", () => {
        it("should throw an error", () => {
          expect(() =>
            enigma.withRingSettings(
              { letter: "F" },
              { letter: "O" },
              { letter: "O" }
            )
          ).toThrow(
            new Error(
              "only capital letters A-Z or numbers 1-26 are permitted input"
            )
          );
        });
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
      describe("when provided numeric keys", () => {
        describe("when switching from alphabetic keys to numeric keys", () => {
          beforeEach(() => {
            enigma.withRotorPositions("B", "A", "R");
            enigma.withRotorPositions(2, 1, 18);
          });

          it("should log a warning about switching between alphabetic and numeric settings", () => {
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith(avoidSwitchingWarning);
          });
        });

        it("should return the rotorPositions property with numeric keys", () => {
          enigma.withRotorPositions(2, 1, 18);
          expect(enigma.rotorPositions).toEqual([2, 1, 18]);
        });
      });

      describe("when provided alphabetic keys", () => {
        describe("when switching from numeric keys to alphabetic keys", () => {
          beforeEach(() => {
            enigma.withRotorPositions(2, 1, 18);
            enigma.withRotorPositions("B", "A", "R");
          });

          it("should log a warning about switching between alphabetic and numeric settings", () => {
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith(avoidSwitchingWarning);
          });
        });

        it("should return the rotorPositions property with alphabetic keys", () => {
          enigma.withRotorPositions("B", "A", "R");
          expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
        });
      });

      describe("when provided mixed keys", () => {
        beforeEach(() => {
          enigma.withRingSettings("F", 15, "O");
        });

        it("should log a warning about switching between alphabetic and numeric settings", () => {
          expect(console.warn).toHaveBeenCalledTimes(2);
          expect(console.warn).toHaveBeenNthCalledWith(
            1,
            avoidSwitchingWarning
          );
          expect(console.warn).toHaveBeenNthCalledWith(
            2,
            avoidSwitchingWarning
          );
        });

        it("should return the rotorPositions property according to the _last_ setting type provided", () => {
          expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
        });
      });

      describe("when provided neither alphabetic nor numeric keys", () => {
        it("should throw an error", () => {
          expect(() =>
            enigma.withRingSettings(
              { letter: "F" },
              { letter: "O" },
              { letter: "O" }
            )
          ).toThrow(
            new Error(
              "only capital letters A-Z or numbers 1-26 are permitted input"
            )
          );
        });
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
    describe("single character encryption", () => {
      let cipherLetter;
      describe("when input is a single letter", () => {
        beforeAll(() => {
          enigma
            .withRingSettings("F", "O", "O")
            .withRotorPositions("B", "A", "R");
          cipherLetter = enigma.encryptCharacter("A");
        });

        it("should not map a letter back onto itself", () => {
          expect(cipherLetter).not.toEqual("A");
        });

        test("the rotors should advance", () => {
          expect(enigma.rotorPositions).toMatchObject(["B", "A", "S"]);
        });

        it("should perform reversible encryption", () => {
          expect(
            enigma
              .withRotorPositions("B", "A", "R")
              .encryptCharacter(cipherLetter)
          ).toBe("A");
        });
      });

      describe("when input is NOT a single letter", () => {
        beforeAll(() => {
          enigma
            .withRingSettings("F", "O", "O")
            .withRotorPositions("B", "A", "R");
          cipherLetter = enigma.encryptCharacter(" ");
        });

        test("the rotors should NOT advance", () => {
          expect(enigma.rotorPositions).toEqual(["B", "A", "R"]);
        });

        it("should return the input character", () => {
          expect(cipherLetter).toBe(" ");
        });
      });
    });

    describe("message encryption", () => {
      let cipherText;
      const plainText = "WHAT HATH GOD WROUGHT?";
      beforeAll(() => {
        enigma
          .withRingSettings("F", "O", "O")
          .withRotorPositions("B", "A", "R");
        cipherText = enigma.encryptMessage(plainText);
      });

      it("should advance the rotors", () => {
        expect(enigma.rotorPositions).toMatchObject(["B", "B", "J"]);
      });

      it("should perform reversible encryption", () => {
        expect(
          enigma.withRotorPositions("B", "A", "R").encryptMessage(cipherText)
        ).toBe(plainText);
      });
    });
  });
});
