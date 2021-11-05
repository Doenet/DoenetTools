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
    let url = "";
    let target = "_blank";
    let haveValidTarget = false;
    if (this.doenetSvData.contentId) {
      url = `https://www.doenet.org/#/content/?contentId=${this.doenetSvData.contentId}`;
      haveValidTarget = true;
    } else if (this.doenetSvData.doenetId) {
      url = `https://www.doenet.org/#/course?tool=assignment&doenetId=${this.doenetSvData.doenetId}`;
      haveValidTarget = true;
    } else if (this.doenetSvData.uri) {
      url = this.doenetSvData.uri;
      if (url.substring(0, 8) === "https://" || url.substring(0, 7) === "http://") {
        haveValidTarget = true;
      }
    } else {
      url = "#" + this.doenetSvData.targetName;
      target = null;
      haveValidTarget = true;
    }
    if (this.doenetSvData.createButton) {
      return /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_button",
        onClick: () => window.location.href = url,
        disabled: this.doenetSvData.disabled
      }, this.doenetSvData.linkText));
    } else {
      if (haveValidTarget) {
        return /* @__PURE__ */ React.createElement("a", {
          target,
          id: this.componentName,
          name: this.componentName,
          href: url
        }, linkContent);
      } else {
        return /* @__PURE__ */ React.createElement("span", {
          id: this.componentName
        }, linkContent);
      }
    }
  }
}
