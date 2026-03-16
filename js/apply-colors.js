// ═══════════════════════════════════════════════════════════════════
// apply-colors.js — Pushes color config into Three.js + CSS
// ═══════════════════════════════════════════════════════════════════

import { hexToInt, deriveEmissive, hexToRGBA } from './colors.js';

export function applyColors(c) {
  const g = window._game;
  if (!g) return;

  const root = document.documentElement.style;

  // CSS custom properties for score bar, status, threat bar
  root.setProperty('--c-player', c.player);
  root.setProperty('--c-cpu', c.cpu);
  root.setProperty('--c-win', c.win);
  root.setProperty('--c-player-dim', hexToRGBA(c.player, 0.6));
  root.setProperty('--c-cpu-dim', hexToRGBA(c.cpu, 0.6));

  // Player / CPU materials
  g.matX.color.setHex(hexToInt(c.player));
  g.matX.emissive.setHex(deriveEmissive(c.player, 0.47));
  g.matO.color.setHex(hexToInt(c.cpu));
  g.matO.emissive.setHex(deriveEmissive(c.cpu, 0.5));

  // Empty cell material
  const cellInt = hexToInt(c.cell);
  g.matEmpty.color.setHex(cellInt);
  g.matEmpty.specular.setHex(deriveEmissive(c.cell, 3.0));

  // Cell edge outlines
  const edgeColor = deriveEmissive(c.cell, 4.0);
  const meshes = g.cellMeshes;
  if (meshes) {
    for (const m of meshes) {
      if (!m) continue;
      const edges = m.children[0];
      if (edges && edges.material) edges.material.color.setHex(edgeColor);
    }
  }

  // Point lights
  g.ptX.color.setHex(hexToInt(c.player));
  g.ptO.color.setHex(hexToInt(c.cpu));
  g.ptW.color.setHex(hexToInt(c.win));

  // Background
  g.renderer.setClearColor(hexToInt(c.bg));

  // Store for runtime use by game functions (makeX, drawCompletedLine, etc.)
  window._colors = c;
}
