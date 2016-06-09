import * as _ from 'lodash';
import {Board, BoardIndex, Camp, Chess, ChessType, PositionPair, Situation, Move} from './notation';

type Moves = Board<boolean>;

function generateMovesForKing(board: Situation, from: BoardIndex, camp: Camp) {
  return createMoves(board, (target, piece) => {
    return [
      pair(-1, -1), pair(0, -1), pair(1, -1), pair(-1, 0),
      pair(1, 0), pair(-1, 1), pair(0, 1), pair(1, 1)
    ].some( validPair => {
      return _.isEqual(validPair, relativePosition(from, target)) && (!piece || camp != piece.camp);
    });
  });
}

function generateMovesForQueue(board: Situation, from: BoardIndex, camp: Camp) {
  return unionMoves(
    generateMovesForRook(board, from, camp),
    generateMovesForBishop(board, from, camp)
  );
}

function generateMovesForRook(board: Situation, from: BoardIndex, camp: Camp) {
  var moves = emptyMoves();

  [-8, -1, 1, 8].forEach( direction => {
    var distance = 1;

    do {
      var target = from + direction * distance;
      var targetChess = board.getSlots()[target];

      if (inBoard(target) && (inHorizontalLine(from, target) || inVerticalLine(from, target))) {
        if (!targetChess) {
          moves[target] = true;
        } else if (camp != targetChess.camp) {
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

function generateMovesForBishop(board: Situation, from: BoardIndex, camp: Camp) {
  var moves = emptyMoves();

  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach( ([xDirection, yDirection]) => {
    var distance = 1;

    do {
      var target = from + (yDirection * distance * 8) + (xDirection * distance);
      var targetChess = board.getSlots()[target];

      if (inBoard(target) && inDiagonalLine(from, target)) {
        if (!targetChess) {
          moves[target] = true;
        } else if (camp != targetChess.camp) {
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

function generateMovesForKnight(board: Situation, from: BoardIndex, camp: Camp) {
  return createMoves(board, (target, piece) => {
    return [
      pair(-1, -2), pair(1, -2), pair(-2, -1), pair(2, -1),
      pair(-2, 1), pair(2, 1), pair(-1, 2), pair(1, 2)
    ].some( validPair => {
      return _.isEqual(validPair, relativePosition(from, target)) && (!piece || camp != piece.camp);
    });
  });
}

function generateMovesForPawn(board: Situation, from: BoardIndex, camp: Camp) {
  var moves = emptyMoves();
  var campOffset = camp == Camp.white ? -1 : 1;
  var initial = y(from) == (camp == Camp.white ? 6 : 1);

  var tryToMove = function(offset): boolean {
    var target = from + offset * campOffset;

    if (inBoard(target) && !board.getSlots()[target]) {
      return moves[target] = true;
    }
  };

  if (tryToMove(8) && initial) {
    tryToMove(16);
  }

  [7, 9].forEach( offset => {
    var target = from + offset * campOffset;
    var piece = board.getSlots()[target];

    if (inBoard(target) && y(target) == y(from) + campOffset && piece && camp != piece.camp) {
      moves[target] = true;
    }
  });

  return moves;
}

export var moveGenerators = {
  [ChessType.king]: generateMovesForKing,
  [ChessType.queen]: generateMovesForQueue,
  [ChessType.rook]: generateMovesForRook,
  [ChessType.bishop]: generateMovesForBishop,
  [ChessType.knight]: generateMovesForKnight,
  [ChessType.pawn]: generateMovesForPawn
}

export function getAvailableMovesBoard(board: Situation, from: BoardIndex): Moves {
  var piece = board.getSlots()[from];
  return moveGenerators[piece.type](board, from, piece.camp)
}

export function generateMoves(board: Situation, from: BoardIndex): Array<Move> {
  var piece = board.getSlots()[from];

  return <Array<Move>> _.compact(moveGenerators[piece.type](board, from, piece.camp).map( (canMove, to) => {
    if (canMove) {
      return {from, to};
    } else {
      return null;
    }
  }));
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
