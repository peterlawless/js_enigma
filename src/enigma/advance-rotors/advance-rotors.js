import { alphabetLoopIncrement } from "../../utils";

const advanceRotors = settings => {
  let rotor, ringPosition;
  let newSettings = [];
  let newRingStellung;
  let shouldRotorAdvance = true;
  for (let i = settings.length - 1; i >= 0; i--) {
    ({ rotor, ringPosition } = settings[i]);
    if (shouldRotorAdvance) {
      newRingStellung = {
        rotor,
        ringPosition: alphabetLoopIncrement(ringPosition)
      };
      // we re-evaluate shouldRotorAdvance ONLY if it is true
      // i.e., once it becomes false, it cannot become true again
      shouldRotorAdvance = Boolean(rotor.turnoverLetters[ringPosition]);
    } else {
      newRingStellung = { rotor, ringPosition };
    }
    newSettings.unshift(newRingStellung);
  }
  return newSettings;
};

export default advanceRotors;
