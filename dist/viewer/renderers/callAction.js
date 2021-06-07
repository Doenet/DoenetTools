import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class CallAction extends DoenetRenderer {
  static initializeChildrenOnConstruction = false;
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("span", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("button", {
      id: this.componentName + "_button",
      onClick: this.actions.callAction,
      disabled: this.doenetSvData.disabled
    }, this.doenetSvData.label));
  }
}
