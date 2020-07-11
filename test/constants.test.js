import {
  alphabetBiMap,
  Rotors,
  GreekWheels,
  Reflectors,
} from "../enigma/constants";

describe("constants", () => {
  describe("alphabetBiMap", function () {
    it("should have 26 entries", function () {
      expect(alphabetBiMap.size).toBe(26);
    });

    it("should have an entry for each letter of the alphabet", function () {
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter) {
        expect(alphabetBiMap.get(letter)).toBeDefined();
      });
    });

    it("should have values mapping back to the letters of the alphabet in correct order", function () {
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (letter, index) {
        expect(alphabetBiMap.inverse.get(index)).toBe(letter);
      });
    });
  });

  describe("Rotors", function () {
    for (var romanNumeral in Rotors) {
      var rotor = Rotors[romanNumeral];
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
    for (var letter in GreekWheels) {
      var greekWheel = GreekWheels[letter];
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

  describe("Reflectors", function () {
    for (var letter in Reflectors) {
      var reflector = Reflectors[letter];
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
