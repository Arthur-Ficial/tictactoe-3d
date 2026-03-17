# Ticket 004: Add 4×4×4 Board Mode As Settings Toggle

## Type
Feature ticket

## Goal
Add a board-size toggle to the settings panel — below the existing difficulty control — that switches between the current 3×3×3 game and a new 4×4×4 game mode.

The 4×4×4 mode follows the same design principles as 3×3×3:
- Lines of **4** instead of 3
- The **2×2×2 center core** (8 cells) is blocked from play, mirroring the blocked center cell in 3×3×3
- Game continues until the board is full; winner has more completed lines
- All win lines touching any blocked cell are filtered out

## Key Numbers

| Metric | 3×3×3 | 4×4×4 |
|--------|-------|-------|
| Total cells | 27 | 64 |
| Blocked cells | 1 (center) | 8 (2×2×2 core) |
| Playable cells | 26 | 56 |
| Raw win lines | 49 | 76 |
| Blocked lines | 13 | 28 |
| Valid win lines | 36 | 48 |
| Space diagonals | 0 (all blocked) | 0 (all blocked) |
| Line length | 3 | 4 |
| Moves per player | 13 | 28 |
| Lines per cell (avg) | 1.38 | 0.86 |

### Blocked Cells in 4×4×4
Using coordinates `(x, y, z)` where `x, y, z ∈ {0, 1, 2, 3}`, the blocked cells are those with all three coordinates in `{1, 2}`:

`(1,1,1)`, `(1,1,2)`, `(1,2,1)`, `(1,2,2)`, `(2,1,1)`, `(2,1,2)`, `(2,2,1)`, `(2,2,2)`

Using flat index `I(x,y,z) = z*16 + y*4 + x`:
indices `21, 22, 25, 26, 37, 38, 41, 42`

### Cell Value Tiers in 4×4×4 (after blocking)
| Cell Type | Count | Lines/Cell | Description |
|-----------|-------|------------|-------------|
| Corner | 8 | 6 | 3 axis + 3 face diags |
| Face | 24 | 3 | 2 axis + 1 face diag |
| Edge | 24 | 3 | 3 axis only |
| Blocked | 8 | — | 2×2×2 center core |

### Win Line Breakdown in 4×4×4 (after blocking)
| Line Type | Raw | Valid | Eliminated |
|-----------|-----|-------|------------|
| Axis-aligned | 48 | 36 | 12 (pass through center core) |
| Face diagonals | 24 | 12 | 12 (pass through center core) |
| Space diagonals | 4 | 0 | 4 (all pass through center core) |
| **Total** | **76** | **48** | **28** |

## Current State
- Board size is hardcoded to 3×3×3 throughout:
  - `index.html:248-250`: `SP=2.0, CS=1.25, CENTER=13`
  - `index.html:252-254`: `cellPos` uses `i%3`, `Math.floor(i/3)%3`, `Math.floor(i/9)`
  - `index.html:258`: index function `I = (x,y,z) => z*9+y*3+x`
  - `index.html:259-283`: raw win-line generation loops `0..2` for 3×3×3
  - `index.html:284`: `WINS` filters lines touching single `CENTER` index
  - `index.html:304`: `board` is `Array(27)`
  - `index.html:322-324`: `isFull` checks 27 cells against single `CENTER`
  - `index.html:366`: `sharedGeo` box geometry sized for 3×3×3
  - `index.html:401-418`: `buildBoard` loops `0..26` with single `CENTER` skip
- CPU solvers receive `wins`, `center`, `board` from the game:
  - `index.html:645-658`: `getCpuMove` passes `WINS`, `CENTER`, board snapshot
  - `js/cpu-normal.js:10`: accepts `config.center` as single integer
  - `js/cpu-super-hard-worker.js:73-83`: `initSolver` builds bit indices skipping single `center`
  - `js/cpu-super-hard-worker.js:76`: `boardToBit` hardcoded to `Int8Array(27)`
  - `js/cpu-super-hard-worker.js:85`: `bitMasks` uses `1 << idx` (max 26 bits, fits 32-bit int)
  - `js/cpu-super-hard-worker.js:339`: `boardToMasks` validates `board.length !== 27`
