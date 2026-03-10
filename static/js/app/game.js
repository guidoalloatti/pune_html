"use strict";

import { $, $$, show, hide } from "./dom.js";
import { state } from "./state.js";
import { addMessage } from "./messages.js";
import { logEvent } from "./logs.js";
import { playSound, pause, playBeep } from "./sounds.js";
import { loadKeysData } from "./storage.js";
import { online } from "./online.js";
import { clearScreen, drawCircle, drawHole, drawMarkerBlocks, updateScoreDisplay } from "./renderer.js";

export function setKeyHelp() {
  state.players.forEach((player) => {
    if (player.playing) {
      const row = $("#" + player.color + "KeyHelpRow");
      const rightBtn = $("#" + player.color + "RightButton");
      const leftBtn = $("#" + player.color + "LeftButton");
      if (row) row.style.display = "block";
      if (rightBtn) rightBtn.value = String.fromCharCode(player.rightKey);
      if (leftBtn) leftBtn.value = String.fromCharCode(player.leftKey);
    }
  });
}

function drawMarkers() {
  state.yMarker = 0;
  drawMarkerBlocks(state.colors, state.xMarker, state.yMarker, state.wMarker, state.hMarker);
}

function drawScore() {
  updateScoreDisplay(state.players, state.score_x, state.score_y, state.yMax);
}

function markOccupied(x, y) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  state.occupied.add(key);
}

function unmarkOccupied(x, y) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  state.occupied.delete(key);
}

function markHole(x, y, ownerIndex) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  if (!state.holes) state.holes = new Map();
  state.holes.set(key, ownerIndex);
}

function isOccupied(x, y) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  return state.occupied.has(key);
}

function isHoleCell(x, y) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  return !!(state.holes && state.holes.has(key));
}

function isOccupiedAt(x, y) {
  if (isHoleCell(x, y)) return false;
  return isOccupied(x, y);
}

function isOccupiedNear(x, y, radius) {
  if (isOccupiedAt(x, y)) return true;
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const angle = (Math.PI * 2 * i) / steps;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (isOccupiedAt(px, py)) return true;
  }
  return false;
}

function drawWorm(currentWorm) {
  drawCircle(currentWorm.color, currentWorm.x, currentWorm.y, state.wormSize);
  markOccupied(currentWorm.x, currentWorm.y);
  if (isHole(currentWorm)) {
    const holeX = currentWorm.previousX[8];
    const holeY = currentWorm.previousY[8];
    drawHole(holeX, holeY, state.wormSize + 1, 2);
    markHole(holeX, holeY, currentWorm.index);
    unmarkOccupied(holeX, holeY);
    currentWorm.previousHole[currentWorm.length] = true;
  } else {
    currentWorm.previousHole[currentWorm.length] = false;
  }
  currentWorm.length += 1;
}

function setContextProperties() {
  // PixiJS handles rendering
}

function loadCanvasContext() {
  return true;
}

export function startGame(selectedColors) {
  const colorsToCheck = Array.isArray(selectedColors) && selectedColors.length
    ? selectedColors
    : (state.playingColors || []);
  const needsKeys = colorsToCheck.some((color) => {
    const idx = getWormIndexByColor(color);
    const key = state.currentKeys[idx];
    return !key || !Number.isFinite(key.left) || !Number.isFinite(key.right) || key.left < 0 || key.right < 0;
  });
  if (needsKeys) getDbKeys(state.source);
  normalizeKeys();
  state.context = loadCanvasContext();

  if (state.context) {
    state.isNewRound = false;
    state.players.forEach((p) => {
      if (typeof p.leftKey !== "undefined") state.keysBeenPressed[p.leftKey] = false;
      if (typeof p.rightKey !== "undefined") state.keysBeenPressed[p.rightKey] = false;
    });

    start(selectedColors);
    setRound();
    doSpeeding();
    state.isNewRound = true;
    state.speed = state.startingSpeed;
    addMessage(state.currentRound, "rounds");
    changeInterval(state.speed);
    setKeyHelp();
    const players = (state.playingColors || []).join(", ") || "(auto)";
    logEvent({ actor: "System", action: "Game started", detail: `Players: ${players}` });
  } else {
    alert("Cannot Load Canvas");
  }
}

