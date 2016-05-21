import {Camp, Chess, ChessType} from '../lib/notation';

export function chessToUnicode(chess: Chess): string {
  if (!chess) {
    return ''
  } else if (chess.camp == Camp.white) {
    return ({
      [ChessType.king]: '\u2654',
      [ChessType.queen]: '\u2655',
      [ChessType.rook]: '\u2656',
      [ChessType.bishop]: '\u2657',
      [ChessType.knight]: '\u2658',
      [ChessType.pawn]: '\u2659'
    })[chess.type];
  } else {
    return ({
      [ChessType.king]: '\u265A',
      [ChessType.queen]: '\u265B',
      [ChessType.rook]: '\u265C',
      [ChessType.bishop]: '\u265D',
      [ChessType.knight]: '\u265E',
      [ChessType.pawn]: '\u265F'
    })[chess.type];
  }
}
