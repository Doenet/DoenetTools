import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Text extends DoenetRenderer {

  static initializeChildrenOnConstruction = false;

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }
    return <><a name={this.componentName} /><span id={this.componentName}>{this.doenetSvData.value}</span></>
  }
}