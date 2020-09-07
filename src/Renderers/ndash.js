import React from 'react';
import DoenetRenderer from './DoenetRenderer';


export default class Nbsp extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    return <>&ndash;</>
  }
}