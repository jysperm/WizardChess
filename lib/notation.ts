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

/* array of 64 items */
export type Board<T> = Array<T>;
/* from 0 to 63 */
export type BoardIndex = number;
/* from a8 to h1 */
export type PositionName = string;
/* from [0, 0] to [7, 7] */
export type PositionPair = Array<number>;

export class Situation {
  private slots: Board<Chess>;

  constructor(slots: Board<Chess>) {
    this.slots = slots;
  }

  public static fromFenString(fenString: string): Situation {
    var currentIndex = 0;
    var slots: Board<Chess> = [];

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

  public getChess(position: PositionName): Chess {
    return this.slots[positionNameToBoardIndex(position)];
  }

  public moveChessByName(from: PositionName, to: PositionName): Situation {
    return this.moveChess(positionNameToBoardIndex(from), positionNameToBoardIndex(to));
  }

  public moveChess(from: BoardIndex, to: BoardIndex) {
    return new Situation(this.slots.map( (chess, index) => {
      if (index == to) {
        return this.slots[from];
      } else if (index == from) {
        return null;
      } else {
        return chess;
      }
    }));
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

export function positionNameToBoardIndex(position: PositionName): BoardIndex {
  var columnIndex = position[0], rowIndex = position[1];
  return (8 - parseInt(rowIndex)) * 8 + (columnIndex.charCodeAt(0) - 'a'.charCodeAt(0));
}

export function boardIndexToPositionName(index: BoardIndex): PositionName {
  return `${String.fromCharCode('a'.charCodeAt(0) + (index % 8))}${8 - Math.floor(index / 8)}`;
}

export function anotherCamp(camp: Camp): Camp {
  return camp == Camp.black ? Camp.white : Camp.black;
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
