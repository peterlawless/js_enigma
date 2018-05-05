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
            it('is an object', function() {
                assert.isObject(rotor);
            });
            
            it('has a \'wiring\' and a \'turnOvers\' property', function() {
                assert.hasAllKeys(rotor, ['wiring', 'turnOvers']);
            });
            
            var { turnOvers } = rotor;
            describe('turnOvers', function() {
                it('is an Array', function() {
                    assert.isArray(turnOvers);
                });
                
                it('is not empty', function() {
                    assert.isNotEmpty(turnOvers);
                });

                it('should have a single capital letter for each entry', function() {
                    turnOvers.map(function(entry) {
                        assert.isString(entry);
                        assert.match(entry, /^[A-Z]{1}$/);
                    });
                });
            });

            var { wiring } = rotor;
            describe('wiring', function() {
                it('should have 26 entries', function() {
                    assert.equal(wiring.size, 26);
                });

                it('should have an entry on the \'forward\' side for every letter of the alphabet', function() {
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                        assert.isDefined(wiring.get(letter));
                    });
                });

                it('should have an entry on the \'reverse\' side for every letter of the alphabet', function() {
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(letter) {
                        assert.isDefined(wiring.inverse.get(letter));
                    });
                })
            });
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