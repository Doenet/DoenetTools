import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default React.memo(function Polygon(props) {
  let {name, id, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  Polygon.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let polygonJXG = useRef(null);
  let pointCoords = useRef(null);
  let draggedPoint = useRef(null);
  let downOnPoint = useRef(null);
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
    let fixed = !SVs.draggable || SVs.fixed;
    jsxPointAttributes.current = {
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      visible: !fixed && !SVs.hidden,
      withLabel: false,
      layer: 10 * SVs.layer + 9
    };
    let jsxBorderAttributes = {
      highlight: false,
      visible: !SVs.hidden,
      layer: 10 * SVs.layer + 8,
      fixed: true,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle)
    };
    let jsxPolygonAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed,
      layer: 10 * SVs.layer + 7,
      fillColor: SVs.selectedStyle.fillColor,
      fillOpacity: SVs.selectedStyle.fillOpacity,
      highlightFillColor: SVs.selectedStyle.fillColor,
      highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
      highlight: !fixed,
      vertices: jsxPointAttributes.current,
      borders: jsxBorderAttributes
    };
    jsxPolygonAttributes.label = {
      highlight: false
    };
    if (SVs.labelHasLatex) {
      jsxPolygonAttributes.label.useMathJax = true;
    }
    if (SVs.applyStyleToLabel) {
      jsxPolygonAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxPolygonAttributes.label.strokeColor = "#000000";
    }
    if (SVs.selectedStyle.fillColor.toLowerCase() !== "none") {
      jsxPolygonAttributes.hasInnerPoints = true;
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
      vertex.on("drag", (e) => dragHandler(i, e));
      vertex.off("up");
      vertex.on("up", () => upHandler(i));
      vertex.off("down");
      vertex.on("down", (e) => {
        draggedPoint.current = null;
        pointerAtDown.current = [e.x, e.y];
        downOnPoint.current = i;
      });
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
    if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
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
  }
  function upHandler(i) {
    if (draggedPoint.current === i) {
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
    } else if (draggedPoint.current === null && (downOnPoint.current === null || i !== -1)) {
      callAction({
        action: actions.polygonClicked
      });
    }
    if (i !== -1) {
      downOnPoint.current = null;
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
      let fixed = !SVs.draggable || SVs.fixed;
      let verticesVisible = !fixed && !SVs.hidden;
      for (let i = 0; i < SVs.nVertices; i++) {
        polygonJXG.current.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalVertices[i]]);
        polygonJXG.current.vertices[i].needsUpdate = true;
        polygonJXG.current.vertices[i].update();
        polygonJXG.current.vertices[i].visProp["visible"] = verticesVisible;
        polygonJXG.current.vertices[i].visPropCalc["visible"] = verticesVisible;
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
      polygonJXG.current.visProp.fixed = fixed;
      polygonJXG.current.visProp.highlight = !fixed;
      polygonJXG.current.visProp["visible"] = visibleNow;
      polygonJXG.current.visPropCalc["visible"] = visibleNow;
      let polygonLayer = 10 * SVs.layer + 7;
      let layerChanged = polygonJXG.current.visProp.layer !== polygonLayer;
      if (layerChanged) {
        polygonJXG.current.setAttribute({layer: polygonLayer});
      }
      polygonJXG.current.name = SVs.labelForGraph;
      if (polygonJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          polygonJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor;
        } else {
          polygonJXG.current.label.visProp.strokecolor = "#000000";
        }
        polygonJXG.current.label.needsUpdate = true;
        polygonJXG.current.label.update();
      }
      if (polygonJXG.current.visProp.fillcolor !== SVs.selectedStyle.fillColor) {
        polygonJXG.current.visProp.fillcolor = SVs.selectedStyle.fillColor;
        polygonJXG.current.visProp.highlightfillcolor = SVs.selectedStyle.fillColor;
        polygonJXG.current.visProp.hasinnerpoints = SVs.selectedStyle.fillColor.toLowerCase() !== "none";
      }
      if (polygonJXG.current.visProp.fillopacity !== SVs.selectedStyle.fillOpacity) {
        polygonJXG.current.visProp.fillopacity = SVs.selectedStyle.fillOpacity;
        polygonJXG.current.visProp.highlightfillopacity = SVs.selectedStyle.fillOpacity * 0.5;
      }
      polygonJXG.current.needsUpdate = true;
      polygonJXG.current.update().updateVisibility();
      for (let i = 0; i < polygonJXG.current.borders.length; i++) {
        let border = polygonJXG.current.borders[i];
        border.visProp.visible = visibleNow;
        border.visPropCalc.visible = visibleNow;
        if (layerChanged) {
          border.setAttribute({layer: polygonLayer + 1});
        }
        if (border.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
          border.visProp.strokecolor = SVs.selectedStyle.lineColor;
          border.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
        }
        if (border.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
          border.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
          border.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5;
        }
        let newDash = styleToDash(SVs.selectedStyle.lineStyle);
        if (border.visProp.dash !== newDash) {
          border.visProp.dash = newDash;
        }
        if (border.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
          border.visProp.strokewidth = SVs.selectedStyle.lineWidth;
          border.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth;
        }
        border.needsUpdate = true;
        border.update();
      }
      if (layerChanged) {
        jsxPointAttributes.current.layer = polygonLayer + 2;
        for (let vertex of polygonJXG.current.vertices) {
          vertex.setAttribute({layer: polygonLayer + 2});
          vertex.needsUpdate = true;
          vertex.update();
        }
      }
      previousNVertices.current = SVs.nVertices;
      board.updateRenderer();
    }
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
