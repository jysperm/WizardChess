import * as React from 'react';

interface ControllerProperties {
  fenString: string;
  onFenChanged(fenString: string);
}

export default class Controller extends React.Component<ControllerProperties, Object> {
  public render() {
    return <div className='controller'>
      <div>
        <label htmlFor='fenString' />
        <textarea id='fenString' value={this.props.fenString} onChange={this.onFenChanged.bind(this)} />
      </div>
      <div>
        <button>Play as Black</button>
        <button>Play as White</button>
      </div>
      <div />
      <div />
    </div>;
  }

  protected onFenChanged(event) {
    console.log('onFenChanged', event.target.value)
    this.props.onFenChanged(event.target.value);
  }
}
