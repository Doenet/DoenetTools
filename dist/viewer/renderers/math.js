import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
export default React.memo(function Math(props) {
  let {name, id, SVs, actions, sourceOfUpdate} = useDoenetRender(props);
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
  if (!SVs.latexWithInputChildren) {
    return null;
  }
  let latexOrInputChildren = SVs.latexWithInputChildren.map((x) => typeof x === "number" ? this.children[x] : beginDelim + x + endDelim);
  let anchors = [
    /* @__PURE__ */ React.createElement("a", {
      name: id,
      key: id
    })
  ];
  if (SVs.mrowChildNames) {
    anchors.push(...SVs.mrowChildNames.map((x) => /* @__PURE__ */ React.createElement("a", {
      name: x,
      key: x,
      id: x
    })));
  }
  if (latexOrInputChildren.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }));
  } else if (latexOrInputChildren.length === 1) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, latexOrInputChildren[0])));
  } else if (latexOrInputChildren.length === 2) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, latexOrInputChildren[0], latexOrInputChildren[1])));
  } else {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, latexOrInputChildren[0])));
  }
});
