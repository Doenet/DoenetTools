import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Tag extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let open = "<";
    let close = ">";

    if(this.doenetSvData.selfClosed) {
      close = "/>";
    }

    return <code id={this.componentName}><a name={this.componentName} />{open}{this.children}{close}</code>
  }
}