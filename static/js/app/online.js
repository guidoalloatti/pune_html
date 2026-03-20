"use strict";

import { $, show, hide } from "./dom.js";
import { lockModeSelection, showMatchSummary, hideMatchSummary } from "./ui.js";
import { renderOnlineWorms, updateScoreDisplay, drawMarkerBlocks } from "./renderer.js";

let _resetOnlineTrails = null;
import("./renderer.js").then((m) => { _resetOnlineTrails = m.resetOnlineTrails; }).catch(() => {});
import { state } from "./state.js";
import { playBeep, playSound, setSoundVolume, setMusicVolume } from "./sounds.js";

let pendingAction = null; // queued action to send once WS opens

export const online = {
  ws: null,
  clientId: null,
  room: null,
  isHost: false,
  statusEl: null,
  roomEl: null,
  roomsEl: null,
  historyEl: null,
  playersEl: null,
  readyBtn: null,
  startBtn: null,
  reconnectBannerEl: null,
  roleToggleEl: null,
  profileNameEl: null,
  profileColorEl: null,
  chatLogEl: null,
  chatInputEl: null,
  chatSendEl: null,
  leaveBtn: null,
  copyRoomBtnEl: null,
  reconnectTimer: null,
  chatMuteUntil: 0,
  chatRateWindow: [],
  ready: false,
  canStart: false,
  started: false,
  spectator: false,
  profile: { name: "", color: "#6de38c" },
  lastSettings: null,
  input: { left: false, right: false },
  state: null,
  canvas: null,
  ctx: null,
  active: false,
  sessionId: null,
  connectedOnce: false,
};

function showOnlineCountdown() {
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
      return;
    }
    showStep();
  }, 1000);
}

function updateOnlineMobileClass() {
  const isMobile = window.matchMedia("(pointer: coarse)").matches
    || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
  const inOnlineMode = document.body.classList.contains("show-online-setup")
    || document.body.classList.contains("online-active");
  document.body.classList.toggle("online-mobile", isMobile && inOnlineMode);
}

function setOnlineStatus(text) {
  if (online.statusEl) online.statusEl.textContent = text;
}

function updateHostControls() {
  const settingsSection = $(".ol-section-settings");
  if (settingsSection) {
    settingsSection.style.display = online.isHost ? "" : "none";
  }
  const settingsFields = [
    $("#online_hole_points"),
    $("#online_speed"),
    $("#online_gap_spacing"),
    $("#online_gap_sizing"),
  ];
  settingsFields.forEach((field) => {
    if (field) field.disabled = !online.isHost;
  });
}

function updateCopyRoomButton() {
  if (!online.copyRoomBtnEl) return;
  online.copyRoomBtnEl.disabled = !online.room;
}

function updateRoomControls() {
  const joinBtn = $("#join-room-btn");
  const pasteBtn = $("#paste-room-btn");
  const createBtn = $("#create-room-btn");
  const copyBtn = $("#copy-room-btn");
  const input = $("#room-code");
  if (input && online.room) input.value = online.room;
  const inRoom = !!online.room;
  const isHost = online.isHost && inRoom;
  const isGuest = !online.isHost && inRoom;
  document.body.classList.toggle("online-host", isHost);
  document.body.classList.toggle("online-guest", isGuest);
  // Host in room: hide join/paste (already in room)
  if (joinBtn) joinBtn.style.display = isHost ? "none" : "";
  if (pasteBtn) pasteBtn.style.display = isHost ? "none" : "";
  // Guest in room: hide create/copy
  if (createBtn) createBtn.style.display = isGuest ? "none" : "";
  if (copyBtn) copyBtn.style.display = isGuest ? "none" : "";
}

function loadProfile() {
  const name = window.localStorage.getItem("puneProfileName") || "";
  const color = window.localStorage.getItem("puneProfileColor") || "#6de38c";
  online.profile = { name: name.trim() || "Player", color };
  if (online.profileNameEl) online.profileNameEl.value = online.profile.name;
  if (online.profileColorEl) online.profileColorEl.value = online.profile.color;
}

function persistProfile() {
  window.localStorage.setItem("puneProfileName", online.profile.name);
  window.localStorage.setItem("puneProfileColor", online.profile.color);
}

function sendProfile() {
  if (!online.ws || online.ws.readyState !== 1) return;
  online.ws.send(JSON.stringify({ type: "profile", name: online.profile.name, color: online.profile.color }));
}

