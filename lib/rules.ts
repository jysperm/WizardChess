import * as _ from 'lodash';
import {Board, BoardIndex, Camp, Chess, ChessType, PositionPair, Situation} from './notation';

export type Moves = Board<boolean>;

export interface ChessRules {
  getMoves(Situation, BoardIndex): Moves;
  getScore(Situation, BoardIndex): number;
}

var KingRules: ChessRules = {
  getMoves: function(situation, position) {
    var source = situation.getSlots()[position];

    return createMoves(situation, (index, target) => {
      return [
        pair(-1, -1), pair(0, -1), pair(1, -1), pair(-1, 0),
        pair(1, 0), pair(-1, 1), pair(0, 1), pair(1, 1)
      ].some( validPair => {
        return _.isEqual(validPair, relativePosition(position, index)) && (!target || source.camp != target.camp);
      });
    });
  },
  getScore: function(situation, position) {
    return _.compact(KingRules.getMoves(situation, position)).length * 2;
  }
};

var QueenRules: ChessRules = {
  getMoves: function(situation, position) {
    return unionMoves(
      RookRules.getMoves(situation, position),
      BishopRules.getMoves(situation, position)
    );
  },
  getScore: function(situation, position) {
    return 1000 + _.compact(QueenRules.getMoves(situation, position)).length * 2;
  }
};

var RookRules: ChessRules = {
  getMoves: function(situation, position) {
    var moves = emptyMoves();
    var sourceChess = situation.getSlots()[position];

    [-8, -1, 1, 8].forEach( direction => {
      var distance = 1;

      do {
        var target = position + direction * distance;
        var targetChess = situation.getSlots()[target];

        if (inBoard(target) && (inHorizontalLine(position, target) || inVerticalLine(position, target))) {
          if (!targetChess) {
            moves[target] = true;
          } else if (sourceChess.camp != targetChess.camp) {
            moves[target] = true;
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      } while(distance++);
    });

    return moves;
  },
  getScore: function(situation, position) {
    return 500 + _.compact(RookRules.getMoves(situation, position)).length * 2;
  }
};

var BishopRules: ChessRules = {
  getMoves: function(situation, position) {
    var moves = emptyMoves();
    var sourceChess = situation.getSlots()[position];

    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach( ([xDirection, yDirection]) => {
      var distance = 1;

      do {
        var target = position + (yDirection * distance * 8) + (xDirection * distance);
        var targetChess = situation.getSlots()[target];

        if (inBoard(target) && inDiagonalLine(position, target)) {
          if (!targetChess) {
            moves[target] = true;
          } else if (sourceChess.camp != targetChess.camp) {
            moves[target] = true;
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      } while(distance++);
    });

    return moves;
  },
  getScore: function(situation, position) {
    return 300 + _.compact(BishopRules.getMoves(situation, position)).length * 2;
  }
}

var KnightRules: ChessRules = {
  getMoves: function(situation, position) {
    var source = situation.getSlots()[position];

    return createMoves(situation, (index, target) => {
      return [
        pair(-1, -2), pair(1, -2), pair(-2, -1), pair(2, -1),
        pair(-2, 1), pair(2, 1), pair(-1, 2), pair(1, 2)
      ].some( validPair => {
        return _.isEqual(validPair, relativePosition(position, index)) && (!target || source.camp != target.camp);
      });
    });
  },
  getScore: function(situation, position) {
    return 400 + _.compact(KnightRules.getMoves(situation, position)).length * 3;
  }
};

var PawnRules: ChessRules = {
  getMoves: function(situation, position) {
    var moves = emptyMoves();
    var sourceChess = situation.getSlots()[position];
    var campOffset = sourceChess.camp == Camp.white ? -1 : 1;
    var initial = y(position) == (sourceChess.camp == Camp.white ? 6 : 1);

    var tryToMove = function(offset): boolean {
      var target = position + offset * campOffset;

      if (inBoard(target) && !situation.getSlots()[target]) {
        return moves[target] = true;
      }
    };

    if (tryToMove(8) && initial) {
      tryToMove(16);
    }

    [7, 9].forEach( offset => {
      var target = position + offset * campOffset;
      var targetChess = situation.getSlots()[target];

      if (inBoard(target) && y(target) == y(position) + campOffset && targetChess && sourceChess.camp != targetChess.camp) {
        moves[target] = true;
      }
    });

    return moves;
  },
  getScore: function(situation, position) {
    var positionScore = (situation.getSlots()[position].camp == Camp.white ? 6 - y(position) : y(position) - 1) * 2;
    return 100 + _.compact(PawnRules.getMoves(situation, position)).length * 2 + positionScore;
  }
};

export var rules = {
  [ChessType.king]: KingRules,
  [ChessType.queen]: QueenRules,
  [ChessType.rook]: RookRules,
  [ChessType.bishop]: BishopRules,
  [ChessType.knight]: KnightRules,
  [ChessType.pawn]: PawnRules
};

export function of(chess: Chess): ChessRules {
  return rules[chess.type];
}

function emptyMoves(): Moves {
  return _.range(64).map( () => {
    return false;
  });
}

function createMoves(situation: Situation, iterator: (BoardIndex, Chess) => boolean): Moves {
  return emptyMoves().map( (move, index) => {
    var target = situation.getSlots()[index];
    return iterator(index, target);
  });
}

function unionMoves(moves1: Moves, moves2: Moves) {
  return emptyMoves().map( (value, position) => {
    return moves1[position] || moves2[position];
  });
}

function inBoard(position: BoardIndex): boolean {
  return position >= 0 && position <= 63;
}

function relativePosition(base: BoardIndex, target: BoardIndex): PositionPair {
  return pair(x(target) - x(base), y(target) - y(base));
}

function pair(x: number, y: number): PositionPair {
  return [x, y];
}

function pairToBoardIndex(pair: PositionPair): BoardIndex {
  return pair[1] * 8 + pair[0];
}

function x(position: BoardIndex): number {
  return position % 8;
}

function y(position: BoardIndex): number {
  return Math.floor(position / 8);
}

function inHorizontalLine(position1: BoardIndex, position2: BoardIndex): boolean {
  return y(position1) == y(position2);
}

function inVerticalLine(position1: BoardIndex, position2: BoardIndex): boolean {
  return x(position1) == x(position2);
}

function inDiagonalLine(position1: BoardIndex, position2: BoardIndex): boolean {
  return Math.abs(x(position1) - x(position2)) == Math.abs(y(position1) - y(position2));
}
