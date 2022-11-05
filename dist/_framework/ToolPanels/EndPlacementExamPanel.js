import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
export default function EndPlacementExamPanel() {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      justifyContent: "center",
      alignItems: "center",
      margin: "20"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement("h1", null, "Exam is finished")), /* @__PURE__ */ React.createElement("div", {
    style: {alignItems: "center", maxWidth: "400px"}
  }, /* @__PURE__ */ React.createElement("p", null, "You have completed both parts of the placement exam. Wait 24 hours and return to ... to see placement results.")));
}
