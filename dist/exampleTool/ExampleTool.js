import React, {useEffect} from "../_snowpack/pkg/react.js";
import Tool from "../_framework/Tool.js";
import {useToolControlHelper} from "../_framework/ToolRoot.js";
import {useToast} from "../_framework/Toast.js";
export default function DoenetExampleTool() {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const [toast, toastType] = useToast();
  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("navPanel", null), /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Doenet Example Tool"
  }), /* @__PURE__ */ React.createElement("mainPanel", {
    responsiveControls: /* @__PURE__ */ React.createElement("p", null, "tests")
  }), /* @__PURE__ */ React.createElement("supportPanel", {
    isInitOpen: true,
    responsiveControls: /* @__PURE__ */ React.createElement("p", null, "tests")
  }, /* @__PURE__ */ React.createElement("p", null, "Support Panel")), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "edit",
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement("p", null, "control important stuff"), /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "SUCCESS"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      toast("hello from SUCCESS Toast!", toastType.SUCCESS);
    }
  }, "Toast!"), /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "ERROR"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      toast("hello from ERROR Toast!", toastType.ERROR);
    }
  }, "Toast!"), /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "INFO"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      toast("hello from INFO Toast!", toastType.INFO);
    }
  }, "Toast!"), /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "Calendar"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      openOverlay({
        type: "calendar",
        title: "Cal",
        branchId: "fdsa"
      });
    }
  }, "open")), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "other"
  }, /* @__PURE__ */ React.createElement("p", null, "control more important stuff")));
}
