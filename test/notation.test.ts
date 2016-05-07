import * as assert from 'power-assert';
import {Camp, ChessType, Situation} from '../lib/notation';

describe('notation', function() {
  describe('Situation', function() {
    describe('fromFenString & toFenString', function() {
      it('initial situation', function() {
        const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
        var situation = Situation.fromFenString(initialFen);

        assert.deepEqual(situation.getSlots().slice(0, 16).map( chess => {
          assert.equal(chess.camp, Camp.black);
          return ChessType[chess.type];
        }), [
          'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
          'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'
        ]);

        situation.getSlots().slice(16, 48).forEach( chess => {
          assert.equal(chess, null);
        });

        assert.deepEqual(situation.getSlots().slice(48, 64).map( chess => {
          assert.equal(chess.camp, Camp.white);
          return ChessType[chess.type];
        }), [
          'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn',
          'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'
        ]);

        assert.equal(situation.toFenString(), initialFen);
      });

      it('more complex situation', function() {
        const complexFen = 'r2r4/p1p2kpp/2Qbbq2/4p3/8/2N5/PPPP1PPP/R1B1K2R';
        var situation = Situation.fromFenString(complexFen);

        assert.deepEqual(situation.getSlots().slice(0, 64).map( chess => {
          if (chess) {
            return `${Camp[chess.camp]}:${ChessType[chess.type]}`;
          } else {
            return null;
          }
        }), [
          'black:rook', null, null, 'black:rook', null, null, null, null,
          'black:pawn', null, 'black:pawn', null, null, 'black:king', 'black:pawn', 'black:pawn',
          null, null, 'white:queen', 'black:bishop', 'black:bishop', 'black:queen', null, null,
          null, null, null, null, 'black:pawn', null, null, null,
          null, null, null, null, null, null, null, null,
          null, null, 'white:knight', null, null, null, null, null,
          'white:pawn', 'white:pawn', 'white:pawn', 'white:pawn', null, 'white:pawn', 'white:pawn', 'white:pawn',
          'white:rook', null, 'white:bishop', null, 'white:king', null, null, 'white:rook'
        ]);

        assert.equal(situation.toFenString(), complexFen);
      });

      it('serialize cases', function() {
        [
          '5k2/ppp5/4P3/3R3p/6P1/1K2Nr2/PP3P2/8',
          'r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R',
          'rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R'
        ].forEach( fen => {
          assert.equal(Situation.fromFenString(fen).toFenString(), fen);
        });
      })
    });
  });
});
