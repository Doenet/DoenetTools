import React from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundInactive} from "./theme.js";
export default function Textfield(props) {
  var textfield = {
    margin: "0px",
    height: "24px",
    border: `2px solid ${doenetComponentForegroundInactive}`,
    fontFamily: "Arial",
    borderRadius: "5px",
    color: "#000",
    value: "Enter text here"
  };
  if (props.size === "medium") {
    textfield.height = "36px";
  }
  if (props.value) {
    textfield.value = props.value;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("textarea", {
    defaultValue: textfield.value,
    style: textfield
  }));
}
