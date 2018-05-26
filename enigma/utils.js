import { alphabetBiMap } from './constants';

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
