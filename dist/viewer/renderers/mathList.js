import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function MathList(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  if (children.length === 0 && SVs.latex) {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("span", {
      id: name
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, "\\(" + SVs.latex + "\\)")));
  }
  if (children.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: name
    });
  }
  let withCommas = children.slice(1).reduce((a, b) => [...a, ", ", b], [children[0]]);
  return /* @__PURE__ */ React.createElement(React.Fragment, {
    key: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    id: name
  }, withCommas));
});