function requestSettingsSync() {
  if (!online.ws || online.ws.readyState !== 1) return;
  if (!online.room) return;
  online.ws.send(JSON.stringify({ type: "settings-sync" }));
}

function applyOnlineSettings(settings) {
  if (!settings) return;
  const holePoints = $("#online_hole_points");
  const speed = $("#online_speed");
  const gapSpacing = $("#online_gap_spacing");
  const gapSizing = $("#online_gap_sizing");
  
  const setSelect = (el, value) => {
    if (!el || value == null) return;
    const normalized = String(value).trim();
    if (!normalized) return;
    el.value = normalized;
    if (el.value !== normalized) {
      const match = normalized.toLowerCase();
      const option = Array.from(el.options).find((opt) => {
        const optValue = String(opt.value || opt.textContent || "").trim();
        return optValue === normalized || optValue.toLowerCase() === match;
      });
      if (option) option.selected = true;
    }
  };
  setSelect(holePoints, settings.holePoints);
  setSelect(speed, settings.modalSpeed);
  setSelect(gapSpacing, settings.gapSpacing);
  setSelect(gapSizing, settings.gapSizing);
}

function showReconnectBanner() {
  if (!online.reconnectBannerEl) return;
  online.reconnectBannerEl.style.display = "block";
  clearTimeout(online.reconnectTimer);
  online.reconnectTimer = setTimeout(() => {
    if (online.reconnectBannerEl) online.reconnectBannerEl.style.display = "none";
  }, 2000);
}

