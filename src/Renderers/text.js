import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Text extends DoenetRenderer {

  render() {
    return <><a name={this.componentName} /><span id={this.componentName}>{this.doenetSvData.value}</span></>
  }
}