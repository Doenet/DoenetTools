import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default function Polygon(props) {
  let {name, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  Polygon.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let polygonJXG = useRef(null);
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
      if (polygonJXG.current) {
        deletePolygonJXG();
      }
    };
  }, []);
  function createPolygonJXG() {
    if (!(SVs.nVertices >= 2)) {
      return null;
    }
    jsxPointAttributes.current = {
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      visible: SVs.draggable && !SVs.fixed,
      withLabel: false,
      layer: 10 * SVs.layer + 9
    };
    let jsxBorderAttributes = {
      highlight: false,
      visible: !SVs.hidden,
      layer: 10 * SVs.layer + 6,
      strokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle)
    };
    let jsxPolygonAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: !SVs.draggable || SVs.fixed,
      layer: 10 * SVs.layer + 7,
      fillColor: "none",
      highlight: false,
      vertices: jsxPointAttributes.current,
      borders: jsxBorderAttributes
    };
    if (SVs.selectedStyle.fillColor !== "none") {
      jsxPolygonAttributes.fillColor = SVs.selectedStyle.fillColor;
    }
    board.suspendUpdate();
    let pts = [];
    for (let p of SVs.numericalVertices) {
      pts.push(board.create("point", [...p], jsxPointAttributes.current));
    }
    let newPolygonJXG = board.create("polygon", pts, jsxPolygonAttributes);
    initializePoints(newPolygonJXG);
    newPolygonJXG.on("drag", (e) => dragHandler(-1, e));
    newPolygonJXG.on("up", (e) => upHandler(-1));
    newPolygonJXG.on("down", function(e) {
      draggedPoint.current = null;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = newPolygonJXG.vertices.map((x) => [...x.coords.scrCoords]);
    });
    board.unsuspendUpdate();
    previousNVertices.current = SVs.nVertices;
    return newPolygonJXG;
  }
  function initializePoints(polygon) {
    for (let i = 0; i < SVs.nVertices; i++) {
      let vertex = polygon.vertices[i];
      vertex.off("drag");
      vertex.on("drag", () => dragHandler(i));
      vertex.off("up");
      vertex.on("up", () => upHandler(i));
      vertex.off("down");
      vertex.on("down", () => draggedPoint.current = null);
    }
  }
  function deletePolygonJXG() {
    for (let i = 0; i < SVs.nVertices; i++) {
      let vertex = polygonJXG.current.vertices[i];
      if (vertex) {
        vertex.off("drag");
        vertex.off("up");
        vertex.off("down");
      }
    }
    board.removeObject(polygonJXG.current);
    polygonJXG.current = null;
  }
  function dragHandler(i, e) {
    draggedPoint.current = i;
    if (i === -1) {
      pointCoords.current = calculatePointPositions(e);
      callAction({
        action: actions.movePolygon,
        args: {
          pointCoords: pointCoords.current,
          transient: true,
          skippable: true
        }
      });
      for (let j = 0; j < SVs.nVertices; j++) {
        polygonJXG.current.vertices[j].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastPositionsFromCore.current[j]]);
      }
    } else {
      pointCoords.current = {};
      pointCoords.current[i] = [polygonJXG.current.vertices[i].X(), polygonJXG.current.vertices[i].Y()];
      callAction({
        action: actions.movePolygon,
        args: {
          pointCoords: pointCoords.current,
          transient: true,
          skippable: true,
          sourceInformation: {vertex: i}
        }
      });
      polygonJXG.current.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastPositionsFromCore.current[i]]);
      board.updateInfobox(polygonJXG.current.vertices[i]);
    }
  }
  function upHandler(i) {
    if (draggedPoint.current !== i) {
      return;
    }
    if (i === -1) {
      callAction({
        action: actions.movePolygon,
        args: {
          pointCoords: pointCoords.current
        }
      });
    } else {
      callAction({
        action: actions.movePolygon,
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
    for (let i = 0; i < polygonJXG.current.vertices.length - 1; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      let calculatedY = (o[2] - (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) / board.unitY;
      pointCoords2.push([calculatedX, calculatedY]);
    }
    return pointCoords2;
  }
  if (board) {
    if (!polygonJXG.current) {
      polygonJXG.current = createPolygonJXG();
    } else if (!(SVs.nVertices >= 2)) {
      deletePolygonJXG();
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
          let newPoint = board.create("point", [...SVs.numericalVertices[i]], jsxPointAttributes.current);
          polygonJXG.current.addPoints(newPoint);
        }
        initializePoints(polygonJXG.current);
      } else if (SVs.nVertices < previousNVertices.current) {
        for (let i = previousNVertices.current - 1; i >= SVs.nVertices; i--) {
          polygonJXG.current.vertices[i].off("drag");
          polygonJXG.current.vertices[i].off("down");
          polygonJXG.current.vertices[i].off("up");
          polygonJXG.current.removePoints(polygonJXG.current.vertices[i]);
        }
        initializePoints(polygonJXG.current);
      }
      for (let i = 0; i < SVs.nVertices; i++) {
        polygonJXG.current.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalVertices[i]]);
        polygonJXG.current.vertices[i].needsUpdate = true;
        polygonJXG.current.vertices[i].update();
      }
      if (sourceOfUpdate.sourceInformation && name in sourceOfUpdate.sourceInformation) {
        let ind = sourceOfUpdate.sourceInformation[name].vertex;
        if (ind !== void 0) {
          board.updateInfobox(polygonJXG.current.vertices[ind]);
        }
      }
      let visibleNow = !SVs.hidden;
      if (!validCoords) {
        visibleNow = false;
      }
      polygonJXG.current.visProp.borders["visible"] = visibleNow;
      polygonJXG.current.visProp["visible"] = visibleNow;
      polygonJXG.current.visPropCalc["visible"] = visibleNow;
      polygonJXG.current.needsUpdate = true;
      polygonJXG.current.update().updateVisibility();
      for (let i = 0; i < polygonJXG.current.borders.length; i++) {
        let border = polygonJXG.current.borders[i];
        border.visProp.visible = visibleNow;
        border.visPropCalc.visible = visibleNow;
        border.needsUpdate = true;
        border.update();
      }
      previousNVertices.current = SVs.nVertices;
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
