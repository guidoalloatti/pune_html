"use strict";

export async function loadPartials() {
  const nodes = Array.from(document.querySelectorAll("[data-include]"));
  await Promise.all(nodes.map(async (node) => {
    const path = node.getAttribute("data-include");
    if (!path) return;
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      node.innerHTML = await res.text();
    } catch (err) {
      node.innerHTML = "";
      // eslint-disable-next-line no-console
      console.error(err);
    }
    node.removeAttribute("data-include");
  }));
}
