"use strict";

import { state } from "./state.js";
import { $ } from "./dom.js";
import { logEvent } from "./logs.js";

export function soundSwitcher() {
  state.soundOn = !state.soundOn;
  const soundImage = $("#soundImage");
  const soundStatus = $("#soundStatus");
  const log = $("#log");
  if (!state.soundOn) {
    if (state.backgroundMusicOn) {
      toggleBackgroundMusic(false);
    }
    if (soundImage) soundImage.innerHTML = '<a onclick="soundSwitcher();"><img src="./static/images/check.png" alt="Sound is OFF" width="32" height="32" border="0" /></a>';
    if (soundStatus) soundStatus.textContent = "Sound is OFF";
    if (log) log.textContent = log.textContent + "\nSound is OFF";
  } else {
    if (soundImage) soundImage.innerHTML = '<a onclick="soundSwitcher();"><img src="./static/images/uncheck.png" alt="Sound is ON" width="32" height="32" border="0" /></a>';
    if (soundStatus) soundStatus.textContent = "Sound is ON";
    if (log) log.textContent = log.textContent + "\nSound is ON";
  }
}

// Unlock audio on first user gesture (browser autoplay policy)
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  const silent = new Audio();
  silent.play().catch(() => {});
  // Also resume any suspended AudioContext
  if (playBeep.ctx && playBeep.ctx.state === "suspended") {
    playBeep.ctx.resume().catch(() => {});
  }
}
["click", "touchstart", "keydown"].forEach((evt) => {
  document.addEventListener(evt, unlockAudio, { once: false, capture: true });
});

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
    sound.preload = "auto";
    playSound.cache.set(audio, sound);
  }
  sound.volume = Math.max(0, Math.min(1, state.soundVolume ?? 1));
  sound.currentTime = 0;
  const p = sound.play();
  if (p && p.catch) p.catch(() => {});
}

export function setSoundVolume(value) {
  const vol = Math.max(0, Math.min(1, Number(value)));
  if (!Number.isFinite(vol)) return;
  state.soundVolume = vol;
  if (playSound.cache) {
    playSound.cache.forEach((sound) => {
      sound.volume = vol;
    });
  }
  logEvent({ actor: "System", action: "Volume", detail: `${Math.round(vol * 100)}%` });
}

export function setMusicVolume(value) {
  const vol = Math.max(0, Math.min(1, Number(value)));
  if (!Number.isFinite(vol)) return;
  state.musicVolume = vol;
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
  const background = $("#background");
  if (background) background.classList.toggle("game-paused", state.onPause);
  logEvent({ actor: "System", action: state.onPause ? "Paused" : "Resumed" });
}

let synthTimer = null;
let synthCtx = null;
let synthGain = null;
const MUSIC_TRACKS = [
  "synthwave",
  "outrun",
  "arcade",
  "noir",
  "pulse",
  "midnight",
  "drift",
  "signal",
  "haze",
  "aurora",
];

function getSynthContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!synthCtx) synthCtx = new AudioCtx();
  if (!synthGain) {
    synthGain = synthCtx.createGain();
    synthGain.connect(synthCtx.destination);
  }
  return synthCtx;
}

function playSynthNote(freq, duration, detune = 0, gainScale = 1) {
  const ctx = getSynthContext();
  if (!ctx || !synthGain) return;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const now = ctx.currentTime;
  const vol = Math.max(0, Math.min(1, state.musicVolume ?? 0.2));
  synthGain.gain.value = Math.max(0.01, vol * 0.2 * gainScale);
  osc.type = "sawtooth";
  osc2.type = "square";
  osc.frequency.value = freq;
  osc2.frequency.value = freq * 2;
  osc.detune.value = detune;
  osc2.detune.value = -detune;
  osc.connect(synthGain);
  osc2.connect(synthGain);
  osc.start(now);
  osc2.start(now);
  osc.stop(now + duration);
  osc2.stop(now + duration);
}

function playBass(freq, duration) {
  const ctx = getSynthContext();
  if (!ctx || !synthGain) return;
  const osc = ctx.createOscillator();
  const now = ctx.currentTime;
  const vol = Math.max(0, Math.min(1, state.musicVolume ?? 0.2));
  synthGain.gain.value = Math.max(0.01, vol * 0.16);
  osc.type = "triangle";
  osc.frequency.value = freq;
  osc.connect(synthGain);
  osc.start(now);
  osc.stop(now + duration);
}

