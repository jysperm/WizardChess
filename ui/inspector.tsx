import * as React from 'react';
import * as _ from 'lodash';
import {Camp, Situation, boardIndexToPositionName, anotherCamp} from '../lib/notation';
import {searchOptions, MovesWithScore, evaluate, Move} from '../lib/search';
import {createBrowserWorker, SearchWorker} from '../lib/workers';
import {chessToUnicode} from './helpers';

import Board from './board';

if (typeof document == 'object') {
  var worker = createBrowserWorker()
}

interface InspectorProperties {
  camp?: Camp;
  fenString?: string;
}

interface InspectorSearchNode {
  fenString: string;
  camp: Camp;
  depth: number;
  move?: Move;
}

interface InspectorState {
  nodes?: Array<InspectorSearchNode>;
}

export default class Inspector extends React.Component<InspectorProperties, InspectorState> {
  constructor(props) {
    super(props)
    this.state = {
      nodes: [{
        fenString: props.fenString,
        camp: props.camp,
        depth: searchOptions.depth - 1
      }]
    };
  }

  public componentWillReceiveProps(nextProps: SearchNodeProperties) {
    var fenString, camp;

    if (_.first(this.state.nodes)) {
      fenString = _.first(this.state.nodes).fenString
      camp = _.first(this.state.nodes).camp
    }

    if (fenString != nextProps.fenString || camp != nextProps.camp) {
      this.setState({
        nodes: [{
          fenString: nextProps.fenString,
          camp: nextProps.camp,
          depth: searchOptions.depth - 1
        }]
      })
    }
  }

  public render() {
    if (!this.props.fenString) {
      return <div />;
    }

    return <div className='inspector'>
      <h1>Inspector</h1>
      {this.state.nodes.map( ({fenString, camp, depth, move}) => {
        return <SearchNode key={`${depth}-${fenString}`} depth={depth} camp={camp} fenString={fenString}
                    onInspectClicked={this.onInspectClicked.bind(this, depth, camp)} move={move}
                    onSearchFinished={this.onSearchFinished.bind(this, depth, camp)} />;
      })}
    </div>;
  }

  protected onSearchFinished(depth: number, camp: Camp, fenString: string) {
    if (depth > 1) {
      this.setState({
        nodes: this.state.nodes.concat({
          fenString: fenString,
          camp: anotherCamp(camp),
          depth: depth - 1
        })
      });
    }
  }

  protected onInspectClicked(depth: number, camp: Camp, move: Move) {
    this.setState({
      nodes: this.state.nodes.filter( node => {
        return node.depth >= depth
      }).map( node => {
        if (node.depth == depth) {
          return _.extend({}, node, {
            move: move,
            depth: searchOptions.depth - 1
          }) as InspectorSearchNode;
        } else {
          return node;
        }
      })
    });
  }
}

interface SearchNodeProperties {
  camp: Camp;
  depth: number;
  fenString: string;
  move?: Move;
  onInspectClicked(move: Move);
  onSearchFinished(fenString: string);
}

interface SearchNodeState {
  moves?: MovesWithScore;
}

class SearchNode extends React.Component<SearchNodeProperties, SearchNodeState> {
  constructor(props) {
    super(props)
    this.state = {
      moves: []
    }
  }

  public componentDidMount() {
    worker.search(Situation.fromFenString(this.props.fenString), this.props.camp, this.props.depth, this.onSearchFinished.bind(this));
  }

  public componentWillReceiveProps(nextProps: SearchNodeProperties) {
    if (this.props.fenString != nextProps.fenString) {
      worker.search(Situation.fromFenString(nextProps.fenString), nextProps.camp, this.props.depth, this.onSearchFinished.bind(this));
    }
  }

  public render() {
    var situation = Situation.fromFenString(this.props.fenString);
    var ourScore = evaluate(situation, this.props.camp);
    var campName = this.props.camp == Camp.black ? 'Black' : 'White';
    var currentMove = this.props.move || (_.first(this.state.moves) && _.first(this.state.moves).move);

    return <div className='search-node'>
      <h3>{campName}</h3>
      <Board fenString={this.props.fenString} />
      <ul>
        {this.state.moves.map( ({move, score}) => {
          return <li key={`${move.from}-${move.to}`}>
            <span className={_.isEqual(currentMove, move) ? 'current-move' : ''}>
              {chessToUnicode(situation.getSlots()[move.from])} from {boardIndexToPositionName(move.from)} to {boardIndexToPositionName(move.to)} with score {score}({score - ourScore})
            </span>
            <button onClick={this.props.onInspectClicked.bind(this, move)}>Inspect</button>
          </li>;
        })}
      </ul>
    </div>;
  }

  protected onSearchFinished(moves: MovesWithScore, costs: number) {
    var bestMove = this.props.move || _.first(moves).move;
    this.props.onSearchFinished(Situation.fromFenString(this.props.fenString).moveChess(bestMove.from, bestMove.to).toFenString());
    this.setState({
      moves: moves.sort(sortMovesWithScore)
    });
  }
}

function sortMovesWithScore(a, b) {
  return b.score - a.score;
}
