import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Board from './board';
import Controller from './controller';

class WizardChess extends React.Component<Object, Object> {
  public render() {
    return <div>
      <Board />
      <Controller />
    </div>;
  }
}

ReactDOM.render(<WizardChess />, document.getElementById('wizard-chess'));
