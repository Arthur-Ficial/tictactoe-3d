(function () {
  'use strict';

  const root = window;
  const cpuNamespace = root.TTT3DCPU || (root.TTT3DCPU = {});

  const SCORE = Object.freeze({
    completedLine: 100,
    immediateCompletion: 160,
    cpuTwoInLine: 10,
    cpuOneInLine: 1,
    playerTwoInLine: -15,
    playerOneInLine: -1,
    cpuThreat: 8,
    playerThreat: 12,
  });

  cpuNamespace.getNormalCpuMove = function getNormalCpuMove(config) {
    const context = normalizeConfig(config);
    const availableMoves = getPlayableMoves(context.board, context.center);

    if (availableMoves.length === 0) {
      return -1;
    }

    let bestMove = availableMoves[0];
    let bestScore = -Infinity;

    for (const moveIndex of availableMoves) {
      const score = scoreCpuMove(context, moveIndex);
      if (score > bestScore) {
        bestScore = score;
        bestMove = moveIndex;
      }
    }

    return bestMove;
  };

  function normalizeConfig(config) {
    return {
      board: Array.isArray(config?.board) ? config.board.slice() : [],
      wins: Array.isArray(config?.wins) ? config.wins : [],
      center: Number.isInteger(config?.center) ? config.center : 13,
      player: config?.player || 'X',
      cpu: config?.cpu || 'O',
    };
  }

  function scoreCpuMove(context, moveIndex) {
    const { board, wins, cpu, player, center } = context;
    board[moveIndex] = cpu;

    const immediateCompletions = wins.filter(line => {
      return line.includes(moveIndex) && line.every(cellIndex => board[cellIndex] === cpu);
    }).length;

    const replyMoves = getPlayableMoves(board, center);
    let worstCaseScore = Infinity;

    if (replyMoves.length === 0) {
      worstCaseScore = evaluateBoard(context);
    } else {
      for (const replyIndex of replyMoves) {
        board[replyIndex] = player;
        const replyScore = evaluateBoard(context);
        board[replyIndex] = null;
        if (replyScore < worstCaseScore) {
          worstCaseScore = replyScore;
        }
      }
    }

    board[moveIndex] = null;
    return immediateCompletions * SCORE.immediateCompletion + worstCaseScore;
  }

  function evaluateBoard(context) {
    const { board, wins, cpu, player } = context;
    const cpuCompletedLines = countCompletedLines(board, wins, cpu);
    const playerCompletedLines = countCompletedLines(board, wins, player);
    let positionalScore = 0;

    for (const line of wins) {
      const cpuCount = countLineMarks(board, line, cpu);
      const playerCount = countLineMarks(board, line, player);

      if (playerCount === 0) {
        if (cpuCount === 2) positionalScore += SCORE.cpuTwoInLine;
        else if (cpuCount === 1) positionalScore += SCORE.cpuOneInLine;
      }

      if (cpuCount === 0) {
        if (playerCount === 2) positionalScore += SCORE.playerTwoInLine;
        else if (playerCount === 1) positionalScore += SCORE.playerOneInLine;
      }
    }

    positionalScore += countThreats(context, cpu, 2) * SCORE.cpuThreat;
    positionalScore -= countThreats(context, player, 2) * SCORE.playerThreat;

    return (
      (cpuCompletedLines - playerCompletedLines) * SCORE.completedLine +
      positionalScore
    );
  }

  function countCompletedLines(board, wins, side) {
    return wins.filter(line => line.every(cellIndex => board[cellIndex] === side)).length;
  }

  function countThreats(context, side, targetCount) {
    const { board, wins, player, cpu } = context;
    const opponent = side === player ? cpu : player;

    return wins.filter(line => {
      const sideCount = countLineMarks(board, line, side);
      const opponentCount = countLineMarks(board, line, opponent);
      return sideCount === targetCount && opponentCount === 0;
    }).length;
  }

  function countLineMarks(board, line, side) {
    let count = 0;
    for (const cellIndex of line) {
      if (board[cellIndex] === side) {
        count += 1;
      }
    }
    return count;
  }

  function getPlayableMoves(board, center) {
    const playableMoves = [];

    for (let cellIndex = 0; cellIndex < board.length; cellIndex += 1) {
      if (cellIndex !== center && board[cellIndex] === null) {
        playableMoves.push(cellIndex);
      }
    }

    return playableMoves;
  }
})();
