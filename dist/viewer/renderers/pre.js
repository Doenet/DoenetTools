import React from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
export default function Pre(props) {
  let {name, SVs, children} = useDoenetRenderer(props);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("pre", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), children);
}