function connectOnline() {
  if (online.ws && online.ws.readyState === 1) return;
  const url = "ws://" + window.location.hostname + ":8080";
  online.ws = new WebSocket(url);
  setOnlineStatus("Connecting...");

  online.ws.onopen = function () {
    online.connectedOnce = true;
    setOnlineStatus("Connected");
    sendProfile();
    const storedSession = window.localStorage.getItem("puneSessionId");
    if (storedSession) {
      online.ws.send(JSON.stringify({ type: "reconnect", sessionId: storedSession }));
    }
    online.ws.send(JSON.stringify({ type: "list-rooms" }));
    online.ws.send(JSON.stringify({ type: "history" }));
    // Flush any queued action (create/join/autojoin)
    if (pendingAction) {
      online.ws.send(JSON.stringify(pendingAction));
      pendingAction = null;
    }
  };

  online.ws.onclose = function () {
    setOnlineStatus(online.connectedOnce ? "Disconnected — reconnecting..." : "Disconnected (server offline)");
    online.room = null;
    online.isHost = false;
    online.active = false;
    online.started = false;
    online.ready = false;
    online.spectator = false;
    document.body.classList.remove("online-active");
    if (online.roomEl) online.roomEl.textContent = "-";
    if (online.chatInputEl) online.chatInputEl.disabled = false;
    if (online.chatSendEl) online.chatSendEl.disabled = true;
    updateReadyButton();
    updateStartButton();
    // Auto-reconnect after 3 seconds if we were previously connected
    if (online.connectedOnce) {
      clearTimeout(online.reconnectTimer);
      online.reconnectTimer = setTimeout(() => connectOnline(), 3000);
    }
  };

  online.ws.onerror = function () {
    setOnlineStatus("Disconnected (server offline)");
  };

  online.ws.onmessage = function (event) {
    let msg = {};
    try { msg = JSON.parse(event.data); } catch (e) { return; }

    if (msg.type === "hello") {
      online.clientId = msg.clientId;
      if (msg.sessionId) {
        online.sessionId = msg.sessionId;
        window.localStorage.setItem("puneSessionId", msg.sessionId);
      }
    }

    if (msg.type === "room-created") {
      online.room = msg.room;
      online.isHost = msg.host;
      online.spectator = !!msg.spectator;
      online.active = true;
      document.body.classList.add("online-active");
      if (online.roomEl) online.roomEl.textContent = online.room;
      if (online.chatLogEl) online.chatLogEl.innerHTML = "";
      if (online.chatInputEl) online.chatInputEl.disabled = false;
      if (online.chatSendEl) online.chatSendEl.disabled = false;
      setOnlineStatus("Room created");
      if (msg.settings) {
        online.lastSettings = msg.settings;
        applyOnlineSettings(msg.settings);
      }
      if (!online.spectator) {
        online.ready = true;
        online.ws.send(JSON.stringify({ type: "ready", ready: true }));
      }
      updateHostControls();
      updateRoomControls();
      updateCopyRoomButton();
      updateOnlineMobileClass();
      requestSettingsSync();
    }

    if (msg.type === "room-joined") {
      online.room = msg.room;
      online.isHost = msg.host;
      online.spectator = !!msg.spectator;
      online.active = true;
      document.body.classList.add("online-active");
      if (online.roomEl) online.roomEl.textContent = online.room;
      if (online.chatLogEl) online.chatLogEl.innerHTML = "";
      if (online.chatInputEl) online.chatInputEl.disabled = false;
      if (online.chatSendEl) online.chatSendEl.disabled = false;
      setOnlineStatus(msg.reconnected ? "Reconnected" : "Room joined");
      if (msg.reconnected) showReconnectBanner();
      if (online.spectator) setOnlineStatus("Spectating");
      if (msg.settings) {
        online.lastSettings = msg.settings;
        applyOnlineSettings(msg.settings);
      }
      if (!online.spectator) {
        online.ready = true;
        online.ws.send(JSON.stringify({ type: "ready", ready: true }));
      }
      updateHostControls();
      updateRoomControls();
      updateStartButton();
      updateCopyRoomButton();
      updateOnlineMobileClass();
      requestSettingsSync();
    }

    if (msg.type === "start") {
      online.started = true;
      online.prevInHole = new Map();
      state.onPause = false;
      setOnlineStatus("Game started");
      if (_resetOnlineTrails) _resetOnlineTrails();
      hideMatchSummary();
      lockModeSelection(true);
      const pauseBanner = $("#online-pause-banner");
      if (pauseBanner) pauseBanner.style.display = "none";
      const bg = $("#background");
      if (bg) bg.classList.remove("game-paused");
      document.dispatchEvent(new Event("pune-online-game-start"));
      hide($("#start-body"));
      hide($(".demo"));
      hide($("#online-setup"));
      show($("#canvas_div"));
      show($("#background"));
      showOnlineCountdown();
      updateOnlineMobileClass();
    }

    if (msg.type === "match-over") {
      online.started = false;
      if (_resetOnlineTrails) _resetOnlineTrails();
      playSound("win");
      if (msg.winner) {
        setOnlineStatus("Match over. Winner: " + msg.winner);
      } else {
        setOnlineStatus("Match over. Tie");
      }
      if (msg.summary) {
        showMatchSummary({
          mode: "online",
          winner: msg.summary.winner,
          maxScore: msg.summary.maxScore,
          players: msg.summary.players || [],
          canRematch: online.isHost,
        });
      }
      online.ready = false;
      updateReadyButton();
      updateStartButton();
      lockModeSelection(false);
      document.dispatchEvent(new Event("pune-online-game-over"));
      document.body.classList.add("show-online-setup");
      document.body.classList.remove("show-local-setup");
      show($("#online-setup"));
      hide($("#background"));
      hide($("#canvas_div"));
      updateCopyRoomButton();
      updateOnlineMobileClass();
    }

    if (msg.type === "room-list") renderRoomList(msg.rooms || []);
    if (msg.type === "history") renderHistory(msg.history || []);
    if (msg.type === "room-state") {
      online.spectator = !!msg.spectator;
      if (msg.hostId != null) online.isHost = msg.hostId === online.clientId;
      if (msg.settings) {
        online.lastSettings = msg.settings;
        applyOnlineSettings(msg.settings);
      }
      renderPlayers(msg.players || [], msg.selfReady, msg.hostId);
      updateRoleToggle();
      updateHostControls();
      updateRoomControls();
      if (!online.spectator && !msg.selfReady && online.ws?.readyState === 1) {
        online.ready = true;
        online.ws.send(JSON.stringify({ type: "ready", ready: true }));
      }
    }

    if (msg.type === "host-changed") {
      online.isHost = msg.hostId === online.clientId;
      updateStartButton();
      updateHostControls();
    }

    if (msg.type === "state") {
      const prevWorms = online.state?.worms ? [...online.state.worms] : [];
      const prevRound = online.state?.round || 0;
      online.state = msg.state;
      online.lastSettings = msg.state?.settings || online.lastSettings;
      if (msg.state?.settings) applyOnlineSettings(msg.state.settings);

      const worms = online.state?.worms || [];
      if (prevWorms.length && worms.length) {
        const prevMap = new Map(prevWorms.map((w) => [w.id, w]));
        let deathThisTick = false;
        worms.forEach((w) => {
          const prev = prevMap.get(w.id);
          if (prev && prev.alive && !w.alive) {
            playSound("die");
            deathThisTick = true;
          }
        });

        // Round ended — play winning worm's color sound
        if (deathThisTick) {
          const alive = worms.filter((w) => w.playing && w.alive);
          if (alive.length <= 1 && alive.length > 0) {
            playSound(alive[0].color);
          }
        }
      }

      // Detect hole entering — yabass sound (trail is newest-first)
      if (!online.prevInHole) online.prevInHole = new Map();
      worms.forEach((w) => {
        if (!w.alive || w.playing === false) return;
        const trail = w.trail || [];
        const inHole = trail.length > 0 && trail[0].hole;
        const wasInHole = online.prevInHole.get(w.id) || false;
        if (inHole && !wasInHole) {
          playSound("yabass");
        }
        online.prevInHole.set(w.id, inHole);
      });
      if (online.state?.round !== prevRound) {
        online.prevInHole = new Map();
      }

      renderOnline();
    }

    if (msg.type === "settings-update") {
      online.lastSettings = msg.settings || online.lastSettings;
      applyOnlineSettings(msg.settings);
    }

    if (msg.type === "score-update") {
      const players = msg.players || [];
      if (online.state?.worms && players.length) {
        const scoreMap = new Map(players.map((p) => [p.id, p]));
        online.state.worms = online.state.worms.map((w) => {
          const next = scoreMap.get(w.id);
          return next ? { ...w, score: next.score, playing: next.playing, alive: next.alive } : w;
        });
      }
      updateScoreDisplay(players.length ? players : (online.state?.worms || []), state.score_x, state.score_y, state.yMax);
    }

    if (msg.type === "pause") {
      state.onPause = true;
      online.pausedById = msg.pausedById;
      const isMine = msg.pausedById === online.clientId;
      const banner = $("#online-pause-banner");
      if (banner) banner.textContent = isMine ? "You paused the game" : (msg.name || "A player") + " paused the game";
      const resumeBtn = $("#pause-resume");
      if (resumeBtn) {
        resumeBtn.disabled = !isMine;
        resumeBtn.textContent = isMine ? "Resume" : "Waiting for " + (msg.name || "player") + "...";
      }
      const abandonLocal = $("#pause-abandon-local");
      const abandonLobby = $("#pause-abandon-lobby");
      if (abandonLocal) abandonLocal.style.display = isMine ? "" : "none";
      if (abandonLobby) abandonLobby.style.display = isMine ? "" : "none";
      const bg = $("#background");
      if (bg) bg.classList.add("game-paused");
      playSound("pause");
    }

    if (msg.type === "resume") {
      state.onPause = false;
      online.pausedById = null;
      const banner = $("#online-pause-banner");
      if (banner) banner.textContent = "";
      const resumeBtn = $("#pause-resume");
      if (resumeBtn) {
        resumeBtn.disabled = false;
        resumeBtn.textContent = "Resume";
      }
      const bg = $("#background");
      if (bg) bg.classList.remove("game-paused");
      playSound("pause");
    }

    if (msg.type === "chat") {
      appendChatMessage(msg);
    }

    if (msg.type === "error") setOnlineStatus(msg.message || "Error");
  };
}

