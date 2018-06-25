import { expect, assert } from 'chai';
import { reflectorKeys, greekWheelKeys, rotorKeys } from '../enigma/constants';

import enigma from '../enigma';

describe('Enigma', function() {
    describe('input validation', function() {
        describe('plainLetter', function() {
            it('should throw an error when called with an empty string plainLetter', function() {
                expect(() => enigma('', {})).to.throw('input \'plainLetter\' must be a single uppercase letter');
            });
        });
        
        describe('scrambler', function() {

            describe('reflector', function() {
                it('should throw an error when called without the \'reflector\' property in the scrambler object', function() {
                    expect(() => enigma('A', {foo: 'bar'}))
                      .to.throw('Missing \'reflector\' property in the scrambler object');
                });
            
                it('should throw an error when called with an invalid value for the \'reflector\' property in the scrambler object', function() {
                    expect(() => enigma('A', {reflector: 'foo'})).to.throw('Invalid reflector model');
                });
            });

            ['greekWheel', 'slowRotor', 'centerRotor', 'fastRotor'].map(function(property) {
                return describe(property, function() {
                    let fullscrambler;

                    beforeEach(function() {
                        fullscrambler = {
                            reflector: 'b',
                            greekWheel: {
                                model: 'beta',
                                exposedLetter: 'A'
                            },
                            slowRotor: {
                                model: 'I',
                                exposedLetter: 'B'
                            },
                            centerRotor: {
                                model: 'II',
                                exposedLetter: 'C'
                            },
                            fastRotor: {
                                model: 'III',
                                exposedLetter: 'D'
                            }
                        };
                    });

                    it(`should throw an error without the \'${property}\' property in the scrambler object`, function() {
                        delete fullscrambler[property];
                        expect(() => enigma(
                            'A',
                            fullscrambler
                        )).to.throw(`Missing required \'${property}\' property from scrambler object`);
                    });

                    it(`should throw an error if the \'${property}\' is not an Object`, function() {
                        fullscrambler[property] = 'foo';
                        expect(() => enigma(
                            'A',
                            fullscrambler
                        )).to.throw(`\'${property}\' must be an instance of an Object`);
                    });

                    ['model', 'exposedLetter'].map(prop => {
                        it(`should throw an error if the \'${property}.${prop}\' property is undefined`, function() {
                            delete fullscrambler[property][prop];
                            expect(() => enigma(
                                'A',
                                fullscrambler
                            )).to.throw(`Missing required \'${property}.${prop}\' property from scrambler object`);
                        });
                        
                        it(`should throw an error if the \'${property}.${prop}\' property is invalid`, function(){
                            fullscrambler[property][prop] = 'foo';
                            expect(() => enigma(
                                'A',
                                fullscrambler
                            )).to.throw(`Invalid \'${property}.${prop}\' property in scrambler object`);
                        });
                    });
                });
            });
        });

        describe('plugBoard', function() {
            const scrambler = {
                reflector: 'b',
                greekWheel: {
                    model: 'beta',
                    exposedLetter: 'A'
                },
                slowRotor: {
                    model: 'I',
                    exposedLetter: 'B'
                },
                centerRotor: {
                    model: 'II',
                    exposedLetter: 'C'
                },
                fastRotor: {
                    model: 'III',
                    exposedLetter: 'D'
                }
            };

            it('should throw an error if it defined but not an Object', function() {
                expect(() => enigma(
                    'A',
                    scrambler,
                    'foo'
                )).to.throw('input \'plugBoard\' must be an Object');
            });

            it('should throw an error if any of the keys are not single uppercase letters', function() {
                expect(() => enigma(
                    'A',
                    scrambler,
                    {
                        foo: 'bar'
                    }
                )).to.throw('all keys and values in input \'plugBoard\' must be single uppercase letters');
            });

            it('should throw an error if there are duplicate mappings', function() {
                expect(() => enigma(
                    'A',
                    scrambler,
                    {
                        A: 'B',
                        B: 'A'
                    }
                )).to.throw('duplicate mapping to letter');
            });
        });
    });
    it('returns reversible encryption', function() {
        // Make a random scrambleruration for each test
        function randomPick(someArray) {
            return someArray[Math.floor(Math.random() * someArray.length)];
        }
        const alphabetArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const scrambler = {
            reflector: randomPick(reflectorKeys),
            greekWheel: {
                model: randomPick(greekWheelKeys),
                exposedLetter: randomPick(alphabetArray)
            },
            slowRotor: {
                model: randomPick(rotorKeys),
                exposedLetter: randomPick(alphabetArray)
            },
            centerRotor: {
                model: randomPick(rotorKeys),
                exposedLetter: randomPick(alphabetArray)
            },
            fastRotor: {
                model: randomPick(rotorKeys),
                exposedLetter: randomPick(alphabetArray)
            }
        };

        const plainLetter = randomPick(alphabetArray);
        
        const cipherLetter = enigma(plainLetter, scrambler);

        assert.equal(plainLetter, enigma(cipherLetter, scrambler));

        // Enigma would never map a letter back onto itself
        // TODO: extract this assertion to a separate test
        assert.notEqual(plainLetter, cipherLetter);
    });
});


