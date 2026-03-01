"use strict";

import { $ } from "./dom.js";

export function addMessage(message, id) {
  let text = message;
  switch (id) {
    case "speed":
      text = "Current speed is: " + message;
      break;
    case "rounds":
      text = "Current round is: " + message;
      break;
    case "longest":
      text = "Longest color: " + message;
      break;
    case "longest_size":
      text = "Longest size: " + message;
      break;
    default:
      text = "Wrong message type...";
      break;
  }
  const el = $("#" + id);
  if (el) el.textContent = text;
}
