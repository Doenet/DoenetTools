import React, {useState} from "../../_snowpack/pkg/react.js";
export default function EndExamPanel() {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "20"
    }
  }, /* @__PURE__ */ React.createElement("img", {
    style: {width: "250px", height: "250px"},
    alt: "Doenet Logo",
    src: "/media/Doenet_Logo_Frontpage.png"
  }), /* @__PURE__ */ React.createElement("div", {
    style: {leftPadding: "10px"}
  }, /* @__PURE__ */ React.createElement("h1", null, "Exam is finished"), /* @__PURE__ */ React.createElement("div", null)));
}
