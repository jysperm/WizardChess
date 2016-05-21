import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Situation, Chess, PositionName} from '../lib/notation';
import {createBrowserWorker, createSyncWorker, SearchWorker} from '../lib/workers';

import Board from './board';
import Controller from './controller';

interface AppState {
  fenString?: string;
  worker?: SearchWorker;
}

class WizardChess extends React.Component<Object, AppState> {
  state: AppState = {
    fenString: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    worker: createBrowserWorker()
  };

  public render() {
    return <div className='wizard-chess-app'>
      <Board fenString={this.state.fenString} onChessMoved={this.onBoardChessMoved.bind(this)} />
      <Controller fenString={this.state.fenString} worker={this.state.worker} onFenChanged={this.onControllerFenChanged.bind(this)} />
    </div>;
  }

  protected onBoardChessMoved(from: PositionName, to: PositionName) {
    this.setState({
      fenString: Situation.fromFenString(this.state.fenString).moveChessByName(from, to).toFenString()
    });
  }

  protected onControllerFenChanged(fenString: string) {
    this.setState({fenString});
  }
}

if (typeof document == 'object') {
  ReactDOM.render(<WizardChess />, document.getElementById('wizard-chess'));
}
