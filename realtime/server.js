import http from "http";
import fs from "fs";
import path from "path";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

const server = http.createServer();
const wss = new WebSocketServer({ server });

const rooms = new Map(); // roomCode -> { players: Map<id, ws>, spectators: Map<id, ws>, hostId, state, inputs, ready, profiles, tickTimer }
const sessions = new Map(); // sessionId -> { clientId, roomCode, role, profile, lastSeen, chatTimestamps, chatMutedUntil }
let nextClientId = 1;

const TICK_RATE = 30;
const TICK_MS = 1000 / TICK_RATE;
const WORLD = { w: 640, h: 480 };
const COLORS = ["red", "blue", "green", "purple", "cyan", "yellow"];
const WORM_SIZE = 4;
const BORDER_SEPARATION = 100;
const HISTORY_LIMIT = 1000;
const MAX_PLAYERS = 6;
const HISTORY_FILE = path.join(process.cwd(), "match-history.json");

let matchHistory = [];
try {
  const raw = fs.readFileSync(HISTORY_FILE, "utf8");
  matchHistory = JSON.parse(raw);
} catch (e) {
  matchHistory = [];
}

function saveHistory() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(matchHistory.slice(-200), null, 2));
}

function makeRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function broadcast(roomCode, message, exceptId = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const payload = JSON.stringify(message);
  for (const [id, client] of room.players.entries()) {
    if (id === exceptId) continue;
    if (client.readyState === 1) client.send(payload);
  }
  for (const [id, client] of room.spectators.entries()) {
    if (id === exceptId) continue;
    if (client.readyState === 1) client.send(payload);
  }
}

function sendRoomState(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  ensureProfiles(room);
  const players = [];
  for (const [id] of room.players.entries()) {
    const profile = room.profiles?.get(id) || { name: `Player ${id}`, color: "#ffffff" };
    players.push({ id, ready: room.ready.get(id) || false, name: profile.name, color: profile.color, role: "player" });
  }
  for (const [id] of room.spectators.entries()) {
    const profile = room.profiles?.get(id) || { name: `Player ${id}`, color: "#ffffff" };
    players.push({ id, ready: false, name: profile.name, color: profile.color, role: "spectator" });
  }
  for (const [id, client] of room.players.entries()) {
    safeSend(client, {
      type: "room-state",
      players,
      selfReady: room.ready.get(id) || false,
      hostId: room.hostId,
      spectator: false,
      settings: room.state.settings,
    });
  }
  for (const [id, client] of room.spectators.entries()) {
    safeSend(client, {
      type: "room-state",
      players,
      selfReady: false,
      hostId: room.hostId,
      spectator: true,
      settings: room.state.settings,
    });
  }
}

function safeSend(ws, message) {
  if (ws.readyState === 1) ws.send(JSON.stringify(message));
}

function ensureProfiles(room) {
  if (!room.profiles) room.profiles = new Map();
}

function getRoomList() {
  const list = [];
  for (const [code, room] of rooms.entries()) {
    list.push({
      room: code,
      players: room.players.size,
      started: room.state.started,
      slots: MAX_PLAYERS,
    });
  }
  return list;
}

function findAutoJoinRoom() {
  for (const [code, room] of rooms.entries()) {
    if (room.state.started) continue;
    if (room.players.size >= MAX_PLAYERS) continue;
    return code;
  }
  return null;
}

function broadcastRoomList() {
  const list = getRoomList();
  const payload = JSON.stringify({ type: "room-list", rooms: list });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload);
  });
}

function makeSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function createInitialState() {
  return {
    started: false,
    worms: [],
    settings: {
      holePoints: "None",
      modalSpeed: "Normal",
      gapSpacing: "Normal",
      gapSizing: "Normal",
    },
    round: 0,
    maxScore: 0,
    winningWorm: "",
    lastUpdate: Date.now(),
  };
}

function startRoomTick(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.tickTimer) return;
  room.tickTimer = setInterval(() => tickRoom(roomCode), TICK_MS);
}

