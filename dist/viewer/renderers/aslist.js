import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class AsList extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    if (this.children.length === 0) {
      return /* @__PURE__ */ React.createElement(React.Fragment, {
        key: this.componentName
      });
    }
    let withCommas = this.children.slice(1).reduce((a, b) => [...a, ", ", b], [this.children[0]]);
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), withCommas);
  }
}
