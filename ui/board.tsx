import * as React from 'react';
import * as _ from 'lodash';

export default class Board extends React.Component<Object, Object> {
  public render() {
    return <table className='board'>
      <tbody>
        {_.rangeRight(1, 9).map( (rowId) => {
          return <tr key={rowId} className='row'>
            {_.range(0, 8).map( (columnId) => {
              var columnName = String.fromCharCode('a'.charCodeAt(0) + columnId);
              return <td key={columnId} className='column'>{rowId}{columnName}</td>;
            })}
          </tr>;
        })}
      </tbody>
    </table>;
  }
}
