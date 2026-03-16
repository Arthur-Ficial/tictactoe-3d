// ═══════════════════════════════════════════════════════════════════
// main.js — Entry point: load saved theme, apply, init settings UI
// ═══════════════════════════════════════════════════════════════════

import { getThemeById } from './themes.js';
import { applyTheme } from './apply-theme.js';
import { init as initUI } from './settings-ui.js';

const KEY = 'ttt3d-theme';
const savedId = localStorage.getItem(KEY) || 'default';

applyTheme(getThemeById(savedId));

initUI(savedId, themeId => {
  localStorage.setItem(KEY, themeId);
  applyTheme(getThemeById(themeId));
});
