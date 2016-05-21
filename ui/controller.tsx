import * as React from 'react';
import {Camp, Situation, boardIndexToPositionName} from '../lib/notation';
import evaluate from '../lib/evaluate';
import search, {MovesWithScore} from '../lib/search';
import {chessToUnicode} from './helpers';
import {SearchWorker} from '../lib/workers';

interface ControllerProperties {
  fenString: string;
  worker: SearchWorker;
  onFenChanged(fenString: string);
}

interface BoardState {
  searchStarted?: boolean;
  whiteMoves?: MovesWithScore;
  whiteCosts?: number;
  blackMoves?: MovesWithScore;
  blackCosts?: number;
}

export default class Controller extends React.Component<ControllerProperties, BoardState> {
  state: BoardState = {
    whiteMoves: [],
    whiteCosts: 0,
    blackMoves: [],
    blackCosts: 0
  };

  public render() {
    var situation = Situation.fromFenString(this.props.fenString);
    var whiteScore = evaluate(situation, Camp.white);
    var blackScore = evaluate(situation, Camp.black);

    var inSearch = false;

    if (!this.state.searchStarted) {
      inSearch = true

      setTimeout( () => {
        this.props.worker.search(situation, Camp.black, null, this.onSearchFinished.bind(this, Camp.black));
        this.props.worker.search(situation, Camp.white, null, this.onSearchFinished.bind(this, Camp.white));
        this.state.searchStarted = true;
      }, 0);
    }

    return <div className='controller'>
      <div>
        <label htmlFor='fenString' />
        <textarea id='fenString' value={this.props.fenString} onChange={this.onFenChanged.bind(this)} />
      </div>

      <div className='black-moves'>
        <p>Black Score: {blackScore} ({compareScoreToDisplay(whiteScore, blackScore)}%) costs {this.state.blackCosts}ms</p>
        <ul>
          {inSearch || this.state.blackMoves.map( ({move, score}) => {
            return <li key={`${move.from}-${move.to}`}>
              <span>
                {chessToUnicode(situation.getSlots()[move.from])} from {boardIndexToPositionName(move.from)} to {boardIndexToPositionName(move.to)} with score {score}({score - blackScore})
              </span>
              <button onClick={this.onPlayClicked.bind(this, move)}>Play</button>
            </li>;
          })}
        </ul>
      </div>

      <div className='white-moves'>
        <p>White Score: {whiteScore} ({compareScoreToDisplay(blackScore, whiteScore)}%) costs {this.state.whiteCosts}ms</p>
        <ul>
          {inSearch || this.state.whiteMoves.map( ({move, score}) => {
            return <li key={`${move.from}-${move.to}`}>
              <span>
                {chessToUnicode(situation.getSlots()[move.from])} from {boardIndexToPositionName(move.from)} to {boardIndexToPositionName(move.to)} with score {score}({score - whiteScore})
              </span>
              <button onClick={this.onPlayClicked.bind(this, move)}>Play</button>
            </li>;
          })}
        </ul>
      </div>
    </div>;
  }

  protected componentWillReceiveProps(props) {
    this.setState({searchStarted: false});
  }

  protected onFenChanged(event) {
    this.props.onFenChanged(event.target.value);
  }

  protected onPlayClicked(move) {
    this.props.onFenChanged(Situation.fromFenString(this.props.fenString).moveChess(move.from, move.to).toFenString());
  }

  protected onSearchFinished(camp, moves, costs) {
    if (camp == Camp.black) {
      this.setState({
        blackMoves: moves.sort(sortMovesWithScore),
        blackCosts: costs
      });
    } else {
      this.setState({
        whiteMoves: moves.sort(sortMovesWithScore),
        whiteCosts: costs
      });
    }
  }
}

function compareScoreToDisplay(base, derived): string {
  return ((derived - base) / (base + derived) * 100).toFixed(2);
}

function sortMovesWithScore(a, b) {
  return b.score - a.score;
}
