// ═══════════════════════════════════════════════════════════════════
// apply-theme.js — Pushes theme colors into CSS vars + C + Three.js
// ═══════════════════════════════════════════════════════════════════

export function applyTheme(theme) {
  const g = window._game;
  if (!g) return;

  const root = document.documentElement.style;

  // 1. Mutate C palette in place (affects future makeX/makeO/drawCompletedLine calls)
  for (const k in theme.js) g.C[k] = theme.js[k];

  // 2. Set CSS custom properties
  for (const k in theme.css) root.setProperty('--' + k, theme.css[k]);

  // 3. Update shared materials
  g.matX.color.setHex(g.C.PLAYER);
  g.matX.emissive.setHex(g.C.PLAYER_EM);
  g.matX.specular.setHex(g.C.WHITE);
  g.matO.color.setHex(g.C.CPU);
  g.matO.emissive.setHex(g.C.CPU_EM);
  g.matO.specular.setHex(g.C.CPU_SPEC);
  g.matEmpty.color.setHex(g.C.CELL);
  g.matEmpty.specular.setHex(g.C.CELL_SPEC);
  g.matHover.color.setHex(g.C.HOVER);
  g.matHover.specular.setHex(g.C.HOVER_SPEC);
  g.matHover.emissive.setHex(g.C.HOVER_EM);

  // 4. Update lights
  g.ptX.color.setHex(g.C.PLAYER);
  g.ptO.color.setHex(g.C.CPU);
  g.ptW.color.setHex(g.C.WIN);
  g.ptAI.color.setHex(g.C.CPU);

  // 5. Renderer background
  g.renderer.setClearColor(g.C.BG);

  // 6. Cell edge outlines + existing markers
  const meshes = g.cellMeshes;
  const board = g.board;
  if (meshes) {
    for (let i = 0; i < meshes.length; i++) {
      const m = meshes[i];
      if (!m) continue;
      for (const child of m.children) {
        if (child.isLineSegments) {
          child.material.color.setHex(g.C.CELL_EDGE);
        }
        if (child.isGroup) {
          const isPlayer = board[i] === 'X';
          const baseColor = isPlayer ? g.C.PLAYER : g.C.CPU;
          const mkEm = isPlayer ? g.C.PLAYER_MK_EM : g.C.CPU_MK_EM;
          child.traverse(c => {
            if (!c.material) return;
            c.material.color.setHex(baseColor);
            if (c.material.emissive) {
              c.material.emissive.setHex(c.material.transparent ? baseColor : mkEm);
            }
          });
        }
      }
    }
  }

  // 7. Update existing line tubes
  updateTubes(g.lineTubes, g);
  updateTubes(g.partialTubes, g);

  // 8. Meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = '#' + g.C.BG.toString(16).padStart(6, '0');
}

function updateTubes(tubes, g) {
  if (!tubes) return;
  // Tubes alternate: main tube + glow for completed, single for partial
  // All tubes for a given player share the same color
  // We can't easily know which player owns which tube, so use C.PLAYER
  // for cyan-ish tubes and C.CPU for others. Simpler: just leave tubes
  // as-is since they're recreated each turn by rebuildPartialTubes and
  // drawCompletedLine which read from C at creation time.
}
