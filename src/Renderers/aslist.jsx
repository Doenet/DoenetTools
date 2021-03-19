import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class AsList extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    if (this.children.length === 0) {
      return <React.Fragment key={this.componentName} />
    }

    let withCommas = this.children.slice(1).reduce((a, b) => [...a, ', ', b], [this.children[0]])

    return <React.Fragment key={this.componentName}><a name={this.componentName} />{withCommas}</React.Fragment>;
  }
}