import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {useUpdateViewer} from "../ToolPanels/EditorViewer.js";
export default function ViewerUpdateButton(props) {
  const updateViewer = useUpdateViewer();
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(Button, {
    "data-test": "Viewer Update Button",
    value: "Update",
    onClick: updateViewer
  }));
}
