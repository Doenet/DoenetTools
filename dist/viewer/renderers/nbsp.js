import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Nbsp extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, " ");
  }
}