function changeAngle(direction, currentWorm) {
  if (direction == "left") {
    if ((currentWorm.angle - state.angleStepSize) <= 0) {
      currentWorm.angle = state.angleMax + currentWorm.angle;
    }
    currentWorm.angle -= state.angleStepSize;
  } else if (direction == "right") {
    if ((currentWorm.angle + state.angleStepSize) >= state.angleMax) {
      currentWorm.angle = 0 - (state.angleMax - currentWorm.angle);
    }
    currentWorm.angle += state.angleStepSize;
  }
  return currentWorm;
}

function Worm() {
  this.color;
  this.x;
  this.y;
  this.leftKey;
  this.rightKey;
  this.angle;
  this.previousX = new Array(state.historyDotsSaved);
  this.previousY = new Array(state.historyDotsSaved);
  this.previousHole = new Array(state.historyDotsSaved);
  this.alive = false;
  this.playing = false;
  this.score = 0;
  this.length = 0;
  this.defaultKeys = true;
  this.lastHoleStarted = 0;
  this.index = 0;
  this.holeScore = 0;
  this.inHole = false;
  this.inScreenHole = false;
}

function start(selectedColors) {
  setConfigurationOptions();
  setContextProperties();
  clearScreen();
  state.occupied = new Set();
  state.holes = new Map();
  drawMarkers();
  addMessage(state.speed / 5, "speed");
  startWorms(selectedColors);
}

function setConfigurationOptions() {
  if (state.modalSpeed == "Slow") state.startingSpeed = 15;
  else if (state.modalSpeed == "Normal") state.startingSpeed = 30;
  else if (state.modalSpeed == "Frantic") state.startingSpeed = 45;

  if (state.gapSpacing == "Close") state.spaceBetweenHoles = 75;
  else if (state.gapSpacing == "Normal") state.spaceBetweenHoles = 100;
  else if (state.gapSpacing == "Far Apart") state.spaceBetweenHoles = 125;

  if (state.gapSizing == "Small") state.holeSize = 10;
  else if (state.gapSizing == "Normal") state.holeSize = 20;
  else if (state.gapSizing == "Large") state.holeSize = 30;
}

function startWorms(selectedColors) {
  if (!state.gameHasStarted && typeof selectedColors !== "undefined") {
    selectedColors.forEach((c) => startWorm(c));
  }

  state.players.forEach((p) => {
    if (p.playing) startWorm(p.color);
  });
  drawScore();
}

function startWorm(color) {
  const c = color.toString();
  state.x = Math.floor(Math.random() * state.xMax);
  state.y = Math.floor(Math.random() * state.yMax);
  state.angle = Math.floor(Math.random() * state.angleMax);
  state.i = getWormIndexByColor(c);

  if (state.x < state.borderSeparation) state.x += state.borderSeparation;
  if (state.x > (state.xMax - state.borderSeparation)) state.x -= state.borderSeparation;
  if (state.y < state.borderSeparation) state.y += state.borderSeparation;
  if (state.y > (state.yMax - state.borderSeparation)) state.y -= state.borderSeparation;

  if (!state.isNewRound || !state.gameHasStarted) {
    state.players[state.i] = new Worm();
    state.players[state.i].score = 0;
  }

  state.players[state.i].x = state.x;
  state.players[state.i].y = state.y;
  state.players[state.i].angle = state.angle;
  state.players[state.i].color = c;
  state.players[state.i].alive = true;
  state.players[state.i].playing = true;
  state.players[state.i].length = 0;

  if (!Number.isFinite(state.currentKeys[state.i].left) || state.currentKeys[state.i].left < 0) {
    state.currentKeys[state.i].left = state.defaultKeys[state.i].left;
  }
  if (!Number.isFinite(state.currentKeys[state.i].right) || state.currentKeys[state.i].right < 0) {
    state.currentKeys[state.i].right = state.defaultKeys[state.i].right;
  }
  state.players[state.i].leftKey = Number(state.currentKeys[state.i].left);
  state.players[state.i].rightKey = Number(state.currentKeys[state.i].right);
  state.players[state.i].index = state.i;
  markOccupied(state.players[state.i].x, state.players[state.i].y);
}

