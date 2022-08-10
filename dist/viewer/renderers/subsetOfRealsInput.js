import React, {useRef, useState, useEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import useDoenetRender from "./useDoenetRenderer.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import ToggleButton from "../../_reactComponents/PanelHeaderComponents/ToggleButton.js";
import ToggleButtonGroup from "../../_reactComponents/PanelHeaderComponents/ToggleButtonGroup.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
const TextNoSelect = styled.text`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;
export default React.memo(function subsetOfReals(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props, false);
  let [mode, setMode] = useState("add remove points");
  let bounds = useRef(null);
  let pointGrabbed = useRef(null);
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
    };
  }, []);
  if (SVs.hidden) {
    return null;
  }
  function handleTogglePoints(val) {
    if (val === 0) {
      console.log(val);
      setMode("add remove points");
    } else if (val === 1) {
      console.log(val);
      setMode("toggle");
    } else if (val === 2) {
      console.log(val);
      setMode("move points");
    }
  }
  let controlButtons = null;
  if (!SVs.fixed) {
    controlButtons = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
      onClick: handleTogglePoints
    }, /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Add/Remove points"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Toggle points and intervals"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Move Points"
    })), /* @__PURE__ */ React.createElement(ActionButtonGroup, null, /* @__PURE__ */ React.createElement(ActionButton, {
      onClick: () => callAction({
        action: actions.clear
      }),
      value: "Clear"
    }), /* @__PURE__ */ React.createElement(ActionButton, {
      onClick: () => callAction({
        action: actions.setToR
      }),
      value: "R"
    })));
  }
  let firstHashXPosition = 40;
  let xBetweenHashes = 36;
  let hashLines = [];
  let numbers = [];
  for (let number = -10; number <= 10; number++) {
    numbers.push(number);
  }
  let labels = [];
  for (let x = firstHashXPosition; x < 780; x = x + xBetweenHashes) {
    hashLines.push(/* @__PURE__ */ React.createElement("line", {
      key: "hash" + x,
      x1: x,
      y1: "35",
      x2: x,
      y2: "45",
      style: {stroke: "black", strokeWidth: "1"},
      shapeRendering: "geometricPrecision"
    }));
    let number = numbers.shift();
    labels.push(/* @__PURE__ */ React.createElement(TextNoSelect, {
      key: "label" + x,
      x,
      y: "66",
      textAnchor: "middle"
    }, number));
  }
  let storedPoints = [];
  for (let pt of SVs.points) {
    let closed = pt.inSubset;
    let xPosition = xValueToXPosition(pt.value);
    let currentFillColor = "var(--mainPurple)";
    if (!closed) {
      currentFillColor = "white";
    }
    let key = `point-${xPosition}`;
    storedPoints.push(/* @__PURE__ */ React.createElement("circle", {
      key,
      cx: xPosition,
      cy: "40",
      r: "6",
      stroke: "black",
      strokeWidth: "1",
      fill: currentFillColor
    }));
  }
  let storedLines = [];
  for (let intervalObj of SVs.intervals) {
    if (intervalObj.right < intervalObj.left || !intervalObj.inSubset) {
      continue;
    }
    let lowerXPosition = xValueToXPosition(intervalObj.left);
    let higherXPosition = xValueToXPosition(intervalObj.right);
    const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
    const higherPointKey = `higherIntervalPoint${higherXPosition}`;
    const lineKey = `line${lowerXPosition}-${higherXPosition}`;
    let currentFillColor = "var(--mainPurple)";
    let lowerLine = lowerXPosition;
    let higherLine = higherXPosition;
    if (lowerXPosition < 38) {
      lowerLine = 20;
      storedPoints.push(/* @__PURE__ */ React.createElement("polygon", {
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
      storedPoints.push(/* @__PURE__ */ React.createElement("polygon", {
        key: higherPointKey,
        points: "795,40 780,46 780,34",
        style: {
          fill: currentFillColor,
          stroke: currentFillColor,
          strokeWidth: "1"
        }
      }));
    }
    storedLines.push(/* @__PURE__ */ React.createElement("line", {
      key: lineKey,
      x1: lowerLine,
      y1: "40",
      x2: higherLine,
      y2: "40",
      style: {stroke: currentFillColor, strokeWidth: "8"}
    }));
  }
  function xValueToXPosition(xValue) {
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let shiftedXValue = xValue + shiftAmount;
    let position = firstHashXPosition + shiftedXValue / intervalValueWidth * xBetweenHashes;
    return position;
  }
  function xPositionToXValue(xPosition) {
    let relativeX = xPosition - firstHashXPosition;
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let value = relativeX / xBetweenHashes * intervalValueWidth;
    value = value - shiftAmount;
    return value;
  }
  async function handleInput(e, inputState) {
    let mouseLeft = e.clientX - bounds.current.offsetLeft;
    let xPosition = xPositionToXValue(mouseLeft);
    let pointHitTolerance = 0.2;
    if (inputState === "up") {
      if (mode === "move points") {
        if (pointGrabbed.current !== null) {
          callAction({
            action: actions.movePoint,
            args: {
              pointInd: pointGrabbed.current,
              value: xPosition,
              transient: false
            }
          });
          pointGrabbed.current = null;
        }
      }
      if (mode === "add remove points") {
        if (pointGrabbed.current !== null) {
          callAction({
            action: actions.deletePoint,
            args: {pointInd: pointGrabbed.current}
          });
        } else if (!SVs.points.map((x) => x.value).includes(xPosition)) {
          callAction({
            action: actions.addPoint,
            args: {value: xPosition}
          });
        }
      } else if (mode === "toggle") {
        if (pointGrabbed.current !== null) {
          callAction({
            action: actions.togglePoint,
            args: {pointInd: pointGrabbed.current}
          });
        } else {
          let intervalInd = 0;
          for (let pt of SVs.points) {
            if (pt.value < xPosition) {
              intervalInd++;
            }
          }
          callAction({
            action: actions.toggleInterval,
            args: {intervalInd}
          });
        }
      }
    } else if (inputState === "down") {
      let pointInd = null;
      for (let [ind, pt] of SVs.points.entries()) {
        if (Math.abs(pt.value - xPosition) < pointHitTolerance) {
          pointInd = ind;
          break;
        }
      }
      if (pointInd !== null) {
        pointGrabbed.current = pointInd;
      } else {
        pointGrabbed.current = null;
      }
    } else if (inputState === "move") {
      if (mode === "move points" && pointGrabbed.current !== null) {
        callAction({
          action: actions.movePoint,
          args: {
            pointInd: pointGrabbed.current,
            value: xPosition,
            transient: true
          }
        });
      }
    } else if (inputState == "leave") {
      if (mode === "move points") {
        if (pointGrabbed.current !== null) {
          callAction({
            action: actions.movePoint,
            args: {
              pointInd: pointGrabbed.current,
              value: xPosition,
              transient: false
            }
          });
          pointGrabbed.current = null;
        }
      }
    }
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("div", {
    ref: bounds,
    style: {display: "flex", gap: "12px"}
  }, controlButtons), /* @__PURE__ */ React.createElement("svg", {
    width: "808",
    height: "80",
    style: {backgroundColor: "white"},
    onMouseDown: (e) => {
      handleInput(e, "down");
    },
    onMouseUp: (e) => {
      handleInput(e, "up");
    },
    onMouseMove: (e) => {
      handleInput(e, "move");
    },
    onMouseLeave: (e) => {
      handleInput(e, "leave");
    }
  }, /* @__PURE__ */ React.createElement("polygon", {
    points: "5,40 20,50 20,30",
    style: {fill: "black", stroke: "black", strokeWidth: "1"}
  }), /* @__PURE__ */ React.createElement("polygon", {
    points: "795,40 780,50 780,30",
    style: {fill: "black", stroke: "black", strokeWidth: "1"}
  }), storedLines, hashLines, /* @__PURE__ */ React.createElement("line", {
    x1: "20",
    y1: "40",
    x2: "780",
    y2: "40",
    style: {stroke: "black", strokeWidth: "2"}
  }), storedPoints, labels)));
});
