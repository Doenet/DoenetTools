import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { sizeToCSS } from './utils/css';

export default class Table extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }


    // let rows = this.children.map((x, i) => <tr key={"row" + i}>x</tr>)

    const tableStyle = {
      width: sizeToCSS(this.doenetSvData.width),
      height: sizeToCSS(this.doenetSvData.height),
      borderCollapse: "collapse",
      borderColor: "black"
    }
    if (this.doenetSvData.top !== "none") {
      tableStyle.borderTopStyle = "solid";
      if (this.doenetSvData.top === "minor") {
        tableStyle.borderTopWidth = "thin";
      } else if (this.doenetSvData.top === "medium") {
        tableStyle.borderTopWidth = "medium";
      } else {
        tableStyle.borderTopWidth = "thick";
      }
    }

    return <><a name={this.componentName} /><table id={this.componentName} style={tableStyle}>
      <tbody>
      {this.children}
      </tbody>
    </table></>
  }
}