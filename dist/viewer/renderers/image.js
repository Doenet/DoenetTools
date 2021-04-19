import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Image extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    if (this.doenetSvData.source) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), /* @__PURE__ */ React.createElement("img", {
        id: this.componentName,
        src: this.doenetSvData.source,
        width: this.doenetSvData.width,
        height: this.doenetSvData.height,
        alt: this.doenetSvData.description
      }));
    }
    return null;
  }
}
