import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Boolean extends DoenetRenderer {

  initializeChildrenOnConstruction = false;
  
  render() {

    if (this.doenetSvData.hide) {
      return null;
    }
    return <><a name={this.componentName} /><span id={this.componentName}>{this.doenetSvData.text}</span></>
  }
}