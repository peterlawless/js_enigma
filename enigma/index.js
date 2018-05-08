import BiMap from 'mnemonist/bi-map';

import { shiftLetter, shiftNumber, isSingleLetter, scrambleBoardMapping } from './utils';
import { alphabetBiMap, Rotors, GreekWheels, Reflectors } from './constants';

export default function enigma(
    plainletter,
    config = {
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
    scrambleBoard = {}
) { 
    /*
        Begin Input Validation
    */

    // 'plainLetter' validation
    if (!isSingleLetter(plainletter)) {
        throw TypeError('input \'plainLetter\' must be a single uppercase letter');
    }

    // 'config.reflector' validation
    if (!config.hasOwnProperty('reflector')) {
        throw Error('Missing \'reflector\' property in the config object');
    } else if (!Reflectors.hasOwnProperty(config.reflector)) {
        throw Error(`Invalid reflector model \'${config.reflector}\'`);
    }
    
    // remaining 'config' validation'
    ['greekWheel', 'slowRotor', 'centerRotor', 'fastRotor'].map((property, index) => {
        if (!config.hasOwnProperty(property)) {
            throw Error(`Missing required \'${property}\' property from config object`);
        } else if (!(config[property] instanceof Object)) {
            throw Error(`\'${property}\' must be an instance of an Object`);
        }
        ['model', 'exposedLetter'].map((prop, idx) => {
            let activeProperty = config[property][prop];
            const err = new Error(`Invalid \'${property}.${prop}\' property in config object`);
            if (!config[property].hasOwnProperty(prop)) {
                throw Error(`Missing required \'${property}.${prop}\' property from config object`)
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

    // 'scrambleBoard' validation
    if (!(scrambleBoard instanceof Object)) {
        throw TypeError('input \'scrambleBoard\' must be an Object');
    } else if (!(Object.keys(scrambleBoard).every(isSingleLetter) || Object.values(scrambleBoard).every(isSingleLetter))) {
        throw TypeError('all keys and values in input \'scrambleBoard\' must be single uppercase letters');
    }
    
    /*
        End Input Validation
    */
    const scrambleBoardBiMap = BiMap.from(scrambleBoard);

    // TODO: check for intersection in the scrambleBoard, i.e., two letters mapping to one
    // TODO: limit size of scrambleBoard to 7(?) or however many cables were issued with the machine
    
    // Create an array expressing the configuration of the enigma
    var arr = [
        {wheel: Rotors[config.fastRotor.model], rotorOffset: shiftNumber('A', config.fastRotor.exposedLetter)},
        {wheel: Rotors[config.centerRotor.model], rotorOffset: shiftNumber('A', config.centerRotor.exposedLetter)},
        {wheel: Rotors[config.slowRotor.model], rotorOffset: shiftNumber('A', config.slowRotor.exposedLetter)},
        {wheel: GreekWheels[config.greekWheel.model], rotorOffset: shiftNumber('A', config.greekWheel.exposedLetter)}
    ];


    return scrambleBoardMapping( // the scrambleboard may map the cipherletter to a different letter on the lampboard
        arr.reduceRight(
            function(previousValue, currentValue){
                // after hitting the reflector, enigma works the same way, but the wiring connections are reversed from this perspective,
                // so we use the inverse mapping of the rotor/wheel
                const connectionElement = shiftLetter(previousValue, currentValue.rotorOffset);
                const totalShift = shiftNumber(connectionElement, currentValue.wheel.inverse.get(connectionElement));
                return shiftLetter(previousValue, totalShift)
            }, 
            Reflectors[config.reflector].get(
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
                    scrambleBoardMapping( // the scrambleboard may map the plainletter to a different contact on the entrywheel
                        plainletter,
                        scrambleBoardBiMap
                    )
                )
            )
        ),
        scrambleBoardBiMap
    );
}
