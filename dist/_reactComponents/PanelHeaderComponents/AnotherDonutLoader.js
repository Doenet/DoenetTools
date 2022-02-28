import React from "../../_snowpack/pkg/react.js";
export default function ScaleDonut() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 500 500",
    className: "align"
  }, /* @__PURE__ */ React.createElement("g", {
    className: "donut-scale"
  }, /* @__PURE__ */ React.createElement("circle", {
    id: "donut",
    fill: "rgb(238,161,119)",
    cx: "50",
    cy: "50",
    r: "50"
  }), /* @__PURE__ */ React.createElement("circle", {
    id: "donut-topping",
    cx: "50",
    cy: "50",
    r: "40",
    fill: "rgb(109,68,69)"
  }), /* @__PURE__ */ React.createElement("circle", {
    id: "donut-hole",
    cx: "50",
    cy: "50",
    r: "18",
    fill: "#FFFFFF"
  }))));
}
