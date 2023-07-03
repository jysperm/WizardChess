import * as _ from 'lodash';
import {BoardIndex, Camp, Situation, anotherCamp, ChessType} from './notation';
import * as rules from './rules';

export type MovesWithScore = Array<{
  move: Move,
  score: number
}>

export interface Move {
  from: BoardIndex;
  to: BoardIndex;
}

export interface SearchOptions {
  flexibility?: boolean;
  depth?: number;
}

export var searchOptions: SearchOptions = {
  flexibility: true,
  depth: 5
};

const scoreOfChess = {
  [ChessType.king]: 10000,
  [ChessType.queen]: 1000,
  [ChessType.rook]: 500,
  [ChessType.bishop]: 300,
  [ChessType.knight]: 400,
  [ChessType.pawn]: 100
};

var metrics = resetMetrics();

export function evaluate(situation: Situation, camp: Camp): number {
  metrics.evaluate++;

  return situation.getSlots().reduce( (sum, chess, index) => {
    if (chess) {
      if (chess.camp == camp) {
        if (searchOptions.flexibility) {
          return sum + scoreOfChess[chess.type] + rules.of(chess).getMoves(situation, index).length;
        } else {
          return sum + scoreOfChess[chess.type];
        }
      } else {
        if (searchOptions.flexibility) {
          return sum - scoreOfChess[chess.type] - rules.of(chess).getMoves(situation, index).length;
        } else {
          return sum - scoreOfChess[chess.type];
        }
      }
    } else {
      return sum;
    }
  }, 0);
}

export default function search(situation: Situation, camp: Camp, depth?: number): MovesWithScore {
  depth = depth || searchOptions.depth;

  var result = getAllMoves(situation, camp).map( move => {
    return {
      move: move,
      score: alphaBetaSearch(depth - 1, situation.moveChess(move.from, move.to), camp, camp, -Infinity, Infinity)
    }
  });

  console.log(camp, metrics);
  metrics = resetMetrics();
  return result;
}

function alphaBetaSearch(depth: number, situation: Situation, camp: Camp, currentCamp: Camp, alpha: number, beta: number): number {
  if (depth <= 0) {
    return evaluate(situation, camp);
  } else {
    metrics.search++;

    var moves = getAllMoves(situation, camp)

    for (let move of moves) {
      if (camp == currentCamp) {
        alpha = Math.max(alpha,
          alphaBetaSearch(depth - 1, situation.moveChess(move.from, move.to), camp, anotherCamp(currentCamp), alpha, beta)
        );
      } else {
        beta = Math.min(beta,
          alphaBetaSearch(depth - 1, situation.moveChess(move.from, move.to), camp, anotherCamp(currentCamp), alpha, beta)
        );
      }

      if (beta <= alpha) {
        metrics.cut++;
        break;
      }
    }

    if (camp == currentCamp) {
      return alpha;
    } else {
      return beta;
    }
  }
}

function getAllMoves(situation: Situation, camp: Camp): Move[] {
  return _.flatten(situation.getSlots().map( (chess, from) => {
    if (chess && chess.camp == camp) {
      return _.compact(rules.of(chess).getMoves(situation, from).map( (canMove, to) => {
        if (canMove) {
          return createMove(from, to);
        } else {
          return null;
        }
      }));
    } else {
      return [];
    }
  }));
}

function createMove(from: BoardIndex, to: BoardIndex): Move {
  return {from, to};
}

function resetMetrics() {
  return {
    search: 0,
    evaluate: 0,
    cut: 0
  }
}
