import {
  ALPHABET_BI_MAP,
  ROTORS,
  GREEK_WHEELS,
  REFLECTORS,
} from "../enigma/constants";

describe("constants", () => {
  describe("ALPHABET_BI_MAP", function () {
    it("should have 26 entries", function () {
      expect(ALPHABET_BI_MAP.size).toBe(26);
    });

    it("should have an entry for each letter of the alphabet", function () {
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
        expect(ALPHABET_BI_MAP.get(letter)).toBeDefined();
      });
    });

    it("should have values mapping back to the letters of the alphabet in correct order", function () {
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter, index) {
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
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
            expect(rotor.get(letter)).toBeDefined();
          });
        });

        it("should have an entry on the 'reverse' side for every letter of the alphabet", function () {
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
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
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
            expect(greekWheel.get(letter)).toBeDefined();
          });
        });

        it("should have an entry on the 'reverse' side for every letter of the alphabet", function () {
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
            expect(greekWheel.inverse.get(letter)).toBeDefined();
          });
        });
      });
    }
  });

  describe("REFLECTORS", function () {
    for (var letter in REFLECTORS) {
      var reflector = REFLECTORS[letter];
      describe(`UKW-${letter}`, function () {
        it("should have 26 entries", function () {
          expect(reflector.size).toBe(26);
        });

        it("should have an entry on the 'forward' side for every letter of the alphabet", function () {
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
            expect(reflector.get(letter)).toBeDefined();
          });
        });

        it("should have an entry on the 'reverse' side for every letter of the alphabet", function () {
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
            expect(reflector.inverse.get(letter)).toBeDefined();
          });
        });

        it("has reversible entries", function () {
          reflector.forEach(function (value, key) {
            expect(reflector.inverse.get(value)).toBe(key);
          });
        });
      });
    }
  });
});
