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

This library will enforce that each Enigma component works authentically against the originals but will not enforce that historically accurate combinations of those components are used. Here we'll encrypt a message using components from the M4 Enigma, the variant used exclusively by the U-Boats (submarines) of the Kriegsmarine.

Assume the following settings:

- Wheel order _(Walzenlage)_: I II III
- Ring settings _(Ringstellung)_: F O O
- Rotor positions _(Grundstellung)_: B A R

We will leave the plugboard unconfigured in this example, and use the default configuration for the reflector.

```javascript
import { ROTORS, buildGreekWheelReflector } from "m4";

import Enigma from "enigma";

const enigma = new Enigma()
  .withRotors(ROTORS.I, ROTORS.II, ROTORS.III)
  .withRingSettings("F", "O", "O")
  .withRotorPositions("B", "A", "R")
  .withReflector(buildGreekWheelReflector());

console.log(enigma.encryptMessage("WHAT HATH GOD WROUGHT?")); // CUNA ZSKD MUL TOYJWQS?

console.log(enigma.rotorPositions); // ["B", "B", "J"]
// the rotors have advanced with each keystroke according to the configuation of each rotor

enigma.withRotorPositions("B", "A", "R"); // reset the rotor positions
console.log(engima.encryptMessage("CUNA ZSKD MUL TOYJWQS?")); // WHAT HATH GOD WROUGHT?
// the encryption is symmetric!
```

## Acknowledgements

Special thanks to [cryptomuseum.com](http://cryptomuseum.com/index.htm) for their excellent documentation of every Enigma variants, especially for providing the [wiring](https://www.cryptomuseum.com/crypto/enigma/wiring.htm) of its many rotors and reflectors.

Thank you also to my brilliant friend and coworker Jason for his advice that made some semblance of a public interface possible

Disclaimer: this project is just for funsies and the Enigma is not a secure means of encryption. The Germans lost the war for a variety of reasons, including that the Allies were "reading their mail" almost the entire time. So please don't use this library to encrypt anything important.
