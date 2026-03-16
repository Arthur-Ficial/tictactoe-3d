// ═══════════════════════════════════════════════════════════════════
// settings.js — Hamburger menu + overlay + color pickers
// ═══════════════════════════════════════════════════════════════════

import { getColors, set, resetAll } from './colors.js';

const PICKERS = [
  { key: 'player', label: 'PLAYER' },
  { key: 'cpu',    label: 'CPU' },
  { key: 'win',    label: 'WIN' },
  { key: 'bg',     label: 'BACKGROUND' },
];

let overlay = null;
let inputs = {};

export function init(applyFn) {
  injectCSS();
  buildHamburger();
  buildOverlay(applyFn);
}

function injectCSS() {
  const s = document.createElement('style');
  s.textContent = `
    #settings-btn{
      position:fixed;bottom:max(14px, env(safe-area-inset-bottom));right:14px;
      z-index:50;background:none;border:none;cursor:pointer;
      font-size:1.6rem;color:#555;line-height:1;
      padding:4px 8px;border-radius:4px;
      transition:color 0.15s,background 0.15s;
    }
    #settings-btn:hover{color:#555;background:none;}
    #settings-overlay{
      position:fixed;inset:0;z-index:100;
      background:rgba(0,0,0,0.85);
      display:flex;align-items:center;justify-content:center;
      transition:opacity 0.2s;
    }
    #settings-overlay.hidden{opacity:0;pointer-events:none;}
    #settings-panel{
      position:relative;
      background:#111;border:1px solid #333;border-radius:10px;
      padding:28px 32px 20px;min-width:240px;
      display:flex;flex-direction:column;gap:14px;
    }
    #settings-title{
      font-size:0.8rem;font-weight:900;letter-spacing:4px;
      color:#666;text-align:center;margin-bottom:4px;
    }
    .settings-row{
      display:flex;align-items:center;justify-content:space-between;gap:16px;
    }
    .settings-label{
      font-size:0.72rem;font-weight:700;letter-spacing:2px;color:#888;
    }
    .settings-color{
      -webkit-appearance:none;appearance:none;
      width:40px;height:28px;border:2px solid #444;border-radius:4px;
      background:none;cursor:pointer;padding:0;
    }
    .settings-color::-webkit-color-swatch-wrapper{padding:0;}
    .settings-color::-webkit-color-swatch{border:none;border-radius:2px;}
    .settings-color::-moz-color-swatch{border:none;border-radius:2px;}
    #settings-reset{
      margin-top:6px;padding:6px 12px;
      background:none;border:1px solid #444;border-radius:4px;
      color:#666;font-size:0.65rem;font-weight:700;letter-spacing:2px;
      cursor:pointer;transition:all 0.15s;
    }
    #settings-reset:hover{color:#fff;border-color:#fff;}
    #settings-close{
      position:absolute;top:8px;right:10px;
      background:none;border:none;color:#555;font-size:1.1rem;
      cursor:pointer;padding:2px 6px;line-height:1;
    }
    #settings-close:hover{color:#fff;}
  `;
  document.head.appendChild(s);
}

function buildHamburger() {
  const btn = document.createElement('button');
  btn.id = 'settings-btn';
  btn.textContent = '\u2630';
  btn.addEventListener('click', () => overlay.classList.remove('hidden'));
  document.body.appendChild(btn);
}

function buildOverlay(applyFn) {
  overlay = document.createElement('div');
  overlay.id = 'settings-overlay';
  overlay.classList.add('hidden');

  const panel = document.createElement('div');
  panel.id = 'settings-panel';

  const title = document.createElement('div');
  title.id = 'settings-title';
  title.textContent = 'COLORS';
  panel.appendChild(title);

  for (const { key, label } of PICKERS) {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.className = 'settings-label';

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'settings-color';
    input.value = getColors()[key];
    input.addEventListener('input', () => {
      set(key, input.value);
      applyFn(getColors());
    });

    inputs[key] = input;
    row.appendChild(lbl);
    row.appendChild(input);
    panel.appendChild(row);
  }

  const resetBtn = document.createElement('button');
  resetBtn.id = 'settings-reset';
  resetBtn.textContent = 'RESET TO DEFAULTS';
  resetBtn.addEventListener('click', () => {
    resetAll();
    const c = getColors();
    for (const { key } of PICKERS) inputs[key].value = c[key];
    applyFn(c);
  });
  panel.appendChild(resetBtn);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'settings-close';
  closeBtn.textContent = '\u2715';
  closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  panel.appendChild(closeBtn);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}