- Settings UI has theme + difficulty:
  - `js/settings-ui.js:221-230`: difficulty toggle appended after spacer in `#theme-grid`
  - `js/main.js:10`: `DIFFICULTY_KEY = 'ttt3d-difficulty'`
- `window._game` bridge at `index.html:1379-1404` exposes board state, difficulty, and newGame

## Architecture Requirement: Modular Board Configuration

**This feature MUST be implemented as a modular board configuration system, not as a fork of the existing code.**

All board-size-dependent values must be derived from a single board configuration object. No hardcoded `3`, `27`, `13`, `9`, or `49` constants may remain in game logic. The board config is the single source of truth.

### Board Config Shape
```javascript
{
  size: 3 | 4,                    // board dimension
  cellCount: 27 | 64,             // size³
  blockedCells: [13] | [21,22,25,26,37,38,41,42],  // Set for O(1) lookup
  lineLength: 3 | 4,              // = size
  playableCells: 26 | 56,         // cellCount - blockedCells.length
  spacing: 2.0 | 1.6,             // cell spacing (adjusted for 4×4×4 to fit camera)
  cellSize: 1.25 | 0.95,          // cell geometry size (smaller for 4×4×4)
  cameraDistance: 9.5 | 14.0,     // default camera radius
}
```

### New File: `js/board-config.js`
- Exports `getBoardConfig(size)` → returns the config object above
- Exports `generateWinLines(config)` → returns array of valid win lines
- Exports `cellPosition(index, config)` → returns `THREE.Vector3` for cell placement
- Exports `indexFromCoords(x, y, z, config)` → flat index
- Exports `isBlocked(index, config)` → boolean
- Contains all board math. No other file computes board geometry.

### Refactor Targets
Every reference to board size must route through the config:

| Current hardcoded | Replace with |
|-------------------|-------------|
| `CENTER=13` | `config.blockedCells` (array/Set) |
| `Array(27)` | `Array(config.cellCount)` |
| `i%3`, `i/3`, `i/9` | `cellPosition(i, config)` |
| `z*9+y*3+x` | `indexFromCoords(x, y, z, config)` |
| `for(a=0;a<3;a++)` in win-line gen | `for(a=0;a<config.size;a++)` |
| `board.length !== 27` in worker | `board.length !== config.cellCount` |
| `Int8Array(27)` in worker | `Int8Array(config.cellCount)` |
| `1 << idx` (max 26 bits) | see Bitmask section below |
| `SP=2.0, CS=1.25` | `config.spacing, config.cellSize` |
| `sph.r=9.5` | `config.cameraDistance` |
| `isFull` checking single `CENTER` | `isFull` checking `config.blockedCells` |
| `isPlayable` comparing `i !== CENTER` | `isPlayable` using `config.isBlocked(i)` |

## Win-Line Generation for 4×4×4
Generalize the existing win-line generator at `index.html:259-283` to work with any size `N`:

```javascript
function generateRawLines(N) {
  const I = (x,y,z) => z*N*N + y*N + x;
  const lines = [];
  // Axis-aligned: N² lines per axis × 3 axes
  for (let a = 0; a < N; a++)
    for (let b = 0; b < N; b++) {
      lines.push(Array.from({length: N}, (_, k) => I(k, a, b)));
      lines.push(Array.from({length: N}, (_, k) => I(a, k, b)));
      lines.push(Array.from({length: N}, (_, k) => I(a, b, k)));
    }
  // Face diagonals: 2 per plane × N planes × 3 orientations
  for (let c = 0; c < N; c++) {
    lines.push(Array.from({length: N}, (_, k) => I(k, k, c)));
    lines.push(Array.from({length: N}, (_, k) => I(N-1-k, k, c)));
    lines.push(Array.from({length: N}, (_, k) => I(k, c, k)));
    lines.push(Array.from({length: N}, (_, k) => I(N-1-k, c, k)));
    lines.push(Array.from({length: N}, (_, k) => I(c, k, k)));
    lines.push(Array.from({length: N}, (_, k) => I(c, N-1-k, k)));
  }
  // Space diagonals: 4
  lines.push(Array.from({length: N}, (_, k) => I(k, k, k)));
  lines.push(Array.from({length: N}, (_, k) => I(N-1-k, k, k)));
  lines.push(Array.from({length: N}, (_, k) => I(k, N-1-k, k)));
  lines.push(Array.from({length: N}, (_, k) => I(N-1-k, N-1-k, k)));
  return lines;
}
```

