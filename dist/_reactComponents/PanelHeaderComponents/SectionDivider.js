import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
export default function SectionDivider(props) {
  let divStyle = {
    display: "grid",
    gridAutoFlow: "row",
    gridGap: 8,
    padding: 8,
    width: 240,
    boxSizing: "border-box"
  };
  switch (props.type) {
    case 1:
    case "single":
      divStyle.gridTemplate = "repeat(1, 1fr) / repeat(1, 1fr)";
      break;
    case 2:
    case "double":
      divStyle.gridTemplate = "repeat(1 , 1fr) / repeat(2, 1fr)";
      break;
    default:
      divStyle.gridTemplate = "repeat(" + props.rows + ", 1fr) / repeat(" + props.columns + ", 1fr)";
      divStyle.gridGap = props.gap;
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: divStyle
  }, props.children);
}
