import { expect } from 'chai';
import BiMap from 'mnemonist/bi-map';
import {
    shiftNumber,
    shiftLetter,
    isSingleLetter,
    bidirectionalMapFrom,
    alphabetLoopIncrement,
    alphabetLoopDecrement,
    isOnTurnoverLetter,
    enigmaAdvance
} from '../enigma/utils';

describe('shiftNumber', function() {
    it('given inputs \'A\' and \'B\', should return 1', function() {
        expect(shiftNumber('A', 'B')).to.equal(1);
    });

    it('given inputs \'A\' and \'Z\', should return 25', function(){
        expect(shiftNumber('A', 'Z')).to.equal(25);        
    });
});

describe('shiftLetter', function() {
    it('given inputs \'A\' and 1, should return \'B\'', function() {
        expect(shiftLetter('A', 1)).to.equal('B');
    });

    it('given inputs \'Z\' and 2, should return \'B\'', function() {
        expect(shiftLetter('Z', 2)).to.equal('B'); 
    });
});

describe('isSingleLetter', function() {
    it('should return false when given an empty string', function() {
        expect(isSingleLetter('')).to.be.false;
    });

    it('should return false when given a single lowercase letter', function() {
        expect(isSingleLetter('a')).to.be.false;
    });

    it('should return true when given a single capital letter', function() {
        expect(isSingleLetter('A')).to.be.true;
    });
});

describe('bidirectionalMapFrom', function() {
    const biMap = BiMap.from({A: 'B'});
    it('should return the value associated with a key in the provided BiMap', function() {
        expect(bidirectionalMapFrom('A', biMap)).to.equal('B');
    });

    it('should return the value associated with a key in the provided BiMap (inverse)', function() {
        expect(bidirectionalMapFrom('B', biMap)).to.equal('A');
    });

    it('should return the letter provided in the first argument if that letter is not present in the BiMap', function() {
        expect(bidirectionalMapFrom('C', biMap)).to.equal('C');
    });
});

describe('alphabetLoopIncrement', function() {
    it('should return the next letter of the alphabet', function() {
        expect(alphabetLoopIncrement('A')).to.equal('B');
    });

    it('should loop to the beginning of the alphabet from the end', function() {
        expect(alphabetLoopIncrement('Z')).to.equal('A');
    });
});

describe('alphabetLoopDecrement', function() {
    it('should return the previous letter of the alphabet', function() {
        expect(alphabetLoopDecrement('B')).to.equal('A');
    });

    it('should loop to the end of the alphabet from the beginning', function() {
        expect(alphabetLoopDecrement('A')).to.equal('Z');
    });
});

describe('isOnTurnoverLetter', function() {
    it('should return false for letters that are NOT turnover points for the given rotor', function() {
        expect(isOnTurnoverLetter({ model: 'I', exposedLetter: 'A' })).to.equal(false);
    });

    it('should return true for letters that are turnover points for the given rotor', function() {
        expect(isOnTurnoverLetter({ model: 'I', exposedLetter: 'Q' })).to.equal(true);
    });
});

describe('enigmaAdvance', function() {
    it('should only advance the fast rotor if neither the fast rotor nor the center rotor are on turnover letters', function() {
        const scrambler = {
            reflector: 'b',
            greekWheel: {
                model: 'beta',
                exposedLetter: 'A'
            },
            slowRotor: {
                model: 'I',
                exposedLetter: 'A'
            },
            centerRotor: {
                model: 'II',
                exposedLetter: 'A'
            },
            fastRotor: {
                model: 'III',
                exposedLetter: 'A'
            }
        };
        expect(isOnTurnoverLetter(scrambler.fastRotor)).to.equal(false);
        expect(enigmaAdvance(scrambler)).to.eql(
            Object.assign(
                {},
                scrambler,
                { fastRotor: { model: 'III', exposedLetter: 'B' } }
            )
        );
    });

    it('should only advance the fast rotor and the center rotor if the fast rotor is on a turnover letter', function() {
        const scrambler = {
            reflector: 'b',
            greekWheel: {
                model: 'beta',
                exposedLetter: 'A'
            },
            slowRotor: {
                model: 'I',
                exposedLetter: 'A'
            },
            centerRotor: {
                model: 'II',
                exposedLetter: 'A'
            },
            fastRotor: {
                model: 'III',
                exposedLetter: 'V'
            }
        };
        expect(isOnTurnoverLetter(scrambler.fastRotor)).to.equal(true);
        expect(isOnTurnoverLetter(scrambler.centerRotor)).to.equal(false);
        expect(enigmaAdvance(scrambler)).to.eql(
            Object.assign(
                {},
                scrambler,
                {
                    centerRotor: { model: 'II', exposedLetter: 'B' },
                    fastRotor: { model: 'III', exposedLetter: 'W' }
                }
            )
        );
    });

    it('should advance all three rotors if the both the fast rotor and center rotor are on turnover letters', function() {
        const scrambler = {
            reflector: 'b',
            greekWheel: {
                model: 'beta',
                exposedLetter: 'A'
            },
            slowRotor: {
                model: 'I',
                exposedLetter: 'A'
            },
            centerRotor: {
                model: 'II',
                exposedLetter: 'E'
            },
            fastRotor: {
                model: 'III',
                exposedLetter: 'V'
            }
        };
        expect(isOnTurnoverLetter(scrambler.fastRotor)).to.equal(true);
        expect(isOnTurnoverLetter(scrambler.centerRotor)).to.equal(true);
        expect(enigmaAdvance(scrambler)).to.eql(
            Object.assign(
                {},
                scrambler,
                {
                    slowRotor: { model: 'I', exposedLetter: 'B' },
                    centerRotor: { model: 'II', exposedLetter: 'F' },
                    fastRotor: { model: 'III', exposedLetter: 'W' }
                }
            )
        );
    });

    it('should NOT advance the slow rotor if the center rotor is on a turnover letter but the fast rotor is not', function() {
        const scrambler = {
            reflector: 'b',
            greekWheel: {
                model: 'beta',
                exposedLetter: 'A'
            },
            slowRotor: {
                model: 'I',
                exposedLetter: 'A'
            },
            centerRotor: {
                model: 'II',
                exposedLetter: 'E'
            },
            fastRotor: {
                model: 'III',
                exposedLetter: 'U'
            }
        };
        expect(isOnTurnoverLetter(scrambler.fastRotor)).to.equal(false);
        expect(isOnTurnoverLetter(scrambler.centerRotor)).to.equal(true);
        expect(enigmaAdvance(scrambler)).to.eql(
            Object.assign(
                {},
                scrambler,
                {
                    slowRotor: { model: 'I', exposedLetter: 'A' },
                    centerRotor: { model: 'II', exposedLetter: 'E' },
                    fastRotor: { model: 'III', exposedLetter: 'V' }
                }
            )
        );
    });
})
