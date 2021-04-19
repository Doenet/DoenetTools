import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
export default class TextOrInline extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("span", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), this.children);
  }
}
