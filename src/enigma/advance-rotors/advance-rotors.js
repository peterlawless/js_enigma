import { alphabetLoopIncrement } from "../../utils";

const isOnTurnoverLetter = ({ rotor, rotorPosition }) =>
  Boolean(rotor.turnoverLetters[rotorPosition]);

// https://www.youtube.com/watch?v=5StZlF-clPc
// Enigma's "double step anomaly" turns over a rotor if:
// 1) the rotor is NOT the leftmost AND it is on a turnover letter
// 2) its right neighbor is on a turnover letter
const advanceRotors = settings =>
  settings.map((rotorSetting, index, currentSettings) => {
    const { rotorPosition } = rotorSetting;
    const isSlowRotor = index === 0;
    const isFastRotor = index === currentSettings.length - 1;
    return isFastRotor || // fast rotor always advances because its ratchet is completely exposed
      (!isSlowRotor && isOnTurnoverLetter(rotorSetting)) ||
      isOnTurnoverLetter(currentSettings[index + 1])
      ? { ...rotorSetting, rotorPosition: alphabetLoopIncrement(rotorPosition) }
      : rotorSetting;
  });

export default advanceRotors;
