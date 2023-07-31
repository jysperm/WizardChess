import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Situation, Camp, PositionName} from '../lib/notation';

import Board from './board';
import Controller from './controller';
import Inspector from './inspector';

interface AppState {
  fenString?: string;
  inspectingFenString?: string;
  inspectingCamp?: Camp;
}

class WizardChess extends React.Component<Object, AppState> {
  state: AppState = {
    fenString: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
  };

  public componentDidMount() {
    const searchParams = new (window as any).URLSearchParams(window.location.search);
    const fenString = searchParams.get('fen')

    if (fenString) {
      this.setState({fenString})
    }
  }

  public render() {
    return <div className='wizard-chess-app'>
      <Board fenString={this.state.fenString} onChessMoved={this.onBoardChessMoved.bind(this)} />
      <Controller fenString={this.state.fenString} onFenChanged={this.onControllerFenChanged.bind(this)}
                  onInspect={this.onControllerInspect.bind(this)}
      />
      <Inspector fenString={this.state.inspectingFenString} camp={this.state.inspectingCamp} />
    </div>;
  }

  protected onBoardChessMoved(from: PositionName, to: PositionName) {
    this.setState({
      fenString: Situation.fromFenString(this.state.fenString).moveChessByName(from, to).toFenString()
    });
  }

  protected onControllerFenChanged(fenString: string) {
    window.history.pushState(null, null, `/?fen=${fenString}`);
    this.setState({fenString});
  }

  protected onControllerInspect(fenString: string, camp: Camp) {
    this.setState({
      inspectingFenString: fenString,
      inspectingCamp: camp
    });
  }
}

if (typeof document == 'object') {
  ReactDOM.render(<WizardChess />, document.getElementById('wizard-chess'));
}
