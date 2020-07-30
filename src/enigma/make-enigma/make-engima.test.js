import { REFLECTORS, GREEK_WHEELS, ROTORS } from "../../constants";
import makeRotorScrambler from "../make-rotor-scrambler";
import makeM4Reflector from "../make-m4-reflector";
import makeEnigma from "./make-enigma";

describe("makeEnigma", function () {
  it("returns a function that generates reversible encryption", function () {
    // Make a random configuration for each test
    function randomPick(someArray) {
      return someArray[Math.floor(Math.random() * someArray.length)];
    }
    const alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const rotorKeys = Object.keys(ROTORS);
    const reflectorKeys = Object.keys(REFLECTORS);
    const greekWheelKeys = Object.keys(GREEK_WHEELS);

    const reflector = makeM4Reflector(
      REFLECTORS[randomPick(reflectorKeys)],
      GREEK_WHEELS[randomPick(greekWheelKeys)],
      randomPick(alphabetArray)
    );

    const rotorScrambler = makeRotorScrambler([
      {
        rotor: ROTORS[randomPick(rotorKeys)],
        ringPosition: randomPick(alphabetArray)
      },
      {
        rotor: ROTORS[randomPick(rotorKeys)],
        ringPosition: randomPick(alphabetArray)
      },
      {
        rotor: ROTORS[randomPick(rotorKeys)],
        ringPosition: randomPick(alphabetArray)
      }
    ]);

    const enigma = makeEnigma(reflector)(rotorScrambler);

    const plainLetter = randomPick(alphabetArray);

    const cipherLetter = enigma(plainLetter);

    expect(enigma(cipherLetter)).toBe(plainLetter);

    // Enigma would never map a letter back onto itself
    // TODO: extract this assertion to a separate test
    expect(plainLetter).not.toBe(cipherLetter);
  });
});
