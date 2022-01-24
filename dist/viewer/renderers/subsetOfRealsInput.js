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
export default class subsetOfReals extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.bounds = React.createRef();
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
    this.storedPoints = [];
    this.storedLines = [];
    this.firstHashXPosition = 40;
    this.xBetweenHashes = 36;
    this.pointHitTolerance = 0.2;
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
        y1: "35",
        x2: x,
        y2: "45",
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
    let position = this.firstHashXPosition + shiftedXValue / intervalValueWidth * this.xBetweenHashes;
    return position;
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
    this.storedPoints = [];
    for (let pt of this.doenetSvData.points) {
      let closed = pt.inSubset;
      let xPosition = this.xValueToXPosition(pt.value);
      let currentFillColor = this.primaryColor;
      if (!closed) {
        currentFillColor = "white";
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
    this.storedLines = [];
    for (let intervalObj of this.doenetSvData.intervals) {
      if (intervalObj.right < intervalObj.left || !intervalObj.inSubset) {
        continue;
      }
      let lowerXPosition = this.xValueToXPosition(intervalObj.left);
      let higherXPosition = this.xValueToXPosition(intervalObj.right);
      const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
      const higherPointKey = `higherIntervalPoint${higherXPosition}`;
      const lineKey = `line${lowerXPosition}-${higherXPosition}`;
      let currentFillColor = this.primaryColor;
      let lowerLine = lowerXPosition;
      let higherLine = higherXPosition;
      if (lowerXPosition < 38) {
        lowerLine = 20;
        this.storedPoints.push(/* @__PURE__ */ React.createElement("polygon", {
          key: lowerPointKey,
          points: "5,40 20,46 20,34",
          style: {
            fill: currentFillColor,
            stroke: currentFillColor,
            strokeWidth: "1"
          }
        }));
      }
      if (higherXPosition > 778) {
        higherLine = 782;
        this.storedPoints.push(/* @__PURE__ */ React.createElement("polygon", {
          key: higherPointKey,
          points: "795,40 780,46 780,34",
          style: {
            fill: currentFillColor,
            stroke: currentFillColor,
            strokeWidth: "1"
          }
        }));
      }
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
  async handleInput(e, inputState) {
    let mouseLeft = e.clientX - this.bounds.current.offsetLeft;
    let xPosition = this.xPositionToXValue(mouseLeft);
    if (inputState === "up") {
      if (this.state.mode === "move points") {
        if (this.pointGrabbed !== void 0) {
          await this.actions.movePoint({
            pointInd: this.pointGrabbed,
            value: xPosition,
            transient: false
          });
          this.pointGrabbed = void 0;
          this.forceUpdate();
        }
      } else {
        let pointInd = -1;
        for (let [ind, pt] of this.doenetSvData.points.entries()) {
          if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
            pointInd = ind;
            break;
          }
        }
        if (this.state.mode === "add remove points") {
          if (pointInd !== -1) {
            await this.actions.deletePoint(pointInd);
            this.forceUpdate();
          } else if (!this.doenetSvData.points.map((x) => x.value).includes(xPosition)) {
            await this.actions.addPoint(xPosition);
            this.forceUpdate();
          }
        } else if (this.state.mode === "toggle") {
          if (pointInd !== -1) {
            await this.actions.togglePoint(pointInd);
          } else {
            let intervalInd = 0;
            for (let pt of this.doenetSvData.points) {
              if (pt.value < xPosition) {
                intervalInd++;
              }
            }
            await this.actions.toggleInterval(intervalInd);
          }
          this.forceUpdate();
        }
      }
    } else if (inputState === "down") {
      if (this.state.mode === "move points") {
        let pointInd = -1;
        for (let [ind, pt] of this.doenetSvData.points.entries()) {
          if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
            pointInd = ind;
            break;
          }
        }
        if (pointInd !== -1) {
          this.pointGrabbed = pointInd;
        }
      }
    } else if (inputState === "move") {
      if (this.pointGrabbed !== void 0) {
        await this.actions.movePoint({
          pointInd: this.pointGrabbed,
          value: xPosition,
          transient: true
        });
        this.forceUpdate();
      }
    } else if (inputState == "leave") {
      if (this.state.mode === "move points") {
        if (this.pointGrabbed !== void 0) {
          await this.actions.movePoint({
            pointInd: this.pointGrabbed,
            value: xPosition,
            transient: false
          });
          this.pointGrabbed = void 0;
          this.forceUpdate();
        }
      }
    }
  }
  switchMode(mode) {
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
    let addRemovePointsStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "add remove points") {
      addRemovePointsStyle = {backgroundColor: activeButtonColor};
    }
    let toggleStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "toggle") {
      toggleStyle = {backgroundColor: activeButtonColor};
    }
    let movePointsStyle = {backgroundColor: inactiveButtonColor};
    if (this.state.mode === "move points") {
      movePointsStyle = {backgroundColor: activeButtonColor};
    }
    let controlButtons = null;
    if (!this.doenetSvData.fixed) {
      controlButtons = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
        style: addRemovePointsStyle,
        onClick: () => this.switchMode("add remove points")
      }, "Add/Remove points")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
        style: toggleStyle,
        onClick: () => this.switchMode("toggle")
      }, "Toggle points and intervals")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ModeButton, {
        style: movePointsStyle,
        onClick: () => this.switchMode("move points")
      }, "Move Points")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("button", {
        onClick: () => this.actions.clear()
      }, "Clear")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("button", {
        onClick: () => this.actions.setToR()
      }, "R")));
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      ref: this.bounds
    }, controlButtons), /* @__PURE__ */ React.createElement("svg", {
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
      style: {stroke: "black", strokeWidth: "2"}
    }), this.storedPoints, this.labels));
  }
}