function stopRoomTick(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || !room.tickTimer) return;
  clearInterval(room.tickTimer);
  room.tickTimer = null;
}

function randomSpawn(room, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    let x = Math.floor(Math.random() * WORLD.w);
    let y = Math.floor(Math.random() * WORLD.h);
    if (x < BORDER_SEPARATION) x += BORDER_SEPARATION;
    if (x > (WORLD.w - BORDER_SEPARATION)) x -= BORDER_SEPARATION;
    if (y < BORDER_SEPARATION) y += BORDER_SEPARATION;
    if (y > (WORLD.h - BORDER_SEPARATION)) y -= BORDER_SEPARATION;
    const key = `${Math.round(x)}:${Math.round(y)}`;
    if (!room.occupied.has(key)) return { x, y };
  }
  return { x: BORDER_SEPARATION, y: BORDER_SEPARATION };
}

function initWorms(room) {
  const prevScores = new Map();
  for (const w of room.state.worms) {
    prevScores.set(w.id, w.score);
  }
  room.state.worms = [];
  let i = 0;
  room.occupied = new Set();
  for (const id of room.players.keys()) {
    const color = COLORS[i % COLORS.length];
    const spawn = randomSpawn(room);
    room.state.worms.push({
      id,
      color,
      x: spawn.x,
      y: spawn.y,
      angle: Math.random() * 360,
      speed: getStartingSpeed(room.state.settings),
      alive: true,
      playing: true,
      score: prevScores.get(id) ?? 0,
      length: 0,
      holeScore: 0,
      trail: [],
      holes: [],
    });
    i++;
  }
  room.state.round += 1;
}

function getStartingSpeed(settings) {
  if (settings.modalSpeed === "Slow") return 1.8;
  if (settings.modalSpeed === "Frantic") return 3.2;
  return 2.5;
}

function getGapSpacing(settings) {
  if (settings.gapSpacing === "Close") return 75;
  if (settings.gapSpacing === "Far Apart") return 125;
  return 100;
}

function getHoleSize(settings) {
  if (settings.gapSizing === "Small") return 10;
  if (settings.gapSizing === "Large") return 30;
  return 20;
}

function isHole(worm, settings) {
  const holeSize = getHoleSize(settings);
  const spaceBetweenHoles = getGapSpacing(settings);
  const mod = worm.length % (holeSize + spaceBetweenHoles);
  return mod <= holeSize;
}

function markOccupied(room, x, y) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  room.occupied.add(key);
}

function isOccupied(room, x, y) {
  const key = `${Math.round(x)}:${Math.round(y)}`;
  return room.occupied.has(key);
}

function isOccupiedNear(room, x, y, radius) {
  if (isOccupied(room, x, y)) return true;
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const angle = (Math.PI * 2 * i) / steps;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (isOccupied(room, px, py)) return true;
  }
  return false;
}

function getWormsAliveCount(room) {
  let alive = 0;
  for (const w of room.state.worms) if (w.playing && w.alive) alive++;
  return alive;
}

function addScoreToAlive(room) {
  for (const w of room.state.worms) if (w.playing && w.alive) w.score += 1;
}

function getScoreToWin(room) {
  let players = 0;
  for (const w of room.state.worms) if (w.playing) players++;
  return players * 10 - 10;
}

function computeWinningWorm(room) {
  let max = 0;
  let winner = "";
  let ties = 0;
  for (const w of room.state.worms) {
    if (w.playing && w.score >= max) {
      if (w.score > max) {
        max = w.score;
        winner = w.color;
        ties = 1;
      } else if (w.score === max) {
        ties += 1;
      }
    }
  }
  room.state.maxScore = max;
  room.state.winningWorm = ties > 1 ? "" : winner;
}

function tickRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || !room.state.started) return;

  let deathsThisTick = 0;

  for (const worm of room.state.worms) {
    if (!worm.playing || !worm.alive) continue;
    const input = room.inputs.get(worm.id) || { left: false, right: false };
    if (input.left) worm.angle -= 3;
    if (input.right) worm.angle += 3;

    const rad = (worm.angle * Math.PI) / 180;
    const nextX = worm.x + Math.cos(rad) * worm.speed;
    const nextY = worm.y + Math.sin(rad) * worm.speed;

    if (nextX + WORM_SIZE > WORLD.w || nextX - WORM_SIZE < 0 || nextY + WORM_SIZE > WORLD.h || nextY - WORM_SIZE < 0) {
      worm.alive = false;
      deathsThisTick += 1;
      continue;
    }

    if (isOccupiedNear(room, nextX, nextY, WORM_SIZE + 1)) {
      worm.alive = false;
      deathsThisTick += 1;
      continue;
    }

    worm.x = nextX;
    worm.y = nextY;

    const hole = isHole(worm, room.state.settings);
    worm.trail.unshift({ x: worm.x, y: worm.y, hole });
    worm.holes.unshift(hole);
    worm.length += 1;

    if (!hole) {
      markOccupied(room, worm.x, worm.y);
    } else if (room.state.settings.holePoints === "One") {
      worm.holeScore += 1;
      if (worm.holeScore > 3) {
        worm.holeScore = 0;
        worm.score += 1;
      }
    }

    if (worm.trail.length > HISTORY_LIMIT) {
      const tail = worm.trail.pop();
      if (tail && !tail.hole) {
        const key = `${Math.round(tail.x)}:${Math.round(tail.y)}`;
        room.occupied.delete(key);
      }
      worm.holes.pop();
    }
  }

  if (deathsThisTick > 0) {
    for (let i = 0; i < deathsThisTick; i++) addScoreToAlive(room);
    computeWinningWorm(room);
    broadcast(roomCode, {
      type: "score-update",
      players: room.state.worms.map((w) => ({
        id: w.id,
        score: w.score,
        playing: w.playing,
        alive: w.alive,
        color: w.color,
      })),
    });
  }

  const aliveCount = getWormsAliveCount(room);
  if (aliveCount < 2) {
    if (deathsThisTick === 0) {
      addScoreToAlive(room);
      computeWinningWorm(room);
    }
    const scoreToWin = getScoreToWin(room);
    if (room.state.maxScore >= scoreToWin) {
      room.state.started = false;
      stopRoomTick(roomCode);
      const summaryPlayers = room.state.worms.map((w) => ({
        id: w.id,
        color: w.color,
        score: w.score,
        name: room.profiles?.get(w.id)?.name || `Player ${w.id}`,
      }));
      const record = {
        room: roomCode,
        winner: room.state.winningWorm,
        maxScore: room.state.maxScore,
        round: room.state.round,
        players: room.state.worms.map((w) => ({ id: w.id, color: w.color, score: w.score })),
        timestamp: Date.now(),
      };
      matchHistory.push(record);
      saveHistory();
      broadcast(roomCode, {
        type: "match-over",
        winner: room.state.winningWorm,
        summary: {
          winner: room.state.winningWorm,
          maxScore: room.state.maxScore,
          players: summaryPlayers,
        },
      });
      broadcastRoomList();
    } else {
      initWorms(room);
    }
  }

  broadcast(roomCode, {
    type: "state",
    state: room.state,
    t: Date.now(),
  });
}

