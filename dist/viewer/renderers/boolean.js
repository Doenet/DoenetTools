import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Boolean extends DoenetRenderer {
  static initializeChildrenOnConstruction = false;
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("span", {
      id: this.componentName
    }, this.doenetSvData.text));
  }
}
