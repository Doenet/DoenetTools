import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Ref extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let linkContent = this.children;
    if (this.children.length === 0) {
      linkContent = this.doenetSvData.linkText;
    }
    if (this.doenetSvData.uri) {
      return /* @__PURE__ */ React.createElement("a", {
        id: this.componentName,
        name: this.componentName,
        href: this.doenetSvData.uri
      }, linkContent);
    } else {
      return /* @__PURE__ */ React.createElement("a", {
        id: this.componentName,
        name: this.componentName,
        href: "#" + this.doenetSvData.targetName
      }, linkContent);
    }
  }
}
