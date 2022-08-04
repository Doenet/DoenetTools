import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default React.memo(function TriggerSet(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props, false);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    id: name,
    style: {margin: "12px 0", display: "inline-block"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement(Button, {
    id: name + "_button",
    onClick: () => callAction({action: actions.triggerActions}),
    disabled: SVs.disabled,
    value: SVs.label,
    valueHasLatex: SVs.labelHasLatex
  }));
});
