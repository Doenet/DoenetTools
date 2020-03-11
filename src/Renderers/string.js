import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class StringRenderer extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    return <>{this.doenetSvData.value}</>
  }
}