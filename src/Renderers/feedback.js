import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Feedback extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    return <aside id={this.componentName} style={{ backgroundColor: "#ebebeb" }} >
      <a name={this.componentName} />
      {this.children}
    </aside>

  }
}