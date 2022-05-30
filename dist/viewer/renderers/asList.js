import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function AsList(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
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
  }), withCommas);
});
