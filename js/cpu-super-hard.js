(function () {
  'use strict';

  const root = window;
  const cpuNamespace = root.TTT3DCPU || (root.TTT3DCPU = {});
  const WORKER_PATH = 'js/cpu-super-hard-worker.js';

  cpuNamespace.createSuperHardSolver = function createSuperHardSolver(config) {
    const worker = new Worker(`${WORKER_PATH}?v=${Date.now()}`);
    const pendingRequests = new Map();
    let nextRequestId = 1;
    let initialized = false;
    let terminated = false;

    worker.addEventListener('message', event => {
      const message = event.data || {};
      if (message.type === 'ready') return;

      const request = pendingRequests.get(message.requestId);
      if (!request) return;

      pendingRequests.delete(message.requestId);

      if (message.type === 'result') {
        request.resolve({
          move: message.move,
          scoreDiff: message.scoreDiff,
        });
        return;
      }

      request.reject(new Error(getWorkerErrorMessage(message)));
    });

    worker.addEventListener('error', event => {
      rejectPendingRequests(event?.message || 'Super Hard worker crashed.');
    });

    function ensureInitialized() {
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

    function rejectPendingRequests(message) {
      const error = new Error(message);
      for (const request of pendingRequests.values()) {
        request.reject(error);
      }
      pendingRequests.clear();
    }

    return {
      getBestMove(board, side) {
        if (terminated) {
          return Promise.reject(new Error('Super Hard solver has been terminated.'));
        }

        ensureInitialized();

        const requestId = nextRequestId++;
        return new Promise((resolve, reject) => {
          pendingRequests.set(requestId, { resolve, reject });
          worker.postMessage({
            type: 'solve',
            requestId,
            board,
            side,
          });
        });
      },

      terminate() {
        if (terminated) return;
        terminated = true;
        worker.terminate();
        rejectPendingRequests('Super Hard solver has been terminated.');
      },
    };
  };

  function getWorkerErrorMessage(message) {
    return typeof message.message === 'string'
      ? message.message
      : 'Super Hard solver failed.';
  }
})();
