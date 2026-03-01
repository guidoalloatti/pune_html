"use strict";

import { $, show, hide } from "./dom.js";
import { lockModeSelection, showMatchSummary, hideMatchSummary } from "./ui.js";
import { renderOnlineWorms } from "./renderer.js";

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
  settingsSectionEl: null,
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

function setOnlineStatus(text) {
  if (online.statusEl) online.statusEl.textContent = text;
}

function updateHostControls() {
  if (online.settingsSectionEl) {
    online.settingsSectionEl.style.display = online.isHost ? "block" : "none";
  }
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
  };

  online.ws.onclose = function () {
    setOnlineStatus(online.connectedOnce ? "Disconnected" : "Disconnected (server offline)");
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
      updateHostControls();
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
      updateHostControls();
    }

    if (msg.type === "start") {
      online.started = true;
      setOnlineStatus("Game started");
      hideMatchSummary();
      lockModeSelection(true);
      document.dispatchEvent(new Event("pune-online-game-start"));
      hide($("#start-body"));
      hide($(".demo"));
      hide($("#online-setup"));
      show($("#canvas_div"));
      show($("#background"));
    }

    if (msg.type === "match-over") {
      online.started = false;
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
    }

    if (msg.type === "room-list") renderRoomList(msg.rooms || []);
    if (msg.type === "history") renderHistory(msg.history || []);
    if (msg.type === "room-state") {
      online.spectator = !!msg.spectator;
      renderPlayers(msg.players || [], msg.selfReady, msg.hostId);
      updateRoleToggle();
      updateHostControls();
    }

    if (msg.type === "host-changed") {
      online.isHost = msg.hostId === online.clientId;
      updateStartButton();
      updateHostControls();
    }

    if (msg.type === "state") {
      online.state = msg.state;
      online.lastSettings = msg.state?.settings || online.lastSettings;
      renderOnline();
    }

    if (msg.type === "chat") {
      appendChatMessage(msg);
    }

    if (msg.type === "error") setOnlineStatus(msg.message || "Error");
  };
}

function createRoom() {
  connectOnline();
  if (!online.ws) return;
  online.ws.send(JSON.stringify({ type: "create" }));
}

function joinRoom() {
  connectOnline();
  let code = $("#room-code").value || "";
  code = code.toUpperCase().trim();
  if (!code) return setOnlineStatus("Enter a room code");
  online.ws.send(JSON.stringify({ type: "join", room: code }));
}

function autoJoinRoom() {
  connectOnline();
  if (!online.ws) return;
  setOnlineStatus("Autojoining...");
  online.ws.send(JSON.stringify({ type: "autojoin" }));
}

function startOnlineGame() {
  if (!online.ws || !online.isHost || !online.canStart) return;
  const settings = {
    holePoints: $("#online_hole_points").value || $("#hole_points").value || "None",
    modalSpeed: $("#online_speed").value || $("#modal_speed").value || "Normal",
    gapSpacing: $("#online_gap_spacing").value || $("#gap_spacing").value || "Normal",
    gapSizing: $("#online_gap_sizing").value || $("#gap_sizing").value || "Normal",
  };
  online.lastSettings = settings;
  online.ws.send(JSON.stringify({ type: "start", settings }));
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
  renderOnlineWorms(online.state.worms || []);
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
  const allReady = players.length > 0 && players.every((p) => p.ready);
  online.canStart = online.isHost && allReady && players.length >= 2;
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
  online.startBtn.disabled = !online.canStart || online.spectator;
}

function appendChatMessage(msg) {
  if (!online.chatLogEl) return;
  const row = document.createElement("div");
  const name = msg.name || "Player";
  const color = msg.color || "#ffffff";
  const nameSpan = document.createElement("span");
  nameSpan.style.color = color;
  nameSpan.textContent = name;
  const textSpan = document.createElement("span");
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
}

function bindOnlineKeys() {
  document.addEventListener("keydown", (event) => {
    if (!online.active) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
    const code = event.keyCode;
    if (code === 37 || code === 65) online.input.left = true;
    if (code === 39 || code === 68) online.input.right = true;
    sendInput();
    event.preventDefault();
  });
  document.addEventListener("keyup", (event) => {
    if (!online.active) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
    const code = event.keyCode;
    if (code === 37 || code === 65) online.input.left = false;
    if (code === 39 || code === 68) online.input.right = false;
    sendInput();
    event.preventDefault();
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
  online.leaveBtn = $("#leave-room");
  online.settingsSectionEl = $(".online-settings");

  const createRoomBtn = $("#create-room-btn");
  const joinRoomBtn = $("#join-room-btn");
  const startOnlineBtn = online.startBtn;
  const autojoinBtn = $("#autojoin-room-btn");
  const refreshRooms = $("#refresh-rooms-btn");
  const refreshHistory = $("#refresh-history-btn");

  if (createRoomBtn) createRoomBtn.addEventListener("click", createRoom);
  if (joinRoomBtn) joinRoomBtn.addEventListener("click", joinRoom);
  if (startOnlineBtn) startOnlineBtn.addEventListener("click", startOnlineGame);
  if (autojoinBtn) autojoinBtn.addEventListener("click", autoJoinRoom);
  if (online.readyBtn) online.readyBtn.addEventListener("click", toggleReady);
  if (online.roleToggleEl) online.roleToggleEl.addEventListener("click", toggleRole);
  if (refreshRooms) refreshRooms.addEventListener("click", () => online.ws?.send(JSON.stringify({ type: "list-rooms" })));
  if (refreshHistory) refreshHistory.addEventListener("click", () => online.ws?.send(JSON.stringify({ type: "history" })));

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
  if (online.chatSendEl) online.chatSendEl.addEventListener("click", sendChat);
  if (online.leaveBtn) online.leaveBtn.addEventListener("click", leaveRoom);
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

  document.addEventListener("pune-online-rematch", rematchOnline);

  bindOnlineKeys();
  bindMobileControls();
}
