import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import styled from "../../_snowpack/pkg/styled-components.js";
{
}
const TextNoSelect = styled.text`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;
const ModeButton = styled.button`
  &:focus {
    outline: 0;
  }
  width: 120px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  margin-left: 1px;
  margin-top: 1px;
`;
export default class IntervalInput extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.buildLine = this.buildLine.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.buildPoints = this.buildPoints.bind(this);
    this.buildIntervals = this.buildIntervals.bind(this);
    this.state = {
      mode: "toggle or drag points",
      activePointObj: null,
      activeIntervalObj: null,
      pointsAndIntervalsObj: []
    };
    this.primaryColor = "red";
    this.removeColor = "grey";
    this.storedPoints = [];
    this.storedLines = [];
    this.firstHashXPosition = 40;
    this.xBetweenHashes = 36;
  }
  buildLine() {
    this.hashLines = [];
    let numbers = [];
    for (let number = -10; number <= 10; number++) {
      numbers.push(number);
    }
    this.labels = [];
    for (let x = this.firstHashXPosition; x < 780; x = x + this.xBetweenHashes) {
      this.hashLines.push(/* @__PURE__ */ React.createElement("line", {
        key: "hash" + x,
        x1: x,
        y1: "20",
        x2: x,
        y2: "50",
        style: {stroke: "black", strokeWidth: "1"},
        shapeRendering: "geometricPrecision"
      }));
      let number = numbers.shift();
      this.labels.push(/* @__PURE__ */ React.createElement(TextNoSelect, {
        key: "label" + x,
        x,
        y: "66",
        textAnchor: "middle"
      }, number));
    }
  }
  xValueToXPosition(xValue) {
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let shiftedXValue = xValue + shiftAmount;
    return this.firstHashXPosition + shiftedXValue / intervalValueWidth * this.xBetweenHashes;
  }
  xPositionToXValue(xPosition) {
    let relativeX = xPosition - this.firstHashXPosition;
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let value = relativeX / this.xBetweenHashes * intervalValueWidth;
    value = value - shiftAmount;
    return value;
  }
  buildPoints() {
    for (let xValue of this.doenetSvData.numericalPoints) {
      let closed = true;
      let remove = false;
      let xPosition = this.xValueToXPosition(xValue);
      let currentFillColor = this.primaryColor;
      if (!closed) {
        currentFillColor = "white";
      }
      if (remove) {
        currentFillColor = this.removeColor;
      }
      let key = `point-${xPosition}`;
      this.storedPoints.push(/* @__PURE__ */ React.createElement("circle", {
        key,
        cx: xPosition,
        cy: "40",
        r: "6",
        stroke: "black",
        strokeWidth: "1",
        fill: currentFillColor
      }));
    }
  }
  buildIntervals() {
    for (let intervalObj of this.doenetSvData.numericalIntervals) {
      console.log(intervalObj);
      if (intervalObj.end < intervalObj.start) {
        continue;
      }
      let lowerXPosition = this.xValueToXPosition(intervalObj.start);
      let higherXPosition = this.xValueToXPosition(intervalObj.end);
      const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
      const higherPointKey = `higherIntervalPoint${higherXPosition}`;
      const lineKey = `line${lowerXPosition}-${higherXPosition}`;
      let remove = false;
      let currentFillColor = this.primaryColor;
      if (remove) {
        currentFillColor = this.removeColor;
      }
      let lowerFillColor = "white";
      if (intervalObj.startClosed) {
        lowerFillColor = currentFillColor;
      }
      let higherFillColor = "white";
      if (intervalObj.endClosed) {
        higherFillColor = currentFillColor;
      }
      let lowerLine = lowerXPosition;
      let higherLine = higherXPosition;
      if (lowerXPosition < 38) {
        lowerLine = 20;
        this.storedPoints.push(/* @__PURE__ */ React.createElement("polygon", {
          key: lowerPointKey,
          points: "5,40 20,46 20,34",
          style: {
            fill: lowerFillColor,
            stroke: lowerFillColor,
            strokeWidth: "1"
          }
        }));
      } else {
        this.storedPoints.push(/* @__PURE__ */ React.createElement("circle", {
          key: lowerPointKey,
          cx: lowerXPosition,
          cy: "40",
          r: "6",
          stroke: "black",
          strokeWidth: "1",
          fill: lowerFillColor
        }));
      }
      if (higherXPosition > 778) {
        higherLine = 782;
        this.storedPoints.push(/* @__PURE__ */ React.createElement("polygon", {
          key: higherPointKey,
          points: "795,40 780,46 780,34",
          style: {
            fill: higherFillColor,
            stroke: higherFillColor,
            strokeWidth: "1"
          }
        }));
      } else {
        this.storedPoints.push(/* @__PURE__ */ React.createElement("circle", {
          key: higherPointKey,
          cx: higherXPosition,
          cy: "40",
          r: "6",
          stroke: "black",
          strokeWidth: "1",
          fill: higherFillColor
        }));
      }
      console.log(`lowerXPosition ${lowerXPosition} higherXPosition ${higherXPosition}`);
      this.storedLines.push(/* @__PURE__ */ React.createElement("line", {
        key: lineKey,
        x1: lowerLine,
        y1: "40",
        x2: higherLine,
        y2: "40",
        style: {stroke: currentFillColor, strokeWidth: "8"}
      }));
    }
  }
  handleInput(e, inputState) {
    if (inputState === "up") {
      let xPosition = this.xPositionToXValue(e.clientX);
      console.log(xPosition);
    }
  }
  switchMode(mode) {
    console.log(mode);
    this.setState({mode});
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    this.buildLine();
    this.buildPoints();
    this.buildIntervals();
    const activeButtonColor = "lightblue";
    const inactiveButtonColor = "lightgrey";
    let addIntervalStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "add interval" || this.state.mode === "add 2nd intervalPoint") {
      addIntervalStyle = {backgroundColor: activeButtonColor};
    }
    let removeIntervalStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "remove interval") {
      removeIntervalStyle = {backgroundColor: activeButtonColor};
    }
    let addPointStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "add point") {
      addPointStyle = {backgroundColor: activeButtonColor};
    }
    let removePointStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "remove point") {
      removePointStyle = {backgroundColor: activeButtonColor};
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
      style: addIntervalStyle,
      onClick: () => this.switchMode("add interval")
    }, "Add Interval")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
      style: removeIntervalStyle,
      onClick: () => this.switchMode("remove interval")
    }, "Remove Interval")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
      style: addPointStyle,
      onClick: () => this.switchMode("add point")
    }, "Add Point")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
      style: removePointStyle,
      onClick: () => this.switchMode("remove point")
    }, "Remove Point")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
      style: {backgroundColor: inactiveButtonColor},
      onClick: () => console.log("simplify")
    }, "Simplify"))), /* @__PURE__ */ React.createElement("svg", {
      width: "808",
      height: "80",
      style: {backgroundColor: "white"},
      onMouseDown: (e) => {
        this.handleInput(e, "down");
      },
      onMouseUp: (e) => {
        this.handleInput(e, "up");
      },
      onMouseMove: (e) => {
        this.handleInput(e, "move");
      },
      onMouseLeave: (e) => {
        this.handleInput(e, "leave");
      }
    }, /* @__PURE__ */ React.createElement("polygon", {
      points: "5,40 20,50 20,30",
      style: {fill: "black", stroke: "black", strokeWidth: "1"}
    }), /* @__PURE__ */ React.createElement("polygon", {
      points: "795,40 780,50 780,30",
      style: {fill: "black", stroke: "black", strokeWidth: "1"}
    }), this.storedLines, this.hashLines, /* @__PURE__ */ React.createElement("line", {
      x1: "20",
      y1: "40",
      x2: "780",
      y2: "40",
      style: {stroke: "black", strokeWidth: "4"}
    }), this.storedPoints, this.labels));
  }
}
