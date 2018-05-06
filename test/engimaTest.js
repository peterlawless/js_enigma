import { expect } from 'chai';

import enigma from '../enigma';

describe('Enigma', function() {
    describe('input validation', function() {
        describe('plainLetter', function() {
            it('should throw an error when called with an empty string plainLetter', function() {
                expect(() => enigma('', {})).to.throw('input \'plainLetter\' must be a single uppercase letter');
            });
        });
        
        describe('config', function() {

            describe('reflector', function() {
                it('should throw an error when called without the \'reflector\' property in the config object', function() {
                    expect(() => enigma('A', {foo: 'bar'}))
                      .to.throw('Missing \'reflector\' property in the config object');
                });
            
                it('should throw an error when called with an invalid value for the \'reflector\' property in the config object', function() {
                    expect(() => enigma('A', {reflector: 'foo'})).to.throw('Invalid reflector model');
                });
            });

            ['greekWheel', 'slowRotor', 'centerRotor', 'fastRotor'].map(function(property) {
                return describe(property, function() {
                    let fullConfig;

                    beforeEach(function() {
                        fullConfig = {
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
                                model: 'II',
                                exposedLetter: 'D'
                            }
                        };
                    });

                    it(`should throw an error without the \'${property}\' property in the config object`, function() {
                        delete fullConfig[property];
                        expect(() => enigma(
                            'A',
                            fullConfig
                        )).to.throw(`Missing required \'${property}\' property from config object`);
                    });

                    it(`should throw an error if the \'${property}\' is not an Object`, function() {
                        fullConfig[property] = 'foo';
                        expect(() => enigma(
                            'A',
                            fullConfig
                        )).to.throw(`\'${property}\' must be an instance of an Object`);
                    });

                    ['model', 'exposedLetter'].map(prop => {
                        it(`should throw an error if the \'${property}.${prop}\' property is undefined`, function() {
                            delete fullConfig[property][prop];
                            expect(() => enigma(
                                'A',
                                fullConfig
                            )).to.throw(`Missing required \'${property}.${prop}\' property from config object`);
                        });
                        
                        it(`should throw an error if the \'${property}.${prop}\' property is invalid`, function(){
                            fullConfig[property][prop] = 'foo';
                            expect(() => enigma(
                                'A',
                                fullConfig
                            )).to.throw(`Invalid \'${property}.${prop}\' property in config object`);
                        });
                    });
                });
            });
        });
    });
});
