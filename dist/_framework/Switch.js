import React, {useState, useEffect} from "../_snowpack/pkg/react.js";
import "./Switch.css.proxy.js";
function randomAlphaString(len) {
  let c = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += c[Math.round(Math.random() * 25)];
  }
  return str;
}
export default function Switch(props) {
  let id = props.id;
  if (!id) {
    id = randomAlphaString(20);
  }
  if (props.size === "Small") {
  }
  let propsChecked = false;
  if (props.checked === true || props.checked === "true" || props.checked === "1" || props.checked === 1) {
    propsChecked = true;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: (props.className || "") + " switch",
    key: id + "container"
  }, /* @__PURE__ */ React.createElement("label", {
    key: id + "label",
    htmlFor: id
  }, /* @__PURE__ */ React.createElement("input", {
    type: "checkbox",
    onChange: (e) => {
      props.onChange(e);
    },
    id,
    name: props.name,
    key: id,
    checked: propsChecked
  }), /* @__PURE__ */ React.createElement("span", {
    className: "switch-visual"
  }), /* @__PURE__ */ React.createElement("span", {
    className: "switch-text"
  }, props.children)));
}
