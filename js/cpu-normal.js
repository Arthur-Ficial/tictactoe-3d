(function () {
  'use strict';

  const root = window;
  const cpuNS = root.TTT3DCPU || (root.TTT3DCPU = {});

  cpuNS.getNormalCpuMove = function getNormalCpuMove(config) {
    const board = Array.isArray(config?.board) ? config.board.slice() : [];
    const wins = Array.isArray(config?.wins) ? config.wins : [];
    const center = Number.isInteger(config?.center) ? config.center : 13;
    const player = config?.player || 'X';
    const cpu = config?.cpu || 'O';

    function isPlayable(b, idx) {
      return idx !== center && b[idx] === null;
    }

    function getEmpties(b) {
      return b.map((value, idx) => (isPlayable(b, idx) ? idx : -1)).filter(idx => idx >= 0);
    }

    function countCompleted(b, who) {
      return wins.filter(line => line.every(idx => b[idx] === who)).length;
    }

    function countThreats(b, who, count) {
      const opponent = who === player ? cpu : player;
      return wins.filter(line => {
        const mine = line.filter(idx => b[idx] === who).length;
        const theirs = line.filter(idx => b[idx] === opponent).length;
        return mine === count && theirs === 0;
      }).length;
    }

    function evalBoard(b) {
      const cpuLines = countCompleted(b, cpu);
      const playerLines = countCompleted(b, player);

      let positional = 0;
      for (const line of wins) {
        const cpuCount = line.filter(idx => b[idx] === cpu).length;
        const playerCount = line.filter(idx => b[idx] === player).length;

        if (playerCount === 0) {
          if (cpuCount === 2) positional += 10;
          else if (cpuCount === 1) positional += 1;
        }

        if (cpuCount === 0) {
          if (playerCount === 2) positional -= 15;
          else if (playerCount === 1) positional -= 1;
        }
      }

      positional += countThreats(b, cpu, 2) * 8;
      positional -= countThreats(b, player, 2) * 12;

      return (cpuLines - playerLines) * 100 + positional;
    }

    function scoreMoveForCpu(b, idx) {
      b[idx] = cpu;

      const immediate = wins.filter(line => line.includes(idx) && line.every(cell => b[cell] === cpu)).length;
      const replies = getEmpties(b);
      let worstForCpu = Infinity;

      if (!replies.length) {
        worstForCpu = evalBoard(b);
      } else {
        for (const reply of replies) {
          b[reply] = player;
          const score = evalBoard(b);
          b[reply] = null;
          if (score < worstForCpu) worstForCpu = score;
        }
      }

      b[idx] = null;
      return immediate * 160 + worstForCpu;
    }

    const available = getEmpties(board);
    if (!available.length) return -1;

    let bestScore = -Infinity;
    let bestIdx = available[0];

    for (const idx of available) {
      const score = scoreMoveForCpu(board, idx);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }

    return bestIdx;
  };
})();
