import enigma from './index';
import { enigmaAdvance, isSingleLetter } from './utils';

export default function translate(plaintext, scrambler, plugboard, preserveNonLetterCharacters = false) {
    var ciphertext = '';
    var plainletter;
    plaintext.split('').map(character => {
        // turn the rotors over before encrypting letter
        scrambler = enigmaAdvance(scrambler);
        plainletter = character.toUpperCase();
        ciphertext += isSingleLetter(plainletter) ?
            enigma(plainletter, scrambler, plugboard) :
            preserveNonLetterCharacters ?
                plainletter :
                '';
    });
    return ciphertext;
}
