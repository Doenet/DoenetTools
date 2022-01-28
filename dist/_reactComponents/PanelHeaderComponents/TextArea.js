import React, {useState} from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundInactive} from "./theme.js";
export default function TextArea(props) {
  const [labelVisible, setLabelVisible] = useState(props.label ? "static" : "none");
  const [align, setAlign] = useState(props.vertical ? "static" : "flex");
  const [text, setText] = useState("");
  var textarea = {
    margin: "0px 4px 0px 0px",
    height: "24px",
    border: `2px solid ${doenetComponentForegroundInactive}`,
    fontFamily: "Arial",
    fontSize: "14px",
    borderRadius: "5px",
    color: "#000",
    value: `${text}`
  };
  var label = {
    value: "Label:",
    fontSize: "14px",
    display: `${labelVisible}`,
    marginRight: "5px",
    marginBottom: `${align == "flex" ? "none" : "2px"}`
  };
  var container = {
    display: `${align}`,
    width: "auto",
    alignItems: "center"
  };
  if (props.alert) {
    textarea.border = "2px solid #C1292E";
  }
  if (props.label) {
    label.value = props.label;
  }
  if (props.placeholder) {
    textarea.placeholder = props.placeholder;
  }
  if (props.ariaLabel) {
    textarea.ariaLabel = props.ariaLabel;
  }
  var disable = "";
  if (props.disabled) {
    textarea.border = "2px solid #e2e2e2";
    textarea.cursor = "not-allowed";
    disable = "disabled";
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
  }, label.value), /* @__PURE__ */ React.createElement("textarea", {
    defaultValue: textarea.value,
    style: textarea,
    "aria-label": textarea.ariaLabel,
    placeholder: textarea.placeholder,
    onChange: (e) => {
      handleChange(e);
    },
    onKeyDown: (e) => {
      handleKeyDown(e);
    },
    onBlur: (e) => {
      handleBlur(e);
    },
    disabled: disable
  })));
}
