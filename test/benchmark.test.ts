import {Camp, Situation} from '../lib/notation';
import {MovesWithScore, searchOptions} from '../lib/search';
import {createSyncWorker, SearchWorker} from '../lib/workers';

searchOptions.depth = 3;

var worker = createSyncWorker();

function run(fenStrings) {
  fenStrings.forEach( fenString => {
    var situation = Situation.fromFenString(fenString);
    worker.search(situation, Camp.white, null);
    worker.search(situation, Camp.black, null);
  });
}

describe('benchmark', function() {
  this.timeout(600 * 1000);

  it('openings', function() {
    run([
      'rn2k2r/pp2bppp/1qpp1n2/4p1B1/2BPP1b1/2P2N2/PP3PPP/RN1QR1K1',
      'rnbqk2r/p1pp1ppp/1p2pn2/8/1bPP4/2N1P3/PP2NPPP/R1BQKB1R',
      'rnbqk1nr/ppp1ppbp/3p2p1/7P/4P3/5N2/PPPP1PP1/RNBQKB1R',
      'r1bqkbnr/pp2pppp/2np4/2p5/3PP3/2P2N2/PP3PPP/RNBQKB1R',
      'rnb1kbnr/pp2pppp/8/2pq4/3P4/2P5/PP3PPP/RNBQKBNR'
    ]);
  });

  it('middlegame', function() {
    run([
      '3rr1k1/pp3ppp/1qp5/8/4R1P1/1BP2Q2/PP3PPb/RN4K',
      '2rq1rk1/p4ppp/bp3n2/n2Pp3/2P5/P1QB4/3BNPPP/R4RK1',
      'r2q4/ppp1pkr1/4bnp1/4p3/4P3/2NP1B2/PPPQ4/2K2R1R',
      'r4rk1/pp1qppb1/6pp/8/2Q4B/2P2N2/PP3PPP/R3K2R',
      '4r1k1/p5pp/1pq1p3/nQ4B1/2P1b1P1/P6P/4BP2/2R3K1'
    ]);
  });

  it('endgames', function() {
    run([
      '8/7R/8/1N1k2p1/1P4P1/5P2/P5PK/8',
      '3Nk3/p2np1r1/2B3p1/4Pb2/3Q4/8/PPP5/2K2R1R',
      '3R4/p4Qbk/4p1pp/8/8/2P2P2/qP3BPP/5RK1',
      '8/p5pB/4b3/2p1k3/6P1/P3K2P/8/8',
      'q7/p3NQpk/1p5p/6PP/PP6/8/5P2/6K1'
    ]);
  });
});
