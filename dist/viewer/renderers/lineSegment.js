import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default React.memo(function LineSegment(props) {
  let {name, id, SVs, actions, callAction} = useDoenetRender(props);
  LineSegment.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let lineSegmentJXG = useRef(null);
  let point1JXG = useRef(null);
  let point2JXG = useRef(null);
  let pointerAtDown = useRef(false);
  let pointsAtDown = useRef(false);
  let draggedPoint = useRef(null);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);
  let pointCoords = useRef(null);
  let downOnPoint = useRef(null);
  let lastPositionsFromCore = useRef(null);
  lastPositionsFromCore.current = SVs.numericalEndpoints;
  useEffect(() => {
    return () => {
      if (lineSegmentJXG.current) {
        deleteLineSegmentJXG();
      }
    };
  }, []);
  function createLineSegmentJXG() {
    if (SVs.numericalEndpoints.length !== 2 || SVs.numericalEndpoints.some((x) => x.length !== 2)) {
      lineSegmentJXG.current = null;
      point1JXG.current = null;
      point2JXG.current = null;
      return;
    }
    let fixed = !SVs.draggable || SVs.fixed;
    let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
    var jsxSegmentAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withlabel,
      fixed,
      layer: 10 * SVs.layer + 7,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
      highlight: !fixed
    };
    if (withlabel) {
      let anchorx, anchory, offset;
      if (SVs.labelPosition === "upperright") {
        offset = [5, 5];
        anchorx = "left";
        anchory = "bottom";
      } else if (SVs.labelPosition === "upperleft") {
        offset = [-5, 5];
        anchorx = "right";
        anchory = "bottom";
      } else if (SVs.labelPosition === "lowerright") {
        offset = [5, -5];
        anchorx = "left";
        anchory = "top";
      } else {
        offset = [-5, -5];
        anchorx = "right";
        anchory = "top";
      }
      jsxSegmentAttributes.label = {
        offset,
        anchorx,
        anchory,
        highlight: false
      };
      if (SVs.labelHasLatex) {
        jsxSegmentAttributes.label.useMathJax = true;
      }
      if (SVs.applyStyleToLabel) {
        jsxSegmentAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
      } else {
        jsxSegmentAttributes.label.strokeColor = "#000000";
      }
    } else {
      jsxSegmentAttributes.label = {
        highlight: false
      };
      if (SVs.labelHasLatex) {
        jsxSegmentAttributes.label.useMathJax = true;
      }
    }
    let jsxPointAttributes = Object.assign({}, jsxSegmentAttributes);
    Object.assign(jsxPointAttributes, {
      withLabel: false,
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      layer: 10 * SVs.layer + 8,
      showInfoBox: SVs.showCoordsWhenDragging
    });
    if (!SVs.draggable || SVs.fixed) {
      jsxPointAttributes.visible = false;
    }
    let endpoints = [
      [...SVs.numericalEndpoints[0]],
      [...SVs.numericalEndpoints[1]]
    ];
    point1JXG.current = board.create("point", endpoints[0], jsxPointAttributes);
    point2JXG.current = board.create("point", endpoints[1], jsxPointAttributes);
    lineSegmentJXG.current = board.create("segment", [point1JXG.current, point2JXG.current], jsxSegmentAttributes);
    point1JXG.current.on("drag", (e) => onDragHandler(1, e));
    point2JXG.current.on("drag", (e) => onDragHandler(2, e));
    lineSegmentJXG.current.on("drag", (e) => onDragHandler(0, e));
    point1JXG.current.on("up", () => {
      if (draggedPoint.current === 1) {
        callAction({
          action: actions.moveLineSegment,
          args: {
            point1coords: pointCoords.current
          }
        });
      } else if (draggedPoint.current === null) {
        callAction({
          action: actions.lineSegmentClicked
        });
      }
      downOnPoint.current = null;
    });
    point2JXG.current.on("up", () => {
      if (draggedPoint.current === 2) {
        callAction({
          action: actions.moveLineSegment,
          args: {
            point2coords: pointCoords.current
          }
        });
      } else if (draggedPoint.current === null) {
        callAction({
          action: actions.lineSegmentClicked
        });
      }
      downOnPoint.current = null;
    });
    lineSegmentJXG.current.on("up", function(e) {
      if (draggedPoint.current === 0) {
        callAction({
          action: actions.moveLineSegment,
          args: {
            point1coords: pointCoords.current[0],
            point2coords: pointCoords.current[1]
          }
        });
      } else if (draggedPoint.current === null && downOnPoint.current === null) {
        callAction({
          action: actions.lineSegmentClicked
        });
      }
    });
    point1JXG.current.on("down", (e) => {
      draggedPoint.current = null;
      pointerAtDown.current = [e.x, e.y];
      downOnPoint.current = 1;
    });
    point2JXG.current.on("down", (e) => {
      draggedPoint.current = null;
      pointerAtDown.current = [e.x, e.y];
      downOnPoint.current = 2;
    });
    lineSegmentJXG.current.on("down", function(e) {
      draggedPoint.current = null;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...point1JXG.current.coords.scrCoords],
        [...point2JXG.current.coords.scrCoords]
      ];
    });
    previousLabelPosition.current = SVs.labelPosition;
    previousWithLabel.current = withlabel;
    return lineSegmentJXG.current;
  }
  function onDragHandler(i, e) {
    if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
      draggedPoint.current = i;
      if (i == 1) {
        pointCoords.current = [lineSegmentJXG.current.point1.X(), lineSegmentJXG.current.point1.Y()];
        callAction({
          action: actions.moveLineSegment,
          args: {
            point1coords: pointCoords.current,
            transient: true,
            skippable: true
          }
        });
      } else if (i == 2) {
        pointCoords.current = [lineSegmentJXG.current.point2.X(), lineSegmentJXG.current.point2.Y()];
        callAction({
          action: actions.moveLineSegment,
          args: {
            point2coords: pointCoords.current,
            transient: true,
            skippable: true
          }
        });
      } else {
        calculatePointPositions(e);
        callAction({
          action: actions.moveLineSegment,
          args: {
            point1coords: pointCoords.current[0],
            point2coords: pointCoords.current[1],
            transient: true,
            skippable: true
          }
        });
      }
    }
    lineSegmentJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[0]);
    lineSegmentJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[1]);
  }
  function calculatePointPositions(e) {
    var o = board.origin.scrCoords;
    pointCoords.current = [];
    for (let i = 0; i < 2; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      let calculatedY = (o[2] - (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) / board.unitY;
      pointCoords.current.push([calculatedX, calculatedY]);
    }
    return pointCoords.current;
  }
  function deleteLineSegmentJXG() {
    lineSegmentJXG.current.off("drag");
    lineSegmentJXG.current.off("down");
    lineSegmentJXG.current.off("up");
    board.removeObject(lineSegmentJXG.current);
    lineSegmentJXG.current = null;
    point1JXG.current.off("drag");
    point1JXG.current.off("down");
    point1JXG.current.off("up");
    board.removeObject(point1JXG.current);
    point1JXG.current = null;
    point2JXG.current.off("drag");
    point2JXG.current.off("down");
    point2JXG.current.off("up");
    board.removeObject(point2JXG.current);
    point2JXG.current = null;
  }
  if (board) {
    if (lineSegmentJXG.current === null) {
      createLineSegmentJXG();
    } else if (SVs.numericalEndpoints.length !== 2 || SVs.numericalEndpoints.some((x) => x.length !== 2)) {
      deleteLineSegmentJXG();
    } else {
      let validCoords = true;
      for (let coords of [SVs.numericalEndpoints[0], SVs.numericalEndpoints[1]]) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }
      lineSegmentJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoints[0]);
      lineSegmentJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoints[1]);
      let visible = !SVs.hidden;
      if (validCoords) {
        let actuallyChangedVisibility = lineSegmentJXG.current.visProp["visible"] !== visible;
        lineSegmentJXG.current.visProp["visible"] = visible;
        lineSegmentJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          lineSegmentJXG.current.setAttribute({visible});
        }
      } else {
        lineSegmentJXG.current.visProp["visible"] = false;
        lineSegmentJXG.current.visPropCalc["visible"] = false;
      }
      let fixed = !SVs.draggable || SVs.fixed;
      lineSegmentJXG.current.visProp.fixed = fixed;
      lineSegmentJXG.current.visProp.highlight = !fixed;
      let layer = 10 * SVs.layer + 7;
      let layerChanged = lineSegmentJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        lineSegmentJXG.current.setAttribute({layer});
        point1JXG.current.setAttribute({layer: layer + 1});
        point2JXG.current.setAttribute({layer: layer + 1});
      }
      if (lineSegmentJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        lineSegmentJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        lineSegmentJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      if (lineSegmentJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        lineSegmentJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth;
        lineSegmentJXG.current.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth;
      }
      if (lineSegmentJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        lineSegmentJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
        lineSegmentJXG.current.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle);
      if (lineSegmentJXG.current.visProp.dash !== newDash) {
        lineSegmentJXG.current.visProp.dash = newDash;
      }
      lineSegmentJXG.current.name = SVs.labelForGraph;
      let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        lineSegmentJXG.current.setAttribute({withlabel});
        previousWithLabel.current = withlabel;
      }
      lineSegmentJXG.current.needsUpdate = true;
      lineSegmentJXG.current.update();
      if (lineSegmentJXG.current.hasLabel) {
        lineSegmentJXG.current.label.needsUpdate = true;
        if (SVs.applyStyleToLabel) {
          lineSegmentJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor;
        } else {
          lineSegmentJXG.current.label.visProp.strokecolor = "#000000";
        }
        if (SVs.labelPosition !== previousLabelPosition.current) {
          let anchorx, anchory, offset;
          if (SVs.labelPosition === "upperright") {
            offset = [5, 5];
            anchorx = "left";
            anchory = "bottom";
          } else if (SVs.labelPosition === "upperleft") {
            offset = [-5, 5];
            anchorx = "right";
            anchory = "bottom";
          } else if (SVs.labelPosition === "lowerright") {
            offset = [5, -5];
            anchorx = "left";
            anchory = "top";
          } else {
            offset = [-5, -5];
            anchorx = "right";
            anchory = "top";
          }
          lineSegmentJXG.current.label.visProp.anchorx = anchorx;
          lineSegmentJXG.current.label.visProp.anchory = anchory;
          lineSegmentJXG.current.label.visProp.offset = offset;
          previousLabelPosition.current = SVs.labelPosition;
          lineSegmentJXG.current.label.fullUpdate();
        } else {
          lineSegmentJXG.current.label.update();
        }
      }
      point1JXG.current.needsUpdate = true;
      point1JXG.current.update();
      point2JXG.current.needsUpdate = true;
      point2JXG.current.update();
      board.updateRenderer();
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: id
    }));
  }
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name: id
  }));
});
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
