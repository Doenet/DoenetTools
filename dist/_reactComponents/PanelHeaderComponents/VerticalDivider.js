import React from "../../_snowpack/pkg/react.js";
import {doenetComponentBackgroundActive} from "./theme.js";
export default function VerticalDivider(props) {
  const verticalHeaderDivider = {
    borderRadius: "5px",
    borderLeft: `5px solid #1A5A99`,
    borderRight: "0px",
    height: props.height ? props.height : "52px",
    width: "0px",
    display: "inline-block",
    margin: "0px",
    verticalAlign: "middle",
    marginTop: props.marginTop ? props.marginTop : 0
  };
  return /* @__PURE__ */ React.createElement("div", {
    style: verticalHeaderDivider
  });
}
