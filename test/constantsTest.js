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

describe('Rotors', function() {
    for (var romanNumeral in Rotors) {
        var rotor = Rotors[romanNumeral];
        describe(`Rotor ${romanNumeral}`, function(){
            it('is an object', function() {
                assert.isObject(rotor);
            });
            it('has a wiring and a turnOvers property', function() {
                assert.hasAllKeys(rotor, ['wiring', 'turnOvers']);
            });
            var {turnOvers} = rotor;
            describe('turnOvers', function() {
                it('is an Array', function() {
                    assert.isArray(turnOvers);
                });
                it('is not empty', function() {
                    assert.isNotEmpty(turnOvers);
                });
                // TODO: each turnover should be a single capitalized letter
            });
            
        });
    }
})