import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class MathList extends DoenetRenderer {
  componentDidMount() {
    if (window.MathJax) {
      window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
    }
  }
  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
    }
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let children = this.children;
    if (children.length === 0 && this.doenetSvData.latex) {
      return /* @__PURE__ */ React.createElement(React.Fragment, {
        key: this.componentName
      }, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, "\\(" + this.doenetSvData.latex + "\\)"));
    }
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
