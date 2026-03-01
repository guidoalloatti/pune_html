"use strict";

import { state } from "./state.js";
import { $ } from "./dom.js";

export function soundSwitcher() {
  state.soundOn = !state.soundOn;
  const soundImage = $("#soundImage");
  const soundStatus = $("#soundStatus");
  const log = $("#log");
  if (!state.soundOn) {
    if (soundImage) soundImage.innerHTML = '<a onclick="soundSwitcher();"><img src="./static/images/check.png" alt="Sound is OFF" width="32" height="32" border="0" /></a>';
    if (soundStatus) soundStatus.textContent = "Sound is OFF";
    if (log) log.textContent = log.textContent + "\nSound is OFF";
  } else {
    if (soundImage) soundImage.innerHTML = '<a onclick="soundSwitcher();"><img src="./static/images/uncheck.png" alt="Sound is ON" width="32" height="32" border="0" /></a>';
    if (soundStatus) soundStatus.textContent = "Sound is ON";
    if (log) log.textContent = log.textContent + "\nSound is ON";
  }
}

export function playSound(audio) {
  if (!state.soundOn || audio === "") return;
  const now = Date.now();
  const cooldown = 150;
  if (!playSound.lastPlayed) playSound.lastPlayed = new Map();
  const last = playSound.lastPlayed.get(audio) || 0;
  if (now - last < cooldown) return;
  playSound.lastPlayed.set(audio, now);

  if (!playSound.cache) playSound.cache = new Map();
  let sound = playSound.cache.get(audio);
  if (!sound) {
    sound = new Audio("./static/sounds/" + audio + ".mp3");
    playSound.cache.set(audio, sound);
  }
  try {
    sound.currentTime = 0;
    sound.play();
  } catch (e) {
    // ignore play errors
  }
}

export function pauseSwitcher() {
  state.pauseOn = !state.pauseOn;
  const pauseImage = $("#pauseImage");
  const pauseStatus = $("#pauseStatus");
  const log = $("#log");
  if (!state.pauseOn) {
    if (pauseImage) pauseImage.innerHTML = '<a onclick="pauseSwitcher();"><img src="./static/images/check.png" alt="Pause is OFF" width="32" height="32" border="0" /></a>';
    if (pauseStatus) pauseStatus.textContent = "Pause is OFF";
    if (log) log.textContent = log.textContent + "\nPause is OFF";
    pause();
  } else {
    if (pauseImage) pauseImage.innerHTML = '<a onclick="pauseSwitcher();"><img src="./static/images/uncheck.png" alt="Pause is ON" width="32" height="32" border="0" /></a>';
    if (pauseStatus) pauseStatus.textContent = "Pause is ON";
    if (log) log.textContent = log.textContent + "\nPause is ON";
    pause();
  }
}

export function pause() {
  playSound("pause");
  state.onPause = !state.onPause;
}
