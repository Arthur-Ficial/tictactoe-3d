const STORAGE_KEYS = Object.freeze({
  theme: 'ttt3d-theme',
  difficulty: 'ttt3d-difficulty',
  gameMode: 'ttt3d-game-mode',
  firstMove: 'ttt3d-first-move',
  thinkingTime: 'ttt3d-thinking-time',
});

export const DIFFICULTY = Object.freeze({
  NORMAL: 'normal',
  SUPER_HARD: 'super-hard',
});

export const GAME_MODE = Object.freeze({
  PLAYER_VS_CPU: 'player-vs-cpu',
  PLAYER_VS_PLAYER: 'player-vs-player',
  CPU_VS_CPU: 'cpu-vs-cpu',
});

export const SIDE = Object.freeze({
  PLAYER: 'X',
  CPU: 'O',
});

export const THINKING_TIME_OPTIONS = Object.freeze([0, 5, 10, 15]);
export const THINKING_TIME_CYCLE = Object.freeze([15, 10, 5, 0]);
export const GAME_MODE_CYCLE = Object.freeze([
  GAME_MODE.PLAYER_VS_CPU,
  GAME_MODE.PLAYER_VS_PLAYER,
  GAME_MODE.CPU_VS_CPU,
]);

export const DEFAULT_SETTINGS = Object.freeze({
  themeId: 'default',
  difficulty: DIFFICULTY.NORMAL,
  gameMode: GAME_MODE.PLAYER_VS_CPU,
  firstMove: SIDE.PLAYER,
  thinkingTime: 0,
});

const APP_STORAGE_KEYS = Object.freeze(Object.values(STORAGE_KEYS));
const HASH_GAME_MODE_OVERRIDES = Object.freeze({
  'player-vs-cpu': GAME_MODE.PLAYER_VS_CPU,
  pvc: GAME_MODE.PLAYER_VS_CPU,
  'player-vs-player': GAME_MODE.PLAYER_VS_PLAYER,
  pvp: GAME_MODE.PLAYER_VS_PLAYER,
  'cpu-vs-cpu': GAME_MODE.CPU_VS_CPU,
  cvc: GAME_MODE.CPU_VS_CPU,
});

export function normalizeThemeId(value) {
  return typeof value === 'string' && value.trim()
    ? value
    : DEFAULT_SETTINGS.themeId;
}

export function normalizeDifficulty(value) {
  return value === DIFFICULTY.SUPER_HARD
    ? DIFFICULTY.SUPER_HARD
    : DEFAULT_SETTINGS.difficulty;
}

export function normalizeGameMode(value) {
  switch (value) {
    case GAME_MODE.PLAYER_VS_PLAYER:
      return GAME_MODE.PLAYER_VS_PLAYER;
    case GAME_MODE.CPU_VS_CPU:
      return GAME_MODE.CPU_VS_CPU;
    default:
      return DEFAULT_SETTINGS.gameMode;
  }
}

export function normalizeFirstMove(value) {
  return value === SIDE.CPU || value === 'cpu'
    ? SIDE.CPU
    : DEFAULT_SETTINGS.firstMove;
}

export function normalizeThinkingTime(value) {
  const parsed = Number.parseInt(value, 10);
  return THINKING_TIME_OPTIONS.includes(parsed)
    ? parsed
    : DEFAULT_SETTINGS.thinkingTime;
}

export function getStoredSettings(storage = window.localStorage) {
  return {
    themeId: normalizeThemeId(storage.getItem(STORAGE_KEYS.theme)),
    difficulty: normalizeDifficulty(storage.getItem(STORAGE_KEYS.difficulty)),
    gameMode: normalizeGameMode(storage.getItem(STORAGE_KEYS.gameMode)),
    firstMove: normalizeFirstMove(storage.getItem(STORAGE_KEYS.firstMove)),
    thinkingTime: normalizeThinkingTime(storage.getItem(STORAGE_KEYS.thinkingTime)),
  };
}

export function getHashSettings(hash = window.location.hash) {
  const normalizedHash = String(hash || '')
    .trim()
    .replace(/^#+/, '')
    .toLowerCase();
  const gameMode = HASH_GAME_MODE_OVERRIDES[normalizedHash];

  return gameMode ? { gameMode } : {};
}

export function setStoredThemeId(themeId, storage = window.localStorage) {
  storage.setItem(STORAGE_KEYS.theme, normalizeThemeId(themeId));
}

export function setStoredDifficulty(difficulty, storage = window.localStorage) {
  storage.setItem(STORAGE_KEYS.difficulty, normalizeDifficulty(difficulty));
}

export function setStoredGameMode(gameMode, storage = window.localStorage) {
  storage.setItem(STORAGE_KEYS.gameMode, normalizeGameMode(gameMode));
}

export function setStoredFirstMove(side, storage = window.localStorage) {
  storage.setItem(STORAGE_KEYS.firstMove, normalizeFirstMove(side));
}

export function setStoredThinkingTime(seconds, storage = window.localStorage) {
  storage.setItem(
    STORAGE_KEYS.thinkingTime,
    String(normalizeThinkingTime(seconds))
  );
}

export function clearStoredSettings(storage = window.localStorage) {
  for (const key of APP_STORAGE_KEYS) {
    storage.removeItem(key);
  }
}
