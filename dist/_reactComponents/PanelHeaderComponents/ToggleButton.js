import React, {useState} from "../../_snowpack/pkg/react.js";
import {doenetMainBlue} from "./theme.js";
export default function ToggleButton(props) {
  const [isSelected, setSelected] = useState(props.isSelected ? props.isSelected : false);
  const [labelVisible, setLabelVisible] = useState(props.label ? "inline" : "none");
  var toggleButton = {
    margin: "0px",
    height: "24px",
    border: `2px solid ${doenetMainBlue}`,
    color: `${doenetMainBlue}`,
    backgroundColor: "#FFF",
    borderRadius: "5px",
    value: "Toggle Button",
    padding: "0px 10px 0px 10px",
    cursor: "pointer",
    fontSize: "12px",
    textAlign: "center"
  };
  var label = {
    value: "Label:",
    fontSize: "12px",
    display: `${labelVisible}`
  };
  var icon = "";
  if (props.size === "medium") {
    toggleButton.height = "36px", toggleButton.fontSize = "18px", label.fontSize = "18px";
  }
  if (props.value || props.icon) {
    if (props.value && props.icon) {
      icon = props.icon;
      toggleButton.value = props.value;
    } else if (props.value) {
      toggleButton.value = props.value;
    } else if (props.icon) {
      icon = props.icon;
      toggleButton.value = "";
    }
  }
  if (isSelected === true) {
    toggleButton.backgroundColor = `${doenetMainBlue}`;
    toggleButton.color = "#FFF";
    toggleButton.border = "2px solid #FFF";
    if (props.switch_value)
      toggleButton.value = props.switch_value;
  }
  function handleClick() {
    if (isSelected === false) {
      setSelected(true);
    }
    if (isSelected === true) {
      setSelected(false);
    }
    if (props.callback)
      props.callback();
  }
  if (props.label) {
    label.value = props.label;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", {
    style: label
  }, label.value), /* @__PURE__ */ React.createElement("button", {
    id: "toggleButton",
    style: toggleButton,
    onClick: () => {
      handleClick();
    }
  }, icon, " ", toggleButton.value));
}
