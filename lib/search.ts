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
  algorithm?: 'negamax' | 'alphabeta';
  depth?: number;
}

const defaultOptions: SearchOptions = {
  algorithm: 'alphabeta',
  depth: 4
};

export function evaluate(situation: Situation, camp: Camp): number {
  var ourScore = 0;
  var oppositeScore = 0;

  situation.getSlots().forEach( (chess, index) => {
    if (chess) {
      if (chess.camp == camp) {
        ourScore += rules.of(chess).getScore(situation, index);
      } else {
        oppositeScore += rules.of(chess).getScore(situation, index);
      }
    }
  });

  return ourScore - oppositeScore;
}

export default function search(situation: Situation, camp: Camp, options: SearchOptions = {}): MovesWithScore {
  var {depth, algorithm} = <SearchOptions> _.defaults(options, defaultOptions);

  if (algorithm == 'negamax') {
    return getAllMoves(situation, camp).map( move => {
      return {
        move: move,
        score: negaMaxSearch(depth - 1, situation.moveChess(move.from, move.to), camp)
      };
    });
  } else if (algorithm == 'alphabeta') {
    return getAllMoves(situation, camp).map( move => {
      return {
        move: move,
        score: alphaBetaSearch(depth -1, situation.moveChess(move.from, move.to), camp, camp, -Infinity, Infinity)
      }
    });
  } else {
    return [];
  }
}

function negaMaxSearch(depth: number, situation: Situation, camp: Camp): number {
  if (depth <= 0) {
    return evaluate(situation, camp);
  } else {
    return getAllMoves(situation, camp).reduce( (best, move) => {
      return Math.max(best, -negaMaxSearch(depth - 1, situation.moveChess(move.from, move.to), anotherCamp(camp)));
    }, -Infinity);
  }
}

function alphaBetaSearch(depth: number, situation: Situation, camp: Camp, currentCamp: Camp, alpha: number, beta: number): number {
  if (depth <= 0) {
    return evaluate(situation, camp);
  } else {
    var moves = getAllMoves(situation, camp);

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
