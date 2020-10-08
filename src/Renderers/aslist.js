import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class AsList extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    // since can't access properties of child themselves
    // look at the instructions to create children to determine
    // which children are hidden
    let unhiddenChildren = this.children
      .filter((x, i) => !this.childrenToCreate[i].stateValues.hidden)

    if (unhiddenChildren.length === 0) {
      return <React.Fragment key={this.componentName} />
    }

    let withCommas = unhiddenChildren.slice(1).reduce((a, b) => [...a, ', ', b], [unhiddenChildren[0]])

    return <React.Fragment key={this.componentName}><a name={this.componentName} />{withCommas}</React.Fragment>;
  }
}