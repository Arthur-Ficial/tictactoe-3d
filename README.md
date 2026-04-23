# 3D Tic-Tac-Toe

Browser-based 3x3x3 tic-tac-toe with a blocked center cell, multiple display themes, a normal heuristic CPU, and a super-hard worker-backed solver.

## Scripts

- `npm run build`
  Updates cache-busting `?v=<git-hash>` query params for local scripts and static ES module imports.
- `npm run deploy`
  Runs the build step, commits the stamped asset references, and pushes `gh-pages`.

## Runtime Layout

- `index.html`
  App shell, inline game runtime, rendering loop, and the `window._game` bridge consumed by the module-based settings/theme layer.
- `js/main.js`
  Startup orchestration. Loads persisted settings, applies them to the live game, and wires the settings UI callbacks.
- `js/app-settings.js`
  Single source of truth for storage keys, defaults, supported values, and normalization helpers.
- `js/settings-ui.js`
  Settings overlay UI for themes, difficulty, game mode, first move, and per-turn timer.
- `js/themes.js`
  Theme catalog used by both the UI and runtime theme application.
- `js/apply-theme.js`
  Applies a selected theme to CSS variables and the live Three.js materials/lights through `window._game`.
- `js/game-modes.js`
  Global helpers for display labels and mode-dependent behavior decisions used by the inline runtime.
- `js/cpu-normal.js`
  Pure heuristic CPU for normal difficulty, exposed through `window.TTT3DCPU.getNormalCpuMove(...)`.
- `js/cpu-super-hard.js`
  Worker wrapper for the super-hard solver lifecycle and request tracking.
- `js/cpu-super-hard-worker.js`
  Iterative-deepening solver that evaluates super-hard CPU turns off the main thread.
- `js/shot-clock.js`
  Small countdown controller used by the per-turn timer UI/runtime.

## Cleanup Boundaries

- Settings persistence is intentionally isolated from gameplay logic so UI changes do not leak storage concerns into the renderer/runtime.
- `RESET ALL` removes only this app's storage keys. It does not wipe unrelated origin storage.
- Build-time cache busting now covers both `index.html` script tags and static ES module imports under `js/`.
- Startup accepts simple hash-based mode overrides for testing:
  `#pvp`, `#player-vs-player`, `#pvc`, `#player-vs-cpu`, `#cvc`, `#cpu-vs-cpu`.

## Next Refactor Candidate

The largest remaining structural debt is the inline runtime in `index.html`. It works, but the next major cleanup should extract the game loop, board construction, and UI update logic into dedicated runtime files without changing behavior.
