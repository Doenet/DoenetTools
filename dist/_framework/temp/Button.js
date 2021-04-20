import React from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundActive} from "./theme.js";
export default function Button(props) {
  var button = {
    margin: "0px",
    height: "24px",
    border: `hidden`,
    backgroundColor: `${doenetComponentForegroundActive}`,
    fontFamily: "Arial",
    color: "#FFFFFF",
    borderRadius: "20px",
    value: "Button",
    padding: "0px 10px 0px 10px",
    cursor: "pointer",
    fontSize: "12px"
  };
  if (props.size === "medium") {
    button.height = "36px", button.fontSize = "18px";
  }
  ;
  if (button.width < button.height) {
    button.width = "85px";
  }
  ;
  if (props.value) {
    button.value = props.value;
  }
  ;
  function handleClick(e) {
    if (props.callback)
      props.callback(e);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    style: button,
    ...props,
    onClick: (e) => {
      handleClick(e);
    }
  }, button.value));
}
