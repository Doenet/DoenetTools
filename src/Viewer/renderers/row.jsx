import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Row extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let cells = this.children.map((x, i) => <td key={"col" + i} >{x}</td>)

    return <tr id={this.componentName}>{cells}</tr>
  }
}