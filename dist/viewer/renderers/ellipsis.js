import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Ellipsis extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "…");
  }
}
