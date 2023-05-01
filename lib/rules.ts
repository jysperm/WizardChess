import * as _ from 'lodash';
import {Board, BoardIndex, Camp, Chess, ChessType, PositionPair, Situation} from './notation';

export type Moves = Board<boolean>;

export interface ChessRules {
  getMoves(Situation, BoardIndex): Moves;
}

var KingRules: ChessRules = {
  getMoves: function(situation, position) {
    var source = situation.getSlots()[position];
    var moves = emptyMoves();

    [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].forEach( pair => {
      var target = relativePosition(position, pair);
      var targetSlot = situation.getSlots()[target];

      if (inBoard(target) && (!targetSlot || source.camp != targetSlot.camp)) {
        moves[target] = true;
      }
    });

    return moves;
  }
};

var QueenRules: ChessRules = {
  getMoves: function(situation, position) {
    return unionMoves(
      RookRules.getMoves(situation, position),
      BishopRules.getMoves(situation, position)
    );
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
  }
}

var KnightRules: ChessRules = {
  getMoves: function(situation, position) {
    var source = situation.getSlots()[position];
    var moves = emptyMoves();

    [[-1, -2], [1, -2], [-2, -1], [2, -1], [-2, 1], [2, 1], [-1, 2], [1, 2]].forEach( pair => {
      var target = relativePosition(position, pair);
      var targetSlot = situation.getSlots()[target];

      if (inBoard(target) && (!targetSlot || source.camp != targetSlot.camp)) {
        moves[target] = true;
      }
    });

    return moves;
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
  return new Array(64).fill(false);
}

function unionMoves(moves1: Moves, moves2: Moves) {
  return emptyMoves().map( (value, position) => {
    return moves1[position] || moves2[position];
  });
}

function inBoard(position: BoardIndex): boolean {
  return position >= 0 && position <= 63;
}

function relativePosition(base: BoardIndex, pair: PositionPair): BoardIndex {
  return base + pair[1] * 8 + pair[0]
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
