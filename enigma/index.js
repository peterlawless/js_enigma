import BiMap from 'mnemonist/bi-map';
import { flow } from 'lodash';

import { shiftLetter, shiftNumber, isSingleLetter, bidirectionalMapFrom } from './utils';
import {
    Rotors,
    GreekWheels,
    Reflectors,
    REFLECTOR,
    GREEK_WHEEL,
    SLOW_ROTOR,
    CENTER_ROTOR,
    FAST_ROTOR,
    MODEL,
    EXPOSED_LETTER
} from './constants';

export default function enigma(
    plainletter,
    scrambler = {
        [REFLECTOR]: '',
        [GREEK_WHEEL]: {
            [MODEL]: '',
            [EXPOSED_LETTER]: ''
        },
        [SLOW_ROTOR]: {
            [MODEL]: '',
            [EXPOSED_LETTER]: ''
        },
        [CENTER_ROTOR]: {
            [MODEL]: '',
            [EXPOSED_LETTER]: ''
        },
        [FAST_ROTOR]: {
            [MODEL]: '',
            [EXPOSED_LETTER]: ''
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
    if (!scrambler.hasOwnProperty(REFLECTOR)) {
        throw Error('Missing \'reflector\' property in the scrambler object');
    } else if (!Reflectors.hasOwnProperty(scrambler[REFLECTOR])) {
        throw Error(`Invalid reflector model \'${scrambler[REFLECTOR]}\'`);
    }
    
    // remaining 'scrambler' validation'
    [GREEK_WHEEL, SLOW_ROTOR, CENTER_ROTOR, FAST_ROTOR].map((property, index) => {
        if (!scrambler.hasOwnProperty(property)) {
            throw Error(`Missing required \'${property}\' property from scrambler object`);
        } else if (!(scrambler[property] instanceof Object)) {
            throw Error(`\'${property}\' must be an instance of an Object`);
        }
        [MODEL, EXPOSED_LETTER].map((prop, idx) => {
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
        if(plugBoardBiMap.inverse.has(key)) {
            throw Error(`duplicate mapping to letter \'${key}\' in plugBoard`);
        }
    });

    function plugBoardMapping(letter) {
        return bidirectionalMapFrom(letter, plugBoardBiMap);
    }

    // TODO: limit size of plugBoard to 7(?) or however many cables were issued with the machine
    
    // Create an array expressing the scrambler configuration of the enigma
    var arr = [
        {wheel: Rotors[scrambler[FAST_ROTOR][MODEL]], rotorOffset: shiftNumber('A', scrambler[FAST_ROTOR][EXPOSED_LETTER])},
        {wheel: Rotors[scrambler[CENTER_ROTOR][MODEL]], rotorOffset: shiftNumber('A', scrambler[CENTER_ROTOR][EXPOSED_LETTER])},
        {wheel: Rotors[scrambler[SLOW_ROTOR][MODEL]], rotorOffset: shiftNumber('A', scrambler[SLOW_ROTOR][EXPOSED_LETTER])},
        {wheel: GreekWheels[scrambler[GREEK_WHEEL][MODEL]], rotorOffset: shiftNumber('A', scrambler[GREEK_WHEEL][EXPOSED_LETTER])}
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
            Reflectors[scrambler[REFLECTOR]].get(
                arr.reduce(
                    function(accumulator, currentValue) {
                        // accumulator is a LETTER, not a number
                        // currentValue is an element in arr
                        
                        // all shifts are calculated with respect to the orientation of the entrywheel,
                        // whose elements are in alphabetical order with 'A' as the 'exposedLetter'

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
