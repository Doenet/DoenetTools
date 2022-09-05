import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Cell(props) {
  let {name, id, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let properties = {style: {padding: "3px 10px"}};
  if (SVs.colSpan !== 1) {
    properties.colSpan = SVs.colSpan;
  }
  if (SVs.halign !== null) {
    properties.style.textAlign = SVs.halign;
  }
  if (SVs.bottom !== "none") {
    properties.style.borderBottomStyle = "solid";
    if (SVs.bottom === "minor") {
      properties.style.borderBottomWidth = "thin";
    } else if (SVs.bottom === "medium") {
      properties.style.borderBottomWidth = "medium";
    } else {
      properties.style.borderBottomWidth = "thick";
    }
  }
  if (SVs.right !== "none") {
    properties.style.borderRightStyle = "solid";
    if (SVs.right === "minor") {
      properties.style.borderRightWidth = "thin";
    } else if (SVs.right === "medium") {
      properties.style.borderRightWidth = "medium";
    } else {
      properties.style.borderRightWidth = "thick";
    }
  }
  let content = children;
  if (content.length === 0) {
    content = SVs.text;
  }
  if (SVs.inHeader) {
    return /* @__PURE__ */ React.createElement("th", {
      id,
      ...properties
    }, content);
  } else {
    return /* @__PURE__ */ React.createElement("td", {
      id,
      ...properties
    }, content);
  }
});
