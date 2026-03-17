// ═══════════════════════════════════════════════════════════════════
// main.js — Entry point: load saved settings, apply, init settings UI
// ═══════════════════════════════════════════════════════════════════

import { getThemeById } from './themes.js';
import { applyTheme } from './apply-theme.js';
import { init as initUI } from './settings-ui.js';

const THEME_KEY = 'ttt3d-theme';
const DIFFICULTY_KEY = 'ttt3d-difficulty';
const FIRST_MOVE_KEY = 'ttt3d-first-move';
const THINKING_TIME_KEY = 'ttt3d-thinking-time';

const GAME_MODE = {
  PLAYER_VS_CPU: 'player-vs-cpu',
};

const DEFAULT_THEME = 'default';
const DEFAULT_DIFFICULTY = 'normal';
const DEFAULT_GAME_MODE = GAME_MODE.PLAYER_VS_CPU;
const DEFAULT_FIRST_MOVE = 'X';
const DEFAULT_THINKING_TIME = 0;

const savedThemeId = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
const savedDifficulty = normalizeDifficulty(localStorage.getItem(DIFFICULTY_KEY));
const savedFirstMove = normalizeFirstMove(localStorage.getItem(FIRST_MOVE_KEY));
const savedThinkingTime = normalizeThinkingTime(localStorage.getItem(THINKING_TIME_KEY));

applyTheme(getThemeById(savedThemeId));
window._game?.setDifficulty(savedDifficulty);
window._game?.setThinkingTime(savedThinkingTime);
window._game?.setFirstMoveSide(savedFirstMove);

if (savedFirstMove !== DEFAULT_FIRST_MOVE) {
  window._game?.newGame();
}

initUI({
  themeId: savedThemeId,
  difficulty: savedDifficulty,
  gameMode: DEFAULT_GAME_MODE,
  firstMove: savedFirstMove,
  thinkingTime: savedThinkingTime,

  onThemeChange(themeId) {
    localStorage.setItem(THEME_KEY, themeId);
    applyTheme(getThemeById(themeId));
  },

  onDifficultyChange(difficulty) {
    const normalized = normalizeDifficulty(difficulty);
    localStorage.setItem(DIFFICULTY_KEY, normalized);
    window._game?.setDifficulty(normalized);
  },

  onGameModeChange(mode) {
    window._game?.setGameMode(normalizeGameMode(mode));
  },

  onFirstMoveChange(side) {
    const normalized = normalizeFirstMove(side);
    localStorage.setItem(FIRST_MOVE_KEY, normalized);
    window._game?.setFirstMoveSide(normalized);
  },

  onThinkingTimeChange(seconds) {
    const normalized = normalizeThinkingTime(seconds);
    localStorage.setItem(THINKING_TIME_KEY, normalized);
    window._game?.setThinkingTime(normalized);
  },

  onReset() {
    localStorage.clear();
    applyTheme(getThemeById(DEFAULT_THEME));
    window._game?.setDifficulty(DEFAULT_DIFFICULTY);
    window._game?.setThinkingTime(DEFAULT_THINKING_TIME);
    window._game?.setFirstMoveSide(DEFAULT_FIRST_MOVE);
    window._game?.setGameMode(DEFAULT_GAME_MODE);
  },
});

function normalizeDifficulty(mode) {
  return mode === 'super-hard' ? 'super-hard' : DEFAULT_DIFFICULTY;
}

function normalizeGameMode(mode) {
  return mode === 'player-vs-player' || mode === 'cpu-vs-cpu'
    ? mode
    : DEFAULT_GAME_MODE;
}

function normalizeFirstMove(value) {
  if (value === 'O' || value === 'cpu') return 'O';
  return 'X';
}

function normalizeThinkingTime(val) {
  const n = parseInt(val, 10);
  if ([0, 5, 10, 15].includes(n)) return n;
  return DEFAULT_THINKING_TIME;
}
