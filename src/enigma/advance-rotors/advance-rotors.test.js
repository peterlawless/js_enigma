import advanceRotors from "./advance-rotors";
import { ROTORS } from "../../constants";

describe("advanceRotors", () => {
  let settings;
  describe("when only the fast rotor is on a turnoverLetter", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.I, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "B" },
        { rotor: ROTORS.III, rotorPosition: "V" }
      ];
    });

    test("the middle rotor and fast rotor should advance", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "C" },
        { rotor: ROTORS.III, rotorPosition: "W" }
      ]);
    });
  });

  describe("when the middle rotor is on a turnover letter", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.III, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "E" },
        { rotor: ROTORS.I, rotorPosition: "R" }
      ];
    });

    test("all three rotors should turn over", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.III, rotorPosition: "B" },
        { rotor: ROTORS.II, rotorPosition: "F" },
        { rotor: ROTORS.I, rotorPosition: "S" }
      ]);
    });
  });
});
