"use strict";

import { bindUI } from "./ui.js";
import { bindOnline } from "./online.js";
import { initRenderer } from "./renderer.js";
import { soundSwitcher, pauseSwitcher } from "./sounds.js";
import { loadPartials } from "./partials.js";

// Expose for inline handlers
window.soundSwitcher = soundSwitcher;
window.pauseSwitcher = pauseSwitcher;

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  initRenderer();
  bindUI();
  bindOnline();
});

