import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Q extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    return <><a name={this.componentName} />&ldquo;{this.children}&rdquo;</>
  }
}