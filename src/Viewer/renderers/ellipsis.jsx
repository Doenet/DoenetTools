import React from 'react';
import DoenetRenderer from './DoenetRenderer';


export default class Ellipsis extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    return <>&hellip;</>
  }
}