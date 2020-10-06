import buildGreekWheelReflector from "./build-greek-wheel-reflector";
import { GREEK_WHEELS, THIN_REFLECTORS } from "../constants";

describe("buildGreekWheelReflector", () => {
  it("should return correct letter mapping given default settings", () => {
    const reflector = buildGreekWheelReflector();
    expect(reflector("A")).toBe("Y");
    expect(reflector("B")).toBe("R");
  });

  it("should return correct letter mapping for provided settings", () => {
    const reflector = buildGreekWheelReflector(
      THIN_REFLECTORS.c,
      GREEK_WHEELS.gamma,
      "A"
    );
    expect(reflector("A")).toBe("F");
    expect(reflector("B")).toBe("V");
  });
});
