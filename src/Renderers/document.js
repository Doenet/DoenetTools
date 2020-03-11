import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Document extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    if (this.children === undefined) {
      this.initializeChildren();
    }
    return <>{this.children}</>
  }
}