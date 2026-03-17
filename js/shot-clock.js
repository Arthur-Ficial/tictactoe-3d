(function () {
  'use strict';

  function createShotClock(config) {
    const onTick = typeof config?.onTick === 'function' ? config.onTick : () => {};
    const onExpire = typeof config?.onExpire === 'function' ? config.onExpire : () => {};
    const onReset = typeof config?.onReset === 'function' ? config.onReset : () => {};

    let intervalId = null;
    let startedAt = 0;
    let durationMs = 0;
    let activeSide = null;
    let activeTurnId = 0;

    function clearIntervalIfNeeded() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function tick() {
      const remainingMs = Math.max(0, durationMs - (Date.now() - startedAt));
      onTick({
        side: activeSide,
        turnId: activeTurnId,
        remainingMs,
        remainingSec: remainingMs / 1000,
        totalMs: durationMs,
      });

      if (remainingMs > 0) return;

      const expiredSide = activeSide;
      const expiredTurnId = activeTurnId;
      clearIntervalIfNeeded();
      activeSide = null;
      activeTurnId = 0;
      durationMs = 0;
      startedAt = 0;
      onExpire({ side: expiredSide, turnId: expiredTurnId });
    }

    return {
      start(seconds, side, turnId) {
        clearIntervalIfNeeded();
        activeSide = side;
        activeTurnId = turnId;
        durationMs = Math.max(0, Number(seconds) || 0) * 1000;
        startedAt = Date.now();

        if (durationMs <= 0) {
          onReset();
          return;
        }

        tick();
        intervalId = setInterval(tick, 50);
      },

      clear() {
        clearIntervalIfNeeded();
        activeSide = null;
        activeTurnId = 0;
        durationMs = 0;
        startedAt = 0;
        onReset();
      },

      isRunning() {
        return !!intervalId;
      },
    };
  }

  window.TTT3DShotClock = { createShotClock };
})();
