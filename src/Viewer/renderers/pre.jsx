import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Pre extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    return <pre id={this.componentName}><a name={this.componentName} />{this.children}</pre>
  }
}