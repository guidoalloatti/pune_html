"use strict";

import { $ } from "./dom.js";

const logs = [];

function formatTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function logEvent({ actor = "System", action = "", detail = "" }) {
  const entry = {
    time: new Date(),
    actor,
    action,
    detail,
  };
  logs.push(entry);
  updateLogUI();
}

export function getLogs() {
  return logs.slice();
}

export function updateLogUI() {
  const list = $("#log-list");
  if (!list) return;
  list.innerHTML = "";
  logs.slice().reverse().forEach((entry) => {
    const row = document.createElement("div");
    row.className = "log-row";

    const time = document.createElement("span");
    time.className = "log-time";
    time.textContent = formatTime(entry.time);

    const action = document.createElement("span");
    action.className = "log-action";
    action.textContent = entry.action || "Event";

    const actor = document.createElement("span");
    actor.className = "log-actor";
    actor.textContent = entry.actor || "System";

    const detail = document.createElement("span");
    detail.className = "log-detail";
    detail.textContent = entry.detail || "";

    row.appendChild(time);
    row.appendChild(action);
    row.appendChild(actor);
    row.appendChild(detail);
    list.appendChild(row);
  });

  const raw = $("#log");
  if (raw) {
    raw.textContent = logs
      .slice()
      .reverse()
      .map((entry) => `${formatTime(entry.time)} | ${entry.actor} | ${entry.action} ${entry.detail ? "- " + entry.detail : ""}`)
      .join("\n");
  }
}
