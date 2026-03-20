"use strict";

import { $ } from "./dom.js";
import { state } from "./state.js";

let app;
let localLayer;
let onlineLayer;
let explosionLayer;
let markerApp;
let markerLayer;
let scoreTexts = [];
let explosions = []; // active explosion animations

const COLOR_MAP = {
  red: 0xff3b30,
  blue: 0x3b82f6,
  green: 0x22c55e,
  purple: 0xa855f7,
  cyan: 0x22d3ee,
  yellow: 0xfacc15,
  black: 0x000000,
  white: 0xffffff,
};

function toHex(color) {
  if (!color) return 0xffffff;
  if (typeof color === "number") return color;
  const lower = String(color).toLowerCase();
  if (COLOR_MAP[lower] !== undefined) return COLOR_MAP[lower];
  if (lower.startsWith("#")) return PIXI.utils.string2hex(lower);
  return 0xffffff;
}

function ensurePixi() {
  if (typeof PIXI === "undefined") {
    throw new Error("PIXI is not loaded. Ensure pixi.min.js is included before main.js");
  }
}

export function initRenderer() {
  ensurePixi();

  const container = $("#canvas_div");
  if (!container) return;

  app = new PIXI.Application({
    width: state.xMax,
    height: state.yMax,
    backgroundColor: 0x000000,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  localLayer = new PIXI.Graphics();
  onlineLayer = new PIXI.Graphics();
  explosionLayer = new PIXI.Graphics();
  app.stage.addChild(localLayer);
  app.stage.addChild(onlineLayer);
  app.stage.addChild(explosionLayer);

  container.prepend(app.view);

  markerApp = new PIXI.Application({
    width: 100,
    height: state.yMax,
    backgroundColor: 0x111111,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  markerLayer = new PIXI.Graphics();
  markerApp.stage.addChild(markerLayer);

  const markerContainer = $("#marker-container");
  if (markerContainer) {
    markerContainer.innerHTML = "";
    markerContainer.appendChild(markerApp.view);
  }

  resizeRenderer();
  window.addEventListener("resize", resizeRenderer);
  document.addEventListener("pune-online-mode-change", resizeRenderer);
  document.addEventListener("pune-online-game-start", resizeRenderer);
  document.addEventListener("pune-online-game-over", resizeRenderer);
}

export function resizeRenderer() {
  if (!app || !markerApp || !markerLayer) return;

  const isOnlineMobile = document.body.classList.contains("online-mobile");
  const padding = isOnlineMobile ? 16 : 0;
  const maxWidth = window.innerWidth - padding;
  const maxHeight = window.innerHeight - (isOnlineMobile ? 140 : 80);
  const scale = Math.min(maxWidth / state.xMax, maxHeight / state.yMax, 1);

  app.stage.scale.set(scale);
  app.renderer.resize(Math.max(1, Math.floor(state.xMax * scale)), Math.max(1, Math.floor(state.yMax * scale)));

  if (isOnlineMobile) {
    const markerHeight = 56;
    markerApp.renderer.resize(app.renderer.width, markerHeight);
    markerLayer.scale.set(markerApp.renderer.width / 100, markerHeight / state.yMax);
  } else {
    markerApp.renderer.resize(100, Math.max(1, Math.floor(state.yMax * scale)));
    markerLayer.scale.set(1, scale);
  }
}

export function clearScreen() {
  if (!localLayer) return;
  localLayer.clear();
}

export function drawCircle(color, x, y, radius) {
  if (!localLayer) return;
  const hex = toHex(color);
  localLayer.beginFill(hex);
  localLayer.drawCircle(x, y, radius);
  localLayer.endFill();
}

export function drawHole(x, y, radius, darkRadius = 2) {
  if (!localLayer) return;
  localLayer.beginFill(0x000000);
  localLayer.drawCircle(x, y, radius);
  localLayer.endFill();

  localLayer.beginFill(0x020202);
  localLayer.drawCircle(x, y, darkRadius);
  localLayer.endFill();
}

export function clearOnlineLayer() {
  if (!onlineLayer) return;
  onlineLayer.clear();
}

export function drawOnlineCircle(color, x, y, radius) {
  if (!onlineLayer) return;
  const hex = toHex(color);
  onlineLayer.beginFill(hex);
  onlineLayer.drawCircle(x, y, radius);
  onlineLayer.endFill();
}

export function drawMarkerBlocks(colors, x, y, w, h) {
  if (!markerLayer) return;
  markerLayer.clear();
  let yPos = y;

//   console.log("Drawing marker blocks with colors:", colors, "at position:", x, y, "with size:", w, h, "and markerLayer:", markerLayer, "and COLOR_MAP:", COLOR_MAP, "and toHex results:", colors.map(c => toHex(c)));

  for (let i = 0; i < colors.length; i++) {
    const hex = toHex(colors[i]);
    markerLayer.beginFill(hex); 
    markerLayer.drawRect(x, yPos, w, h);
    markerLayer.endFill();
    yPos += h;
  }
}

export function updateScoreDisplay(players, scoreX, scoreY, yMax) {
  if (!markerApp) return;

  const orderedColors = Array.isArray(state.colors) && state.colors.length ? state.colors : [];
  const orderedPlayers = orderedColors.length
    ? orderedColors.map((color) => (players || []).find((p) => p && p.color === color))
    : (players || []);

  const availableHeight = markerApp.renderer?.height || yMax;
  const compact = availableHeight < 120;
  const fontSize = compact ? 30 : 68;
  const strokeSize = compact ? 1 : 1;

  const fontFamily = "Digital-7, 'Digital-7 Mono', monospace";
  const baseStyleOptions = {
    fontFamily,
    fontWeight: 400,
    fontSize,
    stroke: 0x000000,
    strokeThickness: strokeSize,
  };
  const style = new PIXI.TextStyle({
    ...baseStyleOptions,
    fill: 0xffffff,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: compact ? 4 : 6,
    dropShadowDistance: 2,
    dropShadowAlpha: 0.7,
  });

  const makeReadableFill = (hex) => {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (luminance < 0.45) {
      const mix = 0.5;
      const rr = Math.round(r + (255 - r) * mix);
      const gg = Math.round(g + (255 - g) * mix);
      const bb = Math.round(b + (255 - b) * mix);
      return (rr << 16) + (gg << 8) + bb;
    }
    return hex;
  };

  if (document.fonts && !updateScoreDisplay.fontReady) {
    updateScoreDisplay.fontReady = true;
    document.fonts.load(`10px ${fontFamily}`).then(() => {
      scoreTexts.forEach((text, i) => {
        const p = orderedPlayers[i];
        if (!p || p.playing === false) {
          text.text = "";
          text.alpha = 0;
          return;
        }
        const rawHex = toHex(p?.color || p?.name || "#ffffff");
        const fill = makeReadableFill(rawHex);
        text.style = new PIXI.TextStyle({
          ...baseStyleOptions,
          fill,
          dropShadow: true,
          dropShadowColor: 0x000000,
          dropShadowBlur: compact ? 4 : 6,
          dropShadowDistance: 2,
        });
        text.text = text.text;
      });
    });
  }

  const desiredCount = orderedPlayers.length || orderedColors.length || 0;
  if (scoreTexts.length < desiredCount) {
    for (let i = scoreTexts.length; i < desiredCount; i++) {
      const p = orderedPlayers[i];
      const rawHex = toHex(p?.color || p?.name || "#ffffff");
      const fill = makeReadableFill(rawHex);
      const initialStyle = new PIXI.TextStyle({
        ...baseStyleOptions,
        fill,
        dropShadow: true,
        dropShadowColor: 0x000000,
        dropShadowBlur: compact ? 4 : 6,
        dropShadowDistance: 2,
        dropShadowAlpha: 0.7,
      });
      const text = new PIXI.Text("00", initialStyle);
      text.anchor.set(0, 0.5);
      text.alpha = 0.92;
      markerApp.stage.addChild(text);
      scoreTexts.push(text);
    }
  }

  const rowCount = Math.max(desiredCount, 1);
  const rowHeight = compact ? (availableHeight / rowCount) : (yMax / 6);
  const baseY = compact ? (rowHeight / 2) : scoreY;
  const baseX = compact ? 4 : Math.max(0, scoreX - 8);

  orderedPlayers.forEach((p, i) => {
    const idx = i;
    const text = scoreTexts[idx];
    if (!text) return;
    if (!p || p.playing === false) {
      text.text = "";
      text.alpha = 0;
      text.x = baseX;
      text.y = baseY + (idx * rowHeight);
      return;
    }
    const score = p.score < 10 ? "0" + p.score : String(p.score);
    const rawHex = toHex(p.color || p.name || "#ffffff");
    const fill = makeReadableFill(rawHex);
    if (text.style?.fontSize !== fontSize || text.style?.fontFamily !== fontFamily || text.style?.fill !== fill) {
      text.style = new PIXI.TextStyle({
        ...baseStyleOptions,
        fill,
        dropShadow: true,
        dropShadowColor: 0x000000,
        dropShadowBlur: compact ? 4 : 6,
        dropShadowDistance: 2,
        dropShadowAlpha: 0.7,
      });
    }
    text.alpha = 0.92;
    text.text = score;
    text.x = baseX;
    text.y = baseY + (idx * rowHeight);
  });
}

export function resetOnlineTrails() {
  clearOnlineLayer();
  explosions = [];
}

export function spawnExplosion(x, y, color) {
  const hex = toHex(color);
  const particles = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 1.5 + Math.random() * 2.5;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      radius: 2 + Math.random() * 3, alpha: 1,
    });
  }
  explosions.push({ hex, particles, life: 30 });
}

function tickExplosions() {
  if (!explosionLayer) return;
  explosionLayer.clear();
  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.life -= 1;
    if (e.life <= 0) { explosions.splice(i, 1); continue; }
    const fade = e.life / 30;
    for (const p of e.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.radius *= 0.97;
      explosionLayer.beginFill(e.hex, fade);
      explosionLayer.drawCircle(p.x, p.y, p.radius);
      explosionLayer.endFill();
    }
  }
}

