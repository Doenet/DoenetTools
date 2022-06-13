import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Tag(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let open = "<";
  let close = ">";
  if (SVs.selfClosed) {
    close = "/>";
  }
  return /* @__PURE__ */ React.createElement("code", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), open, children, close);
});