function normalizeKeys() {
  state.colors.forEach((color, idx) => {
    const entry = state.currentKeys[idx];
    if (!entry) return;
    const left = Number(entry.left);
    const right = Number(entry.right);
    entry.left = Number.isFinite(left) && left > 0 ? left : state.defaultKeys[idx].left;
    entry.right = Number.isFinite(right) && right > 0 ? right : state.defaultKeys[idx].right;
  });
}

function getLongestWorm() {
  state.players.forEach((p) => {
    if (p.playing && p.alive && p.length > state.longestWormSize) {
      state.longestWorm = p;
      state.longestWormSize = p.length;
      state.longestWormColor = p.color;
      addMessage(state.longestWormColor, "longest");
      addMessage(state.longestWormSize, "longest_size");
    }
  });
}

function changeInterval(nextSpeed) {
  state.fps = nextSpeed + state.basicFPSValue;
  clearInterval(state.interval);
  if (!state.onPause) state.interval = setInterval(moveWorms, state.intervalMiliSeconds / state.fps);
}

function moveWorms() {
  if (state.onPause) {
    state.pauseMoves += 1;
    return;
  }
  state.moves += 1;
  speeding();
  modifyWormsAngle();
  state.players.forEach((p) => {
    if (state.gameHasStarted && p.playing && p.alive) moveWorm(p);
  });
}

function addScore() {
  state.players.forEach((p) => { if (p.playing && p.alive) p.score += 1; });
}

function getWormsAlive() {
  state.wormsAlive = 0;
  state.players.forEach((p) => { if (p.playing && p.alive) state.wormsAlive += 1; });
}

function getMaxScore() {
  state.maxScore = 0;
  state.maxScorePlayers = 0;
  state.players.forEach((p) => {
    if (p.playing && p.score > state.maxScore) {
      state.maxScore = p.score;
      state.winningWorm = p.color;
    }
  });
  state.players.forEach((p) => { if (p.playing && p.score == state.maxScore) state.maxScorePlayers += 1; });
  if (state.maxScorePlayers > 1) state.winningWorm = "";
}

function getScoreToWin() {
  state.scoreToWin = -10;
  state.players.forEach((p) => { if (p.playing) state.scoreToWin += 10; });
}

function isWormHit(currentWorm) {
  const radians = currentWorm.angle * (Math.PI / 180);
  const sinValue = Math.sin(radians * state.sizeMultiplier);
  const cosValue = Math.cos(radians * state.sizeMultiplier);

  state.x = currentWorm.x + (cosValue * (Math.PI * 2));
  state.y = currentWorm.y + (sinValue * (Math.PI * 2));

  const radius = Math.max(1, state.wormSize);
  if (isOccupiedNear(state.x, state.y, radius)) return true;

  if (passedThroughHole(currentWorm, state.x, state.y)) {
    playSound("yabass");
    if (state.holePoints == "One") {
      currentWorm.score += 1;
      drawMarkers();
      drawScore();
    }
    return false; // Worm is safe if it passed through a hole
  }

  return false;
}

