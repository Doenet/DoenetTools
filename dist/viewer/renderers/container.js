import React from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
export default function Container(props) {
  let {name, SVs, children} = useDoenetRenderer(props);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), children);
}