function sendOrQueue(msg) {
  if (online.ws && online.ws.readyState === 1) {
    online.ws.send(JSON.stringify(msg));
  } else {
    pendingAction = msg;
    connectOnline();
  }
}

function createRoom() {
  sendOrQueue({ type: "create" });
}

function joinRoom() {
  let code = ($("#room-code")?.value || "").toUpperCase().trim();
  if (!code) return setOnlineStatus("Enter a room code");
  sendOrQueue({ type: "join", room: code });
}

function autoJoinRoom() {
  setOnlineStatus("Autojoining...");
  sendOrQueue({ type: "autojoin" });
}

function startOnlineGame() {
  if (!online.ws || !online.isHost || !online.canStart) return;
  const settings = {
    holePoints: $("#online_hole_points").value || $("#hole_points").value || "None",
    modalSpeed: $("#online_speed").value || $("#modal_speed").value || "Frantic",
    gapSpacing: $("#online_gap_spacing").value || $("#gap_spacing").value || "Far Apart",
    gapSizing: $("#online_gap_sizing").value || $("#gap_sizing").value || "Large",
  };
  online.lastSettings = settings;
  online.ws.send(JSON.stringify({ type: "start", settings }));
}

function sendSettingsUpdate() {
  if (!online.ws || online.ws.readyState !== 1) return;
  if (!online.isHost || online.started || !online.room) return;
  const settings = {
    holePoints: $("#online_hole_points").value || "None",
    modalSpeed: $("#online_speed").value || "Frantic",
    gapSpacing: $("#online_gap_spacing").value || "Far Apart",
    gapSizing: $("#online_gap_sizing").value || "Large",
  };
  online.lastSettings = settings;
  online.ws.send(JSON.stringify({ type: "settings-update", settings }));
}

