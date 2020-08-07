import BiMap from "mnemonist/bi-map";

export const ALPHABET_BI_MAP = BiMap.from({
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25
});

export const ROTORS = {
  I: {
    wiring: BiMap.from({
      A: "E",
      B: "K",
      C: "M",
      D: "F",
      E: "L",
      F: "G",
      G: "D",
      H: "Q",
      I: "V",
      J: "Z",
      K: "N",
      L: "T",
      M: "O",
      N: "W",
      O: "Y",
      P: "H",
      Q: "X",
      R: "U",
      S: "S",
      T: "P",
      U: "A",
      V: "I",
      W: "B",
      X: "R",
      Y: "C",
      Z: "J"
    }),
    turnoverLetters: { Q: true }
  },
  II: {
    wiring: BiMap.from({
      A: "A",
      B: "J",
      C: "D",
      D: "K",
      E: "S",
      F: "I",
      G: "R",
      H: "U",
      I: "X",
      J: "B",
      K: "L",
      L: "H",
      M: "W",
      N: "T",
      O: "M",
      P: "C",
      Q: "Q",
      R: "G",
      S: "Z",
      T: "N",
      U: "P",
      V: "Y",
      W: "F",
      X: "V",
      Y: "O",
      Z: "E"
    }),
    turnoverLetters: { E: true }
  },
  III: {
    wiring: BiMap.from({
      A: "B",
      B: "D",
      C: "F",
      D: "H",
      E: "J",
      F: "L",
      G: "C",
      H: "P",
      I: "R",
      J: "T",
      K: "X",
      L: "V",
      M: "Z",
      N: "N",
      O: "Y",
      P: "E",
      Q: "I",
      R: "W",
      S: "G",
      T: "A",
      U: "K",
      V: "M",
      W: "U",
      X: "S",
      Y: "Q",
      Z: "O"
    }),
    turnoverLetters: { V: true }
  },
  IV: {
    wiring: BiMap.from({
      A: "E",
      B: "S",
      C: "O",
      D: "V",
      E: "P",
      F: "Z",
      G: "J",
      H: "A",
      I: "Y",
      J: "Q",
      K: "U",
      L: "I",
      M: "R",
      N: "H",
      O: "X",
      P: "L",
      Q: "N",
      R: "F",
      S: "T",
      T: "G",
      U: "K",
      V: "D",
      W: "C",
      X: "M",
      Y: "W",
      Z: "B"
    }),
    turnoverLetters: { J: true }
  },
  V: {
    wiring: BiMap.from({
      A: "V",
      B: "Z",
      C: "B",
      D: "R",
      E: "G",
      F: "I",
      G: "T",
      H: "Y",
      I: "U",
      J: "P",
      K: "S",
      L: "D",
      M: "N",
      N: "H",
      O: "L",
      P: "X",
      Q: "A",
      R: "W",
      S: "M",
      T: "J",
      U: "Q",
      V: "O",
      W: "F",
      X: "E",
      Y: "C",
      Z: "K"
    }),
    turnoverLetters: { Z: true }
  },
  VI: {
    wiring: BiMap.from({
      A: "J",
      B: "P",
      C: "G",
      D: "V",
      E: "O",
      F: "U",
      G: "M",
      H: "F",
      I: "Y",
      J: "Q",
      K: "B",
      L: "E",
      M: "N",
      N: "H",
      O: "Z",
      P: "R",
      Q: "D",
      R: "K",
      S: "A",
      T: "S",
      U: "X",
      V: "L",
      W: "I",
      X: "C",
      Y: "T",
      Z: "W"
    }),
    turnoverLetters: { Z: true, M: true }
  },
  VII: {
    wiring: BiMap.from({
      A: "N",
      B: "Z",
      C: "J",
      D: "H",
      E: "G",
      F: "R",
      G: "C",
      H: "X",
      I: "M",
      J: "Y",
      K: "S",
      L: "W",
      M: "B",
      N: "O",
      O: "U",
      P: "F",
      Q: "A",
      R: "I",
      S: "V",
      T: "L",
      U: "P",
      V: "E",
      W: "K",
      X: "Q",
      Y: "D",
      Z: "T"
    }),
    turnoverLetters: { Z: true, M: true }
  },
  VIII: {
    wiring: BiMap.from({
      A: "F",
      B: "K",
      C: "Q",
      D: "H",
      E: "T",
      F: "L",
      G: "X",
      H: "O",
      I: "C",
      J: "B",
      K: "J",
      L: "S",
      M: "P",
      N: "D",
      O: "Z",
      P: "R",
      Q: "A",
      R: "M",
      S: "E",
      T: "W",
      U: "N",
      V: "I",
      W: "U",
      X: "Y",
      Y: "G",
      Z: "V"
    }),
    turnoverLetters: { Z: true, M: true }
  }
};

export const GREEK_WHEELS = {
  beta: BiMap.from({
    A: "L",
    B: "E",
    C: "Y",
    D: "J",
    E: "V",
    F: "C",
    G: "N",
    H: "I",
    I: "X",
    J: "W",
    K: "P",
    L: "B",
    M: "Q",
    N: "M",
    O: "D",
    P: "R",
    Q: "T",
    R: "A",
    S: "K",
    T: "Z",
    U: "G",
    V: "F",
    W: "U",
    X: "H",
    Y: "O",
    Z: "S"
  }),
  gamma: BiMap.from({
    A: "F",
    B: "S",
    C: "O",
    D: "K",
    E: "A",
    F: "N",
    G: "U",
    H: "E",
    I: "R",
    J: "H",
    K: "M",
    L: "B",
    M: "T",
    N: "I",
    O: "Y",
    P: "C",
    Q: "W",
    R: "L",
    S: "Q",
    T: "P",
    U: "Z",
    V: "X",
    W: "V",
    X: "G",
    Y: "J",
    Z: "D"
  })
};

export const REFLECTORS = {
  b: BiMap.from({
    A: "E",
    B: "N",
    C: "K",
    D: "Q",
    F: "U",
    G: "Y",
    H: "W",
    I: "J",
    L: "O",
    M: "P",
    R: "X",
    S: "Z",
    T: "V"
  }),
  c: BiMap.from({
    A: "R",
    B: "D",
    C: "O",
    E: "J",
    F: "N",
    G: "T",
    H: "K",
    I: "V",
    L: "M",
    P: "W",
    Q: "Z",
    S: "X",
    U: "Y"
  })
};

export const REFLECTOR = "reflector";
export const GREEK_WHEEL = "greekWheel";
export const SLOW_ROTOR = "slowRotor";
export const CENTER_ROTOR = "centerRotor";
export const FAST_ROTOR = "fastRotor";

export const MODEL = "model";
export const EXPOSED_LETTER = "exposedLetter";
