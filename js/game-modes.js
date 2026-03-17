(function () {
  'use strict';

  const PLAYER = 'X';
  const CPU = 'O';

  const GAME_MODE = Object.freeze({
    PLAYER_VS_CPU: 'player-vs-cpu',
    PLAYER_VS_PLAYER: 'player-vs-player',
    CPU_VS_CPU: 'cpu-vs-cpu',
  });

  function normalizeGameMode(mode) {
    switch (mode) {
      case GAME_MODE.PLAYER_VS_PLAYER:
        return GAME_MODE.PLAYER_VS_PLAYER;
      case GAME_MODE.CPU_VS_CPU:
        return GAME_MODE.CPU_VS_CPU;
      default:
        return GAME_MODE.PLAYER_VS_CPU;
    }
  }

  function normalizeSide(side) {
    return side === CPU ? CPU : PLAYER;
  }

  function getCpuLabel(difficulty) {
    return difficulty === 'super-hard' ? 'CPU+' : 'CPU';
  }

  function isCpuControlled(mode, side) {
    const normalizedMode = normalizeGameMode(mode);
    const normalizedSide = normalizeSide(side);
    return normalizedMode === GAME_MODE.CPU_VS_CPU ||
      (normalizedMode === GAME_MODE.PLAYER_VS_CPU && normalizedSide === CPU);
  }

  function isHumanControlled(mode, side) {
    return !isCpuControlled(mode, side);
  }

  function isSpectatorMode(mode) {
    return normalizeGameMode(mode) === GAME_MODE.CPU_VS_CPU;
  }

  function usesDifficulty(mode) {
    return normalizeGameMode(mode) !== GAME_MODE.PLAYER_VS_PLAYER;
  }

  function getModeButtonText(mode) {
    const normalizedMode = normalizeGameMode(mode);
    if (normalizedMode === GAME_MODE.PLAYER_VS_PLAYER) return 'Mode: Player vs Player';
    if (normalizedMode === GAME_MODE.CPU_VS_CPU) return 'Mode: CPU vs CPU';
    return 'Mode: Player vs CPU';
  }

  function getScoreLabel(mode, side, difficulty) {
    const normalizedMode = normalizeGameMode(mode);
    const normalizedSide = normalizeSide(side);

    if (normalizedMode === GAME_MODE.PLAYER_VS_PLAYER) {
      return normalizedSide === PLAYER ? 'ME' : 'YOU';
    }
    if (normalizedMode === GAME_MODE.CPU_VS_CPU) {
      return getCpuLabel(difficulty);
    }
    return normalizedSide === PLAYER ? 'YOU' : getCpuLabel(difficulty);
  }

  function getThinkingLabel(mode, side, difficulty) {
    const normalizedMode = normalizeGameMode(mode);
    const normalizedSide = normalizeSide(side);

    if (normalizedMode === GAME_MODE.PLAYER_VS_PLAYER) {
      return normalizedSide === PLAYER ? 'ME' : 'YOU';
    }
    return getScoreLabel(normalizedMode, normalizedSide, difficulty);
  }

  function getFirstMoveLabel(mode, side, difficulty) {
    const normalizedMode = normalizeGameMode(mode);
    const normalizedSide = normalizeSide(side);
    let actor = '';

    if (normalizedMode === GAME_MODE.PLAYER_VS_PLAYER) {
      actor = normalizedSide === PLAYER ? 'Me' : 'You';
    } else if (normalizedMode === GAME_MODE.CPU_VS_CPU) {
      actor = getCpuLabel(difficulty);
    } else {
      actor = normalizedSide === PLAYER ? 'Player' : getCpuLabel(difficulty);
    }

    return `First Move: ${normalizedSide} (${actor})`;
  }

  function getWinnerText(mode, side, difficulty) {
    const normalizedMode = normalizeGameMode(mode);
    const normalizedSide = normalizeSide(side);

    if (normalizedMode === GAME_MODE.PLAYER_VS_PLAYER) {
      return normalizedSide === PLAYER ? 'ME WINS' : 'YOU WIN';
    }
    if (normalizedMode === GAME_MODE.CPU_VS_CPU) {
      return normalizedSide === PLAYER ? 'X WINS' : 'O WINS';
    }
    return normalizedSide === PLAYER ? 'YOU WIN' : `${getCpuLabel(difficulty)} WINS`;
  }

  window.TTT3DGameModes = {
    GAME_MODE,
    normalizeGameMode,
    normalizeSide,
    isCpuControlled,
    isHumanControlled,
    isSpectatorMode,
    usesDifficulty,
    getModeButtonText,
    getScoreLabel,
    getThinkingLabel,
    getFirstMoveLabel,
    getWinnerText,
  };
})();
