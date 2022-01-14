import React from 'react';
import DoenetRenderer from './DoenetRenderer';
export default class Figure extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }


    let childrenToRender = [...this.children];

    // BADBADBAD: need to redo how getting the caption child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble

    let caption;
    if (this.doenetSvData.captionChildName) {
      let captionChildInd;
      for (let [ind, child] of this.children.entries()) {
        if (typeof child !== "string" && child.props.componentInstructions.componentName === this.doenetSvData.captionChildName) {
          captionChildInd = ind;
          break;
        }
      }
      caption = this.children[captionChildInd]
      childrenToRender.splice(captionChildInd, 1); // remove caption
    } else {
      caption = this.doenetSvData.caption;
    }


    if (!this.doenetSvData.suppressFigureNameInCaption) {
      let figureName = <strong>{this.doenetSvData.figureName}</strong>
      if (caption) {
        caption = <>{figureName}: {caption}</>
      } else {
        caption = figureName;
      }
    }

    return <div id={this.componentName} >
      <a name={this.componentName} />
      {childrenToRender}
      <div id={ this.componentName + "_caption" }>{caption}</div>
    </div>
  }
}