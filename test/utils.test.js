import BiMap from "mnemonist/bi-map";
import {
  shiftNumber,
  shiftLetter,
  isSingleLetter,
  getLetterMappingFrom,
  alphabetLoopIncrement,
  alphabetLoopDecrement,
  isOnTurnoverLetter,
  enigmaAdvance
} from "../enigma/utils";
import {
  REFLECTOR,
  GREEK_WHEEL,
  FAST_ROTOR,
  CENTER_ROTOR,
  SLOW_ROTOR,
  MODEL,
  EXPOSED_LETTER
} from "../enigma/constants";

describe("shiftNumber", function () {
  it("given inputs 'A' and 'B', should return 1", function () {
    expect(shiftNumber("A", "B")).toBe(1);
  });

  it("given inputs 'A' and 'Z', should return 25", function () {
    expect(shiftNumber("A", "Z")).toBe(25);
  });
});

describe("shiftLetter", function () {
  it("given inputs 'A' and 1, should return 'B'", function () {
    expect(shiftLetter("A", 1)).toBe("B");
  });

  it("given inputs 'Z' and 2, should return 'B'", function () {
    expect(shiftLetter("Z", 2)).toBe("B");
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

describe("enigmaAdvance", function () {
  let scrambler;

  beforeEach(function () {
    scrambler = {
      [REFLECTOR]: "b",
      [GREEK_WHEEL]: {
        [MODEL]: "beta",
        [EXPOSED_LETTER]: "A"
      },
      [SLOW_ROTOR]: {
        [MODEL]: "I",
        [EXPOSED_LETTER]: "A"
      },
      [CENTER_ROTOR]: {
        [MODEL]: "II",
        [EXPOSED_LETTER]: "A"
      },
      [FAST_ROTOR]: {
        [MODEL]: "III",
        [EXPOSED_LETTER]: "A"
      }
    };
  });

  it("should only advance the fast rotor if neither the fast rotor nor the center rotor are on turnover letters", function () {
    expect(isOnTurnoverLetter(scrambler[FAST_ROTOR])).toBe(false);
    expect(enigmaAdvance(scrambler)).toMatchObject(
      Object.assign({}, scrambler, {
        [FAST_ROTOR]: { [MODEL]: "III", [EXPOSED_LETTER]: "B" }
      })
    );
  });

  it("should only advance the fast rotor and the center rotor if the fast rotor is on a turnover letter", function () {
    scrambler[FAST_ROTOR][EXPOSED_LETTER] = "V";
    expect(isOnTurnoverLetter(scrambler[FAST_ROTOR])).toBe(true);
    expect(isOnTurnoverLetter(scrambler[CENTER_ROTOR])).toBe(false);
    expect(enigmaAdvance(scrambler)).toMatchObject(
      Object.assign({}, scrambler, {
        [CENTER_ROTOR]: { [MODEL]: "II", [EXPOSED_LETTER]: "B" },
        [FAST_ROTOR]: { [MODEL]: "III", [EXPOSED_LETTER]: "W" }
      })
    );
  });

  it("should advance all three rotors if the both the fast rotor and center rotor are on turnover letters", function () {
    scrambler[CENTER_ROTOR][EXPOSED_LETTER] = "E";
    scrambler[FAST_ROTOR][EXPOSED_LETTER] = "V";
    expect(isOnTurnoverLetter(scrambler[FAST_ROTOR])).toBe(true);
    expect(isOnTurnoverLetter(scrambler[CENTER_ROTOR])).toBe(true);
    expect(enigmaAdvance(scrambler)).toMatchObject(
      Object.assign({}, scrambler, {
        [SLOW_ROTOR]: { [MODEL]: "I", [EXPOSED_LETTER]: "B" },
        [CENTER_ROTOR]: { [MODEL]: "II", [EXPOSED_LETTER]: "F" },
        [FAST_ROTOR]: { [MODEL]: "III", [EXPOSED_LETTER]: "W" }
      })
    );
  });

  it("should NOT advance the slow rotor if the center rotor is on a turnover letter but the fast rotor is not", function () {
    scrambler[CENTER_ROTOR][EXPOSED_LETTER] = "E";
    scrambler[FAST_ROTOR][EXPOSED_LETTER] = "U";
    expect(isOnTurnoverLetter(scrambler[FAST_ROTOR])).toBe(false);
    expect(isOnTurnoverLetter(scrambler[CENTER_ROTOR])).toBe(true);
    expect(enigmaAdvance(scrambler)).toMatchObject(
      Object.assign({}, scrambler, {
        [SLOW_ROTOR]: { [MODEL]: "I", [EXPOSED_LETTER]: "A" },
        [CENTER_ROTOR]: { [MODEL]: "II", [EXPOSED_LETTER]: "E" },
        [FAST_ROTOR]: { [MODEL]: "III", [EXPOSED_LETTER]: "V" }
      })
    );
  });
});
