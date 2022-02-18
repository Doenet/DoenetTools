import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Math(props) {
  let {name, SVs, actions, sourceOfUpdate} = useDoenetRender(props);
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  });
  if (SVs.hidden) {
    return null;
  }
  let beginDelim, endDelim;
  if (SVs.renderMode === "inline") {
    beginDelim = "\\(";
    endDelim = "\\)";
  } else if (SVs.renderMode === "display") {
    beginDelim = "\\[";
    endDelim = "\\]";
  } else if (SVs.renderMode === "numbered") {
    beginDelim = `\\begin{gather}\\tag{${SVs.equationTag}}`;
    endDelim = "\\end{gather}";
  } else if (SVs.renderMode === "align") {
    beginDelim = "\\begin{align}";
    endDelim = "\\end{align}";
  } else {
    beginDelim = "\\(";
    endDelim = "\\)";
  }
  let latexOrInputChildren = SVs.latexWithInputChildren.map((x) => typeof x === "number" ? this.children[x] : beginDelim + x + endDelim);
  let anchors = [
    React.createElement("a", {name, key: name})
  ];
  if (SVs.mrowChildNames) {
    anchors.push(SVs.mrowChildNames.map((x) => React.createElement("a", {name: x, key: x})));
  }
  if (latexOrInputChildren.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id: name
    }));
  } else if (latexOrInputChildren.length === 1) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id: name
    }, latexOrInputChildren[0]));
  } else if (latexOrInputChildren.length === 2) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id: name
    }, latexOrInputChildren[0], latexOrInputChildren[1]));
  } else {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id: name
    }, latexOrInputChildren[0]));
  }
}
