import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
export default class StringRenderer extends DoenetRenderer {
  static initializeChildrenOnConstruction = false;
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, this.doenetSvData.value);
  }
}
