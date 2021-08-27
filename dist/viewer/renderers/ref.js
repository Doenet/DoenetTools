import React from "../../_snowpack/pkg/react.js";
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
    if (this.doenetSvData.contentId) {
      return /* @__PURE__ */ React.createElement("a", {
        target: "_blank",
        id: this.componentName,
        name: this.componentName,
        href: `https://www.doenet.org/#/content/?contentId=${this.doenetSvData.contentId}`
      }, linkContent);
    } else if (this.doenetSvData.doenetId) {
      return /* @__PURE__ */ React.createElement("a", {
        target: "_blank",
        id: this.componentName,
        name: this.componentName,
        href: `https://www.doenet.org/#/content/?doenetId=${this.doenetSvData.doenetId}`
      }, linkContent);
    } else if (this.doenetSvData.uri) {
      return /* @__PURE__ */ React.createElement("a", {
        target: "_blank",
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
