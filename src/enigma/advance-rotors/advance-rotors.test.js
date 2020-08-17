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

    it("should turn over the middle rotor", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "C" },
        { rotor: ROTORS.III, rotorPosition: "W" }
      ]);
    });
  });

  describe("when the middle rotor and the fast rotor are both on a turnover letter", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.I, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "E" },
        { rotor: ROTORS.III, rotorPosition: "V" }
      ];
    });

    it("should also turn over the slow (first) rotor", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, rotorPosition: "B" },
        { rotor: ROTORS.II, rotorPosition: "F" },
        { rotor: ROTORS.III, rotorPosition: "W" }
      ]);
    });
  });

  describe("when the middle rotor is on a turnover letter but the fast (last) rotor is NOT", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.I, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "E" },
        { rotor: ROTORS.III, rotorPosition: "C" }
      ];
    });

    it("should only advance the fast (last) rotor", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, rotorPosition: "A" },
        { rotor: ROTORS.II, rotorPosition: "E" },
        { rotor: ROTORS.III, rotorPosition: "D" }
      ]);
    });
  });
});
