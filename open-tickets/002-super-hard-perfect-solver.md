# Ticket 002: Add `Super Hard` CPU With Perfect Solving Strategy

## Type
Feature ticket

## Goal
Add a new CPU difficulty named `Super Hard` that plays perfectly for this game's real objective.

Perfect here does **not** mean classic tic-tac-toe "win as soon as you complete a line." In this project the game continues until the board is full, and the winner is whoever has completed more scoring lines.

The `Super Hard` CPU must therefore choose moves that maximize the final score differential:

`final CPU line count - final Player line count`

## Current State
- Board symbols and blocked center:
  - `index.html:246-248`
- Valid 3D scoring lines are generated and center-touching lines are removed:
  - `index.html:255-283`
- Completed lines are scored when a marker is placed:
  - `index.html:562-592`
- End-of-game winner is decided only when the board is full:
  - `index.html:610-619`
- Current CPU turn dispatch is synchronous and uses the normal heuristic solver:
  - `index.html:630-650`
- The existing CPU logic at `index.html:331-402` is heuristic only and is not an exact solver.

## Required Outcome
- Add a second CPU mode named `Super Hard`.
- `Super Hard` must compute an exact optimal move for the current position.
- It must run off the main thread in a Web Worker so the UI remains responsive while solving.
- It must be deterministic. The same board state must always produce the same move.
- It must not fall back to the normal heuristic.

## File-Level Design
### New Files
- `js/cpu-super-hard.js`
- `js/cpu-super-hard-worker.js`

### Runtime Surface
- Extend the global CPU namespace:
  - `window.TTT3DCPU.createSuperHardSolver({ wins, center, player, cpu })`
- The controller returned by `createSuperHardSolver` must expose:
  - `getBestMove(board)` -> `Promise<{ move, scoreDiff }>`
  - `terminate()`

### Worker Responsibility
- The worker owns:
  - exact state encoding
  - symmetry reduction
  - transposition table
  - exact search
  - move ordering
- The main thread owns:
  - passing the current board
  - awaiting the result
  - applying the returned move if the game is still in the same state

## Exact Solver Specification
### 1. Board Encoding
- Keep the current public board shape as `Array(27)` with index `13` blocked.
- Inside the worker, compress the 26 playable cells into compact bit positions `0..25`.
- Build a fixed lookup table from original board index -> compact bit index.
- Represent game state with:
  - `cpuMask` as a 26-bit integer
  - `playerMask` as a 26-bit integer
  - `sideToMove` as `cpu` or `player`
- Do not store the blocked center in the masks.

### 2. Line Encoding
- Rebuild the same 36 valid scoring lines from `index.html:255-283`.
- Convert each line into a 26-bit mask.
- Precompute:
  - `LINE_MASKS`: all scoring-line masks
  - `CELL_TO_LINES[bitIndex]`: line indexes that contain each cell
  - `CELL_LINE_COUNTS[bitIndex]`: number of valid lines touching each cell

### 3. Exact Score Model
- Score is incremental, not heuristic.
- When a side places a mark, its immediate gain is:
  - number of valid lines in `CELL_TO_LINES[move]` whose full mask becomes owned by that side after the move
- Because the board only fills and marks never move, the final score differential is exactly the sum of per-turn immediate gains.

### 4. Exact Recurrence
- Use negamax over score differential.
- Define:
  - `solve(cpuMask, playerMask, sideToMove) -> exact best final score differential from CPU perspective`
- Base case:
  - if all 26 playable cells are filled, return `0`
- Transition:
  - if `sideToMove === cpu`:
    - for each legal move `m`:
      - `gain = linesCompletedByMove(cpuMask, m)`
      - `value = gain - solve(cpuMask | bit(m), playerMask, player)`
  - if `sideToMove === player`:
    - for each legal move `m`:
      - `gain = linesCompletedByMove(playerMask, m)`
      - `value = -gain - solve(cpuMask, playerMask | bit(m), cpu)`
- Return the maximum `value` among legal moves.

This recurrence is exact because each move contributes only the number of newly completed lines created by that move, and the future subgame contributes the remaining optimal differential.

### 5. Alpha-Beta Pruning
- Implement alpha-beta around the exact recurrence.
- Bounds are on the final score differential from CPU perspective.
- The worker must prune branches once `alpha >= beta`.
- Keep the implementation deterministic by never using randomized move ordering.

### 6. Transposition Table
- Use a transposition table keyed by:
  - canonical `cpuMask`
  - canonical `playerMask`
  - `sideToMove`
- Store:
  - exact solved value when known
  - search flag if the implementation uses bounded entries
  - best move in compact coordinates for move ordering reuse
- Use a plain `Map` in the worker unless profiling proves a stronger structure is needed.

### 7. Symmetry Reduction
- Reduce equivalent states by canonicalizing under the 24 rotational symmetries of the cube.
- Precompute 24 playable-cell permutation arrays from the 3D coordinates implied by `index.html:250-257`.
- For each state:
  - rotate `cpuMask` and `playerMask` by all 24 rotations
  - choose the lexicographically smallest `(cpuMask, playerMask)` pair as the canonical representative
  - retain the inverse rotation needed to map a stored best move back to the current orientation
- Reflections are out of scope. Use rotations only.

### 8. Deterministic Move Ordering
- For each node, order legal moves by the following stable priority:
  1. moves that immediately complete the most lines for the side to move
  2. moves that block the opponent from immediately completing the most lines on their next turn
  3. moves that belong to more valid scoring lines
  4. lower original board index
- Preserve this exact ordering for reproducibility.
- If multiple moves yield the same optimal exact value, choose the first move in this order.

### 9. Worker Protocol
- Input message:
  - `{ type: 'solve', requestId, board }`
- Output success message:
  - `{ type: 'result', requestId, move, scoreDiff }`
- Output error message:
  - `{ type: 'error', requestId, message }`
- `move` must be returned in the original 27-cell board coordinates used by `placeMarker`.
- `scoreDiff` is the exact final CPU-minus-player differential assuming perfect play from both sides.

### 10. Main-Thread Integration
- `Normal` continues using the extracted heuristic CPU from Ticket 001.
- `Super Hard` uses the worker-backed exact solver.
- The CPU turn logic at `index.html:630-650` must:
  - capture a snapshot of the board before requesting a move
  - ignore stale worker results if a new game started or the board changed before the worker replied
  - keep the existing visual "CPU THINKING" state until a valid result arrives

## Performance Rules
- Do not block the main thread with exact search.
- Do not introduce heuristics that can change correctness.
- Do not add a depth limit.
- Do not downgrade to normal mode on slow boards.
- Correctness is higher priority than response time.

## Validation Requirements
- Add an internal test harness or debug-only verification path for solver correctness.
- Minimum validation coverage:
  - terminal full board returns `scoreDiff = 0` from the recursion base and produces no move
  - one-move-left states return the exact line gain for the final move
  - positions with one forced exact best move
  - positions with multiple optimal moves that rely on deterministic tie-breaking
  - symmetry-equivalent boards return symmetry-equivalent best moves
  - brute-force cross-check for states with small remaining move counts
- The exact solver must never return an occupied index, the blocked center, or `-1` when legal moves exist.

## Acceptance Criteria
- `Super Hard` always returns an exact optimal move for the current board under the final score-differential objective.
- The result is deterministic.
- The UI remains responsive while the worker is solving.
- `Normal` mode remains available and unchanged.

## Notes For The Implementer
- The critical design point is the exact recurrence. The solver is not evaluating "who is ahead now." It is solving the remaining game tree for final differential.
- Keep the solver pure inside the worker. The main thread should only translate board state in and move choice out.
