import { shiftLetter, shiftNumber, isSingleLetter } from './utils';
import { Rotors, GreekWheels, Reflectors } from './constants';

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
    scrambleBoard = null
) { 
    /*
        Input Validation
    */

    // 'plainLetter' validation
    if (!isSingleLetter(plainletter)) {
        throw Error('input \'plainLetter\' must be a single uppercase letter');
    }

    // 'config.reflector' validation
    if (!config.hasOwnProperty('reflector')) {
        throw Error('Missing \'reflector\' property in the config object');
    } else if (!Reflectors.hasOwnProperty(config.reflector)) {
        throw Error(`Invalid reflector model \'${config.reflector}\'`);
    }

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
    
}
