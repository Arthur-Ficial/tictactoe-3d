'use strict';

const FLAG_EXACT = 0;
const FLAG_LOWER = 1;
const FLAG_UPPER = 2;
const INF = 1e9;
const MAX_TT_SIZE = 500000;

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
    const result = solveBoard(message.board);
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

function solveBoard(board) {
  const { cpuMask, playerMask } = boardToMasks(board);
  const occupiedMask = (cpuMask | playerMask) >>> 0;
  if (occupiedMask === fullMask) {
    return { move: -1, scoreDiff: 0 };
  }

  let alpha = -INF;
  let bestMove = -1;
  let bestScore = -INF;

  const moves = buildOrderedMoves(cpuMask, playerMask, true);
  for (const move of moves) {
    const gain = move.immediate;
    const score = gain + solveState((cpuMask | bitMasks[move.bit]) >>> 0, playerMask, false, alpha - gain, INF - gain);
    if (score > bestScore) {
      bestScore = score;
      bestMove = bitToBoard[move.bit];
    }
    if (score > alpha) alpha = score;
  }

  return { move: bestMove, scoreDiff: bestScore };
}

function solveState(cpuMask, playerMask, cpuTurn, alpha, beta) {
  const occupiedMask = (cpuMask | playerMask) >>> 0;
  if (occupiedMask === fullMask) return 0;

  const alphaOrig = alpha;
  const betaOrig = beta;
  const key = makeKey(cpuMask, playerMask, cpuTurn);
  const cached = transposition.get(key);

  if (cached) {
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
      const value = gain + solveState((cpuMask | bitMasks[move.bit]) >>> 0, playerMask, false, alpha - gain, beta - gain);
      if (value > bestValue) bestValue = value;
      if (value > alpha) alpha = value;
      if (alpha >= beta) break;
    }
  } else {
    for (const move of moves) {
      const gain = move.immediate;
      const value = solveState(cpuMask, (playerMask | bitMasks[move.bit]) >>> 0, true, alpha + gain, beta + gain) - gain;
      if (value < bestValue) bestValue = value;
      if (value < beta) beta = value;
      if (alpha >= beta) break;
    }
  }

  if (transposition.size < MAX_TT_SIZE) {
    let flag = FLAG_EXACT;
    if (bestValue <= alphaOrig) flag = FLAG_UPPER;
    else if (bestValue >= betaOrig) flag = FLAG_LOWER;
    transposition.set(key, { value: bestValue, flag });
  }

  return bestValue;
}

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

function boardToMasks(board) {
  if (!Array.isArray(board) || board.length !== 27) {
    throw new Error('Super Hard solver expected a 27-cell board.');
  }

  let cpuMask = 0;
  let playerMask = 0;

  for (let bitIdx = 0; bitIdx < bitToBoard.length; bitIdx += 1) {
    const boardIdx = bitToBoard[bitIdx];
    const value = board[boardIdx];
    if (value === cpu) cpuMask |= bitMasks[bitIdx];
    else if (value === player) playerMask |= bitMasks[bitIdx];
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