let prevAliveMap = new Map();

export function renderOnlineWorms(worms) {
  if (!onlineLayer) return;
  clearOnlineLayer();

  // Detect deaths and spawn explosions
  for (let wi = 0; wi < worms.length; wi++) {
    const w = worms[wi];
    const wasAlive = prevAliveMap.get(w.id);
    if (wasAlive && !w.alive) {
      spawnExplosion(w.x, w.y, w.color);
    }
  }
  prevAliveMap = new Map(worms.map((w) => [w.id, w.alive]));

  // Draw trails
  for (let wi = 0; wi < worms.length; wi++) {
    const w = worms[wi];
    const trail = w.trail || [];
    const hex = toHex(w.color);
    for (let ti = trail.length - 1; ti >= 0; ti--) {
      const p = trail[ti];
      if (p.hole) {
        onlineLayer.beginFill(0x020202);
      } else {
        onlineLayer.beginFill(hex);
      }
      onlineLayer.drawCircle(p.x, p.y, 4);
      onlineLayer.endFill();
    }
    // Draw worm head even during grace period
    if (w.alive && w.playing !== false) {
      onlineLayer.beginFill(hex);
      onlineLayer.drawCircle(w.x, w.y, 4);
      onlineLayer.endFill();
    }
  }

  tickExplosions();
}
