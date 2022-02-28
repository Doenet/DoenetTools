import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default function Polyline(props) {
  let {name, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  Polyline.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let polylineJXG = useRef(null);
  let pointsJXG = useRef(null);
  let pointCoords = useRef(null);
  let draggedPoint = useRef(null);
  let pointerAtDown = useRef(null);
  let pointsAtDown = useRef(null);
  let previousNVertices = useRef(null);
  let jsxPointAttributes = useRef(null);
  let lastPositionsFromCore = useRef(null);
  lastPositionsFromCore.current = SVs.numericalVertices;
  useEffect(() => {
    return () => {
      if (polylineJXG.current) {
        deletePolylineJXG();
      }
    };
  }, []);
  function createPolylineJXG() {
    if (SVs.numericalVertices.length !== SVs.nVertices || SVs.numericalVertices.some((x2) => x2.length !== 2)) {
      return null;
    }
    let validCoords = true;
    for (let coords of SVs.numericalVertices) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }
    let jsxPolylineAttributes = {
      name: SVs.label,
      visible: !SVs.hidden && validCoords,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: !SVs.draggable || SVs.fixed,
      layer: 10 * SVs.layer + 7,
      strokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle)
    };
    jsxPointAttributes.current = Object.assign({}, jsxPolylineAttributes);
    Object.assign(jsxPointAttributes.current, {
      withLabel: false,
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: "lightgray",
      layer: 10 * SVs.layer + 9
    });
    if (!SVs.draggable || SVs.fixed || SVs.hidden || !validCoords) {
      jsxPointAttributes.current.visible = false;
    }
    pointsJXG.current = [];
    for (let i = 0; i < SVs.nVertices; i++) {
      pointsJXG.current.push(board.create("point", [...SVs.numericalVertices[i]], jsxPointAttributes.current));
    }
    let x = [], y = [];
    SVs.numericalVertices.forEach((z) => {
      x.push(z[0]);
      y.push(z[1]);
    });
    let newPolylineJXG = board.create("curve", [x, y], jsxPolylineAttributes);
    for (let i = 0; i < SVs.nVertices; i++) {
      pointsJXG.current[i].on("drag", () => dragHandler(i));
      pointsJXG.current[i].on("up", () => upHandler(i));
      pointsJXG.current[i].on("down", () => draggedPoint.current = null);
    }
    newPolylineJXG.on("drag", (e) => dragHandler(-1, e));
    newPolylineJXG.on("up", () => upHandler(-1));
    newPolylineJXG.on("down", function(e) {
      draggedPoint.current = null;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = newPolylineJXG.points.map((x2) => [...x2.scrCoords]);
    });
    previousNVertices.current = SVs.nVertices;
    return newPolylineJXG;
  }
  function deletePolylineJXG() {
    polylineJXG.current.off("drag");
    polylineJXG.current.off("down");
    polylineJXG.current.off("up");
    board.removeObject(polylineJXG.current);
    polylineJXG.current = null;
    for (let i = 0; i < SVs.nVertices; i++) {
      pointsJXG.current[i].off("drag");
      pointsJXG.current[i].off("down");
      pointsJXG.current[i].off("up");
      board.removeObject(pointsJXG.current[i]);
      delete pointsJXG.current[i];
    }
  }
  function dragHandler(i, e) {
    draggedPoint.current = i;
    if (i === -1) {
      pointCoords.current = calculatePointPositions(e);
      callAction({
        action: actions.movePolyline,
        args: {
          pointCoords: pointCoords.current,
          transient: true,
          skippable: true
        }
      });
      polylineJXG.current.updateTransformMatrix();
      let shiftX = polylineJXG.current.transformMat[1][0];
      let shiftY = polylineJXG.current.transformMat[2][0];
      for (let j = 0; j < SVs.nVertices; j++) {
        pointsJXG.current[j].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastPositionsFromCore.current[j]]);
        polylineJXG.current.dataX[j] = lastPositionsFromCore.current[j][0] - shiftX;
        polylineJXG.current.dataY[j] = lastPositionsFromCore.current[j][1] - shiftY;
      }
    } else {
      pointCoords.current = {};
      pointCoords.current[i] = [pointsJXG.current[i].X(), pointsJXG.current[i].Y()];
      callAction({
        action: actions.movePolyline,
        args: {
          pointCoords: pointCoords.current,
          transient: true,
          skippable: true,
          sourceInformation: {vertex: i}
        }
      });
      pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastPositionsFromCore.current[i]]);
      board.updateInfobox(pointsJXG.current[i]);
    }
  }
  function upHandler(i) {
    if (draggedPoint.current !== i) {
      return;
    }
    if (i === -1) {
      callAction({
        action: actions.movePolyline,
        args: {
          pointCoords: pointCoords.current
        }
      });
    } else {
      callAction({
        action: actions.movePolyline,
        args: {
          pointCoords: pointCoords.current,
          sourceInformation: {vertex: i}
        }
      });
    }
  }
  function calculatePointPositions(e) {
    var o = board.origin.scrCoords;
    let pointCoords2 = [];
    for (let i = 0; i < polylineJXG.current.points.length; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      let calculatedY = (o[2] - (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) / board.unitY;
      pointCoords2.push([calculatedX, calculatedY]);
    }
    return pointCoords2;
  }
  if (board) {
    if (!polylineJXG.current) {
      polylineJXG.current = createPolylineJXG();
    } else if (SVs.numericalVertices.length !== SVs.nVertices || SVs.numericalVertices.some((x) => x.length !== 2)) {
      deletePolylineJXG();
    } else {
      let validCoords = true;
      for (let coords of SVs.numericalVertices) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }
      if (SVs.nVertices > previousNVertices.current) {
        for (let i = previousNVertices.current; i < SVs.nVertices; i++) {
          pointsJXG.current.push(board.create("point", [...SVs.numericalVertices[i]], jsxPointAttributes.current));
          polylineJXG.current.dataX.length = SVs.nVertices;
          pointsJXG.current[i].on("drag", (x) => dragHandler(i, true));
          pointsJXG.current[i].on("up", (x) => dragHandler(i, false));
          pointsJXG.current[i].on("down", (x) => draggedPoint.current = null);
        }
      } else if (SVs.nVertices < previousNVertices.current) {
        for (let i = SVs.nVertices; i < previousNVertices.current; i++) {
          let pt = pointsJXG.current.pop();
          pt.off("drag");
          pt.off("down");
          pt.off("up");
          board.removeObject(pt);
        }
        polylineJXG.current.dataX.length = SVs.nVertices;
      }
      previousNVertices.current = SVs.nVertices;
      polylineJXG.current.updateTransformMatrix();
      let shiftX = polylineJXG.current.transformMat[1][0];
      let shiftY = polylineJXG.current.transformMat[2][0];
      for (let i = 0; i < SVs.nVertices; i++) {
        pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalVertices[i]]);
        polylineJXG.current.dataX[i] = SVs.numericalVertices[i][0] - shiftX;
        polylineJXG.current.dataY[i] = SVs.numericalVertices[i][1] - shiftY;
      }
      let visible = !SVs.hidden;
      if (validCoords) {
        polylineJXG.current.visProp["visible"] = visible;
        polylineJXG.current.visPropCalc["visible"] = visible;
        let pointsVisible = visible && SVs.draggable && !SVs.fixed;
        for (let i = 0; i < SVs.nVertices; i++) {
          pointsJXG.current[i].visProp["visible"] = pointsVisible;
          pointsJXG.current[i].visPropCalc["visible"] = pointsVisible;
        }
      } else {
        polylineJXG.current.visProp["visible"] = false;
        polylineJXG.current.visPropCalc["visible"] = false;
        for (let i = 0; i < SVs.nVertices; i++) {
          pointsJXG.current[i].visProp["visible"] = false;
          pointsJXG.current[i].visPropCalc["visible"] = false;
        }
      }
      if (sourceOfUpdate.sourceInformation && name in sourceOfUpdate.sourceInformation) {
        let vertexUpdated = sourceOfUpdate.sourceInformation[name].vertex;
        if (Number.isFinite(vertexUpdated)) {
          board.updateInfobox(pointsJXG.current[vertexUpdated]);
        }
      }
      polylineJXG.current.needsUpdate = true;
      polylineJXG.current.update().updateVisibility();
      for (let i = 0; i < SVs.nVertices; i++) {
        pointsJXG.current[i].needsUpdate = true;
        pointsJXG.current[i].update();
      }
      board.updateRenderer();
    }
  }
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }));
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
