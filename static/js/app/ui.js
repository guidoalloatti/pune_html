"use strict";

import { $, $$, show, hide, toggle } from "./dom.js";
import { state } from "./state.js";
import { playSound, pause, setSoundVolume, setMusicVolume, toggleBackgroundMusic, setMusicTrack } from "./sounds.js";
import { logEvent, updateLogUI } from "./logs.js";
import { saveKeysData, saveSettingsData, loadSettingsData, recordMatchStats, loadStatsData } from "./storage.js";
import { startNewGame, find_duplicates, abandonGame, handleGameKeyDown, handleGameKeyUp } from "./game.js";

function setModeStatus(text) {
  const status = $("#mode-status");
  if (status) status.textContent = text;
}

function setGameNavVisible(isVisible) {
  const create = $("#set-game");
  if (create) create.style.display = isVisible ? "" : "none";
}

export function lockModeSelection(locked) {
  const localBtn = $("#choose-local");
  const onlineBtn = $("#choose-online");
  if (localBtn) localBtn.disabled = locked;
  if (onlineBtn) onlineBtn.disabled = locked;
}

function getSummaryElements() {
  return {
    overlay: $("#match-summary"),
    title: $("#match-summary-title"),
    winner: $("#match-summary-winner"),
    list: $("#match-summary-list"),
    rematch: $("#match-rematch"),
    close: $("#match-close"),
  };
}

export function showMatchSummary({ mode, winner, maxScore, players, canRematch }) {
  const { overlay, title, winner: winnerEl, list, rematch, close } = getSummaryElements();
  if (!overlay || !title || !winnerEl || !list || !rematch || !close) return;
  overlay.dataset.mode = mode;
  title.textContent = "Match Over";
  const winnerLabel = winner ? `🏆 ${winner} wins with ${maxScore} points!` : "It\'s a tie.";
  winnerEl.textContent = winnerLabel;
  const statsData = recordMatchStats({ winner, players });
  list.innerHTML = "";
  const header = document.createElement("div");
  header.className = "match-summary-row match-summary-header";
  header.innerHTML = "<span>#</span><span>Player</span><span>Pts</span><span>Stats</span>";
  list.appendChild(header);

  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  sorted.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "match-summary-row" + (winner && (p.color === winner || p.name === winner) ? " match-summary-winner-row" : "");
    const name = p.name || p.color || `Player ${p.id}`;
    const stats = statsData.players[name] || { games: 0, wins: 0, best: 0 };
    const posSpan = document.createElement("span");
    posSpan.textContent = String(i + 1);
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    const scoreSpan = document.createElement("span");
    scoreSpan.textContent = String(p.score);
    const statsSpan = document.createElement("span");
    statsSpan.className = "match-summary-stats";
    statsSpan.textContent = `W:${stats.wins} G:${stats.games} Best:${stats.best}`;
    row.appendChild(posSpan);
    row.appendChild(nameSpan);
    row.appendChild(scoreSpan);
    row.appendChild(statsSpan);
    list.appendChild(row);
  });
  rematch.textContent = mode === "online" ? "Rematch (Host)" : "Play Again";
  rematch.disabled = !canRematch;
  overlay.style.display = "flex";
}

export function hideMatchSummary() {
  const { overlay } = getSummaryElements();
  if (overlay) overlay.style.display = "none";
}

function showTutorial() {
  const overlay = $("#tutorial-overlay");
  if (overlay && getComputedStyle(overlay).display === "none") {
    toggleWithPause(overlay);
  }
}

function hideTutorial() {
  const overlay = $("#tutorial-overlay");
  if (overlay && getComputedStyle(overlay).display !== "none") {
    toggleWithPause(overlay);
  }
  window.localStorage.setItem("puneTutorialSeen", "1");
}

function updateFullscreenLabel() {
  const btn = $("#fullscreen-toggle");
  if (!btn) return;
  btn.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  } else {
    document.documentElement.requestFullscreen?.();
  }
}

