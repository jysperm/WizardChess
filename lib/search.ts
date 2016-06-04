import * as _ from 'lodash';
import {BoardIndex, Camp, Situation, anotherCamp} from './notation';
import * as rules from './rules';
import evaluate from './evaluate';

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

export default function search(situation: Situation, camp: Camp, options: SearchOptions = {}): MovesWithScore {
  var {depth} = <SearchOptions> _.defaults(options, defaultOptions);

  return getAllMoves(situation, camp).map( move => {
    return {
      move: move,
      score: negaMaxSearch(depth - 1, situation.moveChess(move.from, move.to), anotherCamp(camp))
    };
  });
}

function alphaBetaSearch(depth: number, situation: Situation, camp: Camp, alpha: number, beta: number): number {
  return
}

function negaMaxSearch(depth: number, situation: Situation, camp: Camp): number {
  if (depth <= 0) {
    return evaluate(situation, camp);
  } else {
    return getAllMoves(situation, camp).reduce( (best, move) => {
      return Math.max(best, negaMaxSearch(depth - 1, situation.moveChess(move.from, move.to), anotherCamp(camp)));
    }, 0);
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
