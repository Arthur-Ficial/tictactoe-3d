# Ticket 001: Extract Current Normal CPU Logic Into Its Own File Without Behavior Changes

## Type
Refactor ticket

## Goal
Move the current CPU move-selection logic out of `index.html` into a dedicated file, while preserving the current `Normal` CPU behavior exactly.

This is a structural refactor only. Do not improve, rebalance, optimize, randomize, or otherwise change the current CPU decision logic.

## Current State
- `index.html:298-327` contains helper logic used by the current inline CPU implementation:
  - `isPlayable`
  - `getEmpties`
  - `countCompleted`
  - `countThreats`
- `index.html:331-402` contains the current inline CPU logic:
  - `evalBoard`
  - `scoreMoveForCPU`
  - `aiMove`
- `index.html:640-644` is the live call site during the CPU turn:
  - `const move = aiMove([...board]);`
- `index.html:202-203` shows that the main game still runs in a classic inline `<script>` and is not an ES module.

## Required Outcome
- Create a dedicated runtime file for the current normal CPU logic.
- Keep the main game script in `index.html` non-module.
- Expose the extracted CPU logic through a global namespace so the existing inline game script can call it without converting the whole game to modules.
- Preserve the exact move choice for every board state that the current CPU can reach.

## Implementation Spec
### New Files
- Add `js/cpu-normal.js`.

### Public Runtime API
- `js/cpu-normal.js` must attach a single namespace to `window`:
  - `window.TTT3DCPU`
- It must expose:
  - `window.TTT3DCPU.getNormalCpuMove({ board, wins, center, player, cpu })`

### Internal Function Boundaries
- Move the normal CPU algorithm into `js/cpu-normal.js`.
- Keep the implementation pure: the exported function receives all required inputs and returns only the chosen move index.
- The extracted file must own its own helper functions instead of depending on hidden closures from `index.html`.
- The extracted file must include equivalents of:
  - `isPlayable`
  - `getEmpties`
  - `countCompleted`
  - `countThreats`
  - `evalBoard`
  - `scoreMoveForCPU`

### Load Order
- Add `<script src="js/cpu-normal.js"></script>` in `index.html` immediately before the existing inline game script at `index.html:203`.
- Do not convert the inline game script into `type="module"`.

### Call-Site Change
- Replace the inline `aiMove([...board])` usage at `index.html:643` with:
  - `window.TTT3DCPU.getNormalCpuMove({ board: [...board], wins: WINS, center: CENTER, player: PLAYER, cpu: CPU })`
- Remove the old inline normal CPU implementation from `index.html` after extraction.

## Behavior Lock: Must Stay Exactly The Same
- Preserve the current board evaluation weights from `index.html:333-359`:
  - CPU-only line with 2 marks: `+10`
  - CPU-only line with 1 mark: `+1`
  - Player-only line with 2 marks: `-15`
  - Player-only line with 1 mark: `-1`
  - CPU 2-threat bonus: `countThreats(..., cpu, 2) * 8`
  - Player 2-threat penalty: `countThreats(..., player, 2) * 12`
  - Completed-line differential multiplier: `(cpuLines - plrLines) * 100`
- Preserve the current candidate scoring formula from `index.html:361-387`:
  - `immediate * 160 + worstForCPU`
- Preserve the current search depth:
  - CPU move candidate
  - Player reply evaluation
  - No deeper search
- Preserve current mutation discipline:
  - work on a copied board
  - restore test moves immediately after evaluation
- Preserve current tie-breaking:
  - first move in `avail` wins ties because the current implementation only updates on `s > best`
- Preserve return behavior:
  - `-1` when there are no available moves

## Explicit Non-Goals
- No algorithm improvements
- No super-hard logic
- No difficulty setting changes
- No worker usage
- No new randomness
- No module-system rewrite of the game

## Acceptance Criteria
- For a golden set of board fixtures, the extracted normal CPU returns the same move index as the current inline CPU.
- At minimum include fixture coverage for:
  - empty opening board
  - board with one immediate CPU scoring move
  - board with one immediate player threat to answer
  - board with multiple equal-scoring moves to confirm first-best tie behavior
  - near-full board with one legal move left
  - board where center is blocked as `_`
- Existing gameplay flow remains unchanged except for the source location of the normal CPU logic.

## Notes For The Implementer
- This is a behavior-preservation task. Treat the current inline CPU as the source of truth.
- If any extracted version returns a different move on any existing reachable board, it is a regression even if the move looks stronger.
