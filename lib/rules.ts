import * as _ from 'lodash';
import {Camp, Chess, ChessType, Position, Situation} from './notation';

export type Moves = Array<boolean>;

export interface ChessRules {
  getMoves(Situation, Position): Moves;
}

var KingRules: ChessRules = {
  getMoves: function(situation, position) {
    var moves = emptyMoves();
    var sourceChess = situation.getChess(position);

    [-9, -8, -7, -1, 1, 7, 8, 9].forEach( offset => {
      var target = position + offset;

      if (inBoard(target)) {
        var targetChess = situation.getChess(target);

        if (!targetChess || sourceChess.camp != targetChess.camp) {
          moves[target] = true;
        }
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
    var sourceChess = situation.getChess(position);

    [-8, -1, 1, 8].forEach( direction => {
      var distance = 1;

      do {
        var target = position + direction * distance;
        var targetChess = situation.getChess(target);

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
    var sourceChess = situation.getChess(position);

    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach( ([xDirection, yDirection]) => {
      var distance = 1;

      do {
        var target = position + (yDirection * distance * 8) + (xDirection * distance);
        var targetChess = situation.getChess(target);

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
    var moves = emptyMoves();
    var sourceChess = situation.getChess(position);

    [-17, -15, -10, -6, 6, 10, 15, 17].forEach( offset => {
      var target = position + offset;


      if (inBoard(target)) {
        var targetChess = situation.getChess(target);

        if (!targetChess || sourceChess.camp != targetChess.camp) {
          moves[target] = true;
        }
      }
    });

    return moves;
  }
};

var PawnRules: ChessRules = {
  getMoves: function(situation, position) {
    var moves = emptyMoves();
    var sourceChess = situation.getChess(position);
    var campOffset = sourceChess.camp == Camp.white ? -1 : 1;
    var initial = y(position) == (sourceChess.camp == Camp.white ? 6 : 1);

    var tryToMove = function(offset): boolean {
      var target = position + offset * campOffset;

      if (inBoard(target) && !situation.getChess(target)) {
        return moves[target] = true;
      }
    };

    if (tryToMove(8) && initial) {
      tryToMove(16);
    }

    [7, 9].forEach( offset => {
      var target = position + offset * campOffset;
      var targetChess = situation.getChess(target);

      if (inBoard(target) && targetChess && sourceChess.camp != targetChess.camp) {
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
  return _.range(64).map( () => {
    return null;
  });
}

function unionMoves(moves1, moves2) {
  return emptyMoves().map( (value, position) => {
    return moves1[position] || moves2[position];
  });
}

function inBoard(position: Position): boolean {
  return position >= 0 && position <= 63;
}

function x(position: Position): number {
  return position % 8;
}

function y(position: Position): number {
  return Math.floor(position / 8);
}

function inHorizontalLine(position1: Position, position2: Position): boolean {
  return y(position1) == y(position2);
}

function inVerticalLine(position1: Position, position2: Position): boolean {
  return x(position1) == x(position2);
}

function inDiagonalLine(position1: Position, position2: Position): boolean {
  return Math.abs(x(position1) - x(position2)) == Math.abs(y(position1) - y(position2));
}