wss.on("connection", (ws) => {
  const clientId = nextClientId++;
  ws.clientId = clientId;
  ws.roomCode = null;
  ws.sessionId = makeSessionId();
  sessions.set(ws.sessionId, {
    clientId,
    roomCode: null,
    role: "player",
    profile: { name: `Player ${clientId}`, color: "#6de38c" },
    lastSeen: Date.now(),
    chatTimestamps: [],
    chatMutedUntil: 0,
  });

  safeSend(ws, { type: "hello", clientId, sessionId: ws.sessionId });
  safeSend(ws, { type: "room-list", rooms: getRoomList() });
  safeSend(ws, { type: "history", history: matchHistory.slice(-50) });

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch (e) {
      return safeSend(ws, { type: "error", message: "Invalid JSON" });
    }

    if (msg.type === "reconnect") {
      const sessionId = String(msg.sessionId || "");
      const session = sessions.get(sessionId);
      if (!session || !session.roomCode) return safeSend(ws, { type: "error", message: "Reconnect failed" });
      const room = rooms.get(session.roomCode);
      if (!room) return safeSend(ws, { type: "error", message: "Room not found" });

      ws.clientId = session.clientId;
      ws.roomCode = session.roomCode;
      ws.sessionId = sessionId;
      session.lastSeen = Date.now();

      if (session.role === "spectator") {
        ensureProfiles(room);
        room.spectators.set(ws.clientId, ws);
        room.profiles.set(ws.clientId, session.profile || { name: `Player ${ws.clientId}`, color: "#6de38c" });
        safeSend(ws, { type: "room-joined", room: ws.roomCode, host: false, reconnected: true, spectator: true });
      } else {
        ensureProfiles(room);
        room.players.set(ws.clientId, ws);
        room.ready.set(ws.clientId, room.ready.get(ws.clientId) || false);
        room.profiles.set(ws.clientId, session.profile || { name: `Player ${ws.clientId}`, color: "#6de38c" });
        safeSend(ws, { type: "room-joined", room: ws.roomCode, host: room.hostId === ws.clientId, reconnected: true, spectator: false });
      }
      safeSend(ws, { type: "state", state: room.state, t: Date.now() });
      sendRoomState(ws.roomCode);
      broadcastRoomList();
      return;
    }

    if (msg.type === "create") {
      let code = makeRoomCode();
      while (rooms.has(code)) code = makeRoomCode();
      rooms.set(code, {
        players: new Map([[clientId, ws]]),
        spectators: new Map(),
        hostId: clientId,
        state: createInitialState(),
        inputs: new Map(),
        ready: new Map([[clientId, false]]),
        profiles: new Map([[clientId, sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" }]]),
        tickTimer: null,
      });
      ws.roomCode = code;
      sessions.get(ws.sessionId).roomCode = code;
      sessions.get(ws.sessionId).role = "player";
      safeSend(ws, { type: "room-created", room: code, host: true, spectator: false });
        safeSend(ws, { type: "room-created", room: code, host: true, spectator: false, settings: rooms.get(code).state.settings });
      sendRoomState(code);
      return;
    }

    if (msg.type === "autojoin") {
      const existing = findAutoJoinRoom();
      if (!existing) {
        let code = makeRoomCode();
        while (rooms.has(code)) code = makeRoomCode();
        rooms.set(code, {
          players: new Map([[clientId, ws]]),
          spectators: new Map(),
          hostId: clientId,
          state: createInitialState(),
          inputs: new Map(),
          ready: new Map([[clientId, false]]),
          profiles: new Map([[clientId, sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" }]]),
          tickTimer: null,
        });
        ws.roomCode = code;
        sessions.get(ws.sessionId).roomCode = code;
        sessions.get(ws.sessionId).role = "player";
        broadcastRoomList();
        safeSend(ws, { type: "room-created", room: code, host: true, spectator: false });
          safeSend(ws, { type: "room-created", room: code, host: true, spectator: false, settings: rooms.get(code).state.settings });
        sendRoomState(code);
        return;
      }

      const room = rooms.get(existing);
      if (!room) return safeSend(ws, { type: "error", message: "Room not found" });
      ensureProfiles(room);
      room.players.set(clientId, ws);
      room.ready.set(clientId, false);
      room.profiles.set(clientId, sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" });
      ws.roomCode = existing;
      sessions.get(ws.sessionId).roomCode = existing;
      sessions.get(ws.sessionId).role = "player";
      safeSend(ws, { type: "room-joined", room: existing, host: room.hostId === clientId, spectator: false });
        safeSend(ws, { type: "room-joined", room: existing, host: room.hostId === clientId, spectator: false, settings: room.state.settings });
      safeSend(ws, { type: "state", state: room.state, t: Date.now() });
      broadcast(existing, { type: "player-joined", clientId }, clientId);
      broadcastRoomList();
      sendRoomState(existing);
      return;
    }

    if (msg.type === "join") {
      const code = String(msg.room || "").toUpperCase();
      const room = rooms.get(code);
      if (!room) return safeSend(ws, { type: "error", message: "Room not found" });
      if (room.players.size >= MAX_PLAYERS) {
        ensureProfiles(room);
        room.spectators.set(clientId, ws);
        room.profiles.set(clientId, sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" });
        ws.roomCode = code;
        sessions.get(ws.sessionId).roomCode = code;
        sessions.get(ws.sessionId).role = "spectator";
        safeSend(ws, { type: "room-joined", room: code, host: false, spectator: true });
          safeSend(ws, { type: "room-joined", room: code, host: false, spectator: true, settings: room.state.settings });
        safeSend(ws, { type: "state", state: room.state, t: Date.now() });
        sendRoomState(code);
        return;
      }
      room.players.set(clientId, ws);
      room.ready.set(clientId, false);
      ensureProfiles(room);
      room.profiles.set(clientId, sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" });
      ws.roomCode = code;
      sessions.get(ws.sessionId).roomCode = code;
      sessions.get(ws.sessionId).role = "player";
      safeSend(ws, { type: "room-joined", room: code, host: room.hostId === clientId, spectator: false });
        safeSend(ws, { type: "room-joined", room: code, host: room.hostId === clientId, spectator: false, settings: room.state.settings });
      safeSend(ws, { type: "state", state: room.state, t: Date.now() });
      broadcast(code, { type: "player-joined", clientId }, clientId);
      sendRoomState(code);
      return;
    }

    if (msg.type === "spectate") {
      const code = String(msg.room || "").toUpperCase();
      const room = rooms.get(code);
      if (!room) return safeSend(ws, { type: "error", message: "Room not found" });
      ensureProfiles(room);
      room.spectators.set(clientId, ws);
      room.profiles.set(clientId, sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" });
      ws.roomCode = code;
      sessions.get(ws.sessionId).roomCode = code;
      sessions.get(ws.sessionId).role = "spectator";
      safeSend(ws, { type: "room-joined", room: code, host: false, spectator: true });
        safeSend(ws, { type: "room-joined", room: code, host: false, spectator: true, settings: room.state.settings });
      safeSend(ws, { type: "state", state: room.state, t: Date.now() });
      sendRoomState(code);
      return;
    }

    if (msg.type === "leave") {
      return handleDisconnect(ws);
    }

    if (msg.type === "list-rooms") {
      return safeSend(ws, { type: "room-list", rooms: getRoomList() });
    }

    if (msg.type === "history") {
      return safeSend(ws, { type: "history", history: matchHistory.slice(-50) });
    }

    if (msg.type === "profile") {
      const name = String(msg.name || "Player").slice(0, 16);
      const color = String(msg.color || "#6de38c");
      const profile = { name, color };
      const session = sessions.get(ws.sessionId);
      if (session) session.profile = profile;
      if (ws.roomCode) {
        const room = rooms.get(ws.roomCode);
        if (room) {
          ensureProfiles(room);
          room.profiles.set(clientId, profile);
          sendRoomState(ws.roomCode);
        }
      }
      return;
    }

    if (msg.type === "input") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      if (!room.players.has(clientId)) return;
      if (!room.ready.get(clientId)) return;
      if (!room.state.started) return;
      room.inputs.set(clientId, msg.input || { left: false, right: false });
      return;
    }

    if (msg.type === "chat") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      const session = sessions.get(ws.sessionId);
      if (!session) return;
      const now = Date.now();
      if (now < session.chatMutedUntil) {
        return safeSend(ws, { type: "error", message: "Chat muted for spam" });
      }
      const text = String(msg.text || "").trim().slice(0, 140);
      if (!text) return;
      session.chatTimestamps = session.chatTimestamps.filter((t) => now - t < 5000);
      session.chatTimestamps.push(now);
      if (session.chatTimestamps.length > 6) {
        session.chatMutedUntil = now + 10000;
        return safeSend(ws, { type: "error", message: "Chat muted for 10s" });
      }
      const profile = room.profiles.get(clientId) || sessions.get(ws.sessionId)?.profile || { name: `Player ${clientId}`, color: "#6de38c" };
      broadcast(ws.roomCode, { type: "chat", text, name: profile.name, color: profile.color, t: Date.now() });
      return;
    }

    if (msg.type === "ready") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      if (!room.players.has(clientId)) return;
      room.ready.set(clientId, !!msg.ready);
      sendRoomState(ws.roomCode);
      return;
    }

    if (msg.type === "start") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== clientId) return;
      const players = Array.from(room.players.keys());
      const allReady = players.length > 0 && players.every((id) => room.ready.get(id));
      if (players.length < 2 || !allReady) {
        return safeSend(ws, { type: "error", message: "All players must be ready to start" });
      }
      room.state.settings = {
        holePoints: msg.settings?.holePoints || "None",
        modalSpeed: msg.settings?.modalSpeed || "Normal",
        gapSpacing: msg.settings?.gapSpacing || "Normal",
        gapSizing: msg.settings?.gapSizing || "Normal",
      };
      room.state.started = true;
      initWorms(room);
      startRoomTick(ws.roomCode);
      return broadcast(ws.roomCode, { type: "start" });
    }

    if (msg.type === "settings-update") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== clientId) return;
      if (room.state.started) return;
      room.state.settings = {
        holePoints: msg.settings?.holePoints || room.state.settings.holePoints || "None",
        modalSpeed: msg.settings?.modalSpeed || room.state.settings.modalSpeed || "Normal",
        gapSpacing: msg.settings?.gapSpacing || room.state.settings.gapSpacing || "Normal",
        gapSizing: msg.settings?.gapSizing || room.state.settings.gapSizing || "Normal",
      };
      broadcast(ws.roomCode, { type: "settings-update", settings: room.state.settings });
      sendRoomState(ws.roomCode);
      return;
    }

    if (msg.type === "settings-sync") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      return safeSend(ws, { type: "settings-update", settings: room.state.settings });
    }

    if (msg.type === "switch-role") {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      if (room.state.started) return;
      const desired = msg.role === "spectator" ? "spectator" : "player";
      if (desired === "spectator") {
        room.players.delete(clientId);
        room.ready.delete(clientId);
        room.inputs.delete(clientId);
        room.spectators.set(clientId, ws);
        sessions.get(ws.sessionId).role = "spectator";
      } else {
        if (room.players.size >= MAX_PLAYERS) {
          return safeSend(ws, { type: "error", message: "Room full" });
        }
        room.spectators.delete(clientId);
        room.players.set(clientId, ws);
        room.ready.set(clientId, false);
        sessions.get(ws.sessionId).role = "player";
      }
      sendRoomState(ws.roomCode);
      broadcastRoomList();
      return;
    }
  });

  ws.on("close", () => handleDisconnect(ws));
});

function handleDisconnect(ws) {
  const code = ws.roomCode;
  if (!code) return;
  const room = rooms.get(code);
  if (!room) return;
  room.players.delete(ws.clientId);
  room.inputs.delete(ws.clientId);
  room.ready.delete(ws.clientId);
  room.spectators.delete(ws.clientId);
  room.profiles.delete(ws.clientId);
  const session = sessions.get(ws.sessionId);
  if (session) session.lastSeen = Date.now();

  if (room.players.size === 0) {
    if (room.spectators.size === 0) {
      stopRoomTick(code);
      rooms.delete(code);
      broadcastRoomList();
      return;
    }
  }

  if (room.hostId === ws.clientId) {
    const [nextHostId] = room.players.keys();
    room.hostId = nextHostId;
    broadcast(code, { type: "host-changed", hostId: nextHostId });
  }

  broadcast(code, { type: "player-left", clientId: ws.clientId });
  broadcastRoomList();
  sendRoomState(code);
}

server.listen(PORT, () => {
  console.log(`Realtime server listening on :${PORT}`);
});