function passedThroughHole(currentWorm, nextX, nextY) {
  const key = `${Math.round(nextX)}:${Math.round(nextY)}`;
  const inScreenHole = !!(state.holes && state.holes.has(key));
  const wasInScreenHole = !!currentWorm.inScreenHole;
  currentWorm.inScreenHole = inScreenHole;
  return wasInScreenHole && !inScreenHole;
}

function setRound() {
  state.speed = state.startingSpeed;
  changeInterval(state.speed);
  state.currentRound += 1;
  addMessage(state.currentRound, "rounds");
  addMessage(state.speed / 5, "speed");
  logEvent({ actor: "System", action: "New round", detail: `Round ${state.currentRound}` });
}

function moveWorm(currentWorm) {
  state.wormHasCrush = isWormHit(currentWorm);

  if (currentWorm.x + state.wormSize > state.xMax ||
    currentWorm.x - state.wormSize < 0 ||
    currentWorm.y + state.wormSize > state.yMax ||
    currentWorm.y - state.wormSize < 0 ||
    state.wormHasCrush)
    wormCrushes(currentWorm);
  else
    wormIsAlive(currentWorm);
}

function wormIsAlive(currentWorm) {
  const radians = currentWorm.angle * (Math.PI / 180);
  const sinValue = Math.sin(radians * state.sizeMultiplier);
  const cosValue = Math.cos(radians * state.sizeMultiplier);
  storePreviuosCoordinates(currentWorm);
  currentWorm.y += sinValue;
  currentWorm.x += cosValue;

  if (currentWorm.alive && currentWorm.playing) {
    drawWorm(currentWorm);
  }
}

function wormCrushes(currentWorm) {
  playSound("die");
  currentWorm.alive = false;
  logEvent({ actor: currentWorm.color || "Worm", action: "Crashed", detail: `Round ${state.currentRound}` });
  getLongestWorm();
  addScore();
  getWormsAlive();
  if (state.wormsAlive < 2) lastWormCrushes(currentWorm);
  drawMarkers();
  drawScore();
  getLongestWorm();
}

function lastWormCrushes(currentWorm) {
  clearKeys();
  getMaxScore();
  getScoreToWin();
  setRound();

  if (state.maxScore >= state.scoreToWin) matchOver(currentWorm);
  else roundOver(currentWorm);
}

function matchOver(currentWorm) {
  playSound("win");
  state.currentRound = 0;
  state.isNewRound = false;
  state.gameHasStarted = false;
  const summaryPlayers = state.players
    .filter((p) => p.playing)
    .map((p) => ({ id: p.index, color: p.color, name: p.color, score: p.score }));
  pause();
  logEvent({ actor: "System", action: "Match over", detail: `Winner: ${state.winningWorm || "Tie"}` });
  document.dispatchEvent(new CustomEvent("pune-local-match-summary", {
    detail: {
      winner: state.winningWorm,
      maxScore: state.maxScore,
      players: summaryPlayers,
    },
  }));
  document.dispatchEvent(new Event("pune-local-match-over"));
}

function roundOver(currentWorm) {
  state.yMarker = 0;
  playSound(state.winningWorm);
  start();
}

function storePreviuosCoordinates(currentWorm) {
  for (let idx = state.historyDotsSaved; idx > 0; idx--) {
    currentWorm.previousX[idx] = currentWorm.previousX[idx - 1];
    currentWorm.previousY[idx] = currentWorm.previousY[idx - 1];
  }
  currentWorm.previousX[0] = currentWorm.x;
  currentWorm.previousY[0] = currentWorm.y;
}

function isHole(currentWorm) {
  const holeSize = Number(state.holeSize) || 0;
  const spacing = Number(state.spaceBetweenHoles) || 0;
  const module = currentWorm.length % (holeSize + spacing);
  if (module <= holeSize) return true;
  return false;
}

// Speeding
function doSpeeding() {
  playSound("speeding");
  state.speed += state.speedingIncrementSpeed;
  changeInterval(state.speed);
  addMessage(state.speed / 5, "speed");
  logEvent({ actor: "System", action: "Speed up", detail: `Speed ${state.speed / 5}` });
}

