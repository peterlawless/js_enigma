import { alphabetBiMap } from './constants';

export function shiftNumber(letter1, letter2) {
    return (alphabetBiMap.get(letter2) - alphabetBiMap.get(letter1) + 26) % 26;
}

export function shiftLetter(number) {
    return alphabetBiMap.inverse.get(number);
}