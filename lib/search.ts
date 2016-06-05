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
  depth?: number;
}

const defaultOptions: SearchOptions = {
  depth: 2
};

const pseudoInfinity = 10000;

export function evaluate(situation: Situation, camp: Camp): number {
  var ourScore = 0;
  var ourKing = false;
  var oppositeScore = 0;
  var oppositeKing = false;

  situation.getSlots().forEach( (chess, index) => {
    if (chess) {
      if (chess.camp == camp) {
        ourScore += rules.of(chess).getScore(situation, index);
        ourKing = ourKing || chess.type == ChessType.king;
      } else {
        oppositeScore += rules.of(chess).getScore(situation, index);
        oppositeKing = oppositeKing || chess.type == ChessType.king;
      }
    }
  });

  if (!ourKing) {
    ourScore -= pseudoInfinity;
  }

  if (!oppositeKing) {
    oppositeScore -= pseudoInfinity;
  }

  return ourScore - oppositeScore;
}

export default function search(situation: Situation, camp: Camp, options: SearchOptions = {}): MovesWithScore {
  var {depth} = <SearchOptions> _.defaults(options, defaultOptions);

  return getAllMoves(situation, camp).map( move => {
    return {
      move: move,
      score: negaMaxSearch(depth - 1, situation.moveChess(move.from, move.to), camp)
    };
  });
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

function alphaBetaSearch(depth: number, situation: Situation, camp: Camp, alpha: number, beta: number): number {
  return
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
