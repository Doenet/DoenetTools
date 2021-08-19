import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class AsList extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let children = this.children;
    if (this.doenetSvData.nChildrenToDisplay !== void 0) {
      children = children.slice(0, this.doenetSvData.nChildrenToDisplay);
    }
    children = children.filter((x) => !x.props.componentInstructions.stateValues.hidden);
    if (children.length === 0) {
      return /* @__PURE__ */ React.createElement(React.Fragment, {
        key: this.componentName
      });
    }
    let withCommas = children.slice(1).reduce((a, b) => [...a, ", ", b], [children[0]]);
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), withCommas);
  }
}
