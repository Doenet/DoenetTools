import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class MathRenderer extends DoenetRenderer {
  componentDidMount() {
    window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
    window.MathJax.Hub.processSectionDelay = 0;
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
  }
  componentDidUpdate() {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let beginDelim, endDelim;
    if (this.doenetSvData.renderMode === "inline") {
      beginDelim = "\\(";
      endDelim = "\\)";
    } else if (this.doenetSvData.renderMode === "display") {
      beginDelim = "\\[";
      endDelim = "\\]";
    } else if (this.doenetSvData.renderMode === "numbered") {
      beginDelim = `\\begin{gather}\\tag{${this.doenetSvData.equationTag}}`;
      endDelim = "\\end{gather}";
    } else if (this.doenetSvData.renderMode === "align") {
      beginDelim = "\\begin{align}";
      endDelim = "\\end{align}";
    } else {
      beginDelim = "\\(";
      endDelim = "\\)";
    }
    let latexOrInputChildren = this.doenetSvData.latexWithInputChildren.map((x) => typeof x === "number" ? this.children[x] : beginDelim + x + endDelim);
    let anchors = [
      React.createElement("a", {name: this.componentName, key: this.componentName})
    ];
    if (this.doenetSvData.mrowChildNames) {
      anchors.push(this.doenetSvData.mrowChildNames.map((x) => React.createElement("a", {name: x, key: x})));
    }
    if (latexOrInputChildren.length === 0) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }));
    } else if (latexOrInputChildren.length === 1) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, latexOrInputChildren[0]));
    } else if (latexOrInputChildren.length === 2) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, latexOrInputChildren[0], latexOrInputChildren[1]));
    } else {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, latexOrInputChildren[0]));
    }
  }
}
