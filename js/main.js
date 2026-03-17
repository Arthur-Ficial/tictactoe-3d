// ═══════════════════════════════════════════════════════════════════
// main.js — Entry point: load saved settings, apply, init settings UI
// ═══════════════════════════════════════════════════════════════════

import { getThemeById } from './themes.js';
import { applyTheme } from './apply-theme.js';
import { init as initUI } from './settings-ui.js';

const THEME_KEY = 'ttt3d-theme';
const DIFFICULTY_KEY = 'ttt3d-difficulty';
const CPU_VS_CPU_KEY = 'ttt3d-cpu-vs-cpu';
const FIRST_MOVE_KEY = 'ttt3d-first-move';
const THINKING_TIME_KEY = 'ttt3d-thinking-time';

const DEFAULT_THEME = 'default';
const DEFAULT_DIFFICULTY = 'normal';
const DEFAULT_CPU_VS_CPU = false;
const DEFAULT_FIRST_MOVE = 'player';
const DEFAULT_THINKING_TIME = 5;

const savedThemeId = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
const savedDifficulty = normalizeDifficulty(localStorage.getItem(DIFFICULTY_KEY));
const savedCpuVsCpu = localStorage.getItem(CPU_VS_CPU_KEY) === 'true';
const savedFirstMove = localStorage.getItem(FIRST_MOVE_KEY) === 'cpu' ? 'cpu' : DEFAULT_FIRST_MOVE;
const savedThinkingTime = normalizeThinkingTime(localStorage.getItem(THINKING_TIME_KEY));

applyTheme(getThemeById(savedThemeId));
window._game?.setDifficulty(savedDifficulty);
window._game?.setThinkingTime(savedThinkingTime);
window._game?.setFirstMoveCpu(savedFirstMove === 'cpu');

// CPU vs CPU triggers newGame internally, so apply it last
if (savedCpuVsCpu) {
  window._game?.setCpuVsCpu(true);
}

initUI({
  themeId: savedThemeId,
  difficulty: savedDifficulty,
  cpuVsCpu: savedCpuVsCpu,
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

  onCpuVsCpuChange(enabled) {
    localStorage.setItem(CPU_VS_CPU_KEY, enabled);
    window._game?.setCpuVsCpu(enabled);
  },

  onFirstMoveChange(who) {
    localStorage.setItem(FIRST_MOVE_KEY, who);
    window._game?.setFirstMoveCpu(who === 'cpu');
  },

  onThinkingTimeChange(seconds) {
    localStorage.setItem(THINKING_TIME_KEY, seconds);
    window._game?.setThinkingTime(seconds);
  },

  onReset() {
    localStorage.clear();
    applyTheme(getThemeById(DEFAULT_THEME));
    window._game?.setDifficulty(DEFAULT_DIFFICULTY);
    window._game?.setThinkingTime(DEFAULT_THINKING_TIME);
    window._game?.setFirstMoveCpu(false);
    window._game?.setCpuVsCpu(false);
  },
});

function normalizeDifficulty(mode) {
  return mode === 'super-hard' ? 'super-hard' : DEFAULT_DIFFICULTY;
}

function normalizeThinkingTime(val) {
  const n = parseInt(val, 10);
  if ([5, 10, 15].includes(n)) return n;
  return DEFAULT_THINKING_TIME;
}
