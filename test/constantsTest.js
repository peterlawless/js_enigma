import chai, {assert} from 'chai';

import {alphabetBiMap, Rotors, GreekWheels, Reflectors} from '../enigma/constants';


describe('alphabetBiMap', function() {
    it('should have 26 entries', function() {
        assert.equal(alphabetBiMap.size, 26);
    });

    it('should have an entry for each letter of the alphabet', function() {
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
            assert.isDefined(alphabetBiMap.get(letter));
        });
    });

    it('should have values mapping back to the letters of the alphabet in correct order', function() {
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter, index) {
            assert.equal(letter, alphabetBiMap.inverse.get(index));
        });
    });
});
