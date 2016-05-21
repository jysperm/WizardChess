import * as _ from 'lodash';
import {Camp, Situation} from './notation';
import search, {MovesWithScore, SearchOptions} from './search';

type WorkerCallback = (moves: MovesWithScore, costs: number) => void;

interface SearchWorker {
  search(situation: Situation, camp: Camp, options: SearchOptions, callback: WorkerCallback);
}

export function createSyncWorker(): SearchWorker {
  return {
    search: function(situation, camp, options, callback) {
      var started = Date.now();
      var moves = search(situation, camp, options);
      return callback(moves, Date.now() - started);
    }
  };
}
