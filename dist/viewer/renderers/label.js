import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
export default React.memo(function Label(props) {
  let {name, id, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  if (children.length > 0) {
    return /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), children);
  } else {
    let label = SVs.value;
    if (SVs.hasLatex) {
      label = /* @__PURE__ */ React.createElement(MathJax, {
        hideUntilTypeset: "first",
        inline: true,
        dynamic: true
      }, label);
    }
    return /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), label);
  }
});