function rematchOnline() {
  if (!online.ws || !online.isHost || !online.lastSettings) return;
  online.ws.send(JSON.stringify({ type: "start", settings: online.lastSettings }));
}

function toggleReady() {
  if (!online.ws || !online.active || online.spectator) return;
  online.ready = !online.ready;
  online.ws.send(JSON.stringify({ type: "ready", ready: online.ready }));
  updateReadyButton();
}

function updateReadyButton() {
  if (!online.readyBtn) return;
  if (online.spectator) {
    online.readyBtn.textContent = "Spectating";
    online.readyBtn.disabled = true;
    return;
  }
  online.readyBtn.disabled = false;
  online.readyBtn.textContent = online.ready ? "Cancel Ready" : "Ready Up";
}

function updateRoleToggle() {
  if (!online.roleToggleEl) return;
  if (online.started) {
    online.roleToggleEl.disabled = true;
    return;
  }
  online.roleToggleEl.disabled = false;
  online.roleToggleEl.textContent = online.spectator ? "Switch to Player" : "Switch to Spectator";
}

function sendInput() {
  if (!online.ws || online.ws.readyState !== 1) return;
  if (!online.started || !online.ready || online.spectator) return;
  online.ws.send(JSON.stringify({ type: "input", input: online.input }));
}

function renderOnline() {
  if (!online.state) return;
  const worms = online.state.worms || [];
  renderOnlineWorms(worms);
  // Draw markers using online worm colors and update scores
  const onlineColors = worms.filter((w) => w.playing !== false).map((w) => w.color);
  if (onlineColors.length) {
    state.colors = onlineColors;
    drawMarkerBlocks(onlineColors, state.xMarker, 0, state.wMarker, state.hMarker);
  }
  updateScoreDisplay(worms, state.score_x, state.score_y, state.yMax);
}

function renderRoomList(rooms) {
  if (!online.roomsEl) return;
  if (!rooms.length) {
    online.roomsEl.innerHTML = "<div>No rooms available</div>";
    return;
  }
  let html = "";
  for (let ri = 0; ri < rooms.length; ri++) {
    const r = rooms[ri];
    html += "<div class=\"room-row\">" +
      "<span class=\"room-code\">" + r.room + "</span>" +
      "<span class=\"room-meta\">" + r.players + "/" + r.slots + (r.started ? " • In Game" : " • Lobby") + "</span>" +
      "<button class=\"room-spectate-btn\" data-room=\"" + r.room + "\" type=\"button\">Spectate</button>" +
      "</div>";
  }
  online.roomsEl.innerHTML = html;
}

function renderHistory(history) {
  if (!online.historyEl) return;
  if (!history.length) {
    online.historyEl.innerHTML = "<div>No recent matches</div>";
    return;
  }
  let html = "";
  for (let hi = history.length - 1; hi >= 0; hi--) {
    const h = history[hi];
    const date = new Date(h.timestamp).toLocaleString();
    const winner = h.winner ? h.winner : "Tie";
    html += "<div class=\"history-row\">" +
      "<span class=\"history-date\">" + date + "</span>" +
      "<span class=\"history-winner\">" + winner + "</span>" +
      "</div>";
  }
  online.historyEl.innerHTML = html;
}

