import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Row(props) {
  let {name, id, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let style = {};
  if (SVs.valign !== null) {
    style.verticalAlign = SVs.valign;
  }
  if (SVs.left !== "none") {
    style.borderLeftStyle = "solid";
    if (SVs.left === "minor") {
      style.borderLeftWidth = "thin";
    } else if (SVs.left === "medium") {
      style.borderLeftWidth = "medium";
    } else {
      style.borderLeftWidth = "thick";
    }
  }
  return /* @__PURE__ */ React.createElement("tr", {
    id,
    style
  }, children);
});
