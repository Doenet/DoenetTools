import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Figure extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let childrenToRender = [...this.children];
    let caption;
    if (this.doenetSvData.captionChildName) {
      let captionChildInd;
      for (let [ind, child] of this.children.entries()) {
        if (child.props.componentInstructions.componentName === this.doenetSvData.captionChildName) {
          captionChildInd = ind;
          break;
        }
      }
      caption = this.children[captionChildInd];
      childrenToRender.splice(captionChildInd, 1);
    } else {
      caption = this.doenetSvData.caption;
    }
    if (!this.doenetSvData.suppressFigureNameInCaption) {
      let figureName = /* @__PURE__ */ React.createElement("strong", null, this.doenetSvData.figureName);
      if (caption) {
        caption = /* @__PURE__ */ React.createElement(React.Fragment, null, figureName, ": ", caption);
      } else {
        caption = figureName;
      }
    }
    return /* @__PURE__ */ React.createElement("div", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), childrenToRender, /* @__PURE__ */ React.createElement("div", {
      id: this.componentName + "_caption"
    }, caption));
  }
}
