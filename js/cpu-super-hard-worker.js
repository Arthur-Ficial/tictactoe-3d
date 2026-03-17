'use strict';

const FLAG_EXACT = 0;
const FLAG_LOWER = 1;
const FLAG_UPPER = 2;
const INF = 1e9;
const MAX_TT_SIZE = 500000;
const NODE_CHECK_INTERVAL = 2048;
const DEFAULT_TIME_LIMIT = 2500;

let cpu = 'O';
let player = 'X';
let center = 13;
let ready = false;

let bitToBoard = [];
let bitMasks = [];
let fullMask = 0;
let lineMasks = [];
let cellToLines = [];
let cellLineCounts = [];
let rotationBitValues = [];
let transposition = new Map();

let searchStartTime = 0;
let searchTimeLimit = 0;
let searchAborted = false;
let nodeCount = 0;

self.onmessage = event => {
  const message = event.data || {};

  if (message.type === 'init') {
    try {
      initSolver(message);
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({
        type: 'error',
        requestId: message.requestId ?? -1,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return;
  }

  if (message.type !== 'solve') return;
  if (!ready) {
    self.postMessage({ type: 'error', requestId: message.requestId, message: 'Super Hard solver is not initialized.' });
    return;
  }

  try {
    const result = solveBoard(message.board, message.side);
    self.postMessage({
      type: 'result',
      requestId: message.requestId,
      move: result.move,
      scoreDiff: result.scoreDiff,
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      requestId: message.requestId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

function initSolver(config) {
  cpu = config.cpu || 'O';
  player = config.player || 'X';
  center = Number.isInteger(config.center) ? config.center : 13;

  bitToBoard = [];
  const boardToBit = new Int8Array(27);
  boardToBit.fill(-1);

  for (let idx = 0; idx < 27; idx += 1) {
    if (idx === center) continue;
    boardToBit[idx] = bitToBoard.length;
    bitToBoard.push(idx);
  }

  bitMasks = bitToBoard.map((_, idx) => (1 << idx) >>> 0);
  fullMask = bitMasks.reduce((mask, bit) => (mask | bit) >>> 0, 0);

  lineMasks = config.wins.map(line => {
    let mask = 0;
    for (const boardIdx of line) {
      const bitIdx = boardToBit[boardIdx];
      if (bitIdx < 0) continue;
      mask |= bitMasks[bitIdx];
    }
    return mask >>> 0;
  });

  cellToLines = Array.from({ length: bitToBoard.length }, () => []);
  for (let lineIdx = 0; lineIdx < lineMasks.length; lineIdx += 1) {
    const lineMask = lineMasks[lineIdx];
    for (let bitIdx = 0; bitIdx < bitToBoard.length; bitIdx += 1) {
      if (lineMask & bitMasks[bitIdx]) {
        cellToLines[bitIdx].push(lineIdx);
      }
    }
  }

  cellLineCounts = cellToLines.map(lines => lines.length);
  rotationBitValues = buildRotationBitValues(boardToBit);
  transposition = new Map();
  ready = true;
}

// ═══════════════════════════════════════════════════════════════════
// ITERATIVE DEEPENING SOLVER
// ═══════════════════════════════════════════════════════════════════

function solveBoard(board, side) {
  const { cpuMask, playerMask } = boardToMasks(board, side);
  const occupiedMask = (cpuMask | playerMask) >>> 0;
  if (occupiedMask === fullMask) {
    return { move: -1, scoreDiff: 0 };
  }

  const emptyCount = bitToBoard.length - popcount(occupiedMask);
  const moves = buildOrderedMoves(cpuMask, playerMask, true);
  if (moves.length === 0) return { move: -1, scoreDiff: 0 };

  searchStartTime = performance.now();
  searchTimeLimit = DEFAULT_TIME_LIMIT;
  nodeCount = 0;

  let bestMove = bitToBoard[moves[0].bit];
  let bestScore = -INF;

  for (let maxDepth = 2; maxDepth <= emptyCount; maxDepth += 2) {
    transposition.clear();
    searchAborted = false;

    let iterBestMove = -1;
    let iterBestScore = -INF;
    let alpha = -INF;
    let aborted = false;

    for (const move of moves) {
      const gain = move.immediate;
      const score = gain + solveState(
        (cpuMask | bitMasks[move.bit]) >>> 0,
        playerMask, false,
        alpha - gain, INF - gain,
        maxDepth - 1
      );

      if (searchAborted) { aborted = true; break; }

      if (score > iterBestScore) {
        iterBestScore = score;
        iterBestMove = bitToBoard[move.bit];
      }
      if (score > alpha) alpha = score;
    }

    if (!aborted) {
      bestMove = iterBestMove;
      bestScore = iterBestScore;
    }

    if (maxDepth >= emptyCount) break;
    if (performance.now() - searchStartTime > searchTimeLimit * 0.7) break;
  }

  return { move: bestMove, scoreDiff: bestScore };
}

// ═══════════════════════════════════════════════════════════════════
// DEPTH-LIMITED MINIMAX WITH ALPHA-BETA
// ═══════════════════════════════════════════════════════════════════

function solveState(cpuMask, playerMask, cpuTurn, alpha, beta, depth) {
  nodeCount += 1;
  if ((nodeCount & (NODE_CHECK_INTERVAL - 1)) === 0) {
    if (performance.now() - searchStartTime > searchTimeLimit) {
      searchAborted = true;
      return 0;
    }
  }
  if (searchAborted) return 0;

  const occupiedMask = (cpuMask | playerMask) >>> 0;
  if (occupiedMask === fullMask) return 0;
  if (depth <= 0) return evaluate(cpuMask, playerMask);

  const alphaOrig = alpha;
  const betaOrig = beta;
  const key = makeKey(cpuMask, playerMask, cpuTurn);
  const cached = transposition.get(key);

  if (cached && cached.depth >= depth) {
    if (cached.flag === FLAG_EXACT) return cached.value;
    if (cached.flag === FLAG_LOWER && cached.value > alpha) alpha = cached.value;
    else if (cached.flag === FLAG_UPPER && cached.value < beta) beta = cached.value;
    if (alpha >= beta) return cached.value;
  }

  let bestValue = cpuTurn ? -INF : INF;
  const moves = buildOrderedMoves(cpuMask, playerMask, cpuTurn);

  if (cpuTurn) {
    for (const move of moves) {
      const gain = move.immediate;
      const value = gain + solveState(
        (cpuMask | bitMasks[move.bit]) >>> 0, playerMask, false,
        alpha - gain, beta - gain, depth - 1
      );
      if (searchAborted) return 0;
      if (value > bestValue) bestValue = value;
      if (value > alpha) alpha = value;
      if (alpha >= beta) break;
    }
  } else {
    for (const move of moves) {
      const gain = move.immediate;
      const value = solveState(
        cpuMask, (playerMask | bitMasks[move.bit]) >>> 0, true,
        alpha + gain, beta + gain, depth - 1
      ) - gain;
      if (searchAborted) return 0;
      if (value < bestValue) bestValue = value;
      if (value < beta) beta = value;
      if (alpha >= beta) break;
    }
  }

  if (!searchAborted && transposition.size < MAX_TT_SIZE) {
    let flag = FLAG_EXACT;
    if (bestValue <= alphaOrig) flag = FLAG_UPPER;
    else if (bestValue >= betaOrig) flag = FLAG_LOWER;
    transposition.set(key, { value: bestValue, flag, depth });
  }

  return bestValue;
}

// ═══════════════════════════════════════════════════════════════════
// STATIC EVALUATION
// ═══════════════════════════════════════════════════════════════════

function popcount(x) {
  x = x - ((x >> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
  return (((x + (x >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
}

function evaluate(cpuMask, playerMask) {
  let score = 0;

  for (let i = 0; i < lineMasks.length; i += 1) {
    const lm = lineMasks[i];
    const cpuHits = popcount(cpuMask & lm);
    const plrHits = popcount(playerMask & lm);

    if (cpuHits === 3) { score += 1; continue; }
    if (plrHits === 3) { score -= 1; continue; }
    if (cpuHits > 0 && plrHits > 0) continue;

    if (cpuHits === 2) score += 0.15;
    else if (cpuHits === 1) score += 0.02;

    if (plrHits === 2) score -= 0.15;
    else if (plrHits === 1) score -= 0.02;
  }

  return score;
}

// ═══════════════════════════════════════════════════════════════════
// MOVE ORDERING
// ═══════════════════════════════════════════════════════════════════

function buildOrderedMoves(cpuMask, playerMask, cpuTurn) {
  const occupiedMask = (cpuMask | playerMask) >>> 0;
  const ownMask = cpuTurn ? cpuMask : playerMask;
  const moves = [];

  for (let bitIdx = 0; bitIdx < bitToBoard.length; bitIdx += 1) {
    const bit = bitMasks[bitIdx];
    if (occupiedMask & bit) continue;

    moves.push({
      bit: bitIdx,
      immediate: linesCompletedByMove(ownMask, bitIdx),
      blocks: blockedThreats(cpuMask, playerMask, bitIdx, cpuTurn),
      lineCount: cellLineCounts[bitIdx],
      boardIdx: bitToBoard[bitIdx],
    });
  }

  moves.sort((a, b) =>
    b.immediate - a.immediate ||
    b.blocks - a.blocks ||
    b.lineCount - a.lineCount ||
    a.boardIdx - b.boardIdx
  );

  return moves;
}

function linesCompletedByMove(sideMask, bitIdx) {
  const nextMask = (sideMask | bitMasks[bitIdx]) >>> 0;
  let gained = 0;

  for (const lineIdx of cellToLines[bitIdx]) {
    const lineMask = lineMasks[lineIdx];
    if ((nextMask & lineMask) === lineMask) gained += 1;
  }

  return gained;
}

function blockedThreats(cpuMask, playerMask, bitIdx, cpuTurn) {
  const opponentMask = cpuTurn ? playerMask : cpuMask;
  const moveBit = bitMasks[bitIdx];
  let blocked = 0;

  for (const lineIdx of cellToLines[bitIdx]) {
    const lineMask = lineMasks[lineIdx];
    const neededMask = (lineMask ^ moveBit) >>> 0;
    if ((opponentMask & neededMask) === neededMask) blocked += 1;
  }

  return blocked;
}

// ═══════════════════════════════════════════════════════════════════
// BITBOARD UTILITIES
// ═══════════════════════════════════════════════════════════════════

function boardToMasks(board, side) {
  if (!Array.isArray(board) || board.length !== 27) {
    throw new Error('Super Hard solver expected a 27-cell board.');
  }

  const solvingSide = side === player ? player : cpu;
  const opponentSide = solvingSide === cpu ? player : cpu;
  let cpuMask = 0;
  let playerMask = 0;

  for (let bitIdx = 0; bitIdx < bitToBoard.length; bitIdx += 1) {
    const boardIdx = bitToBoard[bitIdx];
    const value = board[boardIdx];
    if (value === solvingSide) cpuMask |= bitMasks[bitIdx];
    else if (value === opponentSide) playerMask |= bitMasks[bitIdx];
  }

  return {
    cpuMask: cpuMask >>> 0,
    playerMask: playerMask >>> 0,
  };
}

function makeKey(cpuMask, playerMask, cpuTurn) {
  const canonical = canonicalize(cpuMask, playerMask);
  return BigInt(canonical.cpuMask) |
    (BigInt(canonical.playerMask) << 26n) |
    (BigInt(cpuTurn ? 1 : 0) << 52n);
}

function canonicalize(cpuMask, playerMask) {
  let bestCpu = cpuMask >>> 0;
  let bestPlayer = playerMask >>> 0;

  for (let rotIdx = 1; rotIdx < rotationBitValues.length; rotIdx += 1) {
    const rotatedCpu = rotateMask(cpuMask, rotationBitValues[rotIdx]);
    const rotatedPlayer = rotateMask(playerMask, rotationBitValues[rotIdx]);

    if (rotatedCpu < bestCpu || (rotatedCpu === bestCpu && rotatedPlayer < bestPlayer)) {
      bestCpu = rotatedCpu;
      bestPlayer = rotatedPlayer;
    }
  }

  return { cpuMask: bestCpu, playerMask: bestPlayer };
}

function rotateMask(mask, bitValues) {
  let source = mask >>> 0;
  let rotated = 0;

  while (source) {
    const lsb = source & -source;
    const bitIdx = 31 - Math.clz32(lsb);
    rotated |= bitValues[bitIdx];
    source ^= lsb;
  }

  return rotated >>> 0;
}

function buildRotationBitValues(boardToBit) {
  const coordToBit = new Map();
  const coords = bitToBoard.map(boardIdx => {
    const x = (boardIdx % 3) - 1;
    const y = Math.floor(boardIdx / 3) % 3 - 1;
    const z = Math.floor(boardIdx / 9) - 1;
    coordToBit.set(coordKey(x, y, z), boardToBit[boardIdx]);
    return [x, y, z];
  });

  const bitValueSets = [];
  const seen = new Set();
  const axisPermutations = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];

  for (const perm of axisPermutations) {
    const parity = permutationParity(perm);
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          if (sx * sy * sz * parity !== 1) continue;

          const values = new Uint32Array(coords.length);
          const keyParts = [];

          for (let bitIdx = 0; bitIdx < coords.length; bitIdx += 1) {
            const src = coords[bitIdx];
            const rx = src[perm[0]] * sx;
            const ry = src[perm[1]] * sy;
            const rz = src[perm[2]] * sz;
            const mappedBit = coordToBit.get(coordKey(rx, ry, rz));

            values[bitIdx] = bitMasks[mappedBit];
            keyParts.push(mappedBit);
          }

          const key = keyParts.join(',');
          if (seen.has(key)) continue;
          seen.add(key);
          bitValueSets.push(values);
        }
      }
    }
  }

  if (bitValueSets.length !== 24) {
    throw new Error(`Expected 24 cube rotations, got ${bitValueSets.length}.`);
  }

  return bitValueSets;
}

function permutationParity(perm) {
  let inversions = 0;
  for (let i = 0; i < perm.length; i += 1) {
    for (let j = i + 1; j < perm.length; j += 1) {
      if (perm[i] > perm[j]) inversions += 1;
    }
  }
  return inversions % 2 === 0 ? 1 : -1;
}

function coordKey(x, y, z) {
  return `${x},${y},${z}`;
}
