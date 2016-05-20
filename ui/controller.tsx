import * as React from 'react';
import {Camp, Situation} from '../lib/notation';
import evaluate from '../lib/evaluate';
import search from '../lib/search';

interface ControllerProperties {
  fenString: string;
  onFenChanged(fenString: string);
}

export default class Controller extends React.Component<ControllerProperties, Object> {
  public render() {
    var situation = Situation.fromFenString(this.props.fenString);
    var whiteScore = evaluate(situation, Camp.white);
    var blackScore = evaluate(situation, Camp.black);

    console.log(search(situation, Camp.black));

    return <div className='controller'>
      <div>
        <label htmlFor='fenString' />
        <textarea id='fenString' value={this.props.fenString} onChange={this.onFenChanged.bind(this)} />
      </div>
      <div>
        <p>Black Score: {blackScore} ({((blackScore - whiteScore) / (whiteScore + whiteScore) * 100).toFixed(2)}%)</p>
        <button>Play as Black</button>
      </div>
      <div>
        <p>White Score: {whiteScore} ({((whiteScore - blackScore) / (whiteScore + whiteScore) * 100).toFixed(2)}%)</p>
        <button>Play as White</button>
      </div>
    </div>;
  }

  protected onFenChanged(event) {
    console.log('onFenChanged', event.target.value)
    this.props.onFenChanged(event.target.value);
  }
}
