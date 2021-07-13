import React, {useState} from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundInactive} from "./theme.js";
export default function Textfield(props) {
  const [labelVisible, setLabelVisible] = useState(props.label ? "static" : "none");
  const [align, setAlign] = useState(props.vertical ? "static" : "flex");
  var textfield = {
    margin: "0px",
    height: "24px",
    border: `2px solid ${doenetComponentForegroundInactive}`,
    fontFamily: "Arial",
    borderRadius: "5px",
    color: "#000",
    value: "Enter text here"
  };
  var label = {
    value: "Label:",
    fontSize: "12px",
    display: `${labelVisible}`,
    marginRight: "5px",
    marginBottom: `${align == "flex" ? "none" : "0px"}`
  };
  var container = {
    display: `${align}`,
    width: "auto",
    alignItems: "flex-end"
  };
  if (props.label) {
    label.value = props.label;
  }
  if (props.value) {
    textfield.value = props.value;
  }
  if (props.width) {
    if (props.width === "menu") {
      textfield.width = "235px";
      if (props.label) {
        container.width = "235px";
        textfield.width = "100%";
      }
    }
  }
  function handleChange(e) {
    if (props.onChange)
      props.onChange(e.target.value);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: container
  }, /* @__PURE__ */ React.createElement("p", {
    style: label
  }, label.value), /* @__PURE__ */ React.createElement("textarea", {
    defaultValue: textfield.value,
    style: textfield,
    onChange: (e) => {
      handleChange(e);
    }
  })));
}
