import * as assert from 'power-assert';
import {evaluate} from '../lib/search';
import {Camp, Situation} from '../lib/notation';

describe('evaluate', function() {
  describe('evaluate', function() {
    it('initial situation', function() {
      var situation = Situation.fromFenString('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

      assert.equal(evaluate(situation, Camp.white), 0);
      assert.equal(evaluate(situation, Camp.black), 0);
    });

    it('more complex cases', function() {
      assert.equal(evaluate(Situation.fromFenString('r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R'), Camp.white), 400);
      assert.equal(evaluate(Situation.fromFenString('r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R'), Camp.black), -400);
      assert.equal(evaluate(Situation.fromFenString('5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8'), Camp.white), 500);
      assert.equal(evaluate(Situation.fromFenString('5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8'), Camp.black), -500);
    });
  });
});
