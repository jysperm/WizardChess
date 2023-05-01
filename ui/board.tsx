import * as React from 'react';
import * as _ from 'lodash';

import {Situation, positionNameToBoardIndex, PositionName} from '../lib/notation';
import * as rules from '../lib/rules';
import {chessToUnicode} from './helpers';

interface BoardProperties {
  fenString: string;
  onChessMoved?(from: PositionName, to: PositionName);
}

interface BoardState {
  selected?: string;
}

export default class Board extends React.Component<BoardProperties, BoardState> {
  state: BoardState = {};

  public render() {
    var situation = Situation.fromFenString(this.props.fenString);
    var classNames = this.props.onChessMoved ? ['board', 'board-big'] : ['board'];

    return <table className={classNames.join(' ')}>
      <tbody>
        {_.rangeRight(0, 8).map( rowId => {
          return <tr key={rowId} className='row'>
            {_.range(0, 8).map( columnId => {
              var columnName = `${String.fromCharCode('a'.charCodeAt(0) + columnId)}${rowId + 1}`;

              var classNames = ['column'];

              if (this.state.selected == columnName) {
                classNames.push('selected');
              }

              if (this.ableToMove(columnName)) {
                classNames.push('available');
              }

              return <td key={columnName} className={classNames.join(' ')} onClick={this.onCellClicked.bind(this, columnName)}>
                <span className='position'>{columnName}</span>
                <span className='chess'>{chessToUnicode(situation.getChess(columnName))}</span>
              </td>;
            })}
          </tr>;
        })}
      </tbody>
    </table>;
  }

  protected onCellClicked(position: PositionName) {
    if (!this.props.onChessMoved) {
      return;
    }

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
