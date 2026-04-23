import {
  DEFAULT_SETTINGS,
  DIFFICULTY,
  GAME_MODE_CYCLE,
  SIDE,
  THINKING_TIME_CYCLE,
  normalizeDifficulty,
  normalizeFirstMove,
  normalizeGameMode,
  normalizeThinkingTime,
  normalizeThemeId,
} from './app-settings.js?v=31f1d46-dirty-mobz0m1r';
import { THEMES } from './themes.js?v=31f1d46-dirty-mobz0m1r';

const SETTINGS_STYLE_ID = 'ttt3d-settings-ui-style';
const SETTINGS_CSS = `
  #theme-gear{
    position:fixed!important;bottom:2px!important;right:2px!important;z-index:999!important;
    background:none;border:none;cursor:pointer;
    padding:8px;border-radius:6px;
    opacity:0.4!important;pointer-events:all!important;
    visibility:visible!important;display:block!important;
  }
  #theme-gear:hover{opacity:0.7!important;}
  #theme-overlay{
    position:fixed;inset:0;z-index:100;
    background:rgba(0,0,0,0.88);
    display:flex;align-items:center;justify-content:center;
    opacity:0;pointer-events:none;transition:opacity 0.25s ease;
  }
  #theme-overlay.open{opacity:1;pointer-events:all;}
  #theme-panel{
    position:relative;
    background:rgba(18,18,24,0.95);
    border:1px solid rgba(255,255,255,0.08);border-radius:14px;
    padding:28px 20px 16px;
    width:min(280px,calc(100vw - 32px));
    max-height:min(480px,calc(100vh - 60px));
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    box-shadow:0 20px 60px rgba(0,0,0,0.6);
    transform:scale(0.95) translateY(10px);transition:transform 0.25s ease;
    display:flex;flex-direction:column;
  }
  #theme-overlay.open #theme-panel{transform:scale(1) translateY(0);}
  #theme-title{
    font-size:0.6rem;font-weight:900;letter-spacing:5px;
    color:#666;text-align:center;margin-bottom:12px;text-transform:uppercase;
    flex-shrink:0;
  }
  #theme-grid{
    display:flex;flex-direction:column;gap:6px;
    overflow-y:auto;overflow-x:hidden;
    -webkit-overflow-scrolling:touch;
    padding-right:4px;
  }
  .theme-card{
    cursor:pointer;border:2px solid rgba(255,255,255,0.08);
    border-radius:8px;padding:8px 12px;
    background:rgba(255,255,255,0.02);transition:all 0.15s;
    display:flex;align-items:center;gap:12px;
    min-height:44px;touch-action:manipulation;flex-shrink:0;
  }
  .theme-card:hover{border-color:rgba(255,255,255,0.2);}
  .theme-card.active{border-color:var(--c-player);box-shadow:0 0 12px rgba(255,255,255,0.1);}
  .theme-swatch{
    display:flex;gap:2px;width:60px;height:16px;border-radius:4px;overflow:hidden;flex-shrink:0;
  }
  .theme-swatch span{flex:1;display:block;}
  .theme-name{
    font-size:0.65rem;font-weight:700;letter-spacing:1.5px;color:#999;
    line-height:1;white-space:nowrap;
  }
  .settings-spacer{
    min-height:140px;flex-shrink:0;
  }
  .settings-section{
    font-size:0.5rem;font-weight:900;letter-spacing:2.5px;
    color:#666;text-transform:uppercase;
    margin-top:6px;padding-top:12px;
    border-top:1px solid rgba(255,255,255,0.08);
  }
  .settings-toggle{
    width:100%;min-height:48px;
    border:1px solid rgba(255,255,255,0.08);border-radius:10px;
    background:rgba(255,255,255,0.03);color:#bbb;
    font-size:0.62rem;font-weight:800;letter-spacing:1.4px;
    padding:12px;cursor:pointer;transition:all 0.15s;
    touch-action:manipulation;text-align:left;
  }
  .settings-toggle:hover{
    border-color:rgba(255,255,255,0.18);color:#fff;
  }
  #difficulty-toggle[data-difficulty="super-hard"]{
    border-color:rgba(255,102,0,0.3);
    box-shadow:0 0 18px rgba(255,102,0,0.12);
    color:#ffb677;
  }
  #game-mode-toggle[data-mode="player-vs-player"]{
    border-color:rgba(0,255,170,0.28);
    box-shadow:0 0 18px rgba(0,255,170,0.12);
    color:#8affd5;
  }
  #game-mode-toggle[data-mode="cpu-vs-cpu"]{
    border-color:rgba(0,200,255,0.3);
    box-shadow:0 0 18px rgba(0,200,255,0.12);
    color:#77ddff;
  }
  #first-move-toggle[data-active="O"]{
    border-color:rgba(255,200,0,0.3);
    box-shadow:0 0 18px rgba(255,200,0,0.12);
    color:#ffdd77;
  }
  #thinking-time-toggle{
    position:relative;
  }
  #thinking-time-toggle .time-dots{
    display:flex;gap:4px;margin-top:6px;
  }
  #thinking-time-toggle .time-dot{
    width:6px;height:6px;border-radius:50%;
    background:rgba(255,255,255,0.15);transition:all 0.15s;
  }
  #thinking-time-toggle .time-dot.active{
    background:rgba(255,255,255,0.6);
    box-shadow:0 0 6px rgba(255,255,255,0.3);
  }
  #settings-save{
    margin-top:16px;padding:10px;width:100%;
    background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;
    color:#aaa;font-size:0.55rem;font-weight:800;letter-spacing:2px;
    cursor:pointer;transition:all 0.15s;touch-action:manipulation;
  }
  #settings-save:hover{color:#fff;border-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);}
  #theme-reset{
    margin-top:12px;padding:8px;width:100%;
    background:none;border:1px solid rgba(255,255,255,0.06);border-radius:6px;
    color:#555;font-size:0.5rem;font-weight:700;letter-spacing:1.5px;
    cursor:pointer;transition:all 0.15s;touch-action:manipulation;
  }
  #theme-reset:hover{color:#ff4444;border-color:rgba(255,70,70,0.3);}
  #theme-close{
    position:absolute;top:8px;right:10px;
    background:none;border:none;color:#444;font-size:1rem;
    cursor:pointer;padding:4px 8px;line-height:1;transition:color 0.15s;
  }
  #theme-close:hover{color:#aaa;}
`;