Then filter: `rawLines.filter(line => !line.some(i => blockedCells.has(i)))`

## UI Placement Spec

### Location
- Add the board-size toggle **below the difficulty toggle** in `#theme-grid`
- Use the same styling pattern as the difficulty toggle
- No additional spacer needed — it sits directly below difficulty

### Required Visual Structure
- Section label: `Board`
- Single toggle button, same style as `#difficulty-toggle`
- Text shows exactly one of:
  - `Board: 3×3×3`
  - `Board: 4×4×4`

### Interaction
- Tapping flips between the two sizes
- Changing board size **starts a new game immediately** (unlike difficulty, which takes effect on next CPU move)
- The board, geometry, win lines, camera, and AI solver must all reinitialize for the new size

## Persistence Spec

### Storage Key
- `ttt3d-board-size` — stores `'3'` or `'4'`

### Default
- If no value exists, use `'3'` (current 3×3×3)

### Reset Behavior
- `RESET ALL` must restore board size to `'3'`
- Add `ttt3d-board-size` to the targeted key removal list alongside `ttt3d-theme` and `ttt3d-difficulty`

## Interface Changes

### `js/main.js`
- Add `BOARD_SIZE_KEY = 'ttt3d-board-size'`
- Load saved board size on startup
- Pass `boardSize` and `onBoardSizeChange` to `initUI`
- `onBoardSizeChange` must:
  - persist to localStorage
  - call `window._game.setBoardSize(size)` which triggers full reinitialization

### `js/settings-ui.js`
- Add `activeBoardSize` to local state (alongside `activeId` and `activeDifficulty`)
- Build board-size toggle button below difficulty toggle
- On toggle: call `config.onBoardSizeChange(newSize)`

### Game Runtime Bridge (`window._game`)
- Add `setBoardSize(size)` — reinitializes everything: config, board array, win lines, geometry, camera, AI solver
- Add `getBoardSize()` — returns current size

## CPU Solver Adaptation

### Normal CPU (`js/cpu-normal.js`)
- Already receives `wins`, `center`, `board` via config — these just need to carry the correct values for the active board size
- Change `center` parameter to `blockedCells` (array) and update `isPlayable` to check against the array/Set
- No algorithmic changes needed — heuristic evaluation works the same with more cells and longer lines

### Super Hard CPU (`js/cpu-super-hard-worker.js`)
- **Critical: bitmask overflow.** 56 playable cells exceeds 32-bit integer capacity.
- **Required approach for 4×4×4:** Use two 32-bit integers (`maskHigh`, `maskLow`) or switch to `BigInt`
  - Two 32-bit ints: split playable cells into two groups of 28, use separate masks. Faster but more complex code.
  - `BigInt`: simpler code, slower (~5-10× for bit operations). May be acceptable since the solver will be heuristic-bounded anyway.
  - **Recommended:** `BigInt` for simplicity. The 4×4×4 solver cannot achieve perfect play regardless, so raw bit-trick speed is less critical.
- **`initSolver` must accept variable board size**: replace `Int8Array(27)` with `Int8Array(config.cellCount)`, accept `blockedCells` array instead of single `center`
- **Iterative deepening depth limit**: for 4×4×4, the solver will not reach full depth in 2.5s. This is acceptable — it already handles time-limited search with `searchAborted`. The heuristic evaluation at `evaluate()` must adapt line-completion checks from `=== 3` to `=== config.lineLength`.
- **Symmetry reduction**: the 24 cube rotations remain valid for 4×4×4. The `buildRotationBitValues` function must generalize from `-1,0,1` coordinates to `0,1,2,3` mapped to `-1.5,-0.5,0.5,1.5` (centered).
- **Worker protocol**: add `boardSize` (or full config) to the `init` message

## 3D Rendering Adaptation

### Cell Geometry
- 4×4×4 needs smaller cells and tighter spacing to keep the board visually manageable
- Recommended: `spacing: 1.6`, `cellSize: 0.95` (vs `2.0` and `1.25` for 3×3×3)
- `sharedGeo` and `sharedEdgeGeo` must be rebuilt when board size changes

