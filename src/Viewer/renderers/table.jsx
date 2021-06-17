import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { sizeToCSS } from './utils/css';

export default class Table extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }


    // let rows = this.children.map((x, i) => <tr key={"row" + i}>x</tr>)

    const divStyle = {
      width: sizeToCSS(this.doenetSvData.width),
      height: sizeToCSS(this.doenetSvData.height),
    }
    return <><a name={this.componentName} /><table id={this.componentName} style={divStyle}>
      <tbody>
        {this.children}
      </tbody>
    </table></>
  }
}