function renderPlayers(players, selfReady = false, hostId = null) {
  online.ready = !!selfReady;
  updateReadyButton();
  const readyCount = players.filter((p) => p.ready).length;
  online.canStart = online.isHost && readyCount >= 2;
  updateStartButton();
  updateRoleToggle();
  if (!online.playersEl) return;
  if (!players.length) {
    online.playersEl.innerHTML = "<div>No players yet</div>";
    return;
  }
  online.playersEl.innerHTML = "";
  if (online.spectator) {
    const row = document.createElement("div");
    row.className = "player-row";
    const left = document.createElement("span");
    left.textContent = "You are spectating";
    const right = document.createElement("span");
    right.className = "player-not-ready";
    right.textContent = "Viewer";
    row.appendChild(left);
    row.appendChild(right);
    online.playersEl.appendChild(row);
  }
  players.forEach((p) => {
    const row = document.createElement("div");
    row.className = "player-row";
    const readyClass = p.ready ? "player-ready" : "player-not-ready";
    const readyLabel = p.ready ? "Ready" : "Not Ready";
    const hostLabel = hostId === p.id ? " (Host)" : "";
    const label = p.name || `Player ${p.id}`;
    const color = p.color || "#ffffff";
    const left = document.createElement("span");
    left.style.color = color;
    left.textContent = label + hostLabel + (p.role === "spectator" ? " (Spectator)" : "");
    const right = document.createElement("span");
    right.className = readyClass;
    right.textContent = readyLabel;
    row.appendChild(left);
    row.appendChild(right);
    online.playersEl.appendChild(row);
  });
}

function toggleRole() {
  if (!online.ws || online.ws.readyState !== 1) return;
  if (online.started) return;
  online.ws.send(JSON.stringify({ type: "switch-role", role: online.spectator ? "player" : "spectator" }));
}

function updateStartButton() {
  if (!online.startBtn) return;
  const showStart = online.isHost && !!online.room && online.canStart && !online.spectator;
  online.startBtn.disabled = !online.canStart || online.spectator;
  online.startBtn.style.display = showStart ? "" : "none";
}

function appendChatMessage(msg) {
  if (!online.chatLogEl) return;
  const row = document.createElement("div");
  row.className = "chat-message";
  const name = msg.name || "Player";
  const color = msg.color || "#ffffff";
  const nameSpan = document.createElement("span");
  nameSpan.className = "chat-name";
  nameSpan.style.color = color;
  nameSpan.textContent = name;
  const textSpan = document.createElement("span");
  textSpan.className = "chat-text";
  textSpan.textContent = `: ${msg.text}`;
  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  online.chatLogEl.appendChild(row);
  online.chatLogEl.scrollTop = online.chatLogEl.scrollHeight;
}

function sendChat() {
  if (!online.ws || online.ws.readyState !== 1) return;
  if (!online.active || !online.room) {
    setOnlineStatus("Join or create a room to chat");
    return;
  }
  if (!online.chatInputEl) return;
  const now = Date.now();
  if (now < online.chatMuteUntil) {
    setOnlineStatus("Chat muted (spam)");
    return;
  }
  const text = online.chatInputEl.value.trim();
  if (!text) return;
  online.chatRateWindow = online.chatRateWindow.filter((t) => now - t < 5000);
  online.chatRateWindow.push(now);
  if (online.chatRateWindow.length > 6) {
    online.chatMuteUntil = now + 10000;
    setOnlineStatus("Chat muted for 10s");
    return;
  }
  online.ws.send(JSON.stringify({ type: "chat", text }));
  online.chatInputEl.value = "";
}

function leaveRoom() {
  if (!online.ws || online.ws.readyState !== 1) return;
  online.ws.send(JSON.stringify({ type: "leave" }));
  online.active = false;
  online.started = false;
  online.ready = false;
  online.spectator = false;
  online.room = null;
  online.isHost = false;
  if (online.roomEl) online.roomEl.textContent = "-";
  if (online.chatLogEl) online.chatLogEl.innerHTML = "";
  if (online.chatInputEl) online.chatInputEl.disabled = false;
  if (online.chatSendEl) online.chatSendEl.disabled = true;
  updateHostControls();
  updateReadyButton();
  updateStartButton();
  updateRoleToggle();
  updateRoomControls();
  updateCopyRoomButton();
  updateOnlineMobileClass();
}

function bindOnlineKeys() {
  document.addEventListener("keydown", (event) => {
    if (!online.active || !online.started) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
    const code = event.keyCode;
    let handled = false;
    if (code === 27) { // Escape — toggle pause
      if (online.ws && online.ws.readyState === 1) {
        // If paused by another player, ignore Escape
        if (state.onPause && online.pausedById && online.pausedById !== online.clientId) {
          event.preventDefault();
          return;
        }
        online.ws.send(JSON.stringify({ type: "pause" }));
      }
      event.preventDefault();
      return;
    }
    if (code === 37) { online.input.left = true; handled = true; }
    if (code === 39) { online.input.right = true; handled = true; }
    if (handled) {
      sendInput();
      event.preventDefault();
    }
  });
  document.addEventListener("keyup", (event) => {
    if (!online.active || !online.started) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
    const code = event.keyCode;
    let handled = false;
    if (code === 37) { online.input.left = false; handled = true; }
    if (code === 39) { online.input.right = false; handled = true; }
    if (handled) {
      sendInput();
      event.preventDefault();
    }
  });
}

