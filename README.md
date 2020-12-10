# js_enigma

This repository is home to a JavaScript implementation of the infamous Enigma Code Machine that saw use by all branches of the Wehrmacht during World War 2.

## Enigma overview

The Enigma Code Machine is a rotor-based cipher machine that was used by the German military during the Second World War. It has gained some popular attention in recent years thanks to movies like [_U-571_](https://www.imdb.com/title/tt0141926/) and [_The Imitation Game_](https://www.imdb.com/title/tt2084970/).

The Enigma used symmetric encryption, meaning that both sender and recipient use the same key to encrypt and decrypt a message, respectively. The "key" came in the form of a very specific configuration instructions for the machine. The strength of the Enigma came from the millions of ways the machine could be configured.

The Enigma Code Machine had many variants and there were a few gadgets that were developed as the war progressed to improve its security, but in almost every configuration and variant the Enigma had effectively three parts that an operator needed to configure in order to encrypt/decrypt messages:

1. **The Rotors.** The Enigma utilized rotors in an odometer-like mechanism, with 26 contacts along the circumference of each rotor, one for each letter of the alphabet. Each contact on one side would map to a different contact on the other side in a scrambled order. Rotors were made and labelled in identical sets so that any matching configuration would be consistent throughout the network. With each letter of the message being entered, the rotor mechanism would advance, effectively creating a new cipher encryption key for each character.
2. **The Reflector.** At the end of the rotor assembly was another set of 26 contacts that mapped each contact back onto a different contact on the adjacent rotor. This sent electric current back through the rotor assembly going the other way, taking a separate path out than the one it took in (i.e., the current is _reflected_). Some early Enigma variants had fixed (non-configurable) reflectors, while later variants had reflectors that could be configured via interchangable parts or custom wired to increase the complexity of the system.
3. **The Plugboard.** After the electric current had traversed the rotor assembly and back by way of the reflector's mapping, the plugboard is the final means of further scrambling that message. While it is entirely optional (i.e., an Enigma will operate and encrypt a message successfully without one, albeit less securely), the plugboard presented the greatest number of ways to customize the configuration of the machine. The plugboard in its simplest form swaps pair of letters by way of a patch cable (i.e., given the pair of letters A and B, a ciphertext character A will map to B and B will map to A). Since there are 26 letters in the alphabet, you could arrange up to 13 pairs of letters on the plugboard this way, but any characters that are _not_ part of the plugboard configuration will effectively map onto themselves (i.e., not change). A late-war Enigma gadget called the _Uhr_ made the plugboard more complex by using a rotor-like device to make the plugboard's scrambling non-symetrical.

For a more detailed explanation of the inner workings of Enigma, visit [cryptomuseum.com](https://www.cryptomuseum.com/crypto/enigma/working.htm).

## API

```javascript
import Enigma from "js_enigma";

const engima = new Enigma();
```

To get started, create a new instance of `Enigma`. The constructor accepts a single optional parameter `rotorCount` to represent the number of _turning_ rotors within the machine. The `rotorCount` has a sensible default of 3, since most Enigma Code Machines had that many (including the M4, in which case the "fourth rotor" is effectively part of the reflector). There is no historically authentic reason a user would need to override this.

Enigma methods:

### `withRotors(...rotors)`

Sets the "wheel order" (or, in the German instructions, _Walzenlage_), which represents the permutatation of rotors used in a particualr configuration.

- Arguments
  - `...rotors`: `[ROTOR] => enigma` Required. Each `rotor` is an object that represents the wiring and turnover notches/ratchets of a physical Enigma rotor. The js\*enigma project makes many of these available to be provided into this method. The `...rotors` arguments must be provided in order according to the _Walzenlage_ daily key setting.
- Returns
  - the `Enigma` instance so that this method can be chained with other machine configuration methods.

### `withRingSettings(...ringSettings)`

`[(A-Z|1-26)] => enigma` Sets the _Ringstellung_, which is the orientation of the index disc on a rotor with respect to its wiring. This part of an Enigma configuration would impact the turnover behavior of the odometer-like mechanism, since the pawls of the mechanism would engage notches on the index ring. Different ring settings would change at what point a rotor would turn over during the encryption process.

- Arguments
  - `...ringSettings`: Ring settings are single capital letters or integers inclusively between 1 and 26. All rotor configurations should strictly be in one or the other format.
- Returns
  - the `Enigma` instance so that this method can be chained with other machine configuration methods.

### `withRotorPositions`

`[(A-Z|1-26)] => enigma` Required. Sets the _Grundstellung_, which is the orientation of the rotor in the machine with respect to the rotor window. This establishes the starting position of all rotors before encryption commences.

- Arguments
  - `...rotorPositions`: Rotor positions are single capital letters or integers inclusively between 1 and 26. All rotor configurations should strictly be in one or the other format.
- Returns
  - the `Enigma` instance so that this method can be chained with other machine configuration methods.

### `withReflector`

`reflector => enigma` Required. Sets the reflector. This is the part of the machine that receives a signal after it has traversed all of the rotors, and sends it back via another path.

- Arguments
  - `reflector`: Reflectors are functions that may or may not need operator configuration to work properly. Earlier Enigma variants had static reflectors, in which use case the reflector can be imported and passed directly as the sole argument of this method. Later variants had more involved configurations (such as the [UKW-D](https://www.cryptomuseum.com/crypto/enigma/ukwd/index.htm) or Thin Reflector + Greek Wheel used on the [M4 Enigma](https://www.cryptomuseum.com/crypto/enigma/m4/index.htm)), in which use case the reflector is configured using an imported builder method, the return value of which can used as the sole input parameter for this method.
- Returns
  - the `Enigma` instance so that this method can be chained with other machine configuration methods.

### `withPlugboard`

`reflector => enigma` Configures the pluboard. After the electric signal has traversed the rotor assembly, and returned by the path determined by the Reflector, the plugboard would optionally intercept the signal as it came back to a letter and send it to a different letter. This was typically performed with patch cables to swap pairs of letters but the late-war [Enigma Uhr](https://www.cryptomuseum.com/crypto/enigma/uhr/index.htm) device made the plugboard step non-reciprocal (i.e., letter mappings were not the same in both directions through the device).

### Working example

This library will enforce that each Enigma component works authentically against the originals but will not enforce that historically accurate combinations of those components are used. Here we'll encrypt a message using components from the M4 Enigma, the variant used exclusively by the U-Boats (submarines) of the Kriegsmarine.

Assume the following settings:

- Wheel order _(Walzenlage)_: I II III
- Ring settings _(Ringstellung)_: F O O
- Rotor positions _(Grundstellung)_: B A R

We will leave the plugboard unconfigured in this example, and use the default configuration for the reflector.

```javascript
import Enigma, { M4_ROTORS as ROTORS, buildGreekWheelReflector } from "enigma";

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
