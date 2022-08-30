import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function TextList(props) {
  let {name, id, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  if (children.length === 0 && SVs.text) {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: id
    }, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), /* @__PURE__ */ React.createElement("span", {
      id
    }, SVs.text));
  }
  let withCommas = children.slice(1).reduce((a, b) => [...a, ", ", b], [children[0]]);
  return /* @__PURE__ */ React.createElement(React.Fragment, {
    key: id
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), withCommas);
});
