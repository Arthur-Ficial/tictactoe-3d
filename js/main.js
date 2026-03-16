// ═══════════════════════════════════════════════════════════════════
// main.js — Module entry point, wires settings to game
// ═══════════════════════════════════════════════════════════════════

import { load } from './colors.js';
import { applyColors } from './apply-colors.js';
import { init as initSettings } from './settings.js';

// Load saved colors from localStorage, apply to game, init UI
import { getColors } from './colors.js';
load();
applyColors(getColors());
initSettings(applyColors);
