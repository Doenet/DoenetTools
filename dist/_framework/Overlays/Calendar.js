import React, {useEffect} from "../../_snowpack/pkg/react.js";
import Tool from "../Tool.js";
import {useToolControlHelper} from "../ToolRoot.js";
export default function Calendar({contentId, branchId}) {
  useEffect(() => {
    return () => console.log(">>>Cal exit");
  }, []);
  return /* @__PURE__ */ React.createElement(Tool, {
    isOverlay: true
  }, /* @__PURE__ */ React.createElement("headerPanel", null), /* @__PURE__ */ React.createElement("mainPanel", null, "This is the calendar on branch: ", branchId, " with content: ", contentId), /* @__PURE__ */ React.createElement("supportPanel", null), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "actions"
  }));
}
