import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default function Circle(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props);
  Circle.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let circleJXG = useRef(null);
  let dragged = useRef(false);
  let pointerAtDown = useRef(false);
  let centerAtDown = useRef(false);
  let radiusAtDown = useRef(false);
  let throughAnglesAtDown = useRef(false);
  let previousWithLabel = useRef(false);
  let centerCoords = useRef(null);
  let lastCenterFromCore = useRef(null);
  let throughAnglesFromCore = useRef(null);
  lastCenterFromCore.current = SVs.numericalCenter;
  throughAnglesFromCore.current = SVs.throughAngles;
  useEffect(() => {
    return () => {
      if (circleJXG.current) {
        deleteCircleJXG();
      }
    };
  }, []);
  function createCircleJXG() {
    if (!(Number.isFinite(SVs.numericalCenter[0]) && Number.isFinite(SVs.numericalCenter[1]) && SVs.numericalRadius > 0)) {
      return null;
    }
    var jsxCircleAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: !SVs.draggable || SVs.fixed,
      layer: 10 * SVs.layer + 5,
      strokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle)
    };
    if (SVs.showLabel && SVs.label !== "") {
      jsxCircleAttributes.label = {};
      if (SVs.applyStyleToLabel) {
        jsxCircleAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
      } else {
        jsxCircleAttributes.label.strokeColor = "#000000";
      }
    }
    let newCircleJXG = board.create("circle", [[...SVs.numericalCenter], SVs.numericalRadius], jsxCircleAttributes);
    newCircleJXG.on("drag", function(e) {
      dragged.current = true;
      centerCoords.current = calculateCenterPosition(e);
      callAction({
        action: actions.moveCircle,
        args: {
          center: centerCoords.current,
          radius: radiusAtDown.current,
          throughAngles: throughAnglesAtDown.current,
          transient: true,
          skippable: true
        }
      });
      newCircleJXG.center.coords.setCoordinates(JXG.COORDS_BY_USER, [...lastCenterFromCore.current]);
    });
    newCircleJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveCircle,
          args: {
            center: centerCoords.current,
            radius: radiusAtDown.current,
            throughAngles: throughAnglesAtDown.current
          }
        });
      }
    });
    newCircleJXG.on("down", function(e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      centerAtDown.current = [...newCircleJXG.center.coords.scrCoords];
      radiusAtDown.current = newCircleJXG.radius;
      throughAnglesAtDown.current = [...throughAnglesFromCore.current];
    });
    previousWithLabel.current = SVs.showLabel && SVs.label !== "";
    return newCircleJXG;
  }
  function calculateCenterPosition(e) {
    var o = board.origin.scrCoords;
    let calculatedX = (centerAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
    let calculatedY = (o[2] - (centerAtDown.current[2] + e.y - pointerAtDown.current[1])) / board.unitY;
    return [calculatedX, calculatedY];
  }
  function deleteCircleJXG() {
    circleJXG.current.off("drag");
    circleJXG.current.off("down");
    circleJXG.current.off("up");
    board.removeObject(circleJXG.current);
    circleJXG.current = null;
  }
  if (board) {
    if (!circleJXG.current) {
      circleJXG.current = createCircleJXG();
    } else if (!(Number.isFinite(SVs.numericalCenter[0]) && Number.isFinite(SVs.numericalCenter[1]) && SVs.numericalRadius > 0)) {
      deleteCircleJXG();
    } else {
      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[name] = circleJXG.current;
      }
      let validCoords = SVs.numericalCenter.every((x) => Number.isFinite(x));
      circleJXG.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalCenter]);
      circleJXG.current.setRadius(SVs.numericalRadius);
      let visible = !SVs.hidden;
      if (validCoords) {
        circleJXG.current.visProp["visible"] = visible;
        circleJXG.current.visPropCalc["visible"] = visible;
      } else {
        circleJXG.current.visProp["visible"] = false;
        circleJXG.current.visPropCalc["visible"] = false;
      }
      if (circleJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        circleJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        circleJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
      if (circleJXG.current.visProp.dash !== newDash) {
        circleJXG.current.visProp.dash = newDash;
      }
      if (circleJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        circleJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth;
      }
      circleJXG.current.name = SVs.label;
      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        circleJXG.current.setAttribute({withlabel});
        previousWithLabel.current = withlabel;
      }
      circleJXG.current.needsUpdate = true;
      circleJXG.current.update();
      if (circleJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          circleJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor;
        } else {
          circleJXG.current.label.visProp.strokecolor = "#000000";
        }
        circleJXG.current.label.needsUpdate = true;
        circleJXG.current.label.update();
      }
      board.updateRenderer();
    }
  }
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("a", {
    name
  });
}
function styleToDash(style) {
  if (style === "solid") {
    return 0;
  } else if (style === "dashed") {
    return 2;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}
