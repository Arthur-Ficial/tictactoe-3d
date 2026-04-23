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

    function clearTimer() {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    }

    function resetState() {
      activeSide = null;
      activeTurnId = 0;
      durationMs = 0;
      startedAt = 0;
    }

    function getRemainingMs() {
      return Math.max(0, durationMs - (Date.now() - startedAt));
    }

    function tick() {
      const remainingMs = getRemainingMs();
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
      clearTimer();
      resetState();
      onExpire({ side: expiredSide, turnId: expiredTurnId });
    }

    return {
      start(seconds, side, turnId) {
        clearTimer();
        activeSide = side;
        activeTurnId = turnId;
        durationMs = Math.max(0, Number(seconds) || 0) * 1000;
        startedAt = Date.now();

        if (durationMs <= 0) {
          resetState();
          onReset();
          return;
        }

        tick();
        intervalId = setInterval(tick, 50);
      },

      clear() {
        clearTimer();
        resetState();
        onReset();
      },

      isRunning() {
        return Boolean(intervalId);
      },
    };
  }

  window.TTT3DShotClock = { createShotClock };
})();