### Cell Position
- 3×3×3: `(x-1)*SP` centers on `-1, 0, 1`
- 4×4×4: `(x-1.5)*SP` centers on `-1.5, -0.5, 0.5, 1.5`
- General: `(coord - (size-1)/2) * spacing`

### Camera
- 4×4×4 board is physically larger → default camera distance increases from `9.5` to `~14.0`
- Zoom bounds should scale proportionally: `ZOOM_MIN` from `4` to `~6`, `ZOOM_MAX` from `20` to `~28`

### Markers
- X markers (crossed cylinders) and O markers (torus) may need to scale down slightly for 4×4×4 to fit the smaller cells
- Marker dimensions should derive from `config.cellSize`

### Blocked Cell Rendering
- In 3×3×3, the single blocked center cell is simply skipped (no mesh at all)
- In 4×4×4, the 8 blocked cells should also be skipped — no mesh, no edge outline, empty space in the center of the cube
- This naturally creates a visible "hollow core" that communicates the blocked region

### buildBoard Loop
- Change `for(let i=0; i<27; i++)` to `for(let i=0; i<config.cellCount; i++)`
- Change `if(i === CENTER)` to `if(config.blockedCells.has(i))`

## Score Display & Share
- Score bar, delta bar, threat bar work unchanged — they read from `scores` object
- Share text remains the same format: `"I just won/lost X to Y!"`
- The share message should include which board size was played: `"3D Tic-Tac-Toe (4×4×4)"`

## Performance Considerations
- 56 cells × (mesh + edge outline + potential marker) ≈ 168 objects vs ~78 for 3×3×3
- Three.js handles this fine on desktop; mobile should be tested
- If mobile frame rate drops, consider reducing edge-outline detail for 4×4×4 only
- The hollow 2×2×2 center saves 8 cells of geometry

## File Changes Summary

| File | Change |
|------|--------|
| **`js/board-config.js`** | **NEW** — board config factory, win-line generator, coordinate math |
| `index.html` | Replace all hardcoded board constants with config lookups; generalize loops; rebuild geometry on size change |
| `js/settings-ui.js` | Add board-size toggle below difficulty |
| `js/main.js` | Add board-size persistence and `onBoardSizeChange` callback |
| `js/cpu-normal.js` | Change `center` to `blockedCells` array |
| `js/cpu-super-hard.js` | Pass board config to worker init |
| `js/cpu-super-hard-worker.js` | Generalize bitmasks (BigInt or dual-32), variable board size, variable line length |

## Acceptance Criteria
- On first load, game plays as current 3×3×3 — no behavior change
- Settings panel shows `Board: 3×3×3` toggle below difficulty
- Toggling to `Board: 4×4×4` immediately starts a new game on a 4×4×4 board
- 4×4×4 board has 64 cells with 8 center cells blocked (hollow core visible)
- 4×4×4 has exactly 48 valid win lines (36 axis + 12 face diag + 0 space diag)
- Lines require 4-in-a-row to score
- Both Normal and Super Hard CPU play correctly on 4×4×4
- Toggling back to `Board: 3×3×3` restores exact current behavior
- Board size persists across page reloads
- `RESET ALL` restores board size to 3×3×3
- All themes render correctly on both board sizes
- No hardcoded board-size constants remain in game logic — everything derives from `board-config.js`

## Notes For The Implementer
- The modular config system is the core deliverable. A 4×4×4 mode built by copy-pasting and forking the 3×3×3 code is **not acceptable**. The architecture must support switching board sizes at runtime from a single code path.
- The 4×4×4 Super Hard solver will not achieve perfect play — this is expected and acceptable. The time-limited iterative deepening already handles this gracefully.
- The hollow center core in 4×4×4 is a feature, not a rendering gap. It mirrors the blocked center in 3×3×3 and creates a distinctive visual.
- Cell spacing and camera values for 4×4×4 are recommendations. Tune visually during implementation — the goal is that all 56 playable cells are clearly visible and clickable when rotating the board.
- Start by building `board-config.js` and refactoring the existing 3×3×3 to use it. Only then add the 4×4×4 config. This ensures the refactor doesn't break anything before new functionality is added.
