import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Tag(props) {
  let {name, id, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let open = "<";
  let close = ">";
  if (SVs.selfClosed) {
    close = "/>";
  }
  return /* @__PURE__ */ React.createElement("code", {
    id,
    style: {color: "var(--mainGreen)"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), open, children, close);
});
