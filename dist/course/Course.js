import React, {useEffect} from "react";
import Tool from "../_framework/Tool.js";
import {useToolControlHelper} from "../_framework/ToolRoot.js";
import {useToast} from "../_framework/Toast.js";
export default function Course() {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const [toast, toastType] = useToast();
  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Course"
  }), /* @__PURE__ */ React.createElement("mainPanel", null, "Course Tool"));
}
