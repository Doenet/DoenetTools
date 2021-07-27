import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function PlaygroundTool() {
  return /* @__PURE__ */ React.createElement("div", {
    style: {gridArea: "mainPanel"}
  }, /* @__PURE__ */ React.createElement("p", null, "hello"));
}
export function PlayControler() {
  return /* @__PURE__ */ React.createElement(Button, {
    label: "swap"
  });
}
