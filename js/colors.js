// ═══════════════════════════════════════════════════════════════════
// colors.js — Centralized color config + localStorage persistence
// ═══════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'ttt3d-colors';

const DEFAULTS = {
  player:  '#00ffff',
  cpu:     '#ffff00',
  cell:    '#0a0a22',
  bg:      '#000000',
  win:     '#ff00ff',
};

let current = { ...DEFAULTS };

export function getColors() { return current; }
export function getDefaults() { return { ...DEFAULTS }; }

export function hexToInt(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

// Derive a darker emissive from a base color (multiply each channel)
export function deriveEmissive(hex, factor) {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return (r << 16) | (g << 8) | b;
}

// Derive CSS rgba from hex
export function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      for (const k of Object.keys(DEFAULTS)) {
        if (saved[k] && /^#[0-9a-fA-F]{6}$/.test(saved[k])) {
          current[k] = saved[k];
        }
      }
    }
  } catch (_) { /* corrupt data — use defaults */ }
}

export function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function set(key, value) {
  if (!(key in DEFAULTS)) return;
  current[key] = value;
  save();
}

export function resetAll() {
  current = { ...DEFAULTS };
  save();
}
