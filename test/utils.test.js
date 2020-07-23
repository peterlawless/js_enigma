import BiMap from "mnemonist/bi-map";
import {
  compose,
  getDistanceBetweenLetters,
  getLetterPlusShift,
  getRingElementWithRespectToRingPosition,
  getRingElementShiftForRotor,
  isSingleLetter,
  getLetterMappingFrom,
  alphabetLoopIncrement,
  alphabetLoopDecrement,
  isOnTurnoverLetter,
  makeRotorScrambler
} from "../enigma/utils";
import { MODEL, EXPOSED_LETTER, ROTORS } from "../enigma/constants";

describe("distaceBetweenLetters", function () {
  it("given inputs 'A' and 'B', should return 1", function () {
    expect(getDistanceBetweenLetters("A", "B")).toBe(1);
  });

  it("given inputs 'A' and 'Z', should return 25", function () {
    expect(getDistanceBetweenLetters("A", "Z")).toBe(25);
  });
});

describe("getLetterPlusShift", function () {
  it("given inputs 'A' and 1, should return 'B'", function () {
    expect(getLetterPlusShift("A", 1)).toBe("B");
  });

  it("given inputs 'Z' and 2, should return 'B'", function () {
    expect(getLetterPlusShift("Z", 2)).toBe("B");
  });
});

describe("compose", () => {
  const b = jest.fn().mockImplementation(x => x + "b");
  const c = jest.fn().mockImplementation(x => x + "c");
  expect(compose(c, b)("a")).toBe("abc");
  expect(b).toHaveBeenCalledWith("a");
  expect(c).toHaveBeenCalledWith("ab");
});

describe("getRingElementWithRespectToRingPosition", () => {
  const getRingElementToPerformShift = getRingElementWithRespectToRingPosition(
    "C"
  );
  it("should return the letter for the rotor element that the plaintext letter connects to", () => {
    expect(getRingElementToPerformShift("A")).toBe("C");
    expect(getRingElementToPerformShift("Z")).toBe("B");
  });
});

describe("getRingElementShiftForRotor", () => {
  const mockRotor = BiMap.from({ A: "Z" });
  const getRingElementShift = getRingElementShiftForRotor(mockRotor);
  it("returns the shift (number) associated with a particular ring element (letter)", () => {
    expect(getRingElementShift("A")).toBe(25);
  });
});

describe("isSingleLetter", function () {
  it("should return false when given an empty string", function () {
    expect(isSingleLetter("")).toBe(false);
  });

  it("should return false when given a single lowercase letter", function () {
    expect(isSingleLetter("a")).toBe(false);
  });

  it("should return true when given a single capital letter", function () {
    expect(isSingleLetter("A")).toBe(true);
  });
});

describe("getLetterMappingFrom", function () {
  const plugBoard = BiMap.from({ A: "B" });
  const getPlugboardLetter = getLetterMappingFrom(plugBoard);

  it("should return a function", () => {
    expect(getPlugboardLetter).toEqual(expect.any(Function));
  });

  it("should return the value associated with a key in the provided BiMap", function () {
    expect(getPlugboardLetter("A")).toBe("B");
  });

  it("should return the value associated with a key in the provided BiMap (inverse)", function () {
    expect(getPlugboardLetter("B")).toBe("A");
  });

  it("should return the letter provided in the first argument if that letter is not present in the BiMap", function () {
    expect(getPlugboardLetter("C")).toBe("C");
  });
});

describe("alphabetLoopIncrement", function () {
  it("should return the next letter of the alphabet", function () {
    expect(alphabetLoopIncrement("A")).toBe("B");
  });

  it("should loop to the beginning of the alphabet from the end", function () {
    expect(alphabetLoopIncrement("Z")).toBe("A");
  });
});

describe("alphabetLoopDecrement", function () {
  it("should return the previous letter of the alphabet", function () {
    expect(alphabetLoopDecrement("B")).toBe("A");
  });

  it("should loop to the end of the alphabet from the beginning", function () {
    expect(alphabetLoopDecrement("A")).toBe("Z");
  });
});

describe("isOnTurnoverLetter", function () {
  it("should return false for letters that are NOT turnover points for the given rotor", function () {
    expect(isOnTurnoverLetter({ [MODEL]: "I", [EXPOSED_LETTER]: "A" })).toBe(
      false
    );
  });

  it("should return true for letters that are turnover points for the given rotor", function () {
    expect(isOnTurnoverLetter({ [MODEL]: "I", [EXPOSED_LETTER]: "Q" })).toBe(
      true
    );
  });
});

describe("makeRotorScrambler", () => {
  const rotor = ROTORS.I;
  const rotorScramble = makeRotorScrambler("B");
  it("should return the correct letter mapping forwards", () => {
    expect(rotorScramble(rotor)("C")).toBe("E");
  });

  it("should return the correct letter mapping backwards", () => {
    expect(rotorScramble(rotor.inverse)("C")).toBe("F");
  });
});
