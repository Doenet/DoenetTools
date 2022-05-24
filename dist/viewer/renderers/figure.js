import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Figure(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden || !children) {
    return null;
  }
  let childrenToRender = children;
  let caption;
  if (SVs.captionChildName) {
    let captionChildInd;
    for (let [ind, child] of children.entries()) {
      if (typeof child !== "string" && child.props.componentInstructions.componentName === SVs.captionChildName) {
        captionChildInd = ind;
        break;
      }
    }
    caption = children[captionChildInd];
    childrenToRender.splice(captionChildInd, 1);
  } else {
    caption = SVs.caption;
  }
  if (!SVs.suppressFigureNameInCaption) {
    let figureName = /* @__PURE__ */ React.createElement("strong", null, SVs.figureName);
    if (caption) {
      caption = /* @__PURE__ */ React.createElement(React.Fragment, null, figureName, ": ", caption);
    } else {
      caption = figureName;
    }
  }
  return /* @__PURE__ */ React.createElement("figure", {
    id: name,
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), childrenToRender, /* @__PURE__ */ React.createElement("figcaption", {
    id: name + "_caption"
  }, caption));
}
