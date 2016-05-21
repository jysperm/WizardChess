import * as _ from 'lodash';
import {Camp, Situation} from './notation';
import search, {MovesWithScore, SearchOptions} from './search';

type WorkerCallback = (moves: MovesWithScore, costs: number) => void;

export interface SearchWorker {
  search(situation: Situation, camp: Camp, options: SearchOptions, callback: WorkerCallback);
}

export function createSyncWorker(): SearchWorker {
  return {
    search: function(situation, camp, options, callback) {
      console.log('situation', situation)
      var started = Date.now();
      var moves = search(situation, camp, options);
      return callback(moves, Date.now() - started);
    }
  };
}

export function createBrowserWorker(): SearchWorker {
  var selfUrl: string = (<any>window.document).currentScript.src;
  var jobs: {[jobId: string]: WorkerCallback} = {};
  var worker = new Worker(selfUrl);

  worker.addEventListener('message', event => {
    jobs[event.data.jobId](event.data.moves, event.data.costs);
    delete jobs[event.data.jobId];
  });

  return {
    search: function(situation, camp, options, callback) {
      var jobId = _.uniqueId('job');
      jobs[jobId] = callback;
      worker.postMessage({jobId, situation, camp, options});
    }
  };
}

if (typeof document != 'object' && typeof postMessage == 'function') {
  self.addEventListener('message', function(event) {
    var started = Date.now();
    var moves = search(new Situation(event.data.situation.slots), event.data.camp, event.data.options);

    postMessage({
      jobId: event.data.jobId,
      moves: moves,
      costs: Date.now() - started
    }, null);
  });
}
