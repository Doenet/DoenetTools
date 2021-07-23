import React from "../../_snowpack/pkg/react.js";
import {useToast} from "../Toast.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function AddDriveItems(props) {
  const [toast, toastType] = useToast();
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => toast("Stub Add Folder!", toastType.SUCCESS),
    value: "Add Folder"
  }, "Add Folder")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => toast("Stub Add Assignment!", toastType.SUCCESS),
    value: "Add Assignment"
  }, "Add Assignment")), /* @__PURE__ */ React.createElement("div", null, " ", /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => toast("Stub Add DoenetML!", toastType.SUCCESS),
    value: "Add DoenetML"
  }, "Add DoenetML")));
}
