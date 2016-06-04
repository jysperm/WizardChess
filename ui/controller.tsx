import * as React from 'react';
import {Camp, Situation, boardIndexToPositionName, anotherCamp} from '../lib/notation';
import evaluate from '../lib/evaluate';
import search, {MovesWithScore, Move} from '../lib/search';
import {chessToUnicode} from './helpers';
import {SearchWorker} from '../lib/workers';

interface ControllerProperties {
  fenString: string;
  worker: SearchWorker;
  onFenChanged(fenString: string);
}

export default class Controller extends React.Component<ControllerProperties, Object> {
  public render() {
    var situation = Situation.fromFenString(this.props.fenString);

    return <div className='controller'>
      <div>
        <label htmlFor='fenString' />
        <textarea id='fenString' value={this.props.fenString} onChange={this.onFenChanged.bind(this)} />
      </div>

      <MoveList worker={this.props.worker} situation={situation} camp={Camp.black} onPlayClicked={this.onPlayClicked.bind(this)} />
      <MoveList worker={this.props.worker} situation={situation} camp={Camp.white} onPlayClicked={this.onPlayClicked.bind(this)} />
    </div>;
  }

  protected onFenChanged(event) {
    this.props.onFenChanged(event.target.value);
  }

  protected onPlayClicked(move) {
    this.props.onFenChanged(Situation.fromFenString(this.props.fenString).moveChess(move.from, move.to).toFenString());
  }
}

interface MoveListProperties {
  worker: SearchWorker;
  situation: Situation;
  camp: Camp;
  onPlayClicked(move: Move);
}

interface MoveListState {
  moves?: MovesWithScore;
  searchCosts?: number;
}

class MoveList extends React.Component<MoveListProperties, MoveListState> {
  state: MoveListState = {
    moves: []
  }

  public componentDidMount() {
    this.props.worker.search(this.props.situation, this.props.camp, null, this.onSearchFinished.bind(this));
  }

  public componentWillReceiveProps(nextProps: MoveListProperties) {
    nextProps.worker.search(nextProps.situation, nextProps.camp, null, this.onSearchFinished.bind(this));
  }

  public render() {
    var {worker, situation, camp, onPlayClicked} = this.props;

    var rootClassName = camp == Camp.black ? 'black-moves' : 'white-moves';
    var campName = camp == Camp.black ? 'Black' : 'White';

    var ourScore = evaluate(situation, camp);
    var oppositeScore = evaluate(situation, anotherCamp(camp));

    return <div className={rootClassName}>
      <p>{campName} Score: {ourScore} ({compareScoreToDisplay(oppositeScore, ourScore)}%) costs {this.state.searchCosts}ms</p>
      <ul>
        {this.state.moves.map( ({move, score}) => {
          return <li key={`${move.from}-${move.to}`}>
            <span>
              {chessToUnicode(situation.getSlots()[move.from])} from {boardIndexToPositionName(move.from)} to {boardIndexToPositionName(move.to)} with score {score}({score - ourScore})
            </span>
            <button onClick={onPlayClicked.bind(null, move)}>Play</button>
          </li>;
        })}
      </ul>
    </div>;
  }

  protected onSearchFinished(moves: MovesWithScore, costs: number) {
    this.setState({
      moves: moves.sort(sortMovesWithScore),
      searchCosts: costs
    });
  }
}

function compareScoreToDisplay(base, derived): string {
  return ((derived - base) / (base + derived) * 100).toFixed(2);
}

function sortMovesWithScore(a, b) {
  return b.score - a.score;
}
