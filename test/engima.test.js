import { REFLECTORS, GREEK_WHEELS, ROTORS } from "../enigma/constants";

import enigma from "../enigma";

describe("Enigma", function () {
  it("returns reversible encryption", function () {
    // Make a random scrambleruration for each test
    function randomPick(someArray) {
      return someArray[Math.floor(Math.random() * someArray.length)];
    }
    const alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const rotorKeys = Object.keys(ROTORS);
    const reflectorKeys = Object.keys(REFLECTORS);
    const greekWheelKeys = Object.keys(GREEK_WHEELS);

    const scrambler = {
      reflector: randomPick(reflectorKeys),
      greekWheel: {
        model: randomPick(greekWheelKeys),
        exposedLetter: randomPick(alphabetArray),
      },
      slowRotor: {
        model: randomPick(rotorKeys),
        exposedLetter: randomPick(alphabetArray),
      },
      centerRotor: {
        model: randomPick(rotorKeys),
        exposedLetter: randomPick(alphabetArray),
      },
      fastRotor: {
        model: randomPick(rotorKeys),
        exposedLetter: randomPick(alphabetArray),
      },
    };

    const plainLetter = randomPick(alphabetArray);

    const cipherLetter = enigma(plainLetter, scrambler);

    expect(enigma(cipherLetter, scrambler)).toBe(plainLetter);

    // Enigma would never map a letter back onto itself
    // TODO: extract this assertion to a separate test
    expect(plainLetter).not.toBe(cipherLetter);
  });
});