const state = {
  initialized: false,
  overlay: null,
  themeCards: new Map(),
  settings: { ...DEFAULT_SETTINGS },
  elements: {
    gameModeButton: null,
    difficultySection: null,
    difficultyButton: null,
    firstMoveButton: null,
    thinkingTimeButton: null,
  },
};

export function init(config = {}) {
  if (state.initialized) return;

  const handlers = normalizeConfig(config);
  state.initialized = true;
  state.settings = {
    themeId: normalizeThemeId(handlers.themeId),
    difficulty: normalizeDifficulty(handlers.difficulty),
    gameMode: normalizeGameMode(handlers.gameMode),
    firstMove: normalizeFirstMove(handlers.firstMove),
    thinkingTime: normalizeThinkingTime(handlers.thinkingTime),
  };

  injectCss();
  buildGear();
  buildOverlay(handlers);
  document.addEventListener('keydown', handleDocumentKeydown);
}

export function sync(settings = {}) {
  if (!state.initialized) return;

  if (settings.themeId !== undefined) {
    state.settings.themeId = normalizeThemeId(settings.themeId);
    updateThemeSelection();
  }

  if (settings.difficulty !== undefined) {
    state.settings.difficulty = normalizeDifficulty(settings.difficulty);
    updateDifficultyButton();
  }

  if (settings.gameMode !== undefined) {
    state.settings.gameMode = normalizeGameMode(settings.gameMode);
    updateGameModeButton();
    updateDifficultyVisibility();
  }

  if (settings.firstMove !== undefined) {
    state.settings.firstMove = normalizeFirstMove(settings.firstMove);
  }

  if (settings.thinkingTime !== undefined) {
    state.settings.thinkingTime = normalizeThinkingTime(settings.thinkingTime);
    updateThinkingTimeButton();
  }

  updateFirstMoveButton();
}

function normalizeConfig(config) {
  return {
    ...config,
    onThemeChange: toHandler(config.onThemeChange),
    onDifficultyChange: toHandler(config.onDifficultyChange),
    onGameModeChange: toHandler(config.onGameModeChange),
    onFirstMoveChange: toHandler(config.onFirstMoveChange),
    onThinkingTimeChange: toHandler(config.onThinkingTimeChange),
    onReset: toHandler(config.onReset),
  };
}

function toHandler(value) {
  return typeof value === 'function' ? value : () => {};
}

function getGameModesApi() {
  const api = window.TTT3DGameModes;
  if (!api) {
    throw new Error('TTT3DGameModes must be loaded before settings-ui.js.');
  }
  return api;
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    close();
  }
}

function close() {
  state.overlay?.classList.remove('open');
}

function open() {
  state.overlay?.classList.add('open');
}

