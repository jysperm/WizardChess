import * as _ from 'lodash';
import * as assert from 'power-assert';
import {ChessType, Situation} from '../lib/notation';
import * as rules from '../lib/rules';

describe('rules', function() {
  describe('KingRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/5K2/8/8/8/8');

      assert.deepEqual(rules.of(situation.getChess(29)).getMoves(situation, 29), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, true, true, true, null,
        null, null, null, null, true, null, true, null,
        null, null, null, null, true, true, true, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);
    });

    it('capture and obstacles', function() {
      var situation = Situation.fromFenString('5k2/ppp2P2/4P3/3R3p/6P1/1K2Nr2/PP6/8');

      assert.deepEqual(rules.of(situation.getChess(5)).getMoves(situation, 5), [
        null, null, null, null, true, null, true, null,
        null, null, null, null, true, true, true, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);

      assert.deepEqual(rules.of(situation.getChess(41)).getMoves(situation, 41), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        true, true, true, null, null, null, null, null,
        true, null, true, null, null, null, null, null,
        null, null, true, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);
    });
  });

  describe('QueenRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/8/3Q4/8/8/8');

      assert.deepEqual(rules.of(situation.getChess(35)).getMoves(situation, 35), [
        null, null, null, true, null, null, null, true,
        true, null, null, true, null, null, true, null,
        null, true, null, true, null, true, null, null,
        null, null, true, true, true, null, null, null,
        true, true, true, null, true, true, true, true,
        null, null, true, true, true, null, null, null,
        null, true, null, true, null, true, null, null,
        true, null, null, true, null, null, true, null
      ]);
    });

    it('capture and obstacles', function() {
      var situation = Situation.fromFenString('5k2/ppp2P2/1Q2P3/3R3p/6P1/1K2Nrq1/PP6/8');

      assert.deepEqual(rules.of(situation.getChess(17)).getMoves(situation, 17), [
        null, null, null, null, null, null, null, null,
        true, true, true, null, null, null, null, null,
        true, null, true, true, null, null, null, null,
        true, true, true, null, null, null, null, null,
        null, true, null, true, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);

      assert.deepEqual(rules.of(situation.getChess(46)).getMoves(situation, 46), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, true, null, null, null, null,
        null, null, null, null, true, null, null, null,
        null, null, null, null, null, true, true, true,
        null, null, null, null, null, null, null, true,
        null, null, null, null, null, true, true, true,
        null, null, null, null, true, null, true, null
      ]);
    });
  });

  describe('RookRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/3R4/8/8/8/8');

      assert.deepEqual(rules.of(situation.getChess(27)).getMoves(situation, 27), [
        null, null, null, true, null, null, null, null,
        null, null, null, true, null, null, null, null,
        null, null, null, true, null, null, null, null,
        true, true, true, null, true, true, true, true,
        null, null, null, true, null, null, null, null,
        null, null, null, true, null, null, null, null,
        null, null, null, true, null, null, null, null,
        null, null, null, true, null, null, null, null
      ]);
    });
  });

  describe('BishopRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/3B4/8/8/8/8');

      assert.deepEqual(rules.of(situation.getChess(27)).getMoves(situation, 27), [
        true, null, null, null, null, null, true, null,
        null, true, null, null, null, true, null, null,
        null, null, true, null, true, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, true, null, true, null, null, null,
        null, true, null, null, null, true, null, null,
        true, null, null, null, null, null, true, null,
        null, null, null, null, null, null, null, true
      ]);
    });
  });

  describe('KnightRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/8/8/8/3N4/8/8/8');

      assert.deepEqual(rules.of(situation.getChess(35)).getMoves(situation, 35), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, true, null, true, null, null, null,
        null, true, null, null, null, true, null, null,
        null, null, null, null, null, null, null, null,
        null, true, null, null, null, true, null, null,
        null, null, true, null, true, null, null, null,
        null, null, null, null, null, null, null, null
      ]);
    });
  });

  describe('PawnRules', function() {
    it('empty board', function() {
      var situation = Situation.fromFenString('8/3p4/4p3/8/2P5/8/5P2/8');

      assert.deepEqual(rules.of(situation.getChess(11)).getMoves(situation, 11), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, true, null, null, null, null,
        null, null, null, true, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);

      assert.deepEqual(rules.of(situation.getChess(20)).getMoves(situation, 20), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, true, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);

      assert.deepEqual(rules.of(situation.getChess(34)).getMoves(situation, 34), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, true, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);

      assert.deepEqual(rules.of(situation.getChess(53)).getMoves(situation, 53), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, true, null, null,
        null, null, null, null, null, true, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);
    });

    it('capture and obstacles', function() {
      var situation = Situation.fromFenString('5k2/pppp4/4P3/3R3p/6P1/1K2Nr2/PP3P2/8');

      assert.deepEqual(rules.of(situation.getChess(20)).getMoves(situation, 20), [
        null, null, null, null, null, null, null, null,
        null, null, null, true, true, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);

      assert.deepEqual(rules.of(situation.getChess(53)).getMoves(situation, 53), [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]);
    });
  });
});