function toggleWithPause(el) {
  if (!el) return;
  const isHidden = getComputedStyle(el).display === "none";
  toggle(el);
  if (isHidden) {
    if (!state.onPause) pause();
  } else {
    const stillOpen = [
      $("#game-info-div"),
      $("#game-details-div"),
      $("#show-keys-div"),
      $("#sounds-menu"),
      $("#tutorial-overlay"),
      $("#abandon-confirm"),
      $("#about-modal"),
    ].some((panel) => panel && getComputedStyle(panel).display !== "none");
    if (!stillOpen && state.onPause) pause();
  }
}

export function applySettingsToUI(settingsArray) {
  settingsArray.forEach((setting) => {
    Object.entries(setting).forEach(([key, value]) => {
      if (key == "player_1" && value == 1) labelClicked("red", "label");
      if (key == "player_2" && value == 1) labelClicked("blue", "label");
      if (key == "player_3" && value == 1) labelClicked("green", "label");
      if (key == "player_4" && value == 1) labelClicked("purple", "label");
      if (key == "player_5" && value == 1) labelClicked("cyan", "label");
      if (key == "player_6" && value == 1) labelClicked("yellow", "label");
      if (key == "hole_points") {
        const el = $("#hole_points");
        if (el) el.value = value;
      }
      if (key == "start_speed") {
        const el = $("#modal_speed");
        if (el) el.value = value;
      }
      if (key == "gap_space") {
        const el = $("#gap_spacing");
        if (el) el.value = value;
      }
      if (key == "gap_size") {
        const el = $("#gap_sizing");
        if (el) el.value = value;
      }
    });
  });
}

export function labelClicked(color, caller) {
  const play = $("#" + color + "_play");
  const label = $("#" + color + "_label");
  const left = $("#" + color + "LeftInput");
  const right = $("#" + color + "RightInput");
  if (!play || !label || !left || !right) return;

  const idx = state.colors.indexOf(color);
  const defaults = state.defaultKeys[idx];
  const current = state.currentKeys[idx];
  const ensureDefaults = () => {
    const leftCode = parseInt(left.getAttribute("name") || "", 10);
    const rightCode = parseInt(right.getAttribute("name") || "", 10);
    if (!Number.isFinite(leftCode)) setMoveKey(color, "left", current.left > 0 ? current.left : defaults.left);
    if (!Number.isFinite(rightCode)) setMoveKey(color, "right", current.right > 0 ? current.right : defaults.right);
  };

  if (caller == "check") {
    if (play.checked == true) {
      label.style.color = color;
      label.style.background = "white";
      show(left);
      show(right);
      ensureDefaults();
    } else {
      label.style.color = "white";
      label.style.background = "lightgray";
      hide(left);
      hide(right);
    }
  } else if (caller == "label") {
    if (play.checked == true) {
      label.style.color = "white";
      label.style.background = "lightgray";
      play.checked = false;
      hide(left);
      hide(right);
    } else {
      label.style.color = "white";
      label.style.background = color;
      play.checked = true;
      show(left);
      show(right);
      ensureDefaults();
    }
  }
}

