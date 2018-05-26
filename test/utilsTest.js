import { expect } from 'chai';
import BiMap from 'mnemonist/bi-map';
import { shiftNumber, shiftLetter, isSingleLetter, bidirectionalMapFrom, alphabetLoopIncrement, alphabetLoopDecrement } from '../enigma/utils';

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
