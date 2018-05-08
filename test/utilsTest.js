import { expect } from 'chai';
import BiMap from 'mnemonist/bi-map';
import { shiftNumber, shiftLetter, isSingleLetter, scrambleBoardMapping } from '../enigma/utils';

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

describe('scrambleBoardMapping', function() {
    const biMap = BiMap.from({A: 'B'});
    it('should return the value associated with a key in the provided BiMap', function() {
        expect(scrambleBoardMapping('A', biMap)).to.equal('B');
    });

    it('should return the value associated with a key in the provided BiMap (inverse)', function() {
        expect(scrambleBoardMapping('B', biMap)).to.equal('A');
    });

    it('should return the letter provided in the first argument if that letter is not present in the BiMap', function() {
        expect(scrambleBoardMapping('C', biMap)).to.equal('C');
    });
});
