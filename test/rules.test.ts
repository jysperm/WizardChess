import * as _ from 'lodash';
import * as assert from 'power-assert';
import {ChessType, Situation} from '../lib/notation';
import * as rules from '../lib/rules';

describe('rules', function() {
  describe('KingRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/5K2/8/8/8/8');

      assert.deepEqual(rules.of(situation.getSlots()[29]).getMoves(situation, 29), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, true, true, true, false,
        false, false, false, false, true, false, true, false,
        false, false, false, false, true, true, true, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);
    });

    it('capture and obstacles', function() {
      var situation = Situation.fromFenString('5k2/ppp2P2/4P3/3R3p/6P1/1K2Nr2/PP6/8');

      assert.deepEqual(rules.of(situation.getSlots()[5]).getMoves(situation, 5), [
        false, false, false, false, true, false, true, false,
        false, false, false, false, true, true, true, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);

      assert.deepEqual(rules.of(situation.getSlots()[41]).getMoves(situation, 41), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        true, true, true, false, false, false, false, false,
        true, false, true, false, false, false, false, false,
        false, false, true, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);
    });
  });

  describe('QueenRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/8/3Q4/8/8/8');

      assert.deepEqual(rules.of(situation.getSlots()[35]).getMoves(situation, 35), [
        false, false, false, true, false, false, false, true,
        true, false, false, true, false, false, true, false,
        false, true, false, true, false, true, false, false,
        false, false, true, true, true, false, false, false,
        true, true, true, false, true, true, true, true,
        false, false, true, true, true, false, false, false,
        false, true, false, true, false, true, false, false,
        true, false, false, true, false, false, true, false
      ]);
    });

    it('capture and obstacles', function() {
      var situation = Situation.fromFenString('5k2/ppp2P2/1Q2P3/3R3p/6P1/1K2Nrq1/PP6/8');

      assert.deepEqual(rules.of(situation.getSlots()[17]).getMoves(situation, 17), [
        false, false, false, false, false, false, false, false,
        true, true, true, false, false, false, false, false,
        true, false, true, true, false, false, false, false,
        true, true, true, false, false, false, false, false,
        false, true, false, true, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);

      assert.deepEqual(rules.of(situation.getSlots()[46]).getMoves(situation, 46), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, true, false, false, false, false,
        false, false, false, false, true, false, false, false,
        false, false, false, false, false, true, true, true,
        false, false, false, false, false, false, false, true,
        false, false, false, false, false, true, true, true,
        false, false, false, false, true, false, true, false
      ]);
    });
  });

  describe('RookRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/3R4/8/8/8/8');

      assert.deepEqual(rules.of(situation.getSlots()[27]).getMoves(situation, 27), [
        false, false, false, true, false, false, false, false,
        false, false, false, true, false, false, false, false,
        false, false, false, true, false, false, false, false,
        true, true, true, false, true, true, true, true,
        false, false, false, true, false, false, false, false,
        false, false, false, true, false, false, false, false,
        false, false, false, true, false, false, false, false,
        false, false, false, true, false, false, false, false
      ]);
    });
  });

  describe('BishopRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/3B4/8/8/8/8');

      assert.deepEqual(rules.of(situation.getSlots()[27]).getMoves(situation, 27), [
        true, false, false, false, false, false, true, false,
        false, true, false, false, false, true, false, false,
        false, false, true, false, true, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, true, false, true, false, false, false,
        false, true, false, false, false, true, false, false,
        true, false, false, false, false, false, true, false,
        false, false, false, false, false, false, false, true
      ]);
    });
  });

  describe('KnightRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/8/3N4/8/8/8');

      assert.deepEqual(rules.of(situation.getSlots()[35]).getMoves(situation, 35), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, true, false, true, false, false, false,
        false, true, false, false, false, true, false, false,
        false, false, false, false, false, false, false, false,
        false, true, false, false, false, true, false, false,
        false, false, true, false, true, false, false, false,
        false, false, false, false, false, false, false, false
      ]);
    });
  });

  describe('PawnRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/3p4/4p3/8/2P5/8/5P2/8');

      assert.deepEqual(rules.of(situation.getSlots()[11]).getMoves(situation, 11), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, true, false, false, false, false,
        false, false, false, true, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);

      assert.deepEqual(rules.of(situation.getSlots()[20]).getMoves(situation, 20), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, true, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);

      assert.deepEqual(rules.of(situation.getSlots()[34]).getMoves(situation, 34), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, true, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);

      assert.deepEqual(rules.of(situation.getSlots()[53]).getMoves(situation, 53), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, true, false, false,
        false, false, false, false, false, true, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);
    });

    it('capture and obstacles', function() {
      var situation = Situation.fromFenString('5k2/pppp4/4P3/3R3p/6P1/1K2Nr2/PP3P2/8');

      assert.deepEqual(rules.of(situation.getSlots()[20]).getMoves(situation, 20), [
        false, false, false, false, false, false, false, false,
        false, false, false, true, true, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);

      assert.deepEqual(rules.of(situation.getSlots()[53]).getMoves(situation, 53), [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
      ]);
    });
  });
});