function reduceSpeeding() {
  playSound("ohh");
  state.speed -= state.speedingIncrementSpeed;
  changeInterval(state.speed);
  addMessage(state.speed / 5, "speed");
  logEvent({ actor: "System", action: "Speed down", detail: `Speed ${state.speed / 5}` });
}

function speeding() {
  const random_1 = Math.floor(Math.random() * (state.speedingChance + state.speed));
  const random_2 = (state.speedingChance + state.speed) - Math.floor(Math.random() * (state.speedingChance + state.speed));
  if (random_1 === random_2 && !state.onPause) doSpeeding();
}

// Keys
function clearKeys() {
  state.players.forEach((p) => {
    if (typeof p.leftKey !== "undefined" && typeof p.rightKey !== "undefined") {
      state.keysBeenPressed[p.leftKey] = false;
      state.keysBeenPressed[p.rightKey] = false;
    }
  });
}

export function abandonGame() {
  clearInterval(state.interval);
  state.interval = null;
  clearKeys();
  state.gameHasStarted = false;
  state.isNewRound = false;
  state.currentRound = 0;
  state.wormsAlive = 0;
  state.maxScore = 0;
  state.maxScorePlayers = 0;
  state.winningWorm = "";
  logEvent({ actor: "System", action: "Game abandoned" });
}

function onEventPress(event) {  
  if (online.active) return;
  if (!state.gameHasStarted) {
    const target = event?.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return; 
    }
  }
  const keyCode = getKeyCodeFromEvent(event);
  if (!Number.isFinite(keyCode)) return;
  state.keyCode = keyCode;

  if (state.keyCode == 32) pause();
  else if (state.keyCode == 34) doSpeeding();
  else if (state.keyCode == 33) reduceSpeeding();
  if (!state.onPause && state.gameHasStarted) {
    state.keysBeenPressed[state.keyCode] = true;
  }
}

function onEventUp(event) {
  if (online.active) return;
  if (!state.gameHasStarted) {
    const target = event?.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
    }
  }
  const keyCode = getKeyCodeFromEvent(event);
  if (!Number.isFinite(keyCode)) return;
  state.keyCode = keyCode;
  state.keysBeenPressed[state.keyCode] = false; 
}

export function handleGameKeyDown(event) {
  onEventPress(event);
}

export function handleGameKeyUp(event) {
  onEventUp(event);
}

function getKeyCodeFromEvent(event) {
  const direct = event?.keyCode ?? event?.which;
  if (Number.isFinite(direct) && direct > 0) return direct;
  const code = event?.code;
  const key = event?.key;
  const codeMap = {
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Backquote: 192,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    Minus: 189,
    Equal: 187,
    BracketLeft: 219,
    BracketRight: 221,
    Backslash: 220,
    Semicolon: 186,
    Quote: 222,
    Comma: 188,
    Period: 190,
    Slash: 191,
    Space: 32,
    Tab: 9,
  };
  if (code && codeMap[code]) return codeMap[code];
  const keyMap = {
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Escape: 27,
    " ": 32,
  };
  if (key && keyMap[key]) return keyMap[key];
  if (key && key.length === 1) {
    const upper = key.toUpperCase();
    return upper.charCodeAt(0);
  }
  return null;
}

function getKey(currentWorm, direction) {
  if (direction == "right") return currentWorm.rightKey;
  if (direction == "left") return currentWorm.leftKey;
}

function evalKeyPress(currentWorm, direction) {
  if (state.keysBeenPressed[getKey(currentWorm, direction)]) changeAngle(direction, currentWorm);
}

function modifyWormsAngle() {
  if (state.gameHasStarted) {
    state.players.forEach((p) => {
      if (p.playing && p.alive) {
        evalKeyPress(p, "right");
        evalKeyPress(p, "left");
      }
    });
  }
}

