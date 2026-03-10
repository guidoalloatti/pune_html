"use strict";

import { state } from "./state.js";

const getLocal = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
};

const setLocal = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // ignore
  }
};

const buildDefaultKeys = () => ([
  {
    red_r: state.defaultKeys[0].right,
    red_l: state.defaultKeys[0].left,
    blue_r: state.defaultKeys[1].right,
    blue_l: state.defaultKeys[1].left,
    green_r: state.defaultKeys[2].right,
    green_l: state.defaultKeys[2].left,
    purple_r: state.defaultKeys[3].right,
    purple_l: state.defaultKeys[3].left,
    cyan_r: state.defaultKeys[4].right,
    cyan_l: state.defaultKeys[4].left,
    yellow_r: state.defaultKeys[5].right,
    yellow_l: state.defaultKeys[5].left,
  },
]);

const buildDefaultSettings = () => ([
  {
    player_1: 1,
    player_2: 1,
    player_3: 0,
    player_4: 0,
    player_5: 0,
    player_6: 0,
    hole_points: "None",
    gap_space: "Far Apart",
    start_speed: "Frantic",
    gap_size: "Large",
  },
]);

const buildDefaultStats = () => ({
  players: {},
});

export function loadKeysData() {
  let data = getLocal("pune_keys", []);
  if (!data || !data.length) {
    data = buildDefaultKeys();
    setLocal("pune_keys", data);
  }
  return data;
}

export function loadSettingsData() {
  let data = getLocal("pune_settings", []);
  if (!data || !data.length) {
    data = buildDefaultSettings();
    setLocal("pune_settings", data);
  } else if (data[0]) {
    const current = data[0];
    const looksLikeOldDefaults = current.hole_points === "None"
      && current.start_speed === "Normal"
      && current.gap_space === "Normal"
      && current.gap_size === "Normal";
    if (looksLikeOldDefaults) {
      data = buildDefaultSettings();
      setLocal("pune_settings", data);
    }
  }
  return data;
}

export function saveSettingsData(settingsData) {
  setLocal("pune_settings", [settingsData]);
  state.gameId = 1;
}

export function saveKeysData(keysData) {
  setLocal("pune_keys", [keysData]);
  state.keyId = 1;
}

export function loadStatsData() {
  let data = getLocal("pune_stats", null);
  if (!data || !data.players) {
    data = buildDefaultStats();
    setLocal("pune_stats", data);
  }
  return data;
}

export function saveStatsData(statsData) {
  setLocal("pune_stats", statsData);
}

export function recordMatchStats({ winner, players }) {
  if (!Array.isArray(players) || players.length === 0) return loadStatsData();
  const stats = loadStatsData();
  players.forEach((player) => {
    const key = player.name || player.color || `Player ${player.id}`;
    if (!stats.players[key]) {
      stats.players[key] = { games: 0, wins: 0, best: 0 };
    }
    const entry = stats.players[key];
    entry.games += 1;
    const score = Number(player.score) || 0;
    entry.best = Math.max(entry.best, score);
    if (winner && (player.color === winner || player.name === winner)) {
      entry.wins += 1;
    }
  });
  saveStatsData(stats);
  return stats;
}
