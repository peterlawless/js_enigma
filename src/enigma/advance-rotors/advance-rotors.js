import { alphabetLoopIncrement } from "../../utils";

const advanceRotors = settings => {
  let rotor, rotorPosition;
  let newSettings = [];
  let rotorSetting;
  let shouldRotorAdvance = true;
  for (let i = settings.length - 1; i >= 0; i--) {
    ({ rotor, rotorPosition } = settings[i]);
    if (shouldRotorAdvance) {
      rotorSetting = {
        rotor,
        rotorPosition: alphabetLoopIncrement(rotorPosition)
      };
      // we re-evaluate shouldRotorAdvance ONLY if it is true
      // i.e., once it becomes false, it cannot become true again
      shouldRotorAdvance = Boolean(rotor.turnoverLetters[rotorPosition]);
    } else {
      rotorSetting = { rotor, rotorPosition };
    }
    newSettings.unshift(rotorSetting);
  }
  return newSettings;
};

export default advanceRotors;
