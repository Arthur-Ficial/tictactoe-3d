# Ticket 003: Change Request For Hidden Settings Toggle Between `Difficulty: Normal` And `Difficulty: Super Hard`

## Type
Change request ticket

## Goal
Extend the existing settings dialog so that, after the user scrolls far down inside the current settings content, they can reach a difficulty toggle with exactly two states:

- `Difficulty: Normal`
- `Difficulty: Super Hard`

This must integrate the new exact solver from Ticket 002 while keeping the current theme selector behavior intact.

## Current State
- `js/settings-ui.js:12-20` initializes the settings UI with only theme state and a single theme change callback.
- `js/settings-ui.js:47-120` injects all overlay CSS.
- `js/settings-ui.js:133-200` builds the overlay contents:
  - title
  - theme grid
  - reset button
  - close button
- `js/settings-ui.js:83-88` defines the current scrollable area as `#theme-grid`.
- `js/settings-ui.js:179-188` handles reset with `localStorage.clear()` and resets theme only.
- `js/main.js:9-17` persists only the theme under `ttt3d-theme`.
- `index.html:640-644` always dispatches the current single CPU logic with no difficulty branch.

## Required Outcome
- Add a persisted difficulty setting with default `Normal`.
- Add a hidden-feeling difficulty control at the bottom of the existing settings scroll area.
- Keep the current theme-card list first.
- Require the user to scroll down through the existing settings content to reach the difficulty control.
- Switch CPU move selection between `Normal` and `Super Hard` at runtime.

## UI Placement Spec
### Location
- Keep using `#theme-grid` as the single scroll container.
- Append the difficulty control inside `#theme-grid`, after all theme cards.
- Insert a deliberate spacer block above the difficulty control so it sits far below the theme list and only appears after substantial scrolling.

### Required Visual Structure
- Theme cards stay in the current order and keep current behavior.
- After the theme cards, add:
  - a spacer element
  - a section label such as `Difficulty`
  - a single toggle row or button control
- The toggle control text must always read exactly one of:
  - `Difficulty: Normal`
  - `Difficulty: Super Hard`

### Interaction
- Tapping or clicking the control flips between the two states.
- The control remains inside the overlay. It does not open another dialog.
- Closing and reopening the overlay must preserve the current difficulty label.

## Persistence Spec
### Storage Keys
- Keep theme storage key:
  - `ttt3d-theme`
- Add new difficulty storage key:
  - `ttt3d-difficulty`

### Default
- If no difficulty value exists, use `normal`.

### Reset Behavior
- `RESET ALL` must restore:
  - theme -> `default`
  - difficulty -> `normal`
- Replace `localStorage.clear()` in `js/settings-ui.js:182-187` with targeted key removal for only:
  - `ttt3d-theme`
  - `ttt3d-difficulty`

This avoids clearing unrelated storage for the origin.

## Interface Changes
### `js/main.js`
- Change the settings boot contract so it passes both theme and difficulty into the UI layer.
- Replace the current `initUI(savedId, themeId => ...)` shape from `js/main.js:14-17` with an object-style init:
  - `initUI({ themeId, difficulty, onThemeChange, onDifficultyChange, onReset })`

### `js/settings-ui.js`
- Expand local UI state to track:
  - active theme id
  - active difficulty
- Keep theme and difficulty concerns separate.
- The theme callback must still only change theme.
- The difficulty callback must only change difficulty.

### Game Runtime Bridge
- Extend `window._game` at `index.html:1400-1420` to expose:
  - `getDifficulty()`
  - `setDifficulty(mode)`
- Difficulty must be stored in game runtime state, not inferred from DOM text.

## CPU Dispatch Spec
- Update the CPU turn code at `index.html:630-650`.
- At move time:
  - if difficulty is `normal`, call the extracted normal CPU from Ticket 001
  - if difficulty is `super-hard`, call the exact worker-backed solver from Ticket 002
- Difficulty changes do not reset the active game.
- The selected difficulty applies to the next CPU move.
- Existing thinking/status visuals must remain in place.

## CSS/DOM Details
- Extend the injected CSS in `js/settings-ui.js:47-120` with:
  - spacer styling
  - difficulty section label styling
  - difficulty toggle styling
- Keep the current overlay look and proportions.
- Do not create a second scroll container.
- Do not move `RESET ALL` above the difficulty control.
- Keep the difficulty control reachable on mobile within the existing overlay height constraints.

## Acceptance Criteria
- On first load, difficulty is `Normal`.
- After changing difficulty, reload restores the same value.
- The toggle only offers `Normal` and `Super Hard`.
- The toggle appears only after scrolling well past the theme cards.
- `RESET ALL` resets both theme and difficulty.
- Theme selection still behaves exactly as before.
- CPU move selection follows the chosen difficulty on the very next CPU turn.

## Notes For The Implementer
- This is intentionally a hidden-ish advanced setting. The spacer is not accidental; it is part of the requested interaction.
- Keep the implementation modular: theme state, difficulty state, and CPU selection should each have their own clear responsibility.
