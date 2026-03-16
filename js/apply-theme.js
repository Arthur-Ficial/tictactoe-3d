// ═══════════════════════════════════════════════════════════════════
// apply-theme.js — Pushes theme colors into CSS vars + C + Three.js
// ═══════════════════════════════════════════════════════════════════

export function applyTheme(theme) {
  const g = window._game;
  if (!g) return;

  const root = document.documentElement.style;

  // 1. Mutate C palette in place
  for (const k in theme.js) g.C[k] = theme.js[k];

  // 2. Set CSS custom properties
  for (const k in theme.css) root.setProperty('--' + k, theme.css[k]);

  // 3. Update shared materials
  setMat(g.matX, g.C.PLAYER, g.C.PLAYER_EM, g.C.WHITE);
  setMat(g.matO, g.C.CPU, g.C.CPU_EM, g.C.CPU_SPEC);
  setMat(g.matEmpty, g.C.CELL, null, g.C.CELL_SPEC);
  setMat(g.matHover, g.C.HOVER, g.C.HOVER_EM, g.C.HOVER_SPEC);

  // 4. Update lights
  g.ptX.color.setHex(g.C.PLAYER);
  g.ptO.color.setHex(g.C.CPU);
  g.ptW.color.setHex(g.C.WIN);
  g.ptAI.color.setHex(g.C.CPU);

  // Adjust sun intensity for light vs dark backgrounds
  const bgBrightness = ((g.C.BG >> 16) & 0xff) + ((g.C.BG >> 8) & 0xff) + (g.C.BG & 0xff);
  g.sun.intensity = bgBrightness > 200 ? 1.2 : 2.5;

  // 5. Renderer background
  g.renderer.setClearColor(g.C.BG);

  // 6. Cell edges + existing markers
  const meshes = g.cellMeshes;
  const board = g.board;
  if (meshes) {
    for (let i = 0; i < meshes.length; i++) {
      const m = meshes[i];
      if (!m) continue;

      // Force all non-taken cells back to updated matEmpty
      if (!m.userData.taken) {
        m.material = g.matEmpty;
        m.material.needsUpdate = true;
      }
      // Also reset taken cells to correct material
      if (m.userData.taken) {
        m.material = board[i] === 'X' ? g.matX : g.matO;
        m.material.needsUpdate = true;
      }

      for (const child of m.children) {
        if (child.isLineSegments) {
          child.material.color.setHex(g.C.CELL_EDGE);
          child.material.needsUpdate = true;
        }
        if (child.isGroup) {
          const isPlayer = board[i] === 'X';
          const base = isPlayer ? g.C.PLAYER : g.C.CPU;
          const mkEm = isPlayer ? g.C.PLAYER_MK_EM : g.C.CPU_MK_EM;
          child.traverse(c => {
            if (!c.material) return;
            c.material.color.setHex(base);
            if (c.material.emissive) {
              c.material.emissive.setHex(c.material.transparent ? base : mkEm);
            }
            c.material.needsUpdate = true;
          });
        }
      }
    }
  }

  // 7. Rebuild all line tubes with new colors
  if (g.rebuildTubes) g.rebuildTubes();

  // 8. Meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = '#' + g.C.BG.toString(16).padStart(6, '0');
}

function setMat(mat, color, emissive, specular) {
  mat.color.setHex(color);
  if (emissive !== null && mat.emissive) mat.emissive.setHex(emissive);
  if (specular && mat.specular) mat.specular.setHex(specular);
  mat.needsUpdate = true;
}
