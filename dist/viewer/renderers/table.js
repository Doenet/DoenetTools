import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Table extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let heading = null;
    let childrenToRender = [...this.children];
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
      childrenToRender.splice(titleChildInd, 1);
    } else {
      title = this.doenetSvData.title;
    }
    if (!this.doenetSvData.suppressTableNameInCaption) {
      let tableName = /* @__PURE__ */ React.createElement("strong", null, this.doenetSvData.tableName);
      if (title) {
        title = /* @__PURE__ */ React.createElement(React.Fragment, null, tableName, ": ", title);
      } else {
        title = tableName;
      }
    }
    heading = /* @__PURE__ */ React.createElement("div", {
      id: this.componentName + "_title"
    }, title);
    return /* @__PURE__ */ React.createElement("div", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), heading, childrenToRender);
  }
}
