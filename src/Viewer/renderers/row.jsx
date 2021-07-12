import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Row extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let props = { style: {} };

    if (this.doenetSvData.valign !== null) {
      props.style.verticalAlign =this.doenetSvData.valign;
    }
    if (this.doenetSvData.left !== "none") {
      props.style.borderLeftStyle = "solid";
      if (this.doenetSvData.left === "minor") {
        props.style.borderLeftWidth = "thin";
      } else if (this.doenetSvData.left === "medium") {
        props.style.borderLeftWidth = "medium";
      } else {
        props.style.borderLeftWidth = "thick";
      }
    }
    return <tr id={this.componentName} {...props}>{this.children}</tr>
  }
}