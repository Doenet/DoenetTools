import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Pre extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("pre", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), this.children);
  }
}
