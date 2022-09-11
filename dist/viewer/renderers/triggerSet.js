import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default React.memo(function TriggerSet(props) {
  let {name, id, SVs, actions, callAction} = useDoenetRender(props, false);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    id,
    style: {margin: "12px 0", display: "inline-block"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement(Button, {
    id: id + "_button",
    onClick: () => callAction({action: actions.triggerActions}),
    disabled: SVs.disabled,
    value: SVs.label,
    valueHasLatex: SVs.labelHasLatex
  }));
});
