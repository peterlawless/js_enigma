# js_enigma

This repository is home to a JavaScript implementation of the infamous Enigma Code Machine that saw use by all branches of the Wehrmacht during World War 2.

## Usage

### Enigma overview

The Enigma Code Machine had many variants and there were a few gadgets that were developed as the war progressed to improve its security, but in almost every configuration and variant the Enigma had effectively three parts that an operator needed to configure in order to encrypt/decrypt messages:

1. **The Rotors.** The Enigma utilized rotors in an odometer-like mechanism, with 26 contacts along the circumference of each rotor, one for each letter of the alphabet. Each contact on one side would map to a different contact on the other side in a scrambled order. Rotors were made and labelled in identical sets so that any matching configuration would be consistent throughout the network. With each letter of the message being entered, the rotor mechanism would advance, effectively creating a new cipher encryption key for each character.
2. **The Reflector.** At the end of the rotor assembly was another set of 26 contacts that mapped each contact back onto a different contact on the adjacent rotor. This sent electric current back through the rotor assembly going the other way, taking a separate path out than the one it took in (i.e., the current is _reflected_). Some early Enigma variants had fixed (non-configurable) reflectors, while later variants had reflectors that could be configured via interchangable parts or custom wired to increase the complexity of the system.
3. **The Plugboard.** After the electric current had traversed the rotor assembly and back by way of the reflector's mapping, the plugboard is the final means of scrambling that message. While it is entirely optional (i.e., an Enigma will operate and encrypt a message successfully without one, albeit less securely), the plugboard presented the greatest number of ways to customize the configuration of the machine. The plugboard in its simplest form swaps pair of letters by way of a patch cable (i.e., given the pair of letters A and B, a ciphertext character A will map to B and B will map to A). Since there are 26 letters in the alphabet, you could arrange up to 13 pairs of letters on the plugboard this way, but any characters that are _not_ part of the plugboard configuration will effectively map onto themselves (i.e., not change). A late-war Enigma gadget called the _Uhr_ made the plugboard more complex by using a rotor-like device to make the plugboard's scrambling non-symetrical.

For a more detailed explanation of the inner workings of Enigma, visit [cryptomuseum.com](https://www.cryptomuseum.com/crypto/enigma/working.htm).

### Working example

This library will enforce that each Enigma component works authentically against the originals but will not enforce that historically accurate combinations of those components are used. Here we'll encrypt a message using the M4 Enigma, the variant used exclusively by the U-Boats (submarines) of the Kriegsmarine.

Assume the following settings

<html>
  <table>
    <caption>Inner settings <em>(Innere Einstellung)</em></caption>
    <thead>
      <tr>
        <th>Thin reflector</th>
        <th>Greek Wheel</th>
        <th colspan="3">Rotors <em>(Walzelage)</em></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>B</td>
        <td>Beta</td>
        <td>VII</td>
        <td>IV</td>
        <td>V</td>
      </tr>
      <tr>
        <td/>
        <td>A</td>
        <td>G</td>
        <td>N</td>
        <td>O</td>
      </tr>
    </tbody>
  </table>
</html>

<html>
  <table>
    <caption>External settings <em>(Äußere Einstellung)</em></caption>
    <thead>
      <tr>
        <th>Plugboard settings <em>(Steckerverbindungen)</em></th>
        <th>Initial rotor positions <em>(Grundstellung)</em></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>18/26  17/4  21/6  3/16  19/14  22/7  8/1  12/25  5/9  10/15</td>
        <td>H F K D</td>
      </tr>
    </tbody>
  </table>
</html>

```javascript
// functions build the reflector
import { makeM4Reflector, GREEK_WHEELS, THIN_REFLECTORS } from "reflectors";

// function to build the plugboard
import { makeM4Plugboard } from "plugboards";

// import rotors
import { M4 as ROTORS } from "rotors";

// and the function to tie it all together
import enigma from "enigma";

const plugboard = makeM4Plugboard([
  [18, 26],
  [17, 4],
  [21, 6],
  [3, 16],
  [19, 14],
  [22, 7],
  [8, 1],
  [12, 25],
  [5, 9],
  [10, 15]
]);

const reflector = makeM4Reflector(REFLECTORS.b, GREEK_WHEELS.beta, "H");

const rotorSettings = [
  { rotor: ROTORS.VII, ringSetting: "G", ringPosition: "F" },
  { rotor: ROTORS.IV, ringSetting: "N", ringPosition: "K" },
  { rotor: ROTORS.V, ringSetting: "O", ringPosition: "D" }
];

const encrpt = enigma(plugboard, reflector, rotorSettings);

console.log(encrypt("What hath God wrought?"));
```

## Acknowledgements

Special thanks to [cryptomuseum.com](http://cryptomuseum.com/index.htm) for their excellent documentation of every Enigma variants, especially for providing the [wiring](https://www.cryptomuseum.com/crypto/enigma/wiring.htm) of its many rotors and reflectors.

Disclaimer: this project is just for funsies and the Enigma is not a secure means of encryption. The Germans lost the war for a variety of reasons, including that the Allies were "reading their mail" almost the entire time. So please don't use this library to encrypt anything important.
