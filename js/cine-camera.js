(function () {
  'use strict';

  // Cinematic CPU camera: when an automated side picks a cell, the camera
  // orbits so that cell sits at the front before the marker lands, then holds
  // it there for a beat so the move is readable. A live user drag/pinch always
  // wins - the orbit must never fight the finger.

  const CINE_DURATION_MS = 800;
  const CINE_HOLD_MS = 450;
  const PHI_EDGE_MARGIN = 0.1;
  const ELEVATION_BIAS = 0.5;

  function isUserInteracting(input) {
    const state = input || {};
    return Boolean(state.mouseDown) ||
      Number(state.touchCount || 0) > 0 ||
      Boolean(state.pinchActive);
  }

  // `automated` covers moves the human did not personally place - a shot-clock
  // timeout picks for them, and that deserves the same reveal as a CPU move.
  function shouldPlayCinematic(options) {
    const { gameMode, side, userInteracting = false, automated = false } = options || {};
    if (userInteracting) return false;
    if (automated) return true;
    return window.TTT3DGameModes.isCpuControlled(gameMode, side);
  }

  function shortAngleDist(from, to) {
    return ((to - from) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function cineProgress(elapsedMs, durationMs) {
    if (!(durationMs > 0)) return 1;
    return Math.max(0, Math.min(1, elapsedMs / durationMs));
  }

  // Camera goes to the same side as the cell so the cell ends up in the
  // foreground, with a slight elevation bias toward the cell's height.
  function cineTargetAngles(pos, phiMin, phiMax) {
    const theta = Math.atan2(pos.x, pos.z);
    const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z) || 0.001;
    const phi = Math.PI / 2 - Math.atan2(pos.y * ELEVATION_BIAS, dist);
    return {
      theta,
      phi: Math.max(phiMin + PHI_EDGE_MARGIN, Math.min(phiMax - PHI_EDGE_MARGIN, phi)),
    };
  }

  window.TTT3DCineCamera = {
    CINE_DURATION_MS,
    CINE_HOLD_MS,
    isUserInteracting,
    shouldPlayCinematic,
    shortAngleDist,
    easeOutCubic,
    cineProgress,
    cineTargetAngles,
  };
})();
