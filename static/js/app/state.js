"use strict";

export const state = {
  // Tracker
  moves: 0,
  pauseMoves: 0,
  // Core
  players: [],
  playingColors: null,
  colors: ["red", "blue", "green", "purple", "cyan", "yellow"],

  // Setup Vars
  holePoints: null,
  gapSpacing: null,
  modalSpeed: null,
  gapSizing: null,

  // In Game Vars
  borderSeparation: 100,
  gameHasStarted: false,
  showMessages: false,
  holeSize: 30,
  spaceBetweenHoles: 100,
  isNewRound: false,
  roundNumber: 0,
  onPause: false,
  wormsAlive: 0,
  scoreToWin: 0,
  maxScore: 0,
  maxScorePlayers: 0,
  wormHasCrush: false,
  imageArray: null,
  soundOn: true,
  winningWorm: "",
  longestWormSize: 0,
  longestWorm: null,
  longestWormColor: "",
  wormIsInHole: false,
  gameId: "",
  keyId: "",
  source: "main",

  // How Will Worm Move
  speedingChance: 500,
  startingSpeed: 15,
  speedingIncrementSpeed: 5,
  intervalMiliSeconds: 1000,
  speed: 10,
  basicFPSValue: 20,
  fps: 0,
  wormSize: 4,
  angleStepSize: 1,
  sizeMultiplier: 2,
  currentRound: 0,
  historyDotsSaved: 1000,

  // Canvas and JS Vars
  xMax: 640,
  yMax: 480,
  angleMax: 360,
  interval: null,
  context: null,
  marker: null,
  keyCode: null,
  i: 0,
  score_x: 13,
  score_y: 42,

  // Math Vars
  sin: null,
  cos: null,
  angle: null,
  x: null,
  y: null,

  // Information Vars
  message: "",
  actionCounter: 0,
  pauseOn: false,

  // Marker Vars
  xMarker: 0,
  yMarker: 0,
  wMarker: 80,
  hMarker: 80,

  // Arrays
  keysBeenPressed: [],
  worms: new Array(6),
  rgbColors: new Array(6),
  occupied: new Set(),

  // Default Keys
  defaultKeys: {
    0: { color: "red", left: 192, right: 49 },
    1: { color: "blue", left: 90, right: 88 },
    2: { color: "green", left: 66, right: 86 },
    3: { color: "purple", left: 55, right: 54 },
    4: { color: "cyan", left: 187, right: 222 },
    5: { color: "yellow", left: 40, right: 39 },
  },
  usingDefaultKeys: false,

  currentKeys: {
    0: { color: "red", left: -1, right: -1 },
    1: { color: "blue", left: -1, right: -1 },
    2: { color: "green", left: -1, right: -1 },
    3: { color: "purple", left: -1, right: -1 },
    4: { color: "yellow", left: -1, right: -1 },
    5: { color: "cyan", left: -1, right: -1 },
  },
};
