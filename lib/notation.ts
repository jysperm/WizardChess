import * as _ from 'lodash';

export enum ChessType {
  king, queen, rook, bishop, knight, pawn
}

export enum Camp {
  black, white
}

export interface Chess {
  type: ChessType;
  camp: Camp;
}

export type Position = number;

export class Situation {
  private slots: Array<Chess>;

  constructor(slots) {
    this.slots = slots;
  }

  public static fromFenString(fenString: string): Situation {
    var currentIndex = 0;
    var slots: Array<Chess> = [];

    _.forEach(fenString, char => {
      if (isNumberChar(char)) {
        for (var i = 0; i < parseInt(char); i++) {
          slots[currentIndex++] = null;
        }
      } else if (char != '/') {
        slots[currentIndex++] = fenCharToChess(char);
      }
    });

    return new Situation(slots);
  }

  public getSlots() {
    return this.slots;
  }

  public getChess(position: Position): Chess {
    return this.slots[position];
  }

  public toFenString(): string {
    return _.chunk(this.slots, 8).slice(0, 8).map( slots => {
      return slots.map(chessToFenChar).reduce( ({fenString, gaps}, char, position) => {
        if (char) {
          if (gaps) {
            fenString += gaps;
            gaps = 0;
          }

          fenString += char;
        } else {
          if (position == 7) {
            fenString += gaps + 1;
          } else {
            gaps++;
          }
        }

        return {fenString, gaps};
      }, {fenString: '', gaps: 0}).fenString;
    }).join('/');
  }
}

function fenCharToChess(char: string): Chess {
  const mapping = {
    'K': ChessType.king,
    'Q': ChessType.queen,
    'R': ChessType.rook,
    'B': ChessType.bishop,
    'N': ChessType.knight,
    'P': ChessType.pawn
  };

  return {
    type: mapping[char.toUpperCase()],
    camp: isUpperCase(char) ? Camp.white : Camp.black
  };
}

function chessToFenChar(chess: Chess): string {
  const mapping = {
    [ChessType.king]: 'K',
    [ChessType.queen]: 'Q',
    [ChessType.rook]: 'R',
    [ChessType.bishop]: 'B',
    [ChessType.knight]: 'N',
    [ChessType.pawn]: 'P'
  };

  if (chess) {
    var char = mapping[chess.type];
    return chess.camp == Camp.white ? char : char.toLowerCase();
  } else {
    return '';
  }
}

function isNumberChar(char: string): boolean {
  return isFinite(parseInt(char));
}

function isUpperCase(char: string): boolean {
  return char == char.toUpperCase();
}
