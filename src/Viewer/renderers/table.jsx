import React from 'react';
import DoenetRenderer from './DoenetRenderer';
export default class Table extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let heading = null;

    let childrenToRender = [...this.children];

    // BADBADBAD: need to redo how getting the title child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble

    let title;
    if (this.doenetSvData.titleChildName) {
      let titleChildInd;
      for (let [ind, child] of this.children.entries()) {
        if (typeof child !== "string" && child.props.componentInstructions.componentName === this.doenetSvData.titleChildName) {
          titleChildInd = ind;
          break;
        }
      }
      title = this.children[titleChildInd];
      childrenToRender.splice(titleChildInd, 1); // remove title
    } else {
      title = this.doenetSvData.title;
    }

    if (!this.doenetSvData.suppressTableNameInCaption) {
      let tableName = <strong>{this.doenetSvData.tableName}</strong>
      if (title) {
        title = <>{tableName}: {title}</>
      } else {
        title = tableName;
      }
    }

    heading = <div id={this.componentName + "_title"}>{title}</div>

    return <div id={this.componentName} >
      <a name={this.componentName} />
      {heading}
      {childrenToRender}
    </div>
  }
}