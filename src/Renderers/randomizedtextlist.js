import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class RandomizedTextList extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.initializeChildren();
  }

  render() {
    if (this.doenetSvData.hide) {
      return null;
    }
    return <><a name={this.componentName} /><span id={this.componentName}>{this.children}</span></>
  }
}