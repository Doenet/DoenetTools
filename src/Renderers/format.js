import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Text extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }
    return <><a name={this.componentName} /><span id={this.componentName}>{this.doenetSvData.value}</span></>
  }
}