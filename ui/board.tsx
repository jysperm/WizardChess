import * as React from 'react';
import * as _ from 'lodash';

import {Camp, Chess, ChessType, BoardIndex, Situation, positionNameToBoardIndex, PositionName} from '../lib/notation';
import * as rules from '../lib/rules';

interface BoardProperties {
  fenString: string;
  onChessMoved(from: PositionName, to: PositionName);
}

interface BoardState {
  selected?: string;
}

export default class Board extends React.Component<BoardProperties, BoardState> {
  state: BoardState = {};

  public render() {
    var situation = Situation.fromFenString(this.props.fenString);

    return <table className='board'>
      <tbody>
        {_.rangeRight(0, 8).map( (rowId) => {
          return <tr key={rowId} className='row'>
            {_.range(0, 8).map( (columnId) => {
              var columnName = `${String.fromCharCode('a'.charCodeAt(0) + columnId)}${rowId + 1}`;

              var className = 'column';

              if (this.state.selected == columnName) {
                className += ' selected';
              }

              if (this.ableToMove(columnName)) {
                className += ' available'
              }

              return <td key={columnName} className={className} onClick={this.onCellClicked.bind(this, columnName)}>
                <span className='position'>{columnName}</span>
                <span className='chess'>{chessToUnicode(situation.getChess(columnName))}</span>
              </td>
            })}
          </tr>;
        })}
      </tbody>
    </table>;
  }

  protected onCellClicked(position: PositionName) {
    var situation = Situation.fromFenString(this.props.fenString);

    if (this.state.selected) {
      if (this.ableToMove(position)) {
        this.props.onChessMoved(this.state.selected, position);
      }

      this.setState({
        selected: null
      });
    } else if (situation.getChess(position)) {
      this.setState({
        selected: position
      });
    }
  }

  protected ableToMove(position: PositionName): boolean {
    var situation = Situation.fromFenString(this.props.fenString);

    if (this.state.selected) {
      var selectedChess = situation.getChess(this.state.selected);

      if (selectedChess) {
        return rules.of(selectedChess).getMoves(
          situation, positionNameToBoardIndex(this.state.selected)
        )[positionNameToBoardIndex(position)] != false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

function chessToUnicode(chess: Chess): string {
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
