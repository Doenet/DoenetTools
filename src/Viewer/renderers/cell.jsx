import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Cell extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let props = { style: { padding: "3px 10px" } };

    if (this.doenetSvData.colSpan !== 1) {
      props.colSpan = this.doenetSvData.colSpan;
    }
    if (this.doenetSvData.halign !== null) {
      props.style.textAlign = this.doenetSvData.halign;
    }
    if(this.doenetSvData.bottom !== "none") {
      props.style.borderBottomStyle = "solid";
      if(this.doenetSvData.bottom === "minor") {
        props.style.borderBottomWidth = "thin";
      }else if(this.doenetSvData.bottom === "medium") {
        props.style.borderBottomWidth = "medium";
      } else {
        props.style.borderBottomWidth = "thick";
      }
    }
    if(this.doenetSvData.right !== "none") {
      props.style.borderRightStyle = "solid";
      if(this.doenetSvData.right === "minor") {
        props.style.borderRightWidth = "thin";
      }else if(this.doenetSvData.right === "medium") {
        props.style.borderRightWidth = "medium";
      } else {
        props.style.borderRightWidth = "thick";
      }
    }

    let content = this.children;

    if(content.length === 0) {
      content = this.doenetSvData.text;
    }

    if(this.doenetSvData.inHeader) {
      return <th id={this.componentName} {...props}>{content}</th>
    } else {
      return <td id={this.componentName} {...props}>{content}</td>
    }
  }
}