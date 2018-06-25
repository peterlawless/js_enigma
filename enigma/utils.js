import {
    alphabetBiMap,
    RotorTurnoverLetters,
    SLOW_ROTOR,
    CENTER_ROTOR,
    FAST_ROTOR
} from './constants';

export function shiftNumber(letter1, letter2) {
    return (alphabetBiMap.get(letter2) - alphabetBiMap.get(letter1) + 26) % 26;
}

export function shiftLetter(letter, number) {
    return getLetterFromNumber(alphabetBiMap.get(letter) + number);
}

export function isSingleLetter(letter) {
    return /^[A-Z]{1}$/.test(letter);
}

export function bidirectionalMapFrom(letter, biMap) {
    return biMap.get(letter) || biMap.inverse.get(letter) || letter;
}

export function alphabetLoopIncrement(letter) {
    return getLetterFromNumber(alphabetBiMap.get(letter) + 1);
}

export function alphabetLoopDecrement(letter) {
    return getLetterFromNumber(alphabetBiMap.get(letter) - 1);
}

function getLetterFromNumber(number) {
    return alphabetBiMap.inverse.get((number + 26) % 26);
}

export function isOnTurnoverLetter(rotor) {
    return !!RotorTurnoverLetters[rotor.model][rotor.exposedLetter];
}

export function enigmaAdvance(scrambler) {
    return {
        ...scrambler,
        [FAST_ROTOR]: {
            ...scrambler[FAST_ROTOR],
            exposedLetter: alphabetLoopIncrement(scrambler[FAST_ROTOR].exposedLetter)
        },
        [CENTER_ROTOR]: {
            ...scrambler[CENTER_ROTOR],
            exposedLetter: isOnTurnoverLetter(scrambler[FAST_ROTOR]) ?
                               alphabetLoopIncrement(scrambler[CENTER_ROTOR].exposedLetter) :
                               scrambler[CENTER_ROTOR].exposedLetter    
        },
        [SLOW_ROTOR]: {
            ...scrambler[SLOW_ROTOR],
            exposedLetter: (isOnTurnoverLetter(scrambler[FAST_ROTOR]) && isOnTurnoverLetter(scrambler[CENTER_ROTOR])) ?
                               alphabetLoopIncrement(scrambler[SLOW_ROTOR].exposedLetter) :
                               scrambler[SLOW_ROTOR].exposedLetter
        }
    };
}
