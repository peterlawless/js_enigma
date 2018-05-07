# js_enigma
Proof of concept project for a static site with the functionality of the M4 Enigma

This repository is home for a javascript implementation of the Enigma Code M4, as well as relevant unit and functional tests.

Special thanks to [cryptomuseum.com](http://cryptomuseum.com/index.htm) for their excellent documentation of the [Enigma M4](http://cryptomuseum.com/crypto/enigma/m4/), especially for providing the wiring of its many rotors and reflectors.

**Important note:** the `enigma` function only takes in a single, uppercase letter (plaintext), and an object describing the configuration of the code machine, and returns a single uppercase letter (ciphertext) *without* mutating the configuration (i.e., it does not rotate the rotors).  The state of the code machine's configuration ought to be delegated to a state container such as [redux](https://redux.js.org/).

TODO: Implement scrambleboard functionality
