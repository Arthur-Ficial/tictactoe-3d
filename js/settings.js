// ═══════════════════════════════════════════════════════════════════
// settings.js — Hamburger menu + settings overlay + color pickers
// ═══════════════════════════════════════════════════════════════════

import { getColors, set, resetAll } from './colors.js';

const PICKERS = [
  { key: 'player', label: 'YOU' },
  { key: 'cpu',    label: 'CPU' },
  { key: 'win',    label: 'WIN' },
  { key: 'bg',     label: 'BG' },
];

let overlay = null;
let inputs = {};

export function init(applyFn) {
  injectCSS();
  buildHamburger();
  buildOverlay(applyFn);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

function close() { overlay.classList.remove('open'); }
function open()  {
  const c = getColors();
  for (const { key } of PICKERS) inputs[key].value = c[key];
  overlay.classList.add('open');
}

function injectCSS() {
  const s = document.createElement('style');
  s.textContent = `
    #settings-btn{
      position:fixed;bottom:max(14px, env(safe-area-inset-bottom));right:14px;
      z-index:50;background:none;border:none;cursor:pointer;
      font-size:1.4rem;color:#444;line-height:1;
      padding:6px 8px;border-radius:6px;
      transition:opacity 0.3s;opacity:0.6;
    }
    #settings-btn:hover{opacity:1;}
    #settings-btn:active{opacity:1;}

    #settings-overlay{
      position:fixed;inset:0;z-index:100;
      background:rgba(0,0,0,0.88);
      display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;
      transition:opacity 0.25s ease;
    }
    #settings-overlay.open{opacity:1;pointer-events:all;}

    #settings-panel{
      position:relative;
      background:rgba(18,18,24,0.95);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:14px;
      padding:32px 36px 24px;
      min-width:260px;max-width:320px;
      display:flex;flex-direction:column;gap:0;
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
      box-shadow:0 20px 60px rgba(0,0,0,0.6);
      transform:scale(0.95) translateY(10px);
      transition:transform 0.25s ease;
    }
    #settings-overlay.open #settings-panel{
      transform:scale(1) translateY(0);
    }

    #settings-title{
      font-size:0.65rem;font-weight:900;letter-spacing:5px;
      color:#555;text-align:center;margin-bottom:20px;
      text-transform:uppercase;
    }

    .settings-row{
      display:flex;align-items:center;justify-content:space-between;
      padding:10px 0;
      border-bottom:1px solid rgba(255,255,255,0.04);
    }
    .settings-row:last-of-type{border-bottom:none;}

    .settings-label{
      font-size:0.7rem;font-weight:600;letter-spacing:2px;color:#777;
    }

    .settings-color{
      -webkit-appearance:none;appearance:none;
      width:44px;height:30px;
      border:2px solid rgba(255,255,255,0.12);border-radius:6px;
      background:none;cursor:pointer;padding:0;
      transition:border-color 0.15s,box-shadow 0.15s;
    }
    .settings-color:hover{
      border-color:rgba(255,255,255,0.3);
      box-shadow:0 0 12px rgba(255,255,255,0.1);
    }
    .settings-color::-webkit-color-swatch-wrapper{padding:0;}
    .settings-color::-webkit-color-swatch{border:none;border-radius:4px;}
    .settings-color::-moz-color-swatch{border:none;border-radius:4px;}

    .settings-actions{
      display:flex;gap:8px;margin-top:20px;
    }

    #settings-save{
      flex:1;padding:10px 12px;
      background:rgba(255,255,255,0.1);
      border:1px solid rgba(255,255,255,0.2);border-radius:8px;
      color:#ddd;font-size:0.7rem;font-weight:700;letter-spacing:2px;
      cursor:pointer;transition:all 0.15s;
    }
    #settings-save:hover{
      background:rgba(255,255,255,0.18);
      border-color:rgba(255,255,255,0.4);color:#fff;
    }

    #settings-reset{
      flex:1;padding:10px 12px;
      background:none;
      border:1px solid rgba(255,255,255,0.08);border-radius:8px;
      color:#555;font-size:0.6rem;font-weight:700;letter-spacing:1px;
      cursor:pointer;transition:all 0.15s;
    }
    #settings-reset:hover{
      color:#aaa;border-color:rgba(255,255,255,0.2);
    }

    #settings-close{
      position:absolute;top:10px;right:12px;
      background:none;border:none;color:#444;font-size:1rem;
      cursor:pointer;padding:4px 8px;line-height:1;
      transition:color 0.15s;
    }
    #settings-close:hover{color:#aaa;}
  `;
  document.head.appendChild(s);
}

function buildHamburger() {
  const btn = document.createElement('button');
  btn.id = 'settings-btn';
  btn.textContent = '\u2699';
  btn.addEventListener('click', open);
  btn.addEventListener('mousedown', e => e.stopPropagation());
  btn.addEventListener('touchstart', e => e.stopPropagation());
  document.body.appendChild(btn);
}

function buildOverlay(applyFn) {
  overlay = document.createElement('div');
  overlay.id = 'settings-overlay';

  const panel = document.createElement('div');
  panel.id = 'settings-panel';

  const title = document.createElement('div');
  title.id = 'settings-title';
  title.textContent = 'Colors';
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

  const actions = document.createElement('div');
  actions.className = 'settings-actions';

  const saveBtn = document.createElement('button');
  saveBtn.id = 'settings-save';
  saveBtn.textContent = 'DONE';
  saveBtn.addEventListener('click', close);
  actions.appendChild(saveBtn);

  const resetBtn = document.createElement('button');
  resetBtn.id = 'settings-reset';
  resetBtn.textContent = 'RESET';
  resetBtn.addEventListener('click', () => {
    resetAll();
    const c = getColors();
    for (const { key } of PICKERS) inputs[key].value = c[key];
    applyFn(c);
  });
  actions.appendChild(resetBtn);

  panel.appendChild(actions);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'settings-close';
  closeBtn.textContent = '\u2715';
  closeBtn.addEventListener('click', close);
  panel.appendChild(closeBtn);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}
