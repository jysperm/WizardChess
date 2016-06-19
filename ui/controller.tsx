import * as React from 'react';
import {Camp, Situation, boardIndexToPositionName, anotherCamp} from '../lib/notation';
import search, {MovesWithScore, Move, evaluate} from '../lib/search';
import {createBrowserWorker, SearchWorker} from '../lib/workers';
import {chessToUnicode} from './helpers';

interface ControllerProperties {
  fenString: string;
  onFenChanged(fenString: string);
  onInspect(fenString: string, camp: Camp);
}

export default class Controller extends React.Component<ControllerProperties, Object> {
  public render() {
    var situation = Situation.fromFenString(this.props.fenString);

    return <div className='controller'>
      <div>
        <label htmlFor='fenString' />
        <textarea id='fenString' value={this.props.fenString} onChange={this.onFenChanged.bind(this)} />
      </div>

      <MoveList situation={situation} camp={Camp.black} onPlayClicked={this.onPlayClicked.bind(this)}
                onInspectClicked={this.onInspectClicked.bind(this, Camp.black)}
      />

      <MoveList situation={situation} camp={Camp.white} onPlayClicked={this.onPlayClicked.bind(this)}
                onInspectClicked={this.onInspectClicked.bind(this, Camp.white)}
      />
    </div>;
  }

  protected onFenChanged(event) {
    this.props.onFenChanged(event.target.value);
  }

  protected onPlayClicked(move) {
    this.props.onFenChanged(Situation.fromFenString(this.props.fenString).moveChess(move.from, move.to).toFenString());
  }

  protected onInspectClicked(camp: Camp, move: Move) {
    this.props.onInspect(Situation.fromFenString(this.props.fenString).moveChess(move.from, move.to).toFenString(), anotherCamp(camp));
  }
}

interface MoveListProperties {
  situation: Situation;
  camp: Camp;
  onPlayClicked(move: Move);
  onInspectClicked(move: Move);
}

interface MoveListState {
  worker?: SearchWorker;
  moves?: MovesWithScore;
  searchCosts?: number;
}

class MoveList extends React.Component<MoveListProperties, MoveListState> {
  constructor(props) {
    super(props)
    this.state = {
      moves: [],
      worker: createBrowserWorker()
    }
  }

  public componentDidMount() {
    this.state.worker.search(this.props.situation, this.props.camp, null, this.onSearchFinished.bind(this));
  }

  public componentWillReceiveProps(nextProps: MoveListProperties) {
    if (this.props.situation.toFenString() != nextProps.situation.toFenString()) {
      this.state.worker.search(nextProps.situation, nextProps.camp, null, this.onSearchFinished.bind(this));
    }
  }

  public render() {
    var {situation, camp, onPlayClicked, onInspectClicked} = this.props;

    var rootClassName = camp == Camp.black ? 'black-moves' : 'white-moves';
    var campName = camp == Camp.black ? 'Black' : 'White';
    var ourScore = evaluate(situation, camp);

    return <div className={rootClassName}>
      <p>{campName} Score: {ourScore} costs {this.state.searchCosts}ms</p>
      <ul>
        {this.state.moves.map( ({move, score}) => {
          return <li key={`${move.from}-${move.to}`}>
            <span>
              {chessToUnicode(situation.getSlots()[move.from])} from {boardIndexToPositionName(move.from)} to {boardIndexToPositionName(move.to)} with score {score}({score - ourScore})
            </span>
            <button onClick={onInspectClicked.bind(this, move)}>Inspect</button>
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

function sortMovesWithScore(a, b) {
  return b.score - a.score;
}