export function getCharFromKeyCode(code) {
  return String.fromCharCode(code);
}

export function keyIsDefined(code) {
  let keyFound = false;
  state.players.forEach((p) => {
    if (typeof p.leftKey !== "undefined" && typeof p.rightKey !== "undefined") {
      if (p.leftKey == code || p.rightKey == code) keyFound = true;
    }
  });
  return keyFound;
}

function getWormIndexByColor(color) {
  const c = color.toString();
  switch (c) {
    case "red": return 0;
    case "blue": return 1;
    case "green": return 2;
    case "purple": return 3;
    case "cyan": return 4;
    case "yellow": return 5;
    default: return 100;
  }
}

function showAjaxData(data, src) {
  getKeysArray(data, src);
}

function getKeysArray(keys, src) {
  if (src == "main") {
    state.usingDefaultKeys = false;
    keys.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        let idx = 0;
        state.colors.forEach((color) => {
          if (key == color + "_r") state.currentKeys[idx]["right"] = parseInt(value, 10);
          if (key == color + "_l") state.currentKeys[idx]["left"] = parseInt(value, 10);
          idx += 1;
        });
      });
    });

    keys = state.currentKeys;
    Object.values(keys).forEach((key) => {
      const rightBtn = $("#" + key.color + "RightButton");
      const leftBtn = $("#" + key.color + "LeftButton");
      if (rightBtn) rightBtn.value = getCharFromKeyCode(key.right);
      if (leftBtn) leftBtn.value = getCharFromKeyCode(key.left);
    });
  } else if (src == "settings") {
    state.usingDefaultKeys = false;
    keys.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        let idx = 0;
        state.colors.forEach((color) => {
          if (key == color + "_r") state.currentKeys[idx]["right"] = parseInt(value, 10);
          if (key == color + "_l") state.currentKeys[idx]["left"] = parseInt(value, 10);
          idx += 1;
        });
      });
    });

    let keyset = state.defaultKeys;
    if (!state.usingDefaultKeys) keyset = state.currentKeys;

    Object.values(keyset).forEach((key) => {
      const rightInput = $("#" + key.color + "RightInput");
      const leftInput = $("#" + key.color + "LeftInput");
      if (rightInput) {
        rightInput.value = getCharFromKeyCode(key.right);
        rightInput.setAttribute("name", key.right);
      }
      if (leftInput) {
        leftInput.value = getCharFromKeyCode(key.left);
        leftInput.setAttribute("name", key.left);
      }
    });
  }
}

export function getDbKeys(src) {
  const data = loadKeysData();
  showAjaxData(data, src);
}

export function validateNewGame() {
  let checked = 0;
  let isValid = true;
  const playing = [];
  let messageText = "The game cannot be started! Why?";
  const keys = [];

  $$("input[type=checkbox]").forEach((input) => {
    if (input.checked) {
      playing.push(input);
      checked += 1;
    }
  });

  state.holePoints = $("#hole_points").value;
  state.modalSpeed = $("#modal_speed").value;
  state.gapSpacing = $("#gap_spacing").value;
  state.gapSizing = $("#gap_sizing").value;

  if (checked < 2) {
    messageText += "\n * You need at least 2 worms to play!";
    isValid = false;
  }

  if (isValid) {
    state.playingColors = [];
    playing.forEach((input) => {
      const color = input.getAttribute("name");
      state.playingColors.push(color);

      const leftInput = $("#" + color + "LeftInput");
      const rightInput = $("#" + color + "RightInput");

      if (!leftInput || leftInput.value === "") {
        messageText += "\n * The left key for the " + color + " worm is not defined!";
        isValid = false;
      } else {
        keys.push(leftInput.value);
        const leftCode = parseInt(leftInput.getAttribute("name"), 10);
        Object.values(state.currentKeys).forEach((obj) => {
          if (obj.color == color) obj.left = Number.isFinite(leftCode) ? leftCode : obj.left;
        });
      }

      if (!rightInput || rightInput.value === "") {
        messageText += "\n * The right key for the " + color + " worm is not defined!";
        isValid = false;
      } else {
        keys.push(rightInput.value);
        const rightCode = parseInt(rightInput.getAttribute("name"), 10);
        Object.values(state.currentKeys).forEach((obj) => {
          if (obj.color == color) obj.right = Number.isFinite(rightCode) ? rightCode : obj.right;
        });
      }
    });
  }

  if (isValid) {
    const duplicates = find_duplicates(keys);
    duplicates.forEach((key) => {
      messageText += "\n * The key " + key + " is duplicated!";
      isValid = false;
    });
  }

  if (!isValid) alert(messageText);
  return isValid;
}

