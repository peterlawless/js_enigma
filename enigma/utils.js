import { alphabetBiMap } from './constants';

export function shiftNumber(letter1, letter2) {
    return (alphabetBiMap.get(letter2) - alphabetBiMap.get(letter1) + 26) % 26;
}

export function shiftLetter(letter, number) {
    return alphabetBiMap.inverse.get((alphabetBiMap.get(letter) + number + 26) % 26);
}

export function isSingleLetter(letter) {
    return /^[A-Z]{1}$/.test(letter);
}

export function bidirectionalMapFrom(letter, biMap) {
    return biMap.get(letter) || biMap.inverse.get(letter) || letter;
}

export function alphabetLoopIncrement(letter) {
    return alphabetBiMap.inverse.get((alphabetBiMap.get(letter) + 27) % 26);
}

export function alphabetLoopDecrement(letter) {
    return alphabetBiMap.inverse.get((alphabetBiMap.get(letter) + 25) % 26);
}
