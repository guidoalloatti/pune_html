"use strict";

export const $ = (sel, parent = document) => parent.querySelector(sel);
export const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

export const show = (el) => { if (el) el.style.display = ""; };
export const hide = (el) => { if (el) el.style.display = "none"; };
export const toggle = (el) => {
  if (!el) return;
  const isHidden = getComputedStyle(el).display === "none";
  el.style.display = isHidden ? "" : "none";
};
