import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function List(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  if (SVs.item) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("li", {
      id: name
    }, children));
  } else if (SVs.numbered) {
    return /* @__PURE__ */ React.createElement("ol", {
      id: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), children);
  } else {
    return /* @__PURE__ */ React.createElement("ul", {
      id: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), children);
  }
}