function bindMobileControls() {
  const leftBtn = $("#mobile-left");
  const rightBtn = $("#mobile-right");
  if (!leftBtn || !rightBtn) return;

  const down = (dir) => (e) => {
    if (!online.active) return;
    online.input[dir] = true;
    sendInput();
    e.preventDefault();
  };
  const up = (dir) => (e) => {
    if (!online.active) return;
    online.input[dir] = false;
    sendInput();
    e.preventDefault();
  };

  leftBtn.addEventListener("touchstart", down("left"));
  leftBtn.addEventListener("mousedown", down("left"));
  leftBtn.addEventListener("touchend", up("left"));
  leftBtn.addEventListener("mouseup", up("left"));
  leftBtn.addEventListener("mouseleave", up("left"));

  rightBtn.addEventListener("touchstart", down("right"));
  rightBtn.addEventListener("mousedown", down("right"));
  rightBtn.addEventListener("touchend", up("right"));
  rightBtn.addEventListener("mouseup", up("right"));
  rightBtn.addEventListener("mouseleave", up("right"));
}

export function bindOnline() {
  online.statusEl = $("#online-status");
  online.roomEl = $("#online-room");
  online.roomsEl = $("#online-rooms");
  online.historyEl = $("#online-history");
  online.playersEl = $("#online-players");
  online.readyBtn = $("#ready-toggle");
  online.startBtn = $("#start-online-btn");
  online.reconnectBannerEl = $("#reconnect-banner");
  online.roleToggleEl = $("#role-toggle");
  online.profileNameEl = $("#profile-name");
  online.profileColorEl = $("#profile-color");
  online.chatLogEl = $("#online-chat-log");
  online.chatInputEl = $("#online-chat-input");
  online.chatSendEl = $("#online-chat-send");
  online.copyRoomBtnEl = $("#copy-room-btn");

  const createRoomBtn = $("#create-room-btn");
  const joinRoomBtn = $("#join-room-btn");
  const startOnlineBtn = online.startBtn;
  const autojoinBtn = $("#autojoin-room-btn");
  const refreshRooms = $("#refresh-rooms-btn");
  const refreshHistory = $("#refresh-history-btn");
  const copyRoomBtn = $("#copy-room-btn");
  const pasteRoomBtn = $("#paste-room-btn");
  const roomCodeInput = $("#room-code");

  if (createRoomBtn) createRoomBtn.addEventListener("click", createRoom);
  if (joinRoomBtn) joinRoomBtn.addEventListener("click", joinRoom);
  if (startOnlineBtn) startOnlineBtn.addEventListener("click", startOnlineGame);
  if (autojoinBtn) autojoinBtn.addEventListener("click", autoJoinRoom);
  if (refreshRooms) refreshRooms.addEventListener("click", () => online.ws?.send(JSON.stringify({ type: "list-rooms" })));
  if (refreshHistory) refreshHistory.addEventListener("click", () => online.ws?.send(JSON.stringify({ type: "history" })));
  if (copyRoomBtn) copyRoomBtn.addEventListener("click", async () => {
    const code = online.room || (online.roomEl ? online.roomEl.textContent : "");
    if (!code || code === "-") {
      setOnlineStatus("No room code to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setOnlineStatus("Room code copied!");
    } catch (e) {
      const fallback = document.createElement("input");
      fallback.value = code;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
      setOnlineStatus("Room code copied!");
    }
  });
  if (pasteRoomBtn) pasteRoomBtn.addEventListener("click", async () => {
    if (!roomCodeInput) return;
    try {
      const text = await navigator.clipboard.readText();
      const normalized = (text || "").trim().toUpperCase().slice(0, 5);
      roomCodeInput.value = normalized;
      setOnlineStatus("Room code pasted");
      if (/^[A-Z0-9]{5}$/.test(normalized)) joinRoom();
    } catch (e) {
      setOnlineStatus("Paste failed");
    }
  });

  if (online.roomsEl) {
    online.roomsEl.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains("room-spectate-btn")) return;
      const room = target.dataset.room;
      if (!room) return;
      connectOnline();
      if (!online.ws) return;
      setOnlineStatus("Spectating...");
      online.ws.send(JSON.stringify({ type: "spectate", room }));
    });
  }

  loadProfile();
  if (online.profileNameEl) {
    online.profileNameEl.addEventListener("input", () => {
      online.profile.name = online.profileNameEl.value.trim() || "Player";
      persistProfile();
      sendProfile();
    });
  }
  if (online.profileColorEl) {
    online.profileColorEl.addEventListener("input", () => {
      online.profile.color = online.profileColorEl.value || "#6de38c";
      persistProfile();
      sendProfile();
    });
  }
  const holePoints = $("#online_hole_points");
  const speed = $("#online_speed");
  const gapSpacing = $("#online_gap_spacing");
  const gapSizing = $("#online_gap_sizing");
  if (holePoints) {
    holePoints.addEventListener("change", sendSettingsUpdate);
    holePoints.addEventListener("input", sendSettingsUpdate);
  }
  if (speed) {
    speed.addEventListener("change", sendSettingsUpdate);
    speed.addEventListener("input", sendSettingsUpdate);
  }
  if (gapSpacing) {
    gapSpacing.addEventListener("change", sendSettingsUpdate);
    gapSpacing.addEventListener("input", sendSettingsUpdate);
  }
  if (gapSizing) {
    gapSizing.addEventListener("change", sendSettingsUpdate);
    gapSizing.addEventListener("input", sendSettingsUpdate);
  }
  if (online.lastSettings) applyOnlineSettings(online.lastSettings);
  if (online.chatSendEl) online.chatSendEl.addEventListener("click", sendChat);
  if (online.chatInputEl) {
    online.chatInputEl.disabled = true;
    online.chatInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendChat();
      }
    });
  }
  if (online.chatSendEl) online.chatSendEl.disabled = true;

  updateHostControls();
  updateRoomControls();
  updateCopyRoomButton();
  updateOnlineMobileClass();
  window.addEventListener("resize", updateOnlineMobileClass);
  document.addEventListener("pune-online-mode-change", updateOnlineMobileClass);

  document.addEventListener("pune-online-rematch", rematchOnline);

  // Sound controls (floating bar)
  const soundToggle = $("#online-sound-toggle");
  const sfxSlider = $("#online-sfx-volume");
  const musicSlider = $("#online-music-volume");

  const updateSoundToggleUI = () => {
    if (!soundToggle) return;
    soundToggle.textContent = state.soundOn ? "🔊" : "🔇";
    soundToggle.classList.toggle("sound-off", !state.soundOn);
  };
  updateSoundToggleUI();

  if (sfxSlider) {
    sfxSlider.value = Math.round((state.soundVolume ?? 1) * 100);
    sfxSlider.addEventListener("input", () => {
      setSoundVolume(sfxSlider.value / 100);
    });
  }
  if (musicSlider) {
    musicSlider.value = Math.round((state.musicVolume ?? 0.5) * 100);
    musicSlider.addEventListener("input", () => {
      setMusicVolume(musicSlider.value / 100);
    });
  }
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      updateSoundToggleUI();
    });
  }

  // Pause menu buttons
  const pauseResume = $("#pause-resume");
  const pauseAbandonLocal = $("#pause-abandon-local");
  const pauseAbandonLobby = $("#pause-abandon-lobby");

  if (pauseResume) {
    pauseResume.addEventListener("click", () => {
      if (online.ws && online.ws.readyState === 1 && online.started) {
        online.ws.send(JSON.stringify({ type: "pause" }));
      }
    });
  }
  if (pauseAbandonLocal) {
    pauseAbandonLocal.addEventListener("click", () => {
      leaveRoom();
      const bg = $("#background");
      if (bg) bg.classList.remove("game-paused");
      hide($("#background"));
      hide($("#canvas_div"));
      document.body.classList.remove("online-active");
      document.body.classList.add("show-local-setup");
      document.body.classList.remove("show-online-setup");
      show($("#local-setup"));
      const dialog = $("#dialog-form");
      if (dialog) dialog.style.display = "block";
      const backdrop = $("#local-setup-backdrop");
      if (backdrop) backdrop.style.display = "block";
    });
  }
  if (pauseAbandonLobby) {
    pauseAbandonLobby.addEventListener("click", () => {
      leaveRoom();
      const bg = $("#background");
      if (bg) bg.classList.remove("game-paused");
      hide($("#background"));
      hide($("#canvas_div"));
      document.body.classList.add("show-online-setup");
      document.body.classList.remove("show-local-setup");
      show($("#online-setup"));
    });
  }

  bindOnlineKeys();
  bindMobileControls();
}
