import * as _ from 'lodash';
import {BoardIndex, Camp, Situation, anotherCamp, ChessType, Move} from './notation';
import * as rules from './rules';

export type MovesWithScore = Array<{
  move: Move,
  score: number
}>

export interface SearchOptions {
  algorithm?: 'negamax' | 'alphabeta';
  depth?: number;
}

const defaultOptions: SearchOptions = {
  algorithm: 'alphabeta',
  depth: 3
};

const chessScore = {
  [ChessType.king]: 10000,
  [ChessType.queen]: 1000,
  [ChessType.rook]: 500,
  [ChessType.bishop]: 300,
  [ChessType.knight]: 400,
  [ChessType.pawn]: 100
}

export function evaluate(situation: Situation, camp: Camp): number {
  var ourScore = 0;
  var oppositeScore = 0;

  situation.getSlots().forEach( (chess, index) => {
    if (chess) {
      if (chess.camp == camp) {
        ourScore += chessScore[chess.type];
      } else {
        oppositeScore += chessScore[chess.type];
      }
    }
  });

  var {ourMoves, oppositeMoves} = countAllMoves(situation, camp);

  ourScore += ourMoves * 2;
  oppositeScore += oppositeMoves * 2

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

    if (camp == currentCamp) {
      for (let move of moves) {
        alpha = Math.max(alpha,
          alphaBetaSearch(depth - 1, situation.moveChess(move.from, move.to), camp, anotherCamp(currentCamp), alpha, beta)
        );

        if (beta <= alpha) {
          break;
        }
      }

      return alpha;
    } else {
      for (let move of moves) {
        beta = Math.min(beta,
          alphaBetaSearch(depth - 1, situation.moveChess(move.from, move.to), camp, anotherCamp(currentCamp), alpha, beta)
        );

        if (beta <= alpha) {
          break;
        }
      }

      return beta;
    }
  }
}

function getAllMoves(situation: Situation, camp: Camp): Move[] {
  return _.flatten(situation.getSlots().map( (chess, from) => {
    if (chess && chess.camp == camp) {
      return rules.generateMoves(situation, from);
    } else {
      return [];
    }
  }));
}

function countAllMoves(situation: Situation, camp: Camp) {
  var ourMoves = 0;
  var oppositeMoves = 0;

  situation.getSlots().forEach( (chess, from) => {
    if (chess) {
      let moves = rules.moveGenerators[chess.type](situation, from, chess.camp).reduce( (previous, canMove) => {
        return canMove ? previous + 1 : previous;
      }, 0);

      if (chess.camp == camp) {
        ourMoves += moves;
      } else {
        oppositeMoves += moves;
      }
    }
  });

  return {ourMoves, oppositeMoves}
}

function createMove(from: BoardIndex, to: BoardIndex): Move {
  return {from, to};
}