function injectCss() {
  if (document.getElementById(SETTINGS_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = SETTINGS_STYLE_ID;
  style.textContent = SETTINGS_CSS;
  document.head.appendChild(style);
}

function buildGear() {
  const button = document.createElement('button');
  button.id = 'theme-gear';
  button.type = 'button';
  button.appendChild(createGearSvg());
  button.addEventListener('click', open);
  button.addEventListener('mousedown', stopPropagation);
  button.addEventListener('touchstart', stopPropagation);
  document.body.appendChild(button);
}

function buildOverlay(handlers) {
  const overlay = document.createElement('div');
  overlay.id = 'theme-overlay';

  const panel = document.createElement('div');
  panel.id = 'theme-panel';

  const title = document.createElement('div');
  title.id = 'theme-title';
  title.textContent = 'Settings';

  panel.appendChild(title);
  panel.appendChild(buildSettingsGrid(handlers));
  panel.appendChild(buildResetButton(handlers));
  panel.appendChild(buildCloseButton());

  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      close();
    }
  });
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  state.overlay = overlay;
}

function buildSettingsGrid(handlers) {
  const grid = document.createElement('div');
  grid.id = 'theme-grid';

  appendThemeCards(grid, handlers);
  grid.appendChild(createSpacer());

  state.elements.gameModeButton = buildGameModeButton(handlers);
  appendLabeledControl(grid, 'Game Mode', state.elements.gameModeButton);

  state.elements.difficultyButton = buildDifficultyButton(handlers);
  state.elements.difficultySection = appendLabeledControl(
    grid,
    'Difficulty',
    state.elements.difficultyButton
  );

  state.elements.firstMoveButton = buildFirstMoveButton(handlers);
  appendLabeledControl(grid, 'First Move', state.elements.firstMoveButton);

  state.elements.thinkingTimeButton = buildThinkingTimeButton(handlers);
  appendLabeledControl(grid, 'Timer', state.elements.thinkingTimeButton);

  updateThemeSelection();
  updateGameModeButton();
  updateDifficultyButton();
  updateFirstMoveButton();
  updateThinkingTimeButton();
  updateDifficultyVisibility();

  const saveButton = document.createElement('button');
  saveButton.id = 'settings-save';
  saveButton.type = 'button';
  saveButton.textContent = 'SAVE';
  saveButton.addEventListener('click', close);
  grid.appendChild(saveButton);

  return grid;
}

function appendThemeCards(parent, handlers) {
  state.themeCards.clear();

  for (const theme of THEMES) {
    const card = document.createElement('div');
    card.className = 'theme-card';
    card.addEventListener('click', () => {
      state.settings.themeId = theme.id;
      updateThemeSelection();
      handlers.onThemeChange(theme.id);
      close();
    });

    card.appendChild(createThemeSwatch(theme));

    const name = document.createElement('div');
    name.className = 'theme-name';
    name.textContent = theme.name;
    card.appendChild(name);

    parent.appendChild(card);
    state.themeCards.set(theme.id, card);
  }
}

function createSpacer() {
  const spacer = document.createElement('div');
  spacer.className = 'settings-spacer';
  return spacer;
}

function appendLabeledControl(parent, labelText, control) {
  const label = document.createElement('div');
  label.className = 'settings-section';
  label.textContent = labelText;
  parent.appendChild(label);
  parent.appendChild(control);
  return label;
}

function buildGameModeButton(handlers) {
  const button = createToggleButton('game-mode-toggle', () => {
    state.settings.gameMode = getNextValue(GAME_MODE_CYCLE, state.settings.gameMode);
    updateGameModeButton();
    updateDifficultyVisibility();
    updateFirstMoveButton();
    handlers.onGameModeChange(state.settings.gameMode);
  });

  return button;
}

function buildDifficultyButton(handlers) {
  const button = createToggleButton('difficulty-toggle', () => {
    state.settings.difficulty = state.settings.difficulty === DIFFICULTY.NORMAL
      ? DIFFICULTY.SUPER_HARD
      : DIFFICULTY.NORMAL;
    updateDifficultyButton();
    updateFirstMoveButton();
    handlers.onDifficultyChange(state.settings.difficulty);
  });

  return button;
}

function buildFirstMoveButton(handlers) {
  const button = createToggleButton('first-move-toggle', () => {
    state.settings.firstMove = state.settings.firstMove === SIDE.PLAYER
      ? SIDE.CPU
      : SIDE.PLAYER;
    updateFirstMoveButton();
    handlers.onFirstMoveChange(state.settings.firstMove);
  });

  return button;
}

function buildThinkingTimeButton(handlers) {
  const button = createToggleButton('thinking-time-toggle', () => {
    state.settings.thinkingTime = getNextValue(
      THINKING_TIME_CYCLE,
      state.settings.thinkingTime
    );
    updateThinkingTimeButton();
    handlers.onThinkingTimeChange(state.settings.thinkingTime);
  });

  return button;
}

