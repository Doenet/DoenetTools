import React from "react";
import "./ProgressBar.css";
export default function ProgressBar(props) {
  function convert() {
    var elem = document.getElementById("moving");
    var width = elem.width.animVal.value;
    var decimalPercent = percent / 100;
    width = decimalPercent * 1e3;
    elem.setAttribute("width", width);
    return width;
  }
  function load(percent2) {
    var elem = document.getElementById("moving");
    var length = elem.width.animVal.value;
    if (length == 1e3) {
      length = 0;
    } else {
      length = percent2 * 1e3;
    }
    elem.setAttribute("width", length);
    return length;
  }
  function submit() {
    var percent2 = document.getElementById("percent").value / 100;
    load(percent2);
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 -200 1500 500"
  }, /* @__PURE__ */ React.createElement("rect", {
    id: "main",
    x: "50",
    y: "150",
    rx: "25",
    fill: "#E2E2E2",
    stroke: "none",
    strokeWidth: "0",
    width: "1000",
    height: "50"
  }), /* @__PURE__ */ React.createElement("rect", {
    id: "moving",
    x: "50",
    y: "150",
    rx: "25",
    fill: "#1A5A99",
    stroke: "none",
    strokeWidth: "0",
    width: "0",
    height: "50"
  }), /* @__PURE__ */ React.createElement("g", {
    className: "donut-main"
  }, /* @__PURE__ */ React.createElement("circle", {
    id: "donut",
    fill: "rgb(238,161,119)",
    cx: "100",
    cy: "100",
    r: "50"
  }), /* @__PURE__ */ React.createElement("circle", {
    id: "donut-topping",
    cx: "100",
    cy: "100",
    r: "40",
    fill: "rgb(109,68,69)"
  }), /* @__PURE__ */ React.createElement("circle", {
    id: "donut-hole",
    cx: "100",
    cy: "100",
    r: "15",
    fill: "#FFFFFF"
  }))), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    id: "percent"
  }), /* @__PURE__ */ React.createElement("p", null, "%"), /* @__PURE__ */ React.createElement("button", {
    className: "button",
    onClick: () => {
      submit();
    }
  }, "Submit"));
}
