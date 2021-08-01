import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Footnote extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    return <span id={this.componentName}><a name={this.componentName} /><sup><a href='#' title={this.doenetSvData.text} >{this.doenetSvData.footnoteTag}</a></sup></span>
  }
}