export function find_duplicates(arr) {
  const counts = {};
  const out = [];
  arr.forEach((item) => { counts[item] = (counts[item] || 0) + 1; });
  Object.keys(counts).forEach((item) => { if (counts[item] > 1) out.push(item); });
  return out;
}

export function startNewGame() {
  if (validateNewGame()) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    online.active = false;
    online.started = false;
    online.ready = false;
    online.spectator = false;
    if (state.onPause) {
      state.onPause = false;
      const background = $("#background");
      if (background) background.classList.remove("game-paused");
    }
    hide($("#start-body"));
    hide($(".demo"));
    hide($("#dialog-form"));
    hide($("#modal-backdrop"));

    state.gameHasStarted = false;

    show($("#canvas_div"));
    show($("#background"));
    show($("#sounds-nav-bar"));
    show($("#toggle-log"));
    show($("#toggle-info"));
    show($("#toggle-keys"));

    const countdownModal = $("#countdown-modal");
    const count3 = $("#count_3");
    const count2 = $("#count_2");
    const count1 = $("#count_1");
    const status = $("#countdown-status");
    const lightsWrap = $(".countdown-lights");
    const lights = lightsWrap ? Array.from(lightsWrap.querySelectorAll(".countdown-light")) : [];
    const counts = [count3, count2, count1];
    const lightClasses = ["countdown-light-red", "countdown-light-yellow", "countdown-light-green", "countdown-light-off"];

    counts.forEach((el) => el && (el.style.display = "none"));
    if (countdownModal) countdownModal.style.display = "flex";

    let step = 0;
    const setLights = (activeClass) => {
      lights.forEach((lightEl) => {
        lightClasses.forEach((cls) => lightEl.classList.remove(cls));
        lightEl.classList.add(activeClass);
      });
    };

    const showStep = () => {
      counts.forEach((el, idx) => {
        if (!el) return;
        el.style.display = idx === step ? "block" : "none";
      });
      if (status) {
        status.classList.remove("countdown-go", "countdown-go-blink");
        if (step === 0) {
          status.textContent = "Ready";
          setLights("countdown-light-red");
          playBeep(620, 160, 0.8);
        } else if (step === 1) {
          status.textContent = "Set";
          setLights("countdown-light-yellow");
          playBeep(760, 180, 1.0);
        } else {
          status.textContent = "Go";
          status.classList.add("countdown-go", "countdown-go-blink");
          setLights("countdown-light-green");
          playBeep(920, 360, 1.2);
        }
      }
    };

    showStep();
    const countdown = setInterval(() => {
      step += 1;
      if (step >= counts.length) {
        clearInterval(countdown);
        counts.forEach((el) => el && (el.style.display = "none"));
        if (countdownModal) countdownModal.style.display = "none";
        startGame(state.playingColors);
        state.gameHasStarted = true;
        return;
      }
      showStep();
    }, 1000);
    document.dispatchEvent(new Event("pune-local-game-start"));
  }
}

export function bindGameKeys() {
  // Key handling is centralized in ui.js via handleGameKeyDown/Up.
}
