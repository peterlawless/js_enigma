import { assert } from 'chai';

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
            it('should have 26 entries', function() {
                assert.equal(rotor.size, 26);
            });

            it('should have an entry on the \'forward\' side for every letter of the alphabet', function() {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                    assert.isDefined(rotor.get(letter));
                });
            });

            it('should have an entry on the \'reverse\' side for every letter of the alphabet', function() {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                    assert.isDefined(rotor.inverse.get(letter));
                });
            })
        });
    }
})

describe('Greek Wheels', function() {
    for (var letter in GreekWheels) {
        var greekWheel = GreekWheels[letter];
        describe(letter, function() {
            it('should have 26 entries', function() {
                assert.equal(greekWheel.size, 26);
            });

            it('should have an entry on the \'forward\' side for every letter of the alphabet', function() {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                    assert.isDefined(greekWheel.get(letter));
                });
            });

            it('should have an entry on the \'reverse\' side for every letter of the alphabet', function() {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                    assert.isDefined(greekWheel.inverse.get(letter));
                });
            })
        });
    }
});

describe('Reflectors', function() {
    for (var letter in Reflectors) {
        var reflector = Reflectors[letter];
        describe(`UKW-${letter}`, function() {
            it('should have 26 entries', function() {
                assert.equal(reflector.size, 26);
            });

            it('should have an entry on the \'forward\' side for every letter of the alphabet', function() {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                    assert.isDefined(reflector.get(letter));
                });
            });

            it('should have an entry on the \'reverse\' side for every letter of the alphabet', function() {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                    assert.isDefined(reflector.inverse.get(letter));
                });
            });

            it('has reversible entries', function() {
                reflector.forEach(function(value, key) {
                    assert.equal(reflector.inverse.get(value), key);
                });
            });
        });
    }
});