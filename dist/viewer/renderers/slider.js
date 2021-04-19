import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import {Spring} from "react-spring";
import useDoenetRender from "./useDoenetRenderer.js";
const SliderContainer = styled.div`
    width: fit-content;
    height: ${(props) => props.labeled && props.noTicked ? "60px" : props.labeled ? "80px" : props.noTicked ? "40px" : "60px"};
`;
const SubContainer2 = styled.div`
    padding-top: 10px;
    height: 50px;
`;
const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 5px;
  width: ${(props) => props.width};
`;
const StyledValueLabel = styled.p`
    display: inline;
    user-select: none;
`;
const StyledThumb = styled.div`
  width: 10px;
  height: 15px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.8;
  background: ${(props) => props.disabled ? "#404040" : "#002266"};
  cursor: pointer;
`;
const Tick = styled.div`
    position: absolute;
    border-left: solid #888888;
    height: 10px;
    width: 1px;
    left: ${(props) => props.x};
`;
const Label = styled.p`
    position: absolute;
    left: ${(props) => props.x};
    color: #888888;
    font-size: 15px;
    user-select: none;
`;
function generateNumericLabels(points, div_width, point_start_val) {
  return [
    points.map((point) => /* @__PURE__ */ React.createElement(Tick, {
      key: point,
      x: `${(point - point_start_val) * div_width}px`
    })),
    points.map((point) => /* @__PURE__ */ React.createElement(Label, {
      key: point,
      x: `${(point - point_start_val) * div_width - 3}px`
    }, point))
  ];
}
function generateTextLabels(points, div_width) {
  return [
    points.map((point, index) => /* @__PURE__ */ React.createElement(Tick, {
      key: point,
      x: `${index * div_width}px`
    })),
    points.map((point, index) => /* @__PURE__ */ React.createElement(Label, {
      key: point,
      x: `${index * div_width - 3}px`
    }, point))
  ];
}
function xPositionToValue(ref, div_width, start_val) {
  return start_val + ref / div_width;
}
function nearestValue(refval, points) {
  let [min, val, index] = [Infinity, null, 0];
  let i = 0;
  for (let point of points) {
    let diff = Math.abs(point - refval);
    if (diff < min) {
      min = diff;
      val = point;
      index = i;
    }
    i = i + 1;
  }
  return [val, index];
}
export default function Slider(props) {
  let [name, SVs, actions] = useDoenetRender(props);
  const containerRef = useRef(null);
  let sorted_points = [...SVs.items].sort((p1, p2) => p1 - p2);
  const [thumbXPos, setThumbXPos] = useState(0);
  const [thumbValue, setThumbValue] = useState(SVs.sliderType === "text" ? SVs.items[0] : sorted_points[0]);
  const [isMouseDown, setIsMouseDown] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [startValue, setStartValue] = useState(SVs.sliderType === "text" ? 0 : sorted_points[0]);
  const [endValue, setEndValue] = useState(SVs.sliderType === "text" ? 0 : sorted_points[sorted_points.length - 1]);
  const [divisionWidth, setDivisionWidth] = useState(SVs.sliderType === "text" ? 500 / (SVs.items.length - 1) : 500 / (endValue - startValue));
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffsetLeft(rect.left);
    }
  }, []);
  useEffect(() => {
    if (!isMouseDown) {
      setThumbValue(SVs.value);
      setIndex(SVs.index);
      if (!(SVs.sliderType === "text")) {
        setThumbXPos((SVs.value - startValue) * divisionWidth);
      } else {
        setThumbXPos(SVs.index * divisionWidth);
      }
    }
  }, [SVs.index]);
  if (SVs.hidden) {
    return null;
  }
  if (SVs.disabled) {
    return /* @__PURE__ */ React.createElement(SliderContainer, {
      labeled: SVs.showControls || SVs.label,
      noTicked: SVs.showTicks === false,
      ref: containerRef
    }, /* @__PURE__ */ React.createElement("div", {
      style: {height: SVs.showControls || SVs.label ? "20px" : "0px"}
    }, SVs.label ? /* @__PURE__ */ React.createElement(StyledValueLabel, null, SVs.label) : null, SVs.showControls ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
      style: {float: "right", userSelect: "none"},
      onClick: handleNext,
      disabled: true
    }, "Next"), /* @__PURE__ */ React.createElement("button", {
      style: {float: "right", userSelect: "none"},
      onClick: handlePrevious,
      disabled: true
    }, "Prev")) : null), /* @__PURE__ */ React.createElement(SubContainer2, null, /* @__PURE__ */ React.createElement(StyledSlider, {
      width: `${500}px`
    }, /* @__PURE__ */ React.createElement(StyledThumb, {
      disabled: true,
      style: {left: `${-3}px`}
    }), SVs.showTicks === false ? null : SVs.sliderType === "text" ? generateTextLabels(SVs.items, divisionWidth) : generateNumericLabels(SVs.items, divisionWidth, startValue))));
  }
  function handleDragEnter(e) {
    setIsMouseDown(true);
    setThumbXPos(e.nativeEvent.clientX - offsetLeft);
    if (!(SVs.sliderType === "text")) {
      let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
      let valindexpair = nearestValue(refval, SVs.items);
      setThumbValue(valindexpair[0]);
      setIndex(valindexpair[1]);
      actions.changeValue({value: SVs.items[valindexpair[1]], transient: true});
    } else {
      let i = Math.round((e.nativeEvent.clientX - offsetLeft) / divisionWidth);
      setIndex(i);
      setThumbValue(SVs.items[i]);
      actions.changeValue({value: SVs.items[i], transient: true});
    }
  }
  function handleDragExit(e) {
    if (!isMouseDown) {
      return;
    }
    setIsMouseDown(false);
    if (!(SVs.sliderType === "text")) {
      let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
      let valindexpair = nearestValue(refval, SVs.items);
      setThumbValue(valindexpair[0]);
      setThumbXPos((valindexpair[0] - startValue) * divisionWidth);
      setIndex(valindexpair[1]);
      actions.changeValue({value: SVs.items[valindexpair[1]]});
    } else {
      let i = Math.round((e.nativeEvent.clientX - offsetLeft) / divisionWidth);
      setIndex(i);
      setThumbValue(SVs.items[i]);
      setThumbXPos(i * divisionWidth);
      actions.changeValue({value: SVs.items[i]});
    }
  }
  function handleDragThrough(e) {
    if (isMouseDown) {
      setThumbXPos(e.nativeEvent.clientX - offsetLeft);
      if (!(SVs.sliderType === "text")) {
        let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
        let valindexpair = nearestValue(refval, SVs.items);
        setThumbValue(valindexpair[0]);
        setIndex(valindexpair[1]);
        actions.changeValue({value: SVs.items[valindexpair[1]], transient: true});
      } else {
        let i = Math.round((e.nativeEvent.clientX - offsetLeft) / divisionWidth);
        setIndex(i);
        setThumbValue(SVs.items[i]);
        actions.changeValue({value: SVs.items[i], transient: true});
      }
    }
  }
  function handleNext(e) {
    if (index === SVs.items.length - 1) {
      return;
    }
    if (!(SVs.sliderType === "text")) {
      setThumbXPos((SVs.items[index + 1] - startValue) * divisionWidth);
    } else {
      setThumbXPos((index + 1) * divisionWidth);
    }
    actions.changeValue({value: SVs.items[index + 1]});
    setThumbValue(SVs.items[index + 1]);
    setIndex(index + 1);
  }
  function handlePrevious(e) {
    if (index === 0) {
      return;
    }
    if (!(SVs.sliderType === "text")) {
      setThumbXPos((SVs.items[index - 1] - startValue) * divisionWidth);
    } else {
      setThumbXPos((index - 1) * divisionWidth);
    }
    actions.changeValue({value: SVs.items[index - 1]});
    setThumbValue(SVs.items[index - 1]);
    setIndex(index - 1);
  }
  return /* @__PURE__ */ React.createElement(SliderContainer, {
    ref: containerRef,
    labeled: SVs.showControls || SVs.label,
    noTicked: SVs.showTicks === false
  }, /* @__PURE__ */ React.createElement("div", {
    style: {height: SVs.showControls || SVs.label ? "20px" : "0px"}
  }, SVs.label ? /* @__PURE__ */ React.createElement(StyledValueLabel, null, SVs.label) : null, SVs.showControls ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    style: {float: "right", userSelect: "none"},
    onClick: handleNext
  }, "Next"), /* @__PURE__ */ React.createElement("button", {
    style: {float: "right", userSelect: "none"},
    onClick: handlePrevious
  }, "Prev")) : null), /* @__PURE__ */ React.createElement(SubContainer2, {
    onMouseDown: handleDragEnter,
    onMouseUp: handleDragExit,
    onMouseMove: handleDragThrough,
    onMouseLeave: handleDragExit
  }, /* @__PURE__ */ React.createElement(StyledSlider, {
    width: `${500}px`
  }, /* @__PURE__ */ React.createElement(Spring, {
    to: {x: thumbXPos}
  }, (props2) => /* @__PURE__ */ React.createElement(StyledThumb, {
    style: {left: `${props2.x - 3}px`}
  })), SVs.showTicks === false ? null : SVs.sliderType === "text" ? generateTextLabels(SVs.items, divisionWidth) : generateNumericLabels(SVs.items, divisionWidth, startValue))));
}
{
}
{
}
