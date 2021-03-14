import buildStandardPlugboard from "./build-standard-plugboard";

describe("buildStandardPlugboard", () => {
  describe("when there is a non-letter in the input letter pairs object", () => {
    it("should throw an error", () => {
      const badMap = { 1: "A", B: "C" };
      expect(() => buildStandardPlugboard(badMap)).toThrow(
        new Error("invalid letter: 1")
      );
    });
  });

  describe("when there is a duplicate mapping for the same letter in the input letter pairs object", () => {
    it("should throw an error", () => {
      const badMap = { A: "B", B: "C" };
      expect(() => buildStandardPlugboard(badMap)).toThrow(
        new Error("dual mapping for letter: B")
      );
    });
  });

  describe("when all the keys and values are letters with unique mappings", () => {
    it("returns a function that retrieves the mapped output for a given input letter", () => {
      const goodMap = { A: "B", C: "D" };
      const plugboard = buildStandardPlugboard(goodMap);
      expect(plugboard("A")).toBe("B");
      expect(plugboard("B")).toBe("A");
      expect(plugboard("C")).toBe("D");
      expect(plugboard("D")).toBe("C");
      expect(plugboard("E")).toBe("E");
    });
  });
});
