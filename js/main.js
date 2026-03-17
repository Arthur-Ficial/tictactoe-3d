// ═══════════════════════════════════════════════════════════════════
// main.js — Entry point: load saved theme, apply, init settings UI
// ═══════════════════════════════════════════════════════════════════

import { getThemeById } from './themes.js';
import { applyTheme } from './apply-theme.js';
import { init as initUI } from './settings-ui.js';

const THEME_KEY = 'ttt3d-theme';
const DIFFICULTY_KEY = 'ttt3d-difficulty';
const DEFAULT_THEME = 'default';
const DEFAULT_DIFFICULTY = 'normal';

const savedThemeId = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
const savedDifficulty = normalizeDifficulty(localStorage.getItem(DIFFICULTY_KEY));

applyTheme(getThemeById(savedThemeId));
window._game?.setDifficulty(savedDifficulty);

initUI({
  themeId: savedThemeId,
  difficulty: savedDifficulty,

  onThemeChange(themeId) {
    localStorage.setItem(THEME_KEY, themeId);
    applyTheme(getThemeById(themeId));
  },

  onDifficultyChange(difficulty) {
    const normalized = normalizeDifficulty(difficulty);
    localStorage.setItem(DIFFICULTY_KEY, normalized);
    window._game?.setDifficulty(normalized);
  },

  onReset() {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(DIFFICULTY_KEY);
    applyTheme(getThemeById(DEFAULT_THEME));
    window._game?.setDifficulty(DEFAULT_DIFFICULTY);
  },
});

function normalizeDifficulty(mode) {
  return mode === 'super-hard' ? 'super-hard' : DEFAULT_DIFFICULTY;
}