function stopBackgroundMusic() {
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
}

function startBackgroundMusic() {
  stopBackgroundMusic();
  if (!state.soundOn) {
    state.backgroundMusicOn = false;
    return;
  }

  const synthwave = (() => {
    const chords = [
      [261.63, 329.63, 392.0, 523.25],
      [293.66, 369.99, 440.0, 587.33],
      [246.94, 311.13, 392.0, 493.88],
      [220.0, 277.18, 349.23, 440.0],
    ];
    const arp = [0, 1, 2, 3, 2, 1, 0, 2, 1, 3, 2, 1, 0, 1, 3, 2, 1, 0, 2, 1];
    return {
      interval: 190,
      step(step) {
        const chord = chords[Math.floor(step / arp.length) % chords.length];
        const note = chord[arp[step % arp.length]];
        playSynthNote(note, 0.2, 6, 0.85);
        if (step % 8 === 0) {
          playBass(chord[0] / 2, 0.3);
        }
      },
    };
  })();

  const outrun = (() => {
    const chords = [
      [293.66, 369.99, 440.0, 587.33],
      [329.63, 415.3, 493.88, 659.25],
      [261.63, 329.63, 392.0, 523.25],
      [246.94, 311.13, 392.0, 493.88],
    ];
    const arp = [0, 2, 1, 2, 3, 2, 1, 2, 0, 1, 3, 2, 1, 0, 2, 1, 3, 2];
    return {
      interval: 175,
      step(step) {
        const chord = chords[Math.floor(step / arp.length) % chords.length];
        const note = chord[arp[step % arp.length]];
        playSynthNote(note, 0.18, 8, 0.85);
        if (step % 10 === 0) {
          playBass(chord[0] / 2, 0.24);
        }
      },
    };
  })();

  const arcade = (() => {
    const melody = [
      523.25, 587.33, 659.25, 698.46, 659.25, 587.33,
      523.25, 493.88, 523.25, 587.33, 659.25, 587.33,
      523.25, 493.88, 440.0, 392.0, 440.0, 493.88,
      523.25, 493.88, 440.0, 392.0, 349.23, 329.63,
      392.0, 440.0, 493.88, 523.25, 587.33, 659.25,
    ];
    const bass = [261.63, 246.94, 233.08, 220.0, 246.94, 261.63, 293.66, 277.18];
    return {
      interval: 160,
      step(step) {
        const note = melody[step % melody.length];
        playSynthNote(note, 0.14, 2, 0.75);
        if (step % 8 === 0) {
          playBass(bass[Math.floor(step / 8) % bass.length], 0.22);
        }
      },
    };
  })();

  const noir = (() => {
    const chords = [
      [220.0, 277.18, 329.63],
      [196.0, 246.94, 293.66],
      [233.08, 293.66, 349.23],
      [207.65, 261.63, 311.13],
    ];
    const arp = [0, 2, 1, 2, 1, 0, 2, 1, 0, 1, 2, 1];
    return {
      interval: 240,
      step(step) {
        const chord = chords[Math.floor(step / arp.length) % chords.length];
        const note = chord[arp[step % arp.length]];
        playSynthNote(note, 0.24, 3, 0.65);
        if (step % 3 === 0) {
          playBass(chord[0] / 2, 0.3);
        }
      },
    };
  })();

  const pulse = (() => {
    const scale = [
      392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 698.46, 659.25,
      587.33, 523.25, 493.88, 440.0, 392.0, 440.0, 493.88, 523.25,
    ];
    return {
      interval: 140,
      step(step) {
        const note = scale[step % scale.length];
        playSynthNote(note, 0.12, 10, 0.65);
        if (step % 12 === 0) {
          playBass(note / 2, 0.2);
        }
      },
    };
  })();

  const midnight = (() => {
    const chords = [
      [261.63, 311.13, 392.0],
      [246.94, 293.66, 369.99],
      [233.08, 293.66, 349.23],
      [220.0, 277.18, 329.63],
    ];
    const arp = [0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 0, 2, 1, 2];
    return {
      interval: 235,
      step(step) {
        const chord = chords[Math.floor(step / arp.length) % chords.length];
        const note = chord[arp[step % arp.length]];
        playSynthNote(note, 0.22, 2, 0.6);
        if (step % 5 === 0) {
          playBass(chord[0] / 2, 0.32);
        }
      },
    };
  })();

  const drift = (() => {
    const melody = [
      392.0, 440.0, 523.25, 587.33, 659.25, 587.33, 523.25,
      493.88, 440.0, 392.0, 440.0, 523.25, 587.33,
      659.25, 698.46, 659.25, 587.33, 523.25, 493.88,
      440.0, 392.0, 349.23, 392.0, 440.0, 493.88,
    ];
    const bass = [196.0, 207.65, 220.0, 233.08, 246.94];
    return {
      interval: 190,
      step(step) {
        const note = melody[step % melody.length];
        playSynthNote(note, 0.18, 5, 0.65);
        if (step % 6 === 0) {
          playBass(bass[Math.floor(step / 6) % bass.length], 0.26);
        }
      },
    };
  })();

  const signal = (() => {
    const seq = [
      329.63, 392.0, 440.0, 392.0, 349.23, 392.0, 440.0, 493.88,
      523.25, 493.88, 440.0, 392.0, 349.23, 392.0, 329.63, 293.66,
      311.13, 349.23, 392.0, 440.0, 392.0, 349.23, 311.13, 293.66,
    ];
    return {
      interval: 165,
      step(step) {
        const note = seq[step % seq.length];
        playSynthNote(note, 0.16, 7, 0.7);
        if (step % 10 === 0) {
          playBass(note / 2, 0.22);
        }
      },
    };
  })();

  const haze = (() => {
    const chords = [
      [293.66, 349.23, 415.3],
      [261.63, 329.63, 392.0],
      [277.18, 349.23, 415.3],
      [246.94, 311.13, 369.99],
    ];
    const arp = [0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 0, 1, 0, 2, 1, 2];
    return {
      interval: 230,
      step(step) {
        const chord = chords[Math.floor(step / arp.length) % chords.length];
        const note = chord[arp[step % arp.length]];
        playSynthNote(note, 0.22, 4, 0.6);
        if (step % 7 === 0) {
          playBass(chord[0] / 2, 0.3);
        }
      },
    };
  })();

  const aurora = (() => {
    const melody = [
      261.63, 293.66, 329.63, 369.99, 392.0, 369.99, 329.63, 293.66,
      311.13, 349.23, 392.0, 440.0, 392.0, 349.23, 311.13,
      293.66, 329.63, 369.99, 392.0, 440.0, 392.0, 369.99, 329.63,
    ];
    const bass = [130.81, 146.83, 164.81, 174.61, 196.0];
    return {
      interval: 210,
      step(step) {
        const note = melody[step % melody.length];
        playSynthNote(note, 0.2, 5, 0.7);
        if (step % 8 === 0) {
          playBass(bass[Math.floor(step / 8) % bass.length], 0.26);
        }
      },
    };
  })();

  const tracks = {
    synthwave,
    outrun,
    arcade,
    noir,
    pulse,
    midnight,
    drift,
    signal,
    haze,
    aurora,
  };

  const selected = MUSIC_TRACKS.includes(state.musicTrack) ? state.musicTrack : "synthwave";
  const track = tracks[selected];
  synthTimer = setInterval(() => {
    if (!state.backgroundMusicOn) return;
    track.step(track.stepIndex ?? 0);
    track.stepIndex = (track.stepIndex ?? 0) + 1;
  }, track.interval);
}

export function toggleBackgroundMusic(force) {
  const next = typeof force === "boolean" ? force : !state.backgroundMusicOn;
  if (next === state.backgroundMusicOn) return;
  state.backgroundMusicOn = next;
  if (!next) {
    stopBackgroundMusic();
    return;
  }
  startBackgroundMusic();
}

export function setMusicTrack(track) {
  if (!track) return;
  state.musicTrack = MUSIC_TRACKS.includes(track) ? track : "synthwave";
  if (state.backgroundMusicOn) {
    startBackgroundMusic();
  }
}

export function playBeep(frequency = 700, duration = 140, gainScale = 1) {
  if (!state.soundOn) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!playBeep.ctx) playBeep.ctx = new AudioCtx();
    const ctx = playBeep.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const vol = Math.max(0, Math.min(1, state.soundVolume ?? 1));
    osc.type = "square";
    osc.frequency.value = frequency;
    gain.gain.value = Math.max(0.02, vol * 0.2 * gainScale);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration / 1000);
  } catch (e) {
    // ignore audio context errors
  }
}