function buildResetButton(handlers) {
  const button = document.createElement('button');
  button.id = 'theme-reset';
  button.type = 'button';
  button.textContent = 'RESET ALL';
  button.addEventListener('click', () => {
    state.settings = { ...DEFAULT_SETTINGS };
    updateThemeSelection();
    updateGameModeButton();
    updateDifficultyButton();
    updateDifficultyVisibility();
    updateFirstMoveButton();
    updateThinkingTimeButton();
    handlers.onReset();
    close();
  });
  return button;
}

function buildCloseButton() {
  const button = document.createElement('button');
  button.id = 'theme-close';
  button.type = 'button';
  button.textContent = '\u2715';
  button.addEventListener('click', close);
  return button;
}

function createToggleButton(id, onClick) {
  const button = document.createElement('button');
  button.id = id;
  button.className = 'settings-toggle';
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function createThemeSwatch(theme) {
  const swatch = document.createElement('div');
  swatch.className = 'theme-swatch';

  for (const color of [
    theme.css['c-bg'],
    theme.css['c-player'],
    theme.css['c-cpu'],
    theme.css['c-win'],
  ]) {
    const segment = document.createElement('span');
    segment.style.background = color;
    swatch.appendChild(segment);
  }

  return swatch;
}

function createGearSvg() {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS(namespace, 'path');
  path.setAttribute(
    'd',
    'M6.5.5h3l.4 2 .8.3 1.6-1.2 2.1 2.1-1.2 1.6.3.8 2 .4v3l-2 .4-.3.8 1.2 1.6-2.1 2.1-1.6-1.2-.8.3-.4 2h-3l-.4-2-.8-.3-1.6 1.2L1.6 12.4l1.2-1.6-.3-.8-2-.4v-3l2-.4.3-.8L1.6 3.7 3.7 1.6l1.6 1.2.8-.3L6.5.5z'
  );
  path.setAttribute('stroke', '#555');
  path.setAttribute('stroke-width', '1');
  svg.appendChild(path);

  const circle = document.createElementNS(namespace, 'circle');
  circle.setAttribute('cx', '8');
  circle.setAttribute('cy', '8');
  circle.setAttribute('r', '2');
  circle.setAttribute('stroke', '#555');
  circle.setAttribute('stroke-width', '1');
  svg.appendChild(circle);

  return svg;
}

function updateThemeSelection() {
  for (const [themeId, card] of state.themeCards.entries()) {
    card.classList.toggle('active', themeId === state.settings.themeId);
  }
}

function updateGameModeButton() {
  const { gameModeButton } = state.elements;
  if (!gameModeButton) return;

  gameModeButton.dataset.mode = state.settings.gameMode;
  gameModeButton.textContent = getGameModesApi().getModeButtonText(
    state.settings.gameMode
  );
}

function updateDifficultyButton() {
  const { difficultyButton } = state.elements;
  if (!difficultyButton) return;

  difficultyButton.dataset.difficulty = state.settings.difficulty;
  difficultyButton.textContent = state.settings.difficulty === DIFFICULTY.SUPER_HARD
    ? 'Difficulty: Super Hard'
    : 'Difficulty: Normal';
}

function updateFirstMoveButton() {
  const { firstMoveButton } = state.elements;
  if (!firstMoveButton) return;

  firstMoveButton.dataset.active = state.settings.firstMove;
  firstMoveButton.textContent = getGameModesApi().getFirstMoveLabel(
    state.settings.gameMode,
    state.settings.firstMove,
    state.settings.difficulty
  );
}

function updateThinkingTimeButton() {
  const { thinkingTimeButton } = state.elements;
  if (!thinkingTimeButton) return;

  thinkingTimeButton.textContent = '';

  const text = document.createElement('div');
  text.textContent = state.settings.thinkingTime === 0
    ? 'Timer: Off'
    : `Timer: ${state.settings.thinkingTime}s / turn`;
  thinkingTimeButton.appendChild(text);

  const dots = document.createElement('div');
  dots.className = 'time-dots';
  for (const time of [5, 10, 15]) {
    const dot = document.createElement('div');
    dot.className = 'time-dot' + (state.settings.thinkingTime >= time ? ' active' : '');
    dots.appendChild(dot);
  }
  thinkingTimeButton.appendChild(dots);
}

function updateDifficultyVisibility() {
  const showDifficulty = getGameModesApi().usesDifficulty(state.settings.gameMode);
  const displayValue = showDifficulty ? '' : 'none';

  if (state.elements.difficultySection) {
    state.elements.difficultySection.style.display = displayValue;
  }
  if (state.elements.difficultyButton) {
    state.elements.difficultyButton.style.display = displayValue;
  }
}

function getNextValue(values, currentValue) {
  const index = values.indexOf(currentValue);
  const nextIndex = index >= 0 ? (index + 1) % values.length : 0;
  return values[nextIndex];
}

function stopPropagation(event) {
  event.stopPropagation();
}
