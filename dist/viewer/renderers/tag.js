import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Tag extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let open = "<";
    let close = ">";
    if (this.doenetSvData.selfClosed) {
      close = "/>";
    }
    return /* @__PURE__ */ React.createElement("code", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), open, this.children, close);
  }
}
