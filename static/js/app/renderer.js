"use strict";

import { $ } from "./dom.js";
import { state } from "./state.js";

let app;
let localLayer;
let onlineLayer;
let markerApp;
let markerLayer;
let scoreTexts = [];

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
  app.stage.addChild(localLayer);
  app.stage.addChild(onlineLayer);

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

  const style = new PIXI.TextStyle({
    fontFamily: "serif",
    fontSize: 40,
    fill: 0xffffff,
    stroke: 0x000000,
    strokeThickness: 3,
  });

  if (scoreTexts.length < players.length) {
    for (let i = scoreTexts.length; i < players.length; i++) {
      const text = new PIXI.Text("00", style);
      text.anchor.set(0, 0.5);
      markerApp.stage.addChild(text);
      scoreTexts.push(text);
    }
  }

  players.forEach((p) => {
    const idx = p.index;
    const score = p.playing && p.score < 10 ? "0" + p.score : String(p.score);
    const text = scoreTexts[idx];
    if (!text) return;
    text.text = score;
    text.x = scoreX;
    text.y = scoreY + (idx * (yMax / 6));
  });
}

export function renderOnlineWorms(worms) {
  if (!onlineLayer) return;
  clearOnlineLayer();
  for (let wi = 0; wi < worms.length; wi++) {
    const w = worms[wi];
    const trail = w.trail || [];
    for (let ti = 0; ti < trail.length; ti++) {
      const p = trail[ti];
      if (p.hole) {
        drawOnlineCircle("#020202", p.x, p.y, 4);
      } else {
        drawOnlineCircle(w.color, p.x, p.y, 4);
      }
    }
  }
}
