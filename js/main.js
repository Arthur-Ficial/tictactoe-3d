import { applyTheme } from './apply-theme.js?v=31f1d46-dirty-mobz0m1r';
import {
  DEFAULT_SETTINGS,
  clearStoredSettings,
  getHashSettings,
  getStoredSettings,
  normalizeDifficulty,
  normalizeFirstMove,
  normalizeGameMode,
  normalizeThinkingTime,
  normalizeThemeId,
  setStoredDifficulty,
  setStoredFirstMove,
  setStoredGameMode,
  setStoredThinkingTime,
  setStoredThemeId,
} from './app-settings.js?v=31f1d46-dirty-mobz0m1r';
import {
  init as initSettingsUi,
  sync as syncSettingsUi,
} from './settings-ui.js?v=31f1d46-dirty-mobz0m1r';
import { getThemeById } from './themes.js?v=31f1d46-dirty-mobz0m1r';

const initialSettings = {
  ...getStoredSettings(),
  ...getHashSettings(),
};

applyInitialSettings(initialSettings);
initSettingsUi(createSettingsUiConfig(initialSettings));
applyHashOverrideFromLocation();
window.addEventListener('hashchange', applyHashOverrideFromLocation);
window.addEventListener('load', applyHashOverrideFromLocation);
window.addEventListener('pageshow', applyHashOverrideFromLocation);

function applyInitialSettings(settings) {
  const game = window._game;
  applyTheme(getThemeById(settings.themeId));
  game?.setDifficulty(settings.difficulty);
  game?.setThinkingTime(settings.thinkingTime);
  game?.setFirstMoveSide(settings.firstMove);

  if (settings.gameMode !== DEFAULT_SETTINGS.gameMode) {
    game?.setGameMode(settings.gameMode);
    return;
  }

  if (settings.firstMove !== DEFAULT_SETTINGS.firstMove) {
    game?.newGame();
  }
}

function createSettingsUiConfig(settings) {
  return {
    ...settings,
    onThemeChange(themeId) {
      const normalizedThemeId = normalizeThemeId(themeId);
      setStoredThemeId(normalizedThemeId);
      applyTheme(getThemeById(normalizedThemeId));
    },

    onDifficultyChange(difficulty) {
      const normalizedDifficulty = normalizeDifficulty(difficulty);
      setStoredDifficulty(normalizedDifficulty);
      window._game?.setDifficulty(normalizedDifficulty);
    },

    onGameModeChange(gameMode) {
      const normalizedGameMode = normalizeGameMode(gameMode);
      setStoredGameMode(normalizedGameMode);
      window._game?.setGameMode(normalizedGameMode);
    },

    onFirstMoveChange(side) {
      const normalizedSide = normalizeFirstMove(side);
      setStoredFirstMove(normalizedSide);
      window._game?.setFirstMoveSide(normalizedSide);
    },

    onThinkingTimeChange(seconds) {
      const normalizedThinkingTime = normalizeThinkingTime(seconds);
      setStoredThinkingTime(normalizedThinkingTime);
      window._game?.setThinkingTime(normalizedThinkingTime);
    },

    onReset() {
      const resetGameMode = getHashOverriddenGameMode(DEFAULT_SETTINGS.gameMode);
      clearStoredSettings();
      applyTheme(getThemeById(DEFAULT_SETTINGS.themeId));
      window._game?.setDifficulty(DEFAULT_SETTINGS.difficulty);
      window._game?.setThinkingTime(DEFAULT_SETTINGS.thinkingTime);
      window._game?.setFirstMoveSide(DEFAULT_SETTINGS.firstMove);
      window._game?.setGameMode(resetGameMode);
      syncSettingsUi({ gameMode: resetGameMode });
    },
  };
}

function applyHashOverrideFromLocation() {
  const gameMode = getHashOverriddenGameMode();
  if (!gameMode) return;

  if (window._game?.getGameMode?.() !== gameMode) {
    window._game?.setGameMode(gameMode);
  }

  syncSettingsUi({ gameMode });
}

function getHashOverriddenGameMode(fallbackGameMode = null) {
  const { gameMode } = getHashSettings();
  return gameMode ?? fallbackGameMode;
}
