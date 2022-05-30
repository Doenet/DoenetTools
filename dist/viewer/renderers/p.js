import React from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
export default React.memo(function P(props) {
  let {name, SVs, children} = useDoenetRenderer(props);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("p", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), children);
});
