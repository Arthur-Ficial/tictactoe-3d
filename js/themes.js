// ═══════════════════════════════════════════════════════════════════
// themes.js — 18 color themes designed with color theory principles
// Complementary player/CPU pairs, triadic win, mood-tinted glows
// ═══════════════════════════════════════════════════════════════════

export const THEMES = [

  // ── 1. DEFAULT ── Cyan vs Yellow on black
  {
    id: 'default', name: 'DEFAULT',
    js: {
      PLAYER:0x00ffff, PLAYER_EM:0x007777, PLAYER_MK_EM:0x004466,
      CPU:0xff6600, CPU_EM:0xaa3300, CPU_MK_EM:0x993300, CPU_SPEC:0xffcc88,
      CPU_LINE:0xffff00,
      WIN:0xff00ff,
      CELL:0x0e1133, CELL_SPEC:0x4466cc, CELL_EDGE:0x4477dd,
      HOVER:0x221144, HOVER_SPEC:0xaa66ff, HOVER_EM:0x110033, HOVER_RESET:0x000011,
      WHITE:0xffffff, BG:0x000000,
      LP_EDGE_HI:0x88aaff, LP_EDGE_WF:0x6699ff,
    },
    css: {
      'c-player':'#00ffff','c-cpu':'#ffff00','c-win':'#ff00ff','c-bg':'#000',
      'c-white':'#fff','c-sep':'#333','c-muted':'#555','c-dim':'#444',
      'c-panel':'#111','c-subtle':'#aaa',
      'c-player-dim':'#00ffff99','c-cpu-dim':'#ffff0099',
      'c-glow-03':'rgba(255,255,255,0.03)','c-glow-05':'rgba(255,255,255,0.05)',
      'c-glow-08':'rgba(255,255,255,0.08)','c-glow-15':'rgba(255,255,255,0.15)',
      'c-glow-20':'rgba(255,255,255,0.2)','c-glow-30':'rgba(255,255,255,0.3)',
      'c-glow-50':'rgba(255,255,255,0.5)',
      'c-hint':'rgba(255,255,255,0.85)','c-hint-shadow':'rgba(255,255,255,0.15)',
      'c-transparent':'rgba(255,255,255,0)',
    },
  },

  // ── 2. LIGHT ── Blue vs Orange on white
  {
    id: 'light', name: 'LIGHT',
    js: {
      PLAYER:0x0077bb, PLAYER_EM:0x003d5e, PLAYER_MK_EM:0x002e47,
      CPU:0xdd6600, CPU_EM:0x6e3300, CPU_MK_EM:0x522600, CPU_SPEC:0xffbb77, CPU_LINE:0xdd6600,
      WIN:0xbb00bb,
      CELL:0xb8bbcc, CELL_SPEC:0x8899bb, CELL_EDGE:0x6677aa,
      HOVER:0xbbaadd, HOVER_SPEC:0x8855cc, HOVER_EM:0xddccff, HOVER_RESET:0xddddee,
      WHITE:0x1a1a1a, BG:0xeeeef4,
      LP_EDGE_HI:0x5577aa, LP_EDGE_WF:0x4466aa,
    },
    css: {
      'c-player':'#0077bb','c-cpu':'#dd6600','c-win':'#bb00bb','c-bg':'#eeeef4',
      'c-white':'#1a1a1a','c-sep':'#bbb','c-muted':'#888','c-dim':'#999',
      'c-panel':'#d8d8e4','c-subtle':'#555',
      'c-player-dim':'rgba(0,119,187,0.5)','c-cpu-dim':'rgba(221,102,0,0.5)',
      'c-glow-03':'rgba(0,0,0,0.03)','c-glow-05':'rgba(0,0,0,0.05)',
      'c-glow-08':'rgba(0,0,0,0.08)','c-glow-15':'rgba(0,0,0,0.12)',
      'c-glow-20':'rgba(0,0,0,0.15)','c-glow-30':'rgba(0,0,0,0.2)',
      'c-glow-50':'rgba(0,0,0,0.3)',
      'c-hint':'rgba(0,0,0,0.65)','c-hint-shadow':'rgba(0,0,0,0.08)',
      'c-transparent':'rgba(0,0,0,0)',
    },
  },

  // ── 3. RED vs GREEN ── Classic rivalry
  {
    id: 'redgreen', name: 'RED vs GREEN',
    js: {
      PLAYER:0xff2222, PLAYER_EM:0x881111, PLAYER_MK_EM:0x660808,
      CPU:0x22ff44, CPU_EM:0x118822, CPU_MK_EM:0x0a6618, CPU_SPEC:0x88ffaa, CPU_LINE:0x22ff44,
      WIN:0xffdd00,
      CELL:0x0a0a18, CELL_SPEC:0x333355, CELL_EDGE:0x444466,
      HOVER:0x1a1133, HOVER_SPEC:0x8866bb, HOVER_EM:0x0d0822, HOVER_RESET:0x050010,
      WHITE:0xffeeee, BG:0x080000,
      LP_EDGE_HI:0xaa5555, LP_EDGE_WF:0x884444,
    },
    css: {
      'c-player':'#ff2222','c-cpu':'#22ff44','c-win':'#ffdd00','c-bg':'#080000',
      'c-white':'#ffeeee','c-sep':'#3a1515','c-muted':'#885555','c-dim':'#774444',
      'c-panel':'#150808','c-subtle':'#bb8888',
      'c-player-dim':'rgba(255,34,34,0.6)','c-cpu-dim':'rgba(34,255,68,0.6)',
      'c-glow-03':'rgba(255,200,200,0.03)','c-glow-05':'rgba(255,200,200,0.05)',
      'c-glow-08':'rgba(255,200,200,0.08)','c-glow-15':'rgba(255,200,200,0.15)',
      'c-glow-20':'rgba(255,200,200,0.2)','c-glow-30':'rgba(255,200,200,0.3)',
      'c-glow-50':'rgba(255,200,200,0.5)',
      'c-hint':'rgba(255,220,220,0.85)','c-hint-shadow':'rgba(255,200,200,0.15)',
      'c-transparent':'rgba(255,200,200,0)',
    },
  },

  // ── GREEN vs RED ── Swapped classic rivalry
  {
    id: 'greenred', name: 'GREEN vs RED',
    js: {
      PLAYER:0x22ff44, PLAYER_EM:0x118822, PLAYER_MK_EM:0x0a6618,
      CPU:0xff2222, CPU_EM:0x881111, CPU_MK_EM:0x660808, CPU_SPEC:0xffaa88, CPU_LINE:0xff2222,
      WIN:0xffdd00,
      CELL:0x0a0a18, CELL_SPEC:0x333355, CELL_EDGE:0x444466,
      HOVER:0x1a1133, HOVER_SPEC:0x8866bb, HOVER_EM:0x0d0822, HOVER_RESET:0x050010,
      WHITE:0xffeeee, BG:0x080000,
      LP_EDGE_HI:0xaa5555, LP_EDGE_WF:0x884444,
    },
    css: {
      'c-player':'#22ff44','c-cpu':'#ff2222','c-win':'#ffdd00','c-bg':'#080000',
      'c-white':'#ffeeee','c-sep':'#3a1515','c-muted':'#885555','c-dim':'#774444',
      'c-panel':'#150808','c-subtle':'#bb8888',
      'c-player-dim':'rgba(34,255,68,0.6)','c-cpu-dim':'rgba(255,34,34,0.6)',
      'c-glow-03':'rgba(255,200,200,0.03)','c-glow-05':'rgba(255,200,200,0.05)',
      'c-glow-08':'rgba(255,200,200,0.08)','c-glow-15':'rgba(255,200,200,0.15)',
      'c-glow-20':'rgba(255,200,200,0.2)','c-glow-30':'rgba(255,200,200,0.3)',
      'c-glow-50':'rgba(255,200,200,0.5)',
      'c-hint':'rgba(255,220,220,0.85)','c-hint-shadow':'rgba(255,200,200,0.15)',
      'c-transparent':'rgba(255,200,200,0)',
    },
  },

  // ── 4. BLACK & WHITE ── Monochrome on gray
  {
    id: 'bw', name: 'BLACK & WHITE',
    js: {
      PLAYER:0xffffff, PLAYER_EM:0x888888, PLAYER_MK_EM:0x666666,
      CPU:0x111111, CPU_EM:0x000000, CPU_MK_EM:0x000000, CPU_SPEC:0x333333, CPU_LINE:0x111111,
      WIN:0xff2222,
      CELL:0x484848, CELL_SPEC:0x777777, CELL_EDGE:0x888888,
      HOVER:0x555555, HOVER_SPEC:0x999999, HOVER_EM:0x333333, HOVER_RESET:0x2a2a2a,
      WHITE:0xeeeeee, BG:0x2a2a2a,
      LP_EDGE_HI:0x888888, LP_EDGE_WF:0x777777,
    },
    css: {
      'c-player':'#ffffff','c-cpu':'#111111','c-win':'#ff2222','c-bg':'#2a2a2a',
      'c-white':'#eee','c-sep':'#444','c-muted':'#888','c-dim':'#777',
      'c-panel':'#333','c-subtle':'#bbb',
      'c-player-dim':'rgba(255,255,255,0.5)','c-cpu-dim':'rgba(17,17,17,0.7)',
      'c-glow-03':'rgba(255,255,255,0.03)','c-glow-05':'rgba(255,255,255,0.05)',
      'c-glow-08':'rgba(255,255,255,0.08)','c-glow-15':'rgba(255,255,255,0.15)',
      'c-glow-20':'rgba(255,255,255,0.2)','c-glow-30':'rgba(255,255,255,0.3)',
      'c-glow-50':'rgba(255,255,255,0.5)',
      'c-hint':'rgba(255,255,255,0.85)','c-hint-shadow':'rgba(255,255,255,0.15)',
      'c-transparent':'rgba(255,255,255,0)',
    },
  },

  // ── 5. HIGH CONTRAST ── Maximum accessibility, bold primaries
  {
    id: 'highcontrast', name: 'HIGH CONTRAST',
    js: {
      PLAYER:0x0088ff, PLAYER_EM:0x004488, PLAYER_MK_EM:0x003366,
      CPU:0xff6600, CPU_EM:0x883300, CPU_MK_EM:0x662200, CPU_SPEC:0xffaa66, CPU_LINE:0xff6600,
      WIN:0xffff00,
      CELL:0x0a1020, CELL_SPEC:0x223355, CELL_EDGE:0x3366aa,
      HOVER:0x112244, HOVER_SPEC:0x5588cc, HOVER_EM:0x081830, HOVER_RESET:0x040810,
      WHITE:0xffffff, BG:0x000000,
      LP_EDGE_HI:0x5588cc, LP_EDGE_WF:0x4477bb,
    },
    css: {
      'c-player':'#0088ff','c-cpu':'#ff6600','c-win':'#ffff00','c-bg':'#000',
      'c-white':'#fff','c-sep':'#333','c-muted':'#666','c-dim':'#555',
      'c-panel':'#0a0a14','c-subtle':'#bbb',
      'c-player-dim':'rgba(0,136,255,0.6)','c-cpu-dim':'rgba(255,102,0,0.6)',
      'c-glow-03':'rgba(255,255,255,0.03)','c-glow-05':'rgba(255,255,255,0.05)',
      'c-glow-08':'rgba(255,255,255,0.08)','c-glow-15':'rgba(255,255,255,0.15)',
      'c-glow-20':'rgba(255,255,255,0.2)','c-glow-30':'rgba(255,255,255,0.3)',
      'c-glow-50':'rgba(255,255,255,0.5)',
      'c-hint':'rgba(255,255,255,0.9)','c-hint-shadow':'rgba(255,255,255,0.2)',
      'c-transparent':'rgba(255,255,255,0)',
    },
  },

  // ── 6. SOLARIZED ── Ethan Schoonover's palette
  {
    id: 'solarized', name: 'SOLARIZED',
    js: {
      PLAYER:0x268bd2, PLAYER_EM:0x134466, PLAYER_MK_EM:0x0d3352,
      CPU:0xb58900, CPU_EM:0x5a4500, CPU_MK_EM:0x443400, CPU_SPEC:0xddcc66, CPU_LINE:0xb58900,
      WIN:0xd33682,
      CELL:0x0d4858, CELL_SPEC:0x2a7080, CELL_EDGE:0x2aa198,
      HOVER:0x0a4a5a, HOVER_SPEC:0x5599aa, HOVER_EM:0x052a35, HOVER_RESET:0x002b36,
      WHITE:0xfdf6e3, BG:0x002b36,
      LP_EDGE_HI:0x4499aa, LP_EDGE_WF:0x338899,
    },
    css: {
      'c-player':'#268bd2','c-cpu':'#b58900','c-win':'#d33682','c-bg':'#002b36',
      'c-white':'#fdf6e3','c-sep':'#073642','c-muted':'#657b83','c-dim':'#586e75',
      'c-panel':'#073642','c-subtle':'#93a1a1',
      'c-player-dim':'rgba(38,139,210,0.6)','c-cpu-dim':'rgba(181,137,0,0.6)',
      'c-glow-03':'rgba(253,246,227,0.03)','c-glow-05':'rgba(253,246,227,0.05)',
      'c-glow-08':'rgba(253,246,227,0.08)','c-glow-15':'rgba(253,246,227,0.15)',
      'c-glow-20':'rgba(253,246,227,0.2)','c-glow-30':'rgba(253,246,227,0.3)',
      'c-glow-50':'rgba(253,246,227,0.5)',
      'c-hint':'rgba(253,246,227,0.85)','c-hint-shadow':'rgba(253,246,227,0.15)',
      'c-transparent':'rgba(253,246,227,0)',
    },
  },

  // ── 7. OCEAN ── Deep sea bioluminescence
  {
    id: 'ocean', name: 'OCEAN',
    js: {
      PLAYER:0x00ffaa, PLAYER_EM:0x008855, PLAYER_MK_EM:0x006644,
      CPU:0xff6677, CPU_EM:0x883344, CPU_MK_EM:0x662233, CPU_SPEC:0xffaabb, CPU_LINE:0xff6677,
      WIN:0xffcc00,
      CELL:0x0a1e2e, CELL_SPEC:0x1a4466, CELL_EDGE:0x1a5566,
      HOVER:0x0e2838, HOVER_SPEC:0x3388aa, HOVER_EM:0x061822, HOVER_RESET:0x030a10,
      WHITE:0xccffee, BG:0x020a10,
      LP_EDGE_HI:0x339988, LP_EDGE_WF:0x228877,
    },
    css: {
      'c-player':'#00ffaa','c-cpu':'#ff6677','c-win':'#ffcc00','c-bg':'#020a10',
      'c-white':'#ccffee','c-sep':'#0e2233','c-muted':'#337766','c-dim':'#226655',
      'c-panel':'#081820','c-subtle':'#66bbaa',
      'c-player-dim':'rgba(0,255,170,0.6)','c-cpu-dim':'rgba(255,102,119,0.6)',
      'c-glow-03':'rgba(150,255,220,0.03)','c-glow-05':'rgba(150,255,220,0.05)',
      'c-glow-08':'rgba(150,255,220,0.08)','c-glow-15':'rgba(150,255,220,0.15)',
      'c-glow-20':'rgba(150,255,220,0.2)','c-glow-30':'rgba(150,255,220,0.3)',
      'c-glow-50':'rgba(150,255,220,0.5)',
      'c-hint':'rgba(150,255,220,0.85)','c-hint-shadow':'rgba(150,255,220,0.15)',
      'c-transparent':'rgba(150,255,220,0)',
    },
  },

  // ── 8. SUNSET ── Golden hour, amber vs violet
  {
    id: 'sunset', name: 'SUNSET',
    js: {
      PLAYER:0xffaa22, PLAYER_EM:0x885511, PLAYER_MK_EM:0x664008,
      CPU:0xaa44ff, CPU_EM:0x552288, CPU_MK_EM:0x441a66, CPU_SPEC:0xcc88ff, CPU_LINE:0xaa44ff,
      WIN:0xff4466,
      CELL:0x1a0e1e, CELL_SPEC:0x443355, CELL_EDGE:0x553366,
      HOVER:0x221428, HOVER_SPEC:0x7744aa, HOVER_EM:0x140a18, HOVER_RESET:0x0a0610,
      WHITE:0xffeedd, BG:0x0a0408,
      LP_EDGE_HI:0x886644, LP_EDGE_WF:0x775533,
    },
    css: {
      'c-player':'#ffaa22','c-cpu':'#aa44ff','c-win':'#ff4466','c-bg':'#0a0408',
      'c-white':'#ffeedd','c-sep':'#332222','c-muted':'#886666','c-dim':'#775555',
      'c-panel':'#140a10','c-subtle':'#bb8888',
      'c-player-dim':'rgba(255,170,34,0.6)','c-cpu-dim':'rgba(170,68,255,0.6)',
      'c-glow-03':'rgba(255,220,180,0.03)','c-glow-05':'rgba(255,220,180,0.05)',
      'c-glow-08':'rgba(255,220,180,0.08)','c-glow-15':'rgba(255,220,180,0.15)',
      'c-glow-20':'rgba(255,220,180,0.2)','c-glow-30':'rgba(255,220,180,0.3)',
      'c-glow-50':'rgba(255,220,180,0.5)',
      'c-hint':'rgba(255,220,180,0.85)','c-hint-shadow':'rgba(255,220,180,0.15)',
      'c-transparent':'rgba(255,220,180,0)',
    },
  },

  // ── 9. NEON ── Cyberpunk, hot pink vs neon green
  {
    id: 'neon', name: 'NEON',
    js: {
      PLAYER:0xff00cc, PLAYER_EM:0x880066, PLAYER_MK_EM:0x66004d,
      CPU:0x00ff88, CPU_EM:0x008844, CPU_MK_EM:0x006633, CPU_SPEC:0x88ffbb, CPU_LINE:0x00ff88,
      WIN:0x0088ff,
      CELL:0x120a1e, CELL_SPEC:0x332255, CELL_EDGE:0x442266,
      HOVER:0x1e1030, HOVER_SPEC:0x6633aa, HOVER_EM:0x100820, HOVER_RESET:0x080410,
      WHITE:0xffddff, BG:0x030008,
      LP_EDGE_HI:0x6633aa, LP_EDGE_WF:0x552299,
    },
    css: {
      'c-player':'#ff00cc','c-cpu':'#00ff88','c-win':'#0088ff','c-bg':'#030008',
      'c-white':'#ffddff','c-sep':'#2a1133','c-muted':'#774488','c-dim':'#663377',
      'c-panel':'#0e0618','c-subtle':'#aa77cc',
      'c-player-dim':'rgba(255,0,204,0.6)','c-cpu-dim':'rgba(0,255,136,0.6)',
      'c-glow-03':'rgba(255,180,255,0.03)','c-glow-05':'rgba(255,180,255,0.05)',
      'c-glow-08':'rgba(255,180,255,0.08)','c-glow-15':'rgba(255,180,255,0.15)',
      'c-glow-20':'rgba(255,180,255,0.2)','c-glow-30':'rgba(255,180,255,0.3)',
      'c-glow-50':'rgba(255,180,255,0.5)',
      'c-hint':'rgba(255,200,255,0.85)','c-hint-shadow':'rgba(255,180,255,0.15)',
      'c-transparent':'rgba(255,180,255,0)',
    },
  },

  // ── 10. CHERRY BLOSSOM ── Japanese spring, sakura pink vs leaf green
  {
    id: 'sakura', name: 'CHERRY BLOSSOM',
    js: {
      PLAYER:0xff7799, PLAYER_EM:0x883d4d, PLAYER_MK_EM:0x662e3a,
      CPU:0x44cc55, CPU_EM:0x226633, CPU_MK_EM:0x1a4d26, CPU_SPEC:0x88ee99, CPU_LINE:0x44cc55,
      WIN:0xffdd22,
      CELL:0x140a1a, CELL_SPEC:0x3a2244, CELL_EDGE:0x443355,
      HOVER:0x1e1028, HOVER_SPEC:0x7755aa, HOVER_EM:0x120a18, HOVER_RESET:0x080410,
      WHITE:0xffeef4, BG:0x060210,
      LP_EDGE_HI:0x885577, LP_EDGE_WF:0x774466,
    },
    css: {
      'c-player':'#ff7799','c-cpu':'#44cc55','c-win':'#ffdd22','c-bg':'#060210',
      'c-white':'#ffeef4','c-sep':'#2a1122','c-muted':'#885566','c-dim':'#774455',
      'c-panel':'#100818','c-subtle':'#bb7799',
      'c-player-dim':'rgba(255,119,153,0.6)','c-cpu-dim':'rgba(68,204,85,0.6)',
      'c-glow-03':'rgba(255,200,220,0.03)','c-glow-05':'rgba(255,200,220,0.05)',
      'c-glow-08':'rgba(255,200,220,0.08)','c-glow-15':'rgba(255,200,220,0.15)',
      'c-glow-20':'rgba(255,200,220,0.2)','c-glow-30':'rgba(255,200,220,0.3)',
      'c-glow-50':'rgba(255,200,220,0.5)',
      'c-hint':'rgba(255,210,230,0.85)','c-hint-shadow':'rgba(255,200,220,0.15)',
      'c-transparent':'rgba(255,200,220,0)',
    },
  },

  // ── 11. AUTUMN ── Harvest amber vs forest green
  {
    id: 'autumn', name: 'AUTUMN',
    js: {
      PLAYER:0xee7722, PLAYER_EM:0x773c11, PLAYER_MK_EM:0x552d0a,
      CPU:0x33aa55, CPU_EM:0x1a552b, CPU_MK_EM:0x144020, CPU_SPEC:0x77dd88, CPU_LINE:0x33aa55,
      WIN:0xdd2233,
      CELL:0x1e140a, CELL_SPEC:0x554422, CELL_EDGE:0x665522,
      HOVER:0x281a0e, HOVER_SPEC:0x997744, HOVER_EM:0x180f06, HOVER_RESET:0x0a0804,
      WHITE:0xffe8cc, BG:0x080400,
      LP_EDGE_HI:0x886644, LP_EDGE_WF:0x775533,
    },
    css: {
      'c-player':'#ee7722','c-cpu':'#33aa55','c-win':'#dd2233','c-bg':'#080400',
      'c-white':'#ffe8cc','c-sep':'#33220f','c-muted':'#776644','c-dim':'#665533',
      'c-panel':'#140e06','c-subtle':'#aa9966',
      'c-player-dim':'rgba(238,119,34,0.6)','c-cpu-dim':'rgba(51,170,85,0.6)',
      'c-glow-03':'rgba(255,220,180,0.03)','c-glow-05':'rgba(255,220,180,0.05)',
      'c-glow-08':'rgba(255,220,180,0.08)','c-glow-15':'rgba(255,220,180,0.15)',
      'c-glow-20':'rgba(255,220,180,0.2)','c-glow-30':'rgba(255,220,180,0.3)',
      'c-glow-50':'rgba(255,220,180,0.5)',
      'c-hint':'rgba(255,220,180,0.85)','c-hint-shadow':'rgba(255,220,180,0.15)',
      'c-transparent':'rgba(255,220,180,0)',
    },
  },

  // ── 12. ARCTIC ── Ice crystal blue vs aurora violet
  {
    id: 'arctic', name: 'ARCTIC',
    js: {
      PLAYER:0x88ddff, PLAYER_EM:0x446e88, PLAYER_MK_EM:0x335266,
      CPU:0xbb88ee, CPU_EM:0x5e4477, CPU_MK_EM:0x46335a, CPU_SPEC:0xddbbff, CPU_LINE:0xbb88ee,
      WIN:0xff5588,
      CELL:0x0c1422, CELL_SPEC:0x2a3d66, CELL_EDGE:0x3355aa,
      HOVER:0x141e38, HOVER_SPEC:0x5577bb, HOVER_EM:0x0a1428, HOVER_RESET:0x050810,
      WHITE:0xe0eaff, BG:0x020408,
      LP_EDGE_HI:0x5577bb, LP_EDGE_WF:0x446699,
    },
    css: {
      'c-player':'#88ddff','c-cpu':'#bb88ee','c-win':'#ff5588','c-bg':'#020408',
      'c-white':'#e0eaff','c-sep':'#152233','c-muted':'#446688','c-dim':'#335577',
      'c-panel':'#080c1a','c-subtle':'#7799cc',
      'c-player-dim':'rgba(136,221,255,0.6)','c-cpu-dim':'rgba(187,136,238,0.6)',
      'c-glow-03':'rgba(200,220,255,0.03)','c-glow-05':'rgba(200,220,255,0.05)',
      'c-glow-08':'rgba(200,220,255,0.08)','c-glow-15':'rgba(200,220,255,0.15)',
      'c-glow-20':'rgba(200,220,255,0.2)','c-glow-30':'rgba(200,220,255,0.3)',
      'c-glow-50':'rgba(200,220,255,0.5)',
      'c-hint':'rgba(200,220,255,0.85)','c-hint-shadow':'rgba(200,220,255,0.15)',
      'c-transparent':'rgba(200,220,255,0)',
    },
  },

  // ── 13. ROYAL OPERA ── Ultramarine and antique gold on midnight blue
  {
    id: 'royalopera', name: 'ROYAL OPERA',
    js: {
      PLAYER:0x4b6bff, PLAYER_EM:0x243580, PLAYER_MK_EM:0x1b2860,
      CPU:0xd7a52f, CPU_EM:0x6b5116, CPU_MK_EM:0x503d10, CPU_SPEC:0xffe0a0, CPU_LINE:0xf4c95d,
      WIN:0xff5a7a,
      CELL:0x141b38, CELL_SPEC:0x425388, CELL_EDGE:0x5d72b4,
      HOVER:0x231b44, HOVER_SPEC:0x8d6bcf, HOVER_EM:0x140d28, HOVER_RESET:0x090612,
      WHITE:0xf8efd9, BG:0x070b1a,
      LP_EDGE_HI:0x7a87c8, LP_EDGE_WF:0x6876b2,
    },
    css: {
      'c-player':'#4b6bff','c-cpu':'#f4c95d','c-win':'#ff5a7a','c-bg':'#070b1a',
      'c-white':'#f8efd9','c-sep':'#26304e','c-muted':'#7f86aa','c-dim':'#606987',
      'c-panel':'#10162b','c-subtle':'#c5b480',
      'c-player-dim':'rgba(75,107,255,0.55)','c-cpu-dim':'rgba(244,201,93,0.58)',
      'c-glow-03':'rgba(248,239,217,0.03)','c-glow-05':'rgba(248,239,217,0.05)',
      'c-glow-08':'rgba(248,239,217,0.08)','c-glow-15':'rgba(248,239,217,0.15)',
      'c-glow-20':'rgba(248,239,217,0.2)','c-glow-30':'rgba(248,239,217,0.3)',
      'c-glow-50':'rgba(248,239,217,0.5)',
      'c-hint':'rgba(248,239,217,0.88)','c-hint-shadow':'rgba(248,239,217,0.16)',
      'c-transparent':'rgba(248,239,217,0)',
    },
  },

  // ── 14. MOROCCO ── Peacock teal and saffron with rose accents
  {
    id: 'morocco', name: 'MOROCCO',
    js: {
      PLAYER:0x18c6b4, PLAYER_EM:0x0b655c, PLAYER_MK_EM:0x084b45,
      CPU:0xffb12f, CPU_EM:0x8a5c12, CPU_MK_EM:0x6b460d, CPU_SPEC:0xffd48a, CPU_LINE:0xffc95b,
      WIN:0xff5978,
      CELL:0x122130, CELL_SPEC:0x2a4b63, CELL_EDGE:0x2f6c7e,
      HOVER:0x1a2940, HOVER_SPEC:0x5a84b7, HOVER_EM:0x0c1626, HOVER_RESET:0x060b12,
      WHITE:0xfff0d9, BG:0x08131c,
      LP_EDGE_HI:0x4e8b93, LP_EDGE_WF:0x3c7278,
    },
    css: {
      'c-player':'#18c6b4','c-cpu':'#ffc95b','c-win':'#ff5978','c-bg':'#08131c',
      'c-white':'#fff0d9','c-sep':'#213241','c-muted':'#67848b','c-dim':'#4f6770',
      'c-panel':'#0f1b26','c-subtle':'#d4b07c',
      'c-player-dim':'rgba(24,198,180,0.58)','c-cpu-dim':'rgba(255,201,91,0.6)',
      'c-glow-03':'rgba(255,240,217,0.03)','c-glow-05':'rgba(255,240,217,0.05)',
      'c-glow-08':'rgba(255,240,217,0.08)','c-glow-15':'rgba(255,240,217,0.15)',
      'c-glow-20':'rgba(255,240,217,0.2)','c-glow-30':'rgba(255,240,217,0.3)',
      'c-glow-50':'rgba(255,240,217,0.5)',
      'c-hint':'rgba(255,240,217,0.86)','c-hint-shadow':'rgba(255,240,217,0.14)',
      'c-transparent':'rgba(255,240,217,0)',
    },
  },

  // ── 15. WINE & SAGE ── A softened split-complementary evening palette
  {
    id: 'wineandsage', name: 'WINE & SAGE',
    js: {
      PLAYER:0xd86d8b, PLAYER_EM:0x723748, PLAYER_MK_EM:0x552834,
      CPU:0x8cbf8c, CPU_EM:0x486448, CPU_MK_EM:0x364b36, CPU_SPEC:0xcde7bf, CPU_LINE:0xa8d8a2,
      WIN:0xffd36b,
      CELL:0x2a1f2d, CELL_SPEC:0x5a4660, CELL_EDGE:0x73587a,
      HOVER:0x34233a, HOVER_SPEC:0x9464a2, HOVER_EM:0x1d1220, HOVER_RESET:0x10090f,
      WHITE:0xfff3ee, BG:0x120b14,
      LP_EDGE_HI:0xa86b7e, LP_EDGE_WF:0x885a66,
    },
    css: {
      'c-player':'#d86d8b','c-cpu':'#a8d8a2','c-win':'#ffd36b','c-bg':'#120b14',
      'c-white':'#fff3ee','c-sep':'#362236','c-muted':'#8d6f7d','c-dim':'#725560',
      'c-panel':'#1c101d','c-subtle':'#c8aeb8',
      'c-player-dim':'rgba(216,109,139,0.58)','c-cpu-dim':'rgba(168,216,162,0.55)',
      'c-glow-03':'rgba(255,243,238,0.03)','c-glow-05':'rgba(255,243,238,0.05)',
      'c-glow-08':'rgba(255,243,238,0.08)','c-glow-15':'rgba(255,243,238,0.15)',
      'c-glow-20':'rgba(255,243,238,0.2)','c-glow-30':'rgba(255,243,238,0.3)',
      'c-glow-50':'rgba(255,243,238,0.5)',
      'c-hint':'rgba(255,243,238,0.87)','c-hint-shadow':'rgba(255,243,238,0.15)',
      'c-transparent':'rgba(255,243,238,0)',
    },
  },

  // ── 16. AMALFI ── Mediterranean blue and lemon on warm limestone
  {
    id: 'amalfi', name: 'AMALFI',
    js: {
      PLAYER:0x227fe0, PLAYER_EM:0x114070, PLAYER_MK_EM:0x0d3054,
      CPU:0xe0b42b, CPU_EM:0x746016, CPU_MK_EM:0x594911, CPU_SPEC:0xffe58f, CPU_LINE:0xf4cb52,
      WIN:0xff6b5f,
      CELL:0xc7d4e4, CELL_SPEC:0x94a8bf, CELL_EDGE:0x6f8aae,
      HOVER:0xd5d6ea, HOVER_SPEC:0x9278c7, HOVER_EM:0xf2eefb, HOVER_RESET:0xeae7dc,
      WHITE:0x1c2733, BG:0xf4efe6,
      LP_EDGE_HI:0x6f8aae, LP_EDGE_WF:0x5f7b9c,
    },
    css: {
      'c-player':'#227fe0','c-cpu':'#f4cb52','c-win':'#ff6b5f','c-bg':'#f4efe6',
      'c-white':'#1c2733','c-sep':'#c9bfaf','c-muted':'#7f7a74','c-dim':'#91877b',
      'c-panel':'#e4ddd0','c-subtle':'#4d5a68',
      'c-player-dim':'rgba(34,127,224,0.5)','c-cpu-dim':'rgba(244,203,82,0.6)',
      'c-glow-03':'rgba(0,0,0,0.03)','c-glow-05':'rgba(0,0,0,0.05)',
      'c-glow-08':'rgba(0,0,0,0.08)','c-glow-15':'rgba(0,0,0,0.12)',
      'c-glow-20':'rgba(0,0,0,0.15)','c-glow-30':'rgba(0,0,0,0.2)',
      'c-glow-50':'rgba(0,0,0,0.3)',
      'c-hint':'rgba(0,0,0,0.66)','c-hint-shadow':'rgba(0,0,0,0.08)',
      'c-transparent':'rgba(0,0,0,0)',
    },
  },

  // ── 17. FOUNDRY ── Oxidized mint against burnished copper
  {
    id: 'foundry', name: 'FOUNDRY',
    js: {
      PLAYER:0x58d0bb, PLAYER_EM:0x2b6a60, PLAYER_MK_EM:0x204f47,
      CPU:0xd97a4a, CPU_EM:0x6d3d25, CPU_MK_EM:0x522d1b, CPU_SPEC:0xf2b68f, CPU_LINE:0xf29b62,
      WIN:0xffd84d,
      CELL:0x1b1818, CELL_SPEC:0x4d423c, CELL_EDGE:0x6a5a52,
      HOVER:0x2a2220, HOVER_SPEC:0xa37762, HOVER_EM:0x15100e, HOVER_RESET:0x0c0807,
      WHITE:0xf5eadf, BG:0x090706,
      LP_EDGE_HI:0x8e7768, LP_EDGE_WF:0x775f51,
    },
    css: {
      'c-player':'#58d0bb','c-cpu':'#f29b62','c-win':'#ffd84d','c-bg':'#090706',
      'c-white':'#f5eadf','c-sep':'#2d2521','c-muted':'#8e7768','c-dim':'#745f54',
      'c-panel':'#140f0d','c-subtle':'#c7a28f',
      'c-player-dim':'rgba(88,208,187,0.56)','c-cpu-dim':'rgba(242,155,98,0.58)',
      'c-glow-03':'rgba(245,234,223,0.03)','c-glow-05':'rgba(245,234,223,0.05)',
      'c-glow-08':'rgba(245,234,223,0.08)','c-glow-15':'rgba(245,234,223,0.15)',
      'c-glow-20':'rgba(245,234,223,0.2)','c-glow-30':'rgba(245,234,223,0.3)',
      'c-glow-50':'rgba(245,234,223,0.5)',
      'c-hint':'rgba(245,234,223,0.86)','c-hint-shadow':'rgba(245,234,223,0.14)',
      'c-transparent':'rgba(245,234,223,0)',
    },
  },

];

export function getThemeById(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}
