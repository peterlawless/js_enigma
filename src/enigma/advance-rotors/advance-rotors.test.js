import advanceRotors from "./advance-rotors";
import { ROTORS } from "../../constants";

describe("advanceRotors", () => {
  let settings;
  describe("when only the fast rotor is on a turnoverLetter", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.I, ringPosition: "A" },
        { rotor: ROTORS.II, ringPosition: "B" },
        { rotor: ROTORS.III, ringPosition: "V" }
      ];
    });

    it("should turn over the middle rotor", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, ringPosition: "A" },
        { rotor: ROTORS.II, ringPosition: "C" },
        { rotor: ROTORS.III, ringPosition: "W" }
      ]);
    });
  });

  describe("when the middle rotor and the fast rotor are both on a turnover letter", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.I, ringPosition: "A" },
        { rotor: ROTORS.II, ringPosition: "E" },
        { rotor: ROTORS.III, ringPosition: "V" }
      ];
    });

    it("should also turn over the slow (first) rotor", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, ringPosition: "B" },
        { rotor: ROTORS.II, ringPosition: "F" },
        { rotor: ROTORS.III, ringPosition: "W" }
      ]);
    });
  });

  describe("when the middle rotor is on a turnover letter but the fast (last) rotor is NOT", () => {
    beforeEach(() => {
      settings = [
        { rotor: ROTORS.I, ringPosition: "A" },
        { rotor: ROTORS.II, ringPosition: "E" },
        { rotor: ROTORS.III, ringPosition: "C" }
      ];
    });

    it("should only advance the fast (last) rotor", () => {
      expect(advanceRotors(settings)).toMatchObject([
        { rotor: ROTORS.I, ringPosition: "A" },
        { rotor: ROTORS.II, ringPosition: "E" },
        { rotor: ROTORS.III, ringPosition: "D" }
      ]);
    });
  });
});
