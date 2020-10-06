import BiMap from "mnemonist/bi-map";
import {
  compose,
  getDistanceBetweenLetters,
  getLetterPlusShift,
  getLetterFromNumericKey,
  getNumericKeyFromLetter,
  isSingleLetter,
  validateIsSingleLetter,
  validateUniqueMapping,
  getLetterMappingFrom,
  alphabetLoopIncrement,
  alphabetLoopDecrement,
  rotorEncrypt
} from "./utils";
import { ROTORS } from "../constants";

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

describe("validateIsSingleLetter", () => {
  it("should throw an error when given an empty string", () => {
    expect(() => validateIsSingleLetter("")).toThrowError(
      new Error("invalid letter: ")
    );
  });

  it("should throw an error when given a single lowercase letter", () => {
    expect(() => validateIsSingleLetter("a")).toThrowError(
      new Error("invalid letter: a")
    );
  });

  it("should NOT throw an error when given a single capital letter", () => {
    expect(() => validateIsSingleLetter("A")).not.toThrowError();
  });

  it("should return the provided letter when given a single capital letter", () => {
    expect(validateIsSingleLetter("A")).toBe("A");
  });
});

describe("getLetterFromNumericKey", () => {
  it("should throw an error when provided an invalid number", () => {
    expect(() => getLetterFromNumericKey(27)).toThrow(
      new Error("invalid numeric key: 27")
    );
  });

  it("should return the letter associated with the numbers 1-26", () => {
    expect(getLetterFromNumericKey(26)).toBe("Z");
  });
});

describe("getNumericKeyFromLetter", () => {
  it("should return the numeric key associated with the provided letter", () => {
    expect(getNumericKeyFromLetter("A")).toBe(1);
    expect(getNumericKeyFromLetter("Z")).toBe(26);
  });
});

describe("validateUniqueLetterMapping", () => {
  it("should throw an error when there is a duplicate mapping for the same letter in the BiMap", () => {
    const badMap = BiMap.from({ A: "B", B: "C" });
    expect(() => validateUniqueMapping(badMap)).toThrow(
      new Error("dual mapping for letter: B")
    );
  });

  it("should NOT throw an error when each letter mapping is unique", () => {
    const goodMap = BiMap.from({ A: "B", C: "D" });
    expect(() => validateUniqueMapping(goodMap)).not.toThrow();
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

describe("rotorEncrypt", () => {
  const { wiring } = ROTORS.I;

  describe("when the ringPosition (ringStellung) utilizes its default value of 'A'", () => {
    it("should return the correct letter mapping forwards", () => {
      expect(rotorEncrypt(wiring, "B")("C")).toBe("E");
    });

    it("should return the correct letter mapping backwards", () => {
      expect(rotorEncrypt(wiring.inverse, "B")("C")).toBe("F");
    });
  });

  describe("when ringPosition (ringStellung) is provided", () => {
    it("should return the correct letter mapping forwards", () => {
      expect(rotorEncrypt(wiring, "B", "C")("D")).toBe("N");
    });

    it("should return the correct letter mapping backwards", () => {
      expect(rotorEncrypt(wiring.inverse, "B", "C")("D")).toBe("Z");
    });
  });
});
