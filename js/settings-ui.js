// ═══════════════════════════════════════════════════════════════════
// settings-ui.js — Gear icon + theme selector overlay
// ═══════════════════════════════════════════════════════════════════

import { THEMES } from './themes.js';

let overlay = null;
let activeId = 'default';
let cards = {};

export function init(currentId, onChange) {
  activeId = currentId;
  injectCSS();
  buildGear();
  buildOverlay(onChange);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function close() { if (overlay) overlay.classList.remove('open'); }
function open()  { if (overlay) overlay.classList.add('open'); }

function createGearSVG() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M6.5.5h3l.4 2 .8.3 1.6-1.2 2.1 2.1-1.2 1.6.3.8 2 .4v3l-2 .4-.3.8 1.2 1.6-2.1 2.1-1.6-1.2-.8.3-.4 2h-3l-.4-2-.8-.3-1.6 1.2L1.6 12.4l1.2-1.6-.3-.8-2-.4v-3l2-.4.3-.8L1.6 3.7 3.7 1.6l1.6 1.2.8-.3L6.5.5z');
  path.setAttribute('stroke', '#555');
  path.setAttribute('stroke-width', '1');
  svg.appendChild(path);
  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', '8');
  circle.setAttribute('cy', '8');
  circle.setAttribute('r', '2');
  circle.setAttribute('stroke', '#555');
  circle.setAttribute('stroke-width', '1');
  svg.appendChild(circle);
  return svg;
}

function injectCSS() {
  const s = document.createElement('style');
  s.textContent = `
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
    #theme-close{
      position:absolute;top:8px;right:10px;
      background:none;border:none;color:#444;font-size:1rem;
      cursor:pointer;padding:4px 8px;line-height:1;transition:color 0.15s;
    }
    #theme-close:hover{color:#aaa;}
  `;
  document.head.appendChild(s);
}

function buildGear() {
  const btn = document.createElement('button');
  btn.id = 'theme-gear';
  btn.appendChild(createGearSVG());
  btn.addEventListener('click', open);
  btn.addEventListener('mousedown', e => e.stopPropagation());
  btn.addEventListener('touchstart', e => e.stopPropagation());
  document.body.appendChild(btn);
}

function buildOverlay(onChange) {
  overlay = document.createElement('div');
  overlay.id = 'theme-overlay';

  const panel = document.createElement('div');
  panel.id = 'theme-panel';

  const title = document.createElement('div');
  title.id = 'theme-title';
  title.textContent = 'Theme';
  panel.appendChild(title);

  const grid = document.createElement('div');
  grid.id = 'theme-grid';

  for (const theme of THEMES) {
    const card = document.createElement('div');
    card.className = 'theme-card' + (theme.id === activeId ? ' active' : '');
    card.addEventListener('click', () => {
      activeId = theme.id;
      for (const id in cards) cards[id].classList.toggle('active', id === activeId);
      onChange(theme.id);
      close();
    });

    const swatch = document.createElement('div');
    swatch.className = 'theme-swatch';
    const swatchColors = [theme.css['c-bg'], theme.css['c-player'], theme.css['c-cpu'], theme.css['c-win']];
    for (const c of swatchColors) {
      const sp = document.createElement('span');
      sp.style.background = c;
      swatch.appendChild(sp);
    }

    const name = document.createElement('div');
    name.className = 'theme-name';
    name.textContent = theme.name;

    card.appendChild(swatch);
    card.appendChild(name);
    grid.appendChild(card);
    cards[theme.id] = card;
  }

  panel.appendChild(grid);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'theme-close';
  closeBtn.textContent = '\u2715';
  closeBtn.addEventListener('click', close);
  panel.appendChild(closeBtn);

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}
