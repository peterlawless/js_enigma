import { ROTORS } from "../../constants";
import { buildGreekWheelReflector } from "../../m4";
import enigmaEncrypt from "./engima-encrypt";

describe("enigmaEncrypt", () => {
  const plugboard = letter => letter;
  const reflector = buildGreekWheelReflector();
  const initialSettings = [
    { rotor: ROTORS.III, rotorPosition: "A" },
    { rotor: ROTORS.II, rotorPosition: "E" },
    { rotor: ROTORS.I, rotorPosition: "R" }
  ];
  const plaintext = "What hath God wrought?";
  const expectedDecryptedText = "WHAT HATH GOD WROUGHT?";

  it("should return symettrically encrypted text", () => {
    const encrypt = enigmaEncrypt(plugboard, reflector, initialSettings);
    const cipherText = encrypt(plaintext);
    expect(cipherText).not.toEqual(plaintext);
    expect(cipherText).not.toEqual(expectedDecryptedText);
    expect(encrypt(cipherText)).toEqual(expectedDecryptedText);
  });
});
