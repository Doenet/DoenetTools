import React from "react";
import SelectBox from "./SelectBox.js";
import "./selectbox.css";
export default function DropDownSelect(props) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "drop-down-select"
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "1px"}
  }), /* @__PURE__ */ React.createElement(SelectBox, {
    items: props.data
  }));
}
