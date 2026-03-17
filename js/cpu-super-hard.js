(function () {
  'use strict';

  const root = window;
  const cpuNS = root.TTT3DCPU || (root.TTT3DCPU = {});

  cpuNS.createSuperHardSolver = function createSuperHardSolver(config) {
    const workerUrl = 'js/cpu-super-hard-worker.js?v=' + Date.now();
    const worker = new Worker(workerUrl);
    const pending = new Map();
    let nextRequestId = 1;
    let initialized = false;
    let terminated = false;

    worker.addEventListener('message', event => {
      const data = event.data || {};
      if (data.type === 'ready') return;

      const entry = pending.get(data.requestId);
      if (!entry) return;
      pending.delete(data.requestId);

      if (data.type === 'result') {
        entry.resolve({ move: data.move, scoreDiff: data.scoreDiff });
        return;
      }

      const message = typeof data.message === 'string' ? data.message : 'Super Hard solver failed.';
      entry.reject(new Error(message));
    });

    worker.addEventListener('error', event => {
      const message = event?.message || 'Super Hard worker crashed.';
      for (const entry of pending.values()) {
        entry.reject(new Error(message));
      }
      pending.clear();
    });

    function ensureInit() {
      if (initialized || terminated) return;
      initialized = true;
      worker.postMessage({
        type: 'init',
        wins: config.wins,
        center: config.center,
        player: config.player,
        cpu: config.cpu,
      });
    }

    return {
      getBestMove(board, side) {
        if (terminated) {
          return Promise.reject(new Error('Super Hard solver has been terminated.'));
        }

        ensureInit();
        const requestId = nextRequestId++;
        return new Promise((resolve, reject) => {
          pending.set(requestId, { resolve, reject });
          worker.postMessage({ type: 'solve', requestId, board, side });
        });
      },

      terminate() {
        if (terminated) return;
        terminated = true;
        worker.terminate();
        for (const entry of pending.values()) {
          entry.reject(new Error('Super Hard solver has been terminated.'));
        }
        pending.clear();
      },
    };
  };
})();
