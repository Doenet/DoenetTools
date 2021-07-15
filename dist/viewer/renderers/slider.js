import React, {useRef, useState, useEffect} from "../../_snowpack/pkg/react.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import useDoenetRender from "./useDoenetRenderer.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {doenetComponentForegroundActive, doenetComponentForegroundInactive, doenetLightGray} from "../../_reactComponents/PanelHeaderComponents/theme.js";
let round_to_decimals = (x, n) => me.round_numbers_to_decimals(x, n).tree;
const SliderContainer = styled.div`
    width: fit-content;
    height: ${(props) => props.labeled && props.noTicked ? "60px" : props.labeled ? "80px" : props.noTicked ? "40px" : "60px"};
    &:focus {outline: 0;};
`;
const SubContainer2 = styled.div`
    padding-top: 10px;
    height: 50px;
`;
const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #888888 ;
  height: 1px;
  width: ${(props) => props.width};
  user-select: none;
`;
const StyledValueLabel = styled.p`
    display: inline;
    user-select: none;
`;
const StyledThumb = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: relative;
  top: -4px;
  opacity: 1;
  background: ${(props) => props.disabled ? "#404040" : `${doenetComponentForegroundActive}`};
  cursor: pointer;
`;
const Tick = styled.div`
    position: absolute;
    border-left: 2px solid  ${doenetLightGray};
    height: 10px;
    top:1px;
    z-Index:-2;
    left: ${(props) => props.x};
    user-select: none;
`;
const Label = styled.p`
    position: absolute;
    left: ${(props) => props.x};
    color: ${doenetComponentForegroundInactive};
    font-size: 12px;
    top:1px;
    user-select: none;
`;
function generateNumericLabels(points, div_width, point_start_val, SVs) {
  let maxValueWidth;
  let maxAbs = Math.max(Math.abs(SVs.firstItem), Math.abs(SVs.lastItem));
  let magnitudeOfMaxAbs = Math.round(Math.log(maxAbs) / Math.log(10));
  if (maxAbs === 0) {
    magnitudeOfMaxAbs = 1;
  }
  let roundDecimals = 5 - magnitudeOfMaxAbs;
  if (points.length === 0) {
    let pointsToTest = [
      round_to_decimals(SVs.firstItem, roundDecimals),
      round_to_decimals(SVs.lastItem, roundDecimals)
    ];
    let numToTest = Math.min(SVs.nItems, 100);
    let dInd = Math.floor(SVs.nItems / numToTest);
    for (let i = 1; i < numToTest; i++) {
      pointsToTest.push(round_to_decimals(SVs.from + SVs.step * i * dInd, roundDecimals));
    }
    maxValueWidth = findMaxValueWidth(pointsToTest);
  } else {
    let pointsToTest = points.map((x) => round_to_decimals(x, roundDecimals));
    maxValueWidth = findMaxValueWidth(pointsToTest);
  }
  const nItems = SVs.nItems;
  if (SVs.width.size > maxValueWidth * nItems) {
    if (points.length === 0) {
      let ticks = [];
      let labels = [];
      let maxAbs2 = Math.max(Math.abs(SVs.firstItem), Math.abs(SVs.lastItem));
      let magnitudeOfMaxAbs2 = Math.round(Math.log(maxAbs2) / Math.log(10));
      if (maxAbs2 === 0) {
        magnitudeOfMaxAbs2 = 1;
      }
      let roundDecimals2 = 5 - magnitudeOfMaxAbs2;
      for (let index = 0; index < SVs.nItems; index++) {
        let point = round_to_decimals(SVs.from + SVs.step * index, roundDecimals2);
        ticks.push(/* @__PURE__ */ React.createElement(Tick, {
          key: point,
          x: `${index * div_width}px`
        }));
        labels.push(/* @__PURE__ */ React.createElement(Label, {
          key: point,
          x: `${index * div_width - 3}px`
        }, point));
      }
      return [ticks, labels];
    } else {
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
  } else if (SVs.width.size < maxValueWidth) {
    let pointsCopy = [...points];
    if (points.length === 0) {
      for (let index = 0; index < Math.min(3, SVs.nItems); index++) {
        pointsCopy.push(SVs.from + SVs.step * index);
      }
    }
    return [
      pointsCopy.map((point, index) => {
        if (index == 0) {
          return /* @__PURE__ */ React.createElement(Tick, {
            key: point,
            x: `${index * div_width}px`
          });
        } else {
          return "";
        }
      }),
      pointsCopy.map((point, index) => {
        if (index == 0) {
          return /* @__PURE__ */ React.createElement(Label, {
            key: point,
            x: `${index * div_width - 3}px`
          }, point);
        } else if (index == 2) {
          return /* @__PURE__ */ React.createElement(Label, {
            key: point,
            x: `${index * div_width - 3}px`
          }, "...");
        }
      })
    ];
  } else if (SVs.width.size < maxValueWidth * nItems) {
    let tickIndices, tickValues;
    if (points.length === 0) {
      let desiredNumberOfTicks = Math.floor(SVs.width.size / maxValueWidth);
      let tickSpan = SVs.lastItem - SVs.firstItem;
      let desiredDTick = tickSpan / (desiredNumberOfTicks + 1);
      let maxAbs2 = Math.max(Math.abs(SVs.firstItem), Math.abs(SVs.lastItem));
      let magnitudeOfMaxAbs2 = Math.round(Math.log(maxAbs2) / Math.log(10));
      let roundDecimalsForTickSpacing = 1 - magnitudeOfMaxAbs2;
      let dTick = round_to_decimals(desiredDTick, roundDecimalsForTickSpacing);
      let numberOfTicks = Math.floor(tickSpan / dTick) + 1;
      let roundDecimals2 = 5 - magnitudeOfMaxAbs2;
      tickValues = [...Array(numberOfTicks).keys()].map((i) => SVs.from + dTick * i);
      tickIndices = tickValues.map((x) => Math.round((x - SVs.from) / SVs.step));
      tickValues = tickValues.map((x) => round_to_decimals(x, roundDecimals2));
    } else {
      let desiredNumberOfTicks = Math.floor(SVs.width.size / maxValueWidth);
      let dIndex = Math.ceil((SVs.nItems - 1) / (desiredNumberOfTicks - 1) - 1e-10);
      let numberOfTicks = Math.floor((SVs.nItems - 1) / dIndex + 1e-10) + 1;
      tickIndices = [...Array(numberOfTicks).keys()].map((i) => Math.round(dIndex * i));
      let maxAbs2 = Math.max(Math.abs(SVs.firstItem), Math.abs(SVs.lastItem));
      let magnitudeOfMaxAbs2 = Math.round(Math.log(maxAbs2) / Math.log(10));
      let roundDecimals2 = 2 - magnitudeOfMaxAbs2;
      tickValues = tickIndices.map((x) => round_to_decimals(points[x], roundDecimals2));
    }
    return [
      tickIndices.map((x, i) => /* @__PURE__ */ React.createElement(Tick, {
        key: tickValues[i],
        x: `${x * div_width}px`
      })),
      tickIndices.map((x, i) => /* @__PURE__ */ React.createElement(Label, {
        key: tickValues[i],
        x: `${x * div_width}px`
      }, tickValues[i]))
    ];
  } else {
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
}
function findMaxValueWidth(points) {
  let currWidth = points.reduce(function(a, b) {
    return a > b.toString().length ? a : b.toString().length;
  });
  return currWidth * 12;
}
function generateTextLabels(points, div_width, SVs) {
  let maxValueWidth = findMaxValueWidth(points);
  const length = Object.keys(points).length;
  let showAllItems = false;
  if (SVs.width.size > maxValueWidth * length) {
    showAllItems = true;
    return [
      points.map((point, index) => /* @__PURE__ */ React.createElement(Tick, {
        key: point,
        x: `${index * div_width}px`
      })),
      points.map((point, index) => {
        return /* @__PURE__ */ React.createElement(Label, {
          key: point,
          x: `${index * div_width - 3}px`
        }, point);
      })
    ];
  } else if (SVs.width.size < maxValueWidth) {
    showAllItems = false;
    return [
      points.map((point, index) => {
        if (index == 0) {
          return /* @__PURE__ */ React.createElement(Tick, {
            key: point,
            x: `${index * div_width}px`
          });
        } else {
          return "";
        }
      }),
      points.map((point, index) => {
        if (index == 0) {
          return /* @__PURE__ */ React.createElement(Label, {
            key: point,
            x: `${index * div_width - 3}px`
          }, point);
        } else if (index == 2) {
          return /* @__PURE__ */ React.createElement(Label, {
            key: point,
            x: `${index * div_width - 3}px`
          }, "...");
        }
      })
    ];
  } else if (SVs.width.size < maxValueWidth * length) {
    showAllItems = false;
    return [
      points.map((point, index) => /* @__PURE__ */ React.createElement(Tick, {
        key: point,
        x: `${index * div_width}px`
      })),
      points.map((point, index) => {
        if (index == 0 || length === index + 1) {
          return /* @__PURE__ */ React.createElement(Label, {
            key: point,
            x: `${index * div_width - 3}px`
          }, point);
        } else {
          return /* @__PURE__ */ React.createElement(Label, {
            key: point,
            x: `${index * div_width - 3}px`
          }, point.length < 3 ? point : point.substr(0, 3) + "...");
        }
      })
    ];
  }
}
function xPositionToValue(ref, div_width, start_val) {
  return start_val + ref / div_width;
}
function nearestValue(refval, points, SVs) {
  let index = Math.max(0, Math.min(SVs.nItems - 1, Math.round(refval - SVs.firstItem)));
  let val;
  if (points.length === 0) {
    val = SVs.from + SVs.step * index;
  } else {
    val = points[index];
  }
  return [val, index];
}
export default function Slider(props) {
  let [name, SVs, actions] = useDoenetRender(props);
  const containerRef = useRef(null);
  const [thumbXPos, setThumbXPos] = useState(0);
  const [thumbValue, setThumbValue] = useState(SVs.firstItem);
  const [isMouseDown, setIsMouseDown] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const startValue = SVs.type === "text" ? 0 : SVs.firstItem;
  let divisionWidth = SVs.width.size / (SVs.nItems - 1);
  const [index, setIndex] = useState(0);
  const width = SVs.width.size;
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
      if (!(SVs.type === "text")) {
        setThumbXPos(SVs.index / (SVs.nItems - 1) * SVs.width.size);
      } else {
        setThumbXPos(SVs.index * divisionWidth);
      }
    }
  }, [SVs.index]);
  if (SVs.hidden) {
    return null;
  }
  if (SVs.disabled) {
    let controls2 = "";
    if (SVs.showControls) {
      controls2 = /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
        value: "Prev",
        onClick: (e) => handlePrevious(e),
        disabled: true
      }), /* @__PURE__ */ React.createElement(Button, {
        value: "Next",
        onClick: (e) => handleNext(e),
        disabled: true
      }));
    } else {
      controls2 = null;
    }
    let labels2 = "";
    if (SVs.type === "text") {
      labels2 = generateTextLabels(SVs.items, divisionWidth, SVs);
    } else {
      labels2 = generateNumericLabels(SVs.items, divisionWidth, startValue, SVs);
    }
    let ticksAndLabels2 = "";
    if (SVs.showTicks === false) {
      ticksAndLabels2 = null;
    } else {
      ticksAndLabels2 = labels2;
    }
    return /* @__PURE__ */ React.createElement(SliderContainer, {
      labeled: SVs.showControls || SVs.label,
      noTicked: SVs.showTicks === false,
      ref: containerRef
    }, /* @__PURE__ */ React.createElement("div", {
      style: {height: SVs.showControls || SVs.label ? "20px" : "0px"}
    }, SVs.label ? /* @__PURE__ */ React.createElement(StyledValueLabel, null, SVs.label) : null, controls2), /* @__PURE__ */ React.createElement(SubContainer2, null, /* @__PURE__ */ React.createElement(StyledSlider, {
      width: `${SVs.width.size}px`
    }, /* @__PURE__ */ React.createElement(StyledThumb, {
      disabled: true,
      style: {left: `${thumbXPos - 4}px`}
    }), ticksAndLabels2)));
  }
  function handleDragEnter(e) {
    setIsMouseDown(true);
    setThumbXPos(e.nativeEvent.clientX - offsetLeft);
    if (!(SVs.type === "text")) {
      let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
      let valindexpair = nearestValue(refval, SVs.items, SVs);
      setThumbValue(valindexpair[0]);
      setIndex(valindexpair[1]);
      actions.changeValue({value: valindexpair[0], transient: true});
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
    if (!(SVs.type === "text")) {
      let xPositionToValue2 = function(ref, div_width, start_val) {
        return start_val + ref / div_width;
      };
      let refval = xPositionToValue2(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
      let valindexpair = nearestValue(refval, SVs.items, SVs);
      setThumbValue(valindexpair[0]);
      setIndex(valindexpair[1]);
      setThumbXPos(valindexpair[1] * divisionWidth);
      actions.changeValue({value: valindexpair[0]});
    } else {
      let i = Math.round((e.nativeEvent.clientX - offsetLeft) / divisionWidth);
      i = Math.max(0, Math.min(SVs.nItems - 1, i));
      setIndex(i);
      setThumbValue(SVs.items[i]);
      setThumbXPos(i * divisionWidth);
      actions.changeValue({value: SVs.items[i]});
    }
  }
  function handleDragThrough(e) {
    if (isMouseDown) {
      setThumbXPos(Math.max(0, Math.min(SVs.width.size, e.nativeEvent.clientX - offsetLeft)));
      if (!(SVs.type === "text")) {
        let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
        let valindexpair = nearestValue(refval, SVs.items, SVs);
        setThumbValue(valindexpair[0]);
        setIndex(valindexpair[1]);
        actions.changeValue({value: valindexpair[0], transient: true});
      } else {
        let i = Math.round((e.nativeEvent.clientX - offsetLeft) / divisionWidth);
        setIndex(i);
        setThumbValue(SVs.items[i]);
        actions.changeValue({value: SVs.items[i], transient: true});
      }
    }
  }
  function handleNext(e) {
    if (index === SVs.nItems - 1) {
      return;
    }
    let val;
    if (SVs.items.length === 0) {
      val = SVs.from + SVs.step * (index + 1);
    } else {
      val = SVs.items[index + 1];
    }
    actions.changeValue({value: val});
    setThumbValue(val);
    setIndex(index + 1);
  }
  function handlePrevious(e) {
    if (index === 0) {
      return;
    }
    let val;
    if (SVs.items.length === 0) {
      val = SVs.from + SVs.step * (index - 1);
    } else {
      val = SVs.items[index - 1];
    }
    actions.changeValue({value: val});
    setThumbValue(val);
    setIndex(index - 1);
  }
  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      return handlePrevious(e);
    } else if (e.key === "ArrowRight") {
      return handleNext(e);
    }
  }
  let labels = "";
  if (SVs.type === "text") {
    labels = generateTextLabels(SVs.items, divisionWidth, SVs);
  } else {
    labels = generateNumericLabels(SVs.items, divisionWidth, startValue, SVs);
  }
  let ticksAndLabels = "";
  if (SVs.showTicks === false) {
    ticksAndLabels = null;
  } else {
    ticksAndLabels = labels;
  }
  let controls = "";
  if (SVs.showControls) {
    controls = /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
      value: "Prev",
      onClick: (e) => handlePrevious(e),
      "data-cy": "prevbutton"
    }), /* @__PURE__ */ React.createElement(Button, {
      value: "Next",
      onClick: (e) => handleNext(e),
      "data-cy": "nextbutton"
    }));
  } else {
    null;
  }
  let valueDisplay = null;
  if (SVs.showValue) {
    valueDisplay = /* @__PURE__ */ React.createElement("span", {
      style: {left: `${thumbXPos - 4}px`, position: "relative", userSelect: "none"}
    }, SVs.valueForDisplay, " ");
  }
  return /* @__PURE__ */ React.createElement(SliderContainer, {
    ref: containerRef,
    labeled: SVs.showControls || SVs.label,
    noTicked: SVs.showTicks === false,
    onKeyDown: handleKeyDown,
    tabIndex: "0"
  }, /* @__PURE__ */ React.createElement("div", {
    style: {height: SVs.showControls || SVs.label ? "20px" : "0px"}
  }, SVs.label ? /* @__PURE__ */ React.createElement(StyledValueLabel, null, SVs.label) : null, controls), /* @__PURE__ */ React.createElement(SubContainer2, {
    onMouseDown: handleDragEnter,
    onMouseUp: handleDragExit,
    onMouseMove: handleDragThrough,
    onMouseLeave: handleDragExit
  }, /* @__PURE__ */ React.createElement(StyledSlider, {
    width: `${SVs.width.size}px`,
    "data-cy": "slider1"
  }, valueDisplay, /* @__PURE__ */ React.createElement(StyledThumb, {
    style: {left: `${thumbXPos - 4}px`},
    "data-cy": "slider1-handle"
  }), ticksAndLabels)));
}
