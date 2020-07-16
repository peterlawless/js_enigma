import {
  ALPHABET_BI_MAP,
  ROTORS,
  GREEK_WHEELS,
  REFLECTORS
} from "../enigma/constants";

describe("constants", () => {
  const alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  describe("ALPHABET_BI_MAP", function () {
    it("should have 26 entries", function () {
      expect(ALPHABET_BI_MAP.size).toBe(26);
    });

    it("should have an entry for each letter of the alphabet", function () {
      alphabetArray.map(function (letter) {
        expect(ALPHABET_BI_MAP.get(letter)).toBeDefined();
      });
    });

    it("should have values mapping back to the letters of the alphabet in correct order", function () {
      alphabetArray.map(function (letter, index) {
        expect(ALPHABET_BI_MAP.inverse.get(index)).toBe(letter);
      });
    });
  });

  describe("ROTORS", function () {
    for (var romanNumeral in ROTORS) {
      var rotor = ROTORS[romanNumeral];
      describe(`Rotor ${romanNumeral}`, function () {
        it("should have 26 entries", function () {
          expect(rotor.size).toBe(26);
        });

        it("should have an entry on the 'forward' side for every letter of the alphabet", function () {
          alphabetArray.map(function (letter) {
            expect(rotor.get(letter)).toBeDefined();
          });
        });

        it("should have an entry on the 'reverse' side for every letter of the alphabet", function () {
          alphabetArray.map(function (letter) {
            expect(rotor.inverse.get(letter)).toBeDefined();
          });
        });
      });
    }
  });

  describe("Greek Wheels", function () {
    for (var letter in GREEK_WHEELS) {
      var greekWheel = GREEK_WHEELS[letter];
      describe(letter, function () {
        it("should have 26 entries", function () {
          expect(greekWheel.size).toBe(26);
        });

        it("should have an entry on the 'forward' side for every letter of the alphabet", function () {
          alphabetArray.map(function (letter) {
            expect(greekWheel.get(letter)).toBeDefined();
          });
        });

        it("should have an entry on the 'reverse' side for every letter of the alphabet", function () {
          alphabetArray.map(function (letter) {
            expect(greekWheel.inverse.get(letter)).toBeDefined();
          });
        });
      });
    }
  });

  describe.each(Object.entries(REFLECTORS))("%0", (_, reflector) => {
    it("should have 13 entries", () => {
      expect(reflector.size).toBe(13);
    });

    it("should represent each letter of the alphabet exactly once", () => {
      expect(
        alphabetArray.every(
          letter =>
            (reflector.get(letter) && !reflector.inverse.get(letter)) ||
            (reflector.inverse.get(letter) && !reflector.get(letter))
        )
      );
    });
  });
});
