import makeM4Reflector from "./make-m4-reflector";
import { REFLECTORS, GREEK_WHEELS } from "../../../constants";

describe("makeM4Reflector", () => {
  it("should return correct letter mapping given default settings", () => {
    const reflector = makeM4Reflector();
    expect(reflector("A")).toBe("Y");
    expect(reflector("B")).toBe("R");
  });

  it("should return correct letter mapping for provided settings", () => {
    const reflector = makeM4Reflector(REFLECTORS.c, GREEK_WHEELS.gamma, "A");
    expect(reflector("A")).toBe("F");
    expect(reflector("B")).toBe("V");
  });
});