export function setMoveKey(color, direction, code) {
  if (code != 9) {
    const input = $("#" + color + capitalize(direction) + "Input");
    if (input) {
      input.value = String.fromCharCode(code);
      input.setAttribute("name", code);
    }
  }
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

export function saveSettings() {
  const settings = {
    hole_points: $("#hole_points").value,
    start_speed: $("#modal_speed").value,
    gap_space: $("#gap_spacing").value,
    gap_size: $("#gap_sizing").value,
    player_1: $("#red_play").checked,
    player_2: $("#blue_play").checked,
    player_3: $("#green_play").checked,
    player_4: $("#purple_play").checked,
    player_5: $("#cyan_play").checked,
    player_6: $("#yellow_play").checked,
  };

  const keys = {
    red_r: $("#redRightInput").getAttribute("name"),
    red_l: $("#redLeftInput").getAttribute("name"),
    blue_r: $("#blueRightInput").getAttribute("name"),
    blue_l: $("#blueLeftInput").getAttribute("name"),
    green_r: $("#greenRightInput").getAttribute("name"),
    green_l: $("#greenLeftInput").getAttribute("name"),
    purple_r: $("#purpleRightInput").getAttribute("name"),
    purple_l: $("#purpleLeftInput").getAttribute("name"),
    cyan_r: $("#cyanRightInput").getAttribute("name"),
    cyan_l: $("#cyanLeftInput").getAttribute("name"),
    yellow_r: $("#yellowRightInput").getAttribute("name"),
    yellow_l: $("#yellowLeftInput").getAttribute("name"),
  };

  saveSettingsData(settings);
  saveKeysData(keys);
}

function openSettingsDialog() {
  const dialog = $("#settings-dialog");
  const backdrop = $("#settings-backdrop") || ensureBackdrop();
  if (dialog) dialog.style.display = "block";
  if (backdrop) backdrop.style.display = "block";

  $("#settings_hole_points").value = $("#hole_points").value;
  $("#settings_speed").value = $("#modal_speed").value;
  $("#settings_gap_spacing").value = $("#gap_spacing").value;
  $("#settings_gap_sizing").value = $("#gap_sizing").value;

  populateKeySettings();
}

function closeSettingsDialog() {
  const dialog = $("#settings-dialog");
  const backdrop = $("#settings-backdrop");
  const fallbackBackdrop = $("#modal-backdrop");
  if (dialog) dialog.style.display = "none";
  if (backdrop) backdrop.style.display = "none";
  if (fallbackBackdrop) fallbackBackdrop.style.display = "none";
}

function showModeSelect() {
  document.body.classList.remove("show-local-setup", "show-online-setup");
  document.body.classList.remove("online-mobile");
  show($("#start-body"));
  hide($("#local-setup"));
  hide($("#online-setup"));
  hide($("#background"));
  hide($("#canvas_div"));
  closeDialog();
  closeSettingsDialog();
  lockModeSelection(false);
  setModeStatus("Select");
  const localBackdrop = $("#local-setup-backdrop");
  if (localBackdrop) localBackdrop.style.display = "none";
  const onlineBackdrop = $("#online-setup-backdrop");
  if (onlineBackdrop) onlineBackdrop.style.display = "none";
  document.dispatchEvent(new Event("pune-online-mode-change"));
}

function showLocalSetup() {
  document.body.classList.add("show-local-setup");
  document.body.classList.remove("show-online-setup");
  hide($("#start-body"));
  show($("#local-setup"));
  hide($("#online-setup"));
  setModeStatus("Local setup");
  const dialog = $("#dialog-form");
  if (dialog) dialog.style.display = "block";
  const demo = $(".demo");
  if (demo) demo.style.display = "";
  const backdrop = $("#modal-backdrop");
  if (backdrop) backdrop.style.display = "none";
  const localBackdrop = $("#local-setup-backdrop");
  if (localBackdrop) localBackdrop.style.display = "block";

  const redPlay = $("#red_play");
  const bluePlay = $("#blue_play");
  if (redPlay && !redPlay.checked) {
    redPlay.checked = true;
    labelClicked("red", "check");
  }
  if (bluePlay && !bluePlay.checked) {
    bluePlay.checked = true;
    labelClicked("blue", "check");
  }
}

function showOnlineSetup() {
  document.body.classList.add("show-online-setup");
  document.body.classList.remove("show-local-setup");
  hide($("#start-body"));
  hide($("#local-setup"));
  show($("#online-setup"));
  setModeStatus("Online setup");
  const onlineBackdrop = $("#online-setup-backdrop");
  if (onlineBackdrop) onlineBackdrop.style.display = "block";
  document.dispatchEvent(new Event("pune-online-mode-change"));
}

function applySettingsFromDialog() {
  if (!validateSettingsKeys()) return;
  $("#hole_points").value = $("#settings_hole_points").value;
  $("#modal_speed").value = $("#settings_speed").value;
  $("#gap_spacing").value = $("#settings_gap_spacing").value;
  $("#gap_sizing").value = $("#settings_gap_sizing").value;

  applyKeySettings();
  saveSettings();
  closeSettingsDialog();
}

function validateSettingsKeys() {
  const keyCodes = [];
  state.colors.forEach((color, idx) => {
    const leftInput = $("#settings_" + color + "_left");
    const rightInput = $("#settings_" + color + "_right");
    const leftCode = getKeyInputCode(leftInput) ?? state.currentKeys[idx].left;
    const rightCode = getKeyInputCode(rightInput) ?? state.currentKeys[idx].right;
    if (leftCode != null) keyCodes.push(String(leftCode));
    if (rightCode != null) keyCodes.push(String(rightCode));
  });

  const duplicates = find_duplicates(keyCodes);
  if (duplicates.length === 0) return true;

  const display = duplicates
    .map((code) => String.fromCharCode(parseInt(code, 10)))
    .join(", ");
  alert("Duplicate keys detected: " + display);
  return false;
}

function setKeyInput(input, keyCode) {
  if (!input) return;
  input.value = String.fromCharCode(keyCode);
  input.dataset.keycode = String(keyCode);
}

function getKeyInputCode(input) {
  if (!input) return null;
  const code = parseInt(input.dataset.keycode || "", 10);
  return Number.isFinite(code) ? code : null;
}

function populateKeySettings() {
  const keyset = state.usingDefaultKeys ? state.defaultKeys : state.currentKeys;
  state.colors.forEach((color, idx) => {
    const leftInput = $("#settings_" + color + "_left");
    const rightInput = $("#settings_" + color + "_right");
    setKeyInput(leftInput, keyset[idx].left);
    setKeyInput(rightInput, keyset[idx].right);
  });
}

function applyKeySettings() {
  state.colors.forEach((color, idx) => {
    const leftInput = $("#settings_" + color + "_left");
    const rightInput = $("#settings_" + color + "_right");
    const leftCode = getKeyInputCode(leftInput) ?? state.currentKeys[idx].left;
    const rightCode = getKeyInputCode(rightInput) ?? state.currentKeys[idx].right;

    state.currentKeys[idx].left = leftCode;
    state.currentKeys[idx].right = rightCode;

    const mainLeft = $("#" + color + "LeftInput");
    const mainRight = $("#" + color + "RightInput");
    if (mainLeft) {
      mainLeft.value = String.fromCharCode(leftCode);
      mainLeft.setAttribute("name", leftCode);
    }
    if (mainRight) {
      mainRight.value = String.fromCharCode(rightCode);
      mainRight.setAttribute("name", rightCode);
    }
  });
  state.usingDefaultKeys = false;
}

function bindSettingsKeyInputs() {
  state.colors.forEach((color) => {
    const leftInput = $("#settings_" + color + "_left");
    const rightInput = $("#settings_" + color + "_right");
    if (leftInput) {
      leftInput.addEventListener("keydown", (e) => {
        e.preventDefault();
        setKeyInput(leftInput, e.keyCode);
      });
    }
    if (rightInput) {
      rightInput.addEventListener("keydown", (e) => {
        e.preventDefault();
        setKeyInput(rightInput, e.keyCode);
      });
    }
  });
}

function resetSettingsDefaults() {
  $("#settings_hole_points").value = "None";
  $("#settings_speed").value = "Frantic";
  $("#settings_gap_spacing").value = "Far Apart";
  $("#settings_gap_sizing").value = "Large";

  state.colors.forEach((color, idx) => {
    const leftInput = $("#settings_" + color + "_left");
    const rightInput = $("#settings_" + color + "_right");
    setKeyInput(leftInput, state.defaultKeys[idx].left);
    setKeyInput(rightInput, state.defaultKeys[idx].right);
  });
  state.usingDefaultKeys = true;
}

export function openDialog() {
  const dialog = $("#dialog-form");
  const backdrop = ensureBackdrop();
  if (dialog) dialog.style.display = "block";
  if (backdrop) backdrop.style.display = "block";
}

export function closeDialog() {
  const dialog = $("#dialog-form");
  const backdrop = $("#modal-backdrop");
  if (dialog) dialog.style.display = "none";
  if (backdrop) backdrop.style.display = "none";
}

function ensureBackdrop() {
  let backdrop = $("#modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "modal-backdrop";
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", closeDialog);
  }
  return backdrop;
}

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function updateInfoModal() {
  const info = $("#info");
  if (!info) return;
  const lines = [];
  const mode = document.body.classList.contains("online-active") ? "Online" : "Local";
  lines.push(`Mode: ${mode}`);
  lines.push(`Round: ${state.roundNumber || state.currentRound || 0}`);
  lines.push(`Worms alive: ${state.wormsAlive || 0}`);
  lines.push(`Score to win: ${state.scoreToWin || 0}`);
  lines.push(`Max score: ${state.maxScore || 0}`);
  lines.push(`Winning worm: ${state.winningWorm || "-"}`);
  lines.push(`Longest worm: ${state.longestWormColor || "-"} (${state.longestWormSize || 0})`);
  lines.push("");
  lines.push("Settings:");
  lines.push(`- Hole points: ${state.holePoints || "None"}`);
  lines.push(`- Speed: ${state.modalSpeed || "Normal"}`);
  lines.push(`- Gap spacing: ${state.gapSpacing || "Normal"}`);
  lines.push(`- Gap size: ${state.gapSizing || "Normal"}`);
  lines.push("");
  lines.push("Gameplay:");
  lines.push(`- FPS: ${state.fps || 0}`);
  lines.push(`- Worm size: ${state.wormSize || 0}`);
  lines.push(`- Arena: ${state.xMax || 0} x ${state.yMax || 0}`);
  info.textContent = lines.join("\n");
}

function initModalInteractions() {
  const cards = document.querySelectorAll(".modal-card, .match-summary-card");
  cards.forEach((card) => {
    if (card.dataset.puneDraggable === "true") return;
    const header = card.querySelector(".modal-header, .match-summary-title");
    if (!header) return;
    const onMouseDown = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const rect = card.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const offsetX = startX - rect.left;
      const offsetY = startY - rect.top;
      card.style.position = "fixed";
      card.style.left = `${rect.left}px`;
      card.style.top = `${rect.top}px`;
      card.style.margin = "0";
      card.style.transform = "none";
      const onMove = (moveEvent) => {
        const nextLeft = Math.max(8, Math.min(window.innerWidth - rect.width - 8, moveEvent.clientX - offsetX));
        const nextTop = Math.max(8, Math.min(window.innerHeight - rect.height - 8, moveEvent.clientY - offsetY));
        card.style.left = `${nextLeft}px`;
        card.style.top = `${nextTop}px`;
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    header.addEventListener("mousedown", onMouseDown);
    card.dataset.puneDraggable = "true";
  });
}

export function bindUI() {
  initModalInteractions();
  const wormCards = document.querySelectorAll(".worm-card");
  wormCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        if (target.type === "text" || target.type === "checkbox") return;
      }
      if (target instanceof HTMLLabelElement) return;
      const checkbox = card.querySelector("input[type='checkbox']");
      if (!checkbox) return;
      checkbox.click();
    });
  });

  document.addEventListener("keydown", (event) => {
    // if (event.code === "Space" || event.key === " ") {
    if (event.code === "Space") {
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if (state.gameHasStarted && !state.onPause) {
        event.preventDefault();
        pause();
        return;
      }
      if (state.gameHasStarted && state.onPause) {
        event.preventDefault();
        pause();
        return;
      }
    }

    if (event.key === "Escape") {
      const abandonConfirm = $("#abandon-confirm");
      if (abandonConfirm && abandonConfirm.style.display !== "none") {
        event.preventDefault();
        toggleWithPause(abandonConfirm);
        return;
      }

      const tutorial = $("#tutorial-overlay");
      if (tutorial && tutorial.style.display !== "none") {
        event.preventDefault();
        hideTutorial();
        return;
      }

      const background = $("#background");
      const canvasDiv = $("#canvas_div");
      const inGameView = !!background && !!canvasDiv
        && getComputedStyle(background).display !== "none"
        && getComputedStyle(canvasDiv).display !== "none";

      if (inGameView && abandonConfirm) {
        event.preventDefault();
        toggleWithPause(abandonConfirm);
        return;
      }
      const inSetup = document.body.classList.contains("show-local-setup")
        || document.body.classList.contains("show-online-setup");
      if (!inSetup) {
        return;
      }
      event.preventDefault();
      showModeSelect();
      return;
    }

    handleGameKeyDown(event);
  });

  document.addEventListener("keyup", (event) => {
    handleGameKeyUp(event);
  });

  // Dialog open events
  const setGame = $("#set-game");
  if (setGame) setGame.addEventListener("click", showLocalSetup);

  const chooseLocal = $("#choose-local");
  const chooseOnline = $("#choose-online");
  if (chooseLocal) chooseLocal.addEventListener("click", showLocalSetup);
  if (chooseOnline) chooseOnline.addEventListener("click", showOnlineSetup);

  const dialogCreate = $("#dialog-create");
  const dialogClose = $("#dialog-close");
  if (dialogCreate) dialogCreate.addEventListener("click", () => {
    closeDialog();
    setModeStatus("Local match");
    lockModeSelection(true);
    startNewGame();
  });
  if (dialogClose) dialogClose.addEventListener("click", showModeSelect);

  const openSettings = $("#open-settings");
  if (openSettings) openSettings.addEventListener("click", openSettingsDialog);
  const openHelp = $("#open-help");
  const tutorialClose = $("#tutorial-close");
  if (openHelp) openHelp.addEventListener("click", showTutorial);
  if (tutorialClose) tutorialClose.addEventListener("click", hideTutorial);
  const openAbout = $("#open-about");
  if (openAbout) openAbout.addEventListener("click", () => toggleWithPause($("#about-modal")));
  const fullscreenToggle = $("#fullscreen-toggle");
  if (fullscreenToggle) fullscreenToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleFullscreen();
  });
  document.addEventListener("fullscreenchange", updateFullscreenLabel);

  const summary = getSummaryElements();
  if (summary.close) summary.close.addEventListener("click", hideMatchSummary);
  if (summary.rematch) {
    summary.rematch.addEventListener("click", () => {
      const mode = summary.overlay?.dataset.mode || "local";
      if (mode === "online") {
        hideMatchSummary();
        document.dispatchEvent(new Event("pune-online-rematch"));
      } else {
        hideMatchSummary();
        startNewGame();
      }
    });
  }
  const settingsSave = $("#settings-save");
  const settingsClose = $("#settings-close");
  const settingsReset = $("#settings-reset");
  if (settingsSave) settingsSave.addEventListener("click", applySettingsFromDialog);
  if (settingsClose) settingsClose.addEventListener("click", closeSettingsDialog);
  if (settingsReset) settingsReset.addEventListener("click", resetSettingsDefaults);
  const settingsBackdrop = $("#settings-backdrop");
  if (settingsBackdrop) settingsBackdrop.addEventListener("click", closeSettingsDialog);

  const onlineBack = $("#online-back");
  if (onlineBack) onlineBack.addEventListener("click", showModeSelect);

  // Close panels
  const infoClose = $("#info-close-btn");
  const logClose = $("#log-close-btn");
  const keysClose = $("#keys-close-btn");
  const soundsClose = $("#sounds-close-btn");
  const abandonClose = $("#abandon-close");
  const abandonContinue = $("#abandon-continue");
  const abandonLocal = $("#abandon-local");
  const abandonLobby = $("#abandon-lobby");
  const aboutClose = $("#about-close");
  if (infoClose) infoClose.addEventListener("click", () => toggleWithPause($("#game-info-div")));
  if (logClose) logClose.addEventListener("click", () => toggleWithPause($("#game-details-div")));
  if (keysClose) keysClose.addEventListener("click", () => toggleWithPause($("#show-keys-div")));
  if (soundsClose) soundsClose.addEventListener("click", () => toggleWithPause($("#sounds-menu")));
  if (aboutClose) aboutClose.addEventListener("click", () => toggleWithPause($("#about-modal")));
  if (abandonClose) abandonClose.addEventListener("click", () => toggleWithPause($("#abandon-confirm")));
  if (abandonContinue) abandonContinue.addEventListener("click", () => toggleWithPause($("#abandon-confirm")));
  if (abandonLocal) {
    abandonLocal.addEventListener("click", () => {
      abandonGame();
      if (state.onPause) pause();
      if ($("#abandon-confirm")) toggleWithPause($("#abandon-confirm"));
      showModeSelect();
      showLocalSetup();
    });
  }
  if (abandonLobby) {
    abandonLobby.addEventListener("click", () => {
      abandonGame();
      if (state.onPause) pause();
      if ($("#abandon-confirm")) toggleWithPause($("#abandon-confirm"));
      showModeSelect();
    });
  }

  // Nav bar buttons action
  const toggleLog = $("#toggle-log");
  const toggleInfo = $("#toggle-info");
  const toggleKeys = $("#toggle-keys");
  const soundsNav = $("#sounds-nav-bar");
  const soundsVolume = $("#sounds-volume");
  const soundsVolumeValue = $("#sounds-volume-value");
  const musicVolume = $("#music-volume");
  const musicVolumeValue = $("#music-volume-value");
  const musicTrack = $("#music-track");
  const synthToggle = $("#toggle-synth");
  if (toggleLog) toggleLog.addEventListener("click", () => {
    updateLogUI();
    toggleWithPause($("#game-details-div"));
    logEvent({ actor: "System", action: "Log opened" });
  });
  if (toggleInfo) toggleInfo.addEventListener("click", () => {
    updateInfoModal();
    toggleWithPause($("#game-info-div"));
  });
  if (toggleKeys) toggleKeys.addEventListener("click", () => toggleWithPause($("#show-keys-div")));
  if (soundsNav) soundsNav.addEventListener("click", () => toggleWithPause($("#sounds-menu")));
  if (synthToggle) {
    const syncSynth = () => {
      const isOn = !!state.backgroundMusicOn;
      synthToggle.textContent = isOn ? "On" : "Off";
      synthToggle.classList.toggle("is-on", isOn);
      synthToggle.setAttribute("aria-pressed", isOn ? "true" : "false");
    };
    syncSynth();
    synthToggle.addEventListener("click", () => {
      toggleBackgroundMusic();
      syncSynth();
    });
  }
  if (soundsVolume) {
    const syncVolumeLabel = () => {
      if (soundsVolumeValue) soundsVolumeValue.textContent = `${soundsVolume.value}%`;
    };
    const initial = Math.round((state.soundVolume ?? 0.25) * 100);
    soundsVolume.value = String(initial);
    syncVolumeLabel();
    soundsVolume.addEventListener("input", () => {
      const vol = Number(soundsVolume.value) / 100;
      setSoundVolume(vol);
      syncVolumeLabel();
    });
  }
  if (musicVolume) {
    const syncMusicLabel = () => {
      if (musicVolumeValue) musicVolumeValue.textContent = `${musicVolume.value}%`;
    };
    const initial = Math.round((state.musicVolume ?? 0.2) * 100);
    musicVolume.value = String(initial);
    syncMusicLabel();
    musicVolume.addEventListener("input", () => {
      const vol = Number(musicVolume.value) / 100;
      setMusicVolume(vol);
      syncMusicLabel();
    });
  }
  if (musicTrack) {
    const initialTrack = state.musicTrack || "synthwave";
    musicTrack.value = initialTrack;
    musicTrack.addEventListener("change", () => {
      setMusicTrack(musicTrack.value);
    });
  }

  // Sounds triggers
  const soundMap = [
    ["#play-red-winning-shout", "red"],
    ["#play-purple-winning-shout", "purple"],
    ["#play-blue-winning-shout", "blue"],
    ["#play-green-winning-shout", "green"],
    ["#play-yellow-winning-shout", "yellow"],
    ["#play-cyan-winning-shout", "cyan"],
    ["#play-die-shout", "die"],
    ["#play-yabass-shout", "yabass"],
    ["#play-winning-shout", "win"],
    ["#play-speeding-shout", "speeding"],
    ["#play-pause-shout", "pause"],
    ["#play-burp-shout", "burp"],
  ];
  soundMap.forEach(([sel, sound]) => {
    const el = $(sel);
    if (el) el.addEventListener("click", () => playSound(sound));
  });

  // Settings inputs
  state.colors.forEach((color) => {
    const play = $("#" + color + "_play");
    const label = $("#" + color + "_label");
    const leftInput = $("#" + color + "LeftInput");
    const rightInput = $("#" + color + "RightInput");

    if (play) play.addEventListener("click", () => labelClicked(color, "check"));
    if (label) label.addEventListener("click", () => labelClicked(color, "label"));

    if (leftInput) leftInput.addEventListener("keydown", (e) => {
      e.preventDefault();
      const code = getKeyCodeFromEvent(e);
      if (!Number.isFinite(code)) return;
      setMoveKey(color, "left", code);
    });
    if (rightInput) rightInput.addEventListener("keydown", (e) => {
      e.preventDefault();
      const code = getKeyCodeFromEvent(e);
      if (!Number.isFinite(code)) return;
      setMoveKey(color, "right", code);
    });

    if (leftInput) hide(leftInput);
    if (rightInput) hide(rightInput);

    if (play && play.checked) {
      labelClicked(color, "check");
    }
  });

  const settingsData = loadSettingsData();
  state.players.length = 0;
  settingsData.forEach((s) => state.players.push(s));
  applySettingsToUI(settingsData);

  const redPlay = $("#red_play");
  const bluePlay = $("#blue_play");
  if (redPlay && !redPlay.checked) {
    redPlay.checked = true;
    labelClicked("red", "check");
  }
  if (bluePlay && !bluePlay.checked) {
    bluePlay.checked = true;
    labelClicked("blue", "check");
  }

  setModeStatus("Select");

  bindSettingsKeyInputs();

  if (!window.localStorage.getItem("puneTutorialSeen")) {
    showTutorial();
  }

  updateFullscreenLabel();

  document.addEventListener("pune-local-match-over", () => {
    lockModeSelection(false);
    showModeSelect();
    setGameNavVisible(true);
  });

  document.addEventListener("pune-local-match-summary", (event) => {
    const detail = event.detail || {};
    showMatchSummary({
      mode: "local",
      winner: detail.winner,
      maxScore: detail.maxScore,
      players: detail.players || [],
      canRematch: true,
    });
  });

  document.addEventListener("pune-local-game-start", () => {
    setGameNavVisible(false);
  });

  document.addEventListener("pune-online-game-start", () => {
    setGameNavVisible(false);
  });

  document.addEventListener("pune-online-game-over", () => {
    setGameNavVisible(true);
  });
}
