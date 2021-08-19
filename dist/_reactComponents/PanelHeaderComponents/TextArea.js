import React, {useState} from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundInactive} from "./theme.js";
export default function TextArea(props) {
  const [labelVisible, setLabelVisible] = useState(props.label ? "static" : "none");
  const [align, setAlign] = useState(props.vertical ? "static" : "flex");
  var textarea = {
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
  if (props.alert) {
    textarea.border = "2px solid #C1292E";
  }
  if (props.label) {
    label.value = props.label;
  }
  if (props.disabled) {
    textarea.border = "2px solid #e2e2e2";
    textarea.cursor = "not-allowed";
  }
  if (props.value) {
    textarea.value = props.value;
  }
  if (props.width) {
    if (props.width === "menu") {
      textarea.width = "235px";
      if (props.label) {
        container.width = "235px";
        textarea.width = "100%";
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
    defaultValue: textarea.value,
    style: textarea,
    onChange: (e) => {
      handleChange(e);
    }
  })));
}
