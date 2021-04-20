import React from "../../_snowpack/pkg/react.js";
import SelectBox from "./SelectBox.js";
import "./selectbox.css.proxy.js";
export default function DropDownSelect(props) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "drop-down-select"
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "1px"}
  }), /* @__PURE__ */ React.createElement(SelectBox, {
    items: props.data
  }));
}
