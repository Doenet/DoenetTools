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
    value: "Enter text here",
    resize: "none",
    whiteSpace: "nowrap",
    padding: "0px 5px 0px 5px",
    lineHeight: "24px"
  };
  var label = {
    value: "Label:",
    fontSize: "14px",
    display: `${labelVisible}`,
    marginRight: "5px",
    marginBottom: `${align == "flex" ? "none" : "0px"}`
  };
  var container = {
    display: `${align}`,
    width: "auto",
    alignItems: "flex-end"
  };
  if (props.alert) {
    textfield.border = "2px solid #C1292E";
  }
  if (props.label) {
    label.value = props.label;
  }
  var disable = "";
  if (props.disabled) {
    textfield.border = "2px solid #e2e2e2";
    textfield.cursor = "not-allowed";
    disable = "disabled";
  }
  if (props.value) {
    textfield.value = props.value;
  }
  if (props.width) {
    if (props.width === "menu") {
      textfield.width = "200px";
      if (props.label) {
        container.width = "200px";
      }
    }
  }
  function handleChange(e) {
    if (props.onChange)
      props.onChange(e);
  }
  function handleBlur(e) {
    if (props.onBlur)
      props.onBlur(e);
  }
  function handleKeyDown(e) {
    if (props.onKeyDown)
      props.onKeyDown(e);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: container
  }, /* @__PURE__ */ React.createElement("p", {
    style: label
  }, label.value), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: textfield.value,
    style: textfield,
    onChange: (e) => {
      handleChange(e);
    },
    onBlur: (e) => {
      handleBlur(e);
    },
    onKeyDown: (e) => {
      handleKeyDown(e);
    },
    disabled: disable
  })));
}
