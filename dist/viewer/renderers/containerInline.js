import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function ContainerInline(props) {
  let {name, id, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("span", {
    id
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), children);
});
