import React from "../../_snowpack/pkg/react.js";
import Tool from "../Tool.js";
export default function Image({contentId, branchId}) {
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", null), /* @__PURE__ */ React.createElement("mainPanel", null, "This is the image on branch: ", branchId, " with content: ", contentId), /* @__PURE__ */ React.createElement("supportPanel", null), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "actions"
  }));
}
