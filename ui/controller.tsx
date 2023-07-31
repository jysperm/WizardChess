import * as React from 'react';
import {Camp, Situation, boardIndexToPositionName, anotherCamp} from '../lib/notation';
import {MovesWithScore, Move, evaluate, searchOptions} from '../lib/search';
import {createBrowserWorker, SearchWorker} from '../lib/workers';
import {chessToUnicode} from './helpers';

interface ControllerProperties {
  fenString: string;
  onFenChanged(fenString: string);
  onInspect(fenString: string, camp: Camp);
}

interface ControllerState {
  searchDepth: number;
}

export default class Controller extends React.Component<ControllerProperties, ControllerState> {
  constructor(props) {
    super(props);
    this.state = {
      searchDepth: searchOptions.depth
    };
  }

  public render() {
    var situation = Situation.fromFenString(this.props.fenString);

    return <div className='controller'>
      <div className='input-and-instructions'>
        <textarea id='fenString' value={this.props.fenString} onChange={this.onFenChanged.bind(this)} />
        <p>
          You can manliple chess directly on the big board (whatever black or white), or modify the <a target='_blank' href='https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation'>FEN</a> representation above, the following are moves calculated by Wizard Chess (sorted by score).
          You can click on play button to apply one of them; or click on inspect button to exploer a particle path of derivations without applying this move.
        </p>
        <p>
          Search depth: <input id='search-depth' type='number' value={this.state.searchDepth.toString()} onChange={this.onDepthChanged.bind(this)} min='1' max='10' />
        </p>
      </div>
      <div className='row'>
        <MoveList situation={situation} searchDepth={this.state.searchDepth} camp={Camp.black} onPlayClicked={this.onPlayClicked.bind(this)}
                  onInspectClicked={this.onInspectClicked.bind(this, Camp.black)}
        />

        <MoveList situation={situation} searchDepth={this.state.searchDepth} camp={Camp.white} onPlayClicked={this.onPlayClicked.bind(this)}
                  onInspectClicked={this.onInspectClicked.bind(this, Camp.white)}
        />
      </div>
    </div>;
  }

  protected onFenChanged(event) {
    this.props.onFenChanged(event.target.value);
  }

  protected onPlayClicked(move) {
    this.props.onFenChanged(Situation.fromFenString(this.props.fenString).moveChess(move.from, move.to).toFenString());
  }

  protected onDepthChanged(event) {
    this.setState({searchDepth: event.target.value});
  }

  protected onInspectClicked(camp: Camp, move: Move) {
    this.props.onInspect(Situation.fromFenString(this.props.fenString).moveChess(move.from, move.to).toFenString(), anotherCamp(camp));
  }
}

interface MoveListProperties {
  situation: Situation;
  searchDepth: number;
  camp: Camp;
  onPlayClicked(move: Move);
  onInspectClicked(move: Move);
}

interface MoveListState {
  worker?: SearchWorker;
  moves?: MovesWithScore;
  calculating?: boolean
  searchCosts?: number;
}

class MoveList extends React.Component<MoveListProperties, MoveListState> {
  constructor(props) {
    super(props)
    this.state = {
      moves: [],
      calculating: true,
      worker: createBrowserWorker()
    }
  }

  public componentDidMount() {
    this.state.worker.search(this.props.situation, this.props.camp, null, this.onSearchFinished.bind(this));
  }

  public componentWillReceiveProps(nextProps: MoveListProperties) {
    if (this.props.situation.toFenString() !== nextProps.situation.toFenString() || this.props.searchDepth !== nextProps.searchDepth) {
      this.setState({calculating: true})
      this.state.worker.search(nextProps.situation, nextProps.camp, nextProps.searchDepth, this.onSearchFinished.bind(this));
    }
  }

  public render() {
    var {situation, camp, onPlayClicked, onInspectClicked} = this.props;

    var rootClassName = camp == Camp.black ? 'black-moves' : 'white-moves';
    var campName = camp == Camp.black ? 'Black' : 'White';
    var ourScore = evaluate(situation, camp);

    return <div className={rootClassName}>
      <h2>{campName}</h2>
      <p>Score: {ourScore} costs {this.state.searchCosts}ms</p>
      {this.state.calculating ? <p>Calculating ...</p> : <ul>
        {this.state.moves.map( ({move, score}) => {
          return <li key={`${move.from}-${move.to}`}>
            <span>
              {chessToUnicode(situation.getSlots()[move.from])} from {boardIndexToPositionName(move.from)} to {boardIndexToPositionName(move.to)} with score {score}({score - ourScore})
            </span>
            <button onClick={onInspectClicked.bind(this, move)}>Inspect</button>
            <button onClick={onPlayClicked.bind(null, move)}>Play</button>
          </li>;
        })}
      </ul>}
    </div>;
  }

  protected onSearchFinished(moves: MovesWithScore, costs: number) {
    this.setState({
      moves: moves.sort(sortMovesWithScore),
      calculating: false,
      searchCosts: costs
    });
  }
}

function sortMovesWithScore(a, b) {
  return b.score - a.score;
}
