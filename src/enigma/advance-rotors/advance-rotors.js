import { alphabetLoopIncrement } from "../../utils";

const advanceRotors = settings => {
  let rotorSetting, rotor, rotorPosition, isOnTurnoverLetter;
  let newSettings = [];
  // rightmost rotor always advances because its ratchet is completely exposed
  let shouldRotorAdvance = true;
  for (let i = settings.length - 1; i >= 0; i--) {
    rotorSetting = settings[i];
    ({ rotor, rotorPosition } = rotorSetting);
    // https://www.youtube.com/watch?v=5StZlF-clPc
    // Enigma's "double step anomaly" turns over a rotor if:
    // 1) the rotor is NOT the leftmost AND it is on a turnover letter
    // 2) its right neighbor is on a turnover letter
    isOnTurnoverLetter = Boolean(
      rotor.turnoverLetters[rotorPosition] && i !== 0
    );
    newSettings.unshift({
      ...rotorSetting,
      rotorPosition:
        shouldRotorAdvance || isOnTurnoverLetter
          ? alphabetLoopIncrement(rotorPosition)
          : rotorPosition
    });
    shouldRotorAdvance = isOnTurnoverLetter;
  }
  return newSettings;
};

export default advanceRotors;
