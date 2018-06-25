import BiMap from 'mnemonist/bi-map';
import { flow } from 'lodash';

import { shiftLetter, shiftNumber, isSingleLetter, bidirectionalMapFrom } from './utils';
import { Rotors, GreekWheels, Reflectors } from './constants';

export default function enigma(
    plainletter,
    scrambler = {
        reflector: '',
        greekWheel: {
            model: '',
            exposedLetter: ''
        },
        slowRotor: {
            model: '',
            exposedLetter: ''
        },
        centerRotor: {
            model: '',
            exposedLetter: ''
        },
        fastRotor: {
            model: '',
            exposedLetter: ''
        }
    },
    plugBoard = {}
) { 
    /*
        Begin Input Validation
    */

    // 'plainLetter' validation
    if (!isSingleLetter(plainletter)) {
        throw TypeError('input \'plainLetter\' must be a single uppercase letter');
    }

    // 'scrambler.reflector' validation
    if (!scrambler.hasOwnProperty('reflector')) {
        throw Error('Missing \'reflector\' property in the scrambler object');
    } else if (!Reflectors.hasOwnProperty(scrambler.reflector)) {
        throw Error(`Invalid reflector model \'${scrambler.reflector}\'`);
    }
    
    // remaining 'scrambler' validation'
    ['greekWheel', 'slowRotor', 'centerRotor', 'fastRotor'].map((property, index) => {
        if (!scrambler.hasOwnProperty(property)) {
            throw Error(`Missing required \'${property}\' property from scrambler object`);
        } else if (!(scrambler[property] instanceof Object)) {
            throw Error(`\'${property}\' must be an instance of an Object`);
        }
        ['model', 'exposedLetter'].map((prop, idx) => {
            let activeProperty = scrambler[property][prop];
            const err = new Error(`Invalid \'${property}.${prop}\' property in scrambler object`);
            if (!scrambler[property].hasOwnProperty(prop)) {
                throw Error(`Missing required \'${property}.${prop}\' property from scrambler object`)
            }
            // 'model' validation
            if (idx == 0) {
                // greek wheel
                if (index == 0 && !GreekWheels.hasOwnProperty(activeProperty)) {
                    throw err;                    
                }
                // everything else
                else if (index != 0 && !Rotors.hasOwnProperty(activeProperty)) {
                    throw err;                                        
                }
            }
            // 'exposedLetter' validation
            if (idx == 1 && !isSingleLetter(activeProperty)) {
                throw err;
            }
        })
    })

    // 'plugBoard' validation
    if (!(plugBoard instanceof Object)) {
        throw TypeError('input \'plugBoard\' must be an Object');
    }
    
    /*
        End Input Validation
    */
    const plugBoardBiMap = BiMap.from(plugBoard);

    // one iteration for input validation
    plugBoardBiMap.forEach((value, key) => {
        if (!(isSingleLetter(key) || isSingleLetter(value))) {
            throw Error('all keys and values in input \'plugBoard\' must be single uppercase letters');
        }
        if(plugBoardBiMap.inverse.has(value)) {
            throw Error(`duplicate mapping to letter \'${value}\' in plugBoard`);
        }
    });

    function plugBoardMapping(letter) {
        return bidirectionalMapFrom(letter, plugBoardBiMap);
    }

    // TODO: limit size of plugBoard to 7(?) or however many cables were issued with the machine
    
    // Create an array expressing the scrambleruration of the enigma
    var arr = [
        {wheel: Rotors[scrambler.fastRotor.model], rotorOffset: shiftNumber('A', scrambler.fastRotor.exposedLetter)},
        {wheel: Rotors[scrambler.centerRotor.model], rotorOffset: shiftNumber('A', scrambler.centerRotor.exposedLetter)},
        {wheel: Rotors[scrambler.slowRotor.model], rotorOffset: shiftNumber('A', scrambler.slowRotor.exposedLetter)},
        {wheel: GreekWheels[scrambler.greekWheel.model], rotorOffset: shiftNumber('A', scrambler.greekWheel.exposedLetter)}
    ];

    function rotorScramble(letter) {
        return arr.reduceRight(
            function(previousValue, currentValue){
                // after hitting the reflector, enigma works the same way, but the wiring connections are reversed from this perspective,
                // so we use the inverse mapping of the rotor/wheel
                const connectionElement = shiftLetter(previousValue, currentValue.rotorOffset);
                const totalShift = shiftNumber(connectionElement, currentValue.wheel.inverse.get(connectionElement));
                return shiftLetter(previousValue, totalShift)
            }, 
            Reflectors[scrambler.reflector].get(
                arr.reduce(
                    function(accumulator, currentValue) {
                        // accumulator is a LETTER, not a number
                        // currentValue is an element in arr

                        // find which letter is actually in currentValue's 'accumulator' position
                        const connectionElement = shiftLetter(accumulator, currentValue.rotorOffset);

                        // find the shift associated with that letter
                        const totalShift = shiftNumber(connectionElement, currentValue.wheel.get(connectionElement));

                        // return the letter having undergone that shift
                        return shiftLetter(accumulator, totalShift);
                    },
                    letter
                )
            )
        )
    }

    return flow([plugBoardMapping, rotorScramble, plugBoardMapping])(plainletter);
}
