import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Container = styled.div`
  // Depend on if we have a label or the showProgress props
  display: ${(props) => props.align};
  align-items: ${(props) => props.alignItems};
`;
const Svg = styled.svg``;
const Rect = styled.rect`;
  x: 0px;
  y: 0px;
  rx: ${(props) => props.radius}; // Depends on if we have the donutIcon prop
  stroke: none;
  stroke-width: 0;
  height: ${(props) => props.height};
  // width prop is passed in as a number without "px"
  // Usage: <ProgressBar width=400/> to set the width of the progress bar to 400px
  width: ${(props) => props.width.toString() + "px"};
`;
const DonutG = styled.g``;
const Circle = styled.circle`
  cy: 12.5px;
`;
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible}; // Only visible with label prop
  margin-right: 5px;
  margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"};
`;
const Progress = styled.p`
    font-size: 12px;
    display: ${(props) => props.showProgress}; // Only visible with showProgress prop
    margin-left: 5px; // Percentage appears to the right of the progress bar
`;
export default function ProgressBar(props) {
  const [fillWidth, setFillWidth] = useState("0px");
  const [donutPosition, setDonutPosition] = useState("12.5px");
  const [barWidth, setBarWidth] = useState(props.width ? props.width : 235);
  const height = props.donutIcon ? "25px" : "10px";
  const radius = props.donutIcon ? "12.5px" : "5px";
  const ariaLabel = props.ariaLabel ? props.ariaLabel : null;
  const labelVisible = props.label ? "static" : "none";
  var donut = /* @__PURE__ */ React.createElement(DonutG, null, /* @__PURE__ */ React.createElement(Circle, {
    id: "donut",
    cx: donutPosition,
    fill: "var(--donutBody)",
    r: "12.5"
  }), /* @__PURE__ */ React.createElement(Circle, {
    id: "donut-topping",
    cx: donutPosition,
    fill: "var(--donutTopping)",
    r: "10"
  }), /* @__PURE__ */ React.createElement(Circle, {
    id: "donut-hole",
    cx: donutPosition,
    r: "4",
    fill: "var(--mainGray)"
  }));
  var align = "flex";
  var alignItems = "none";
  var label = "";
  if (props.label) {
    label = props.label;
    alignItems = "center";
    if (props.vertical) {
      align = "static";
    }
  }
  ;
  var percent = "";
  if (props.showProgress) {
    percent = (props.progress * 100).toString() + "%";
    alignItems = "center";
  }
  ;
  useEffect(() => {
    let progress = props.progress ? props.progress : 0;
    progress *= barWidth;
    setFillWidth(progress);
    setDonutPosition(progress - 12.5);
    if (props.showProgress) {
      setBarWidth(200);
    }
    ;
  }, [props.progress, props.showProgress, barWidth]);
  return /* @__PURE__ */ React.createElement(Container, {
    align,
    alignItems
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(Svg, {
    width: barWidth,
    height
  }, /* @__PURE__ */ React.createElement(Rect, {
    id: "main",
    fill: "var(--mainGray)",
    width: barWidth,
    height,
    radius,
    "aria-label": ariaLabel
  }), /* @__PURE__ */ React.createElement(Rect, {
    id: "moving",
    fill: "var(--mainBlue)",
    width: fillWidth,
    height,
    radius
  }), props.donutIcon ? donut : ""), props.showProgress ? /* @__PURE__ */ React.createElement(Progress, null, percent) : "");
}
;
