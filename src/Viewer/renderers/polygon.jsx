import React, { useContext, useEffect, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { PageContext } from "../PageViewer";

export default React.memo(function Polygon(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRenderer(props);

  Polygon.ignoreActionsWithoutCore = () => true;

  const board = useContext(BoardContext);

  let polygonJXG = useRef(null);

  let pointCoords = useRef(null);
  let draggedPoint = useRef(null);
  let downOnPoint = useRef(null);
  let pointerAtDown = useRef(null);
  let pointsAtDown = useRef(null);
  let pointerIsDown = useRef(false);
  let pointerMovedSinceDown = useRef(false);
  let previousNumVertices = useRef(null);
  let jsxPointAttributes = useRef(null);

  let lastPositionsFromCore = useRef(null);
  let fixed = useRef(false);
  let fixLocation = useRef(false);
  let verticesFixed = useRef(false);

  lastPositionsFromCore.current = SVs.numericalVertices;
  fixed.current = SVs.fixed;
  fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;
  verticesFixed.current =
    !SVs.verticesDraggable || SVs.fixed || SVs.fixLocation;

  const { darkMode } = useContext(PageContext) || {};

  useEffect(() => {
    //On unmount
    return () => {
      // if point is defined
      if (polygonJXG.current) {
        deletePolygonJXG();
      }

      if (board) {
        board.off("move", boardMoveHandler);
      }
    };
  }, []);

  useEffect(() => {
    if (board) {
      board.on("move", boardMoveHandler);
    }
  }, [board]);

  function createPolygonJXG() {
    if (!(SVs.numVertices >= 2)) {
      return null;
    }

    let lineColor =
      darkMode === "dark"
        ? SVs.selectedStyle.lineColorDarkMode
        : SVs.selectedStyle.lineColor;
    let fillColor =
      darkMode === "dark"
        ? SVs.selectedStyle.fillColorDarkMode
        : SVs.selectedStyle.fillColor;
    fillColor = SVs.filled ? fillColor : "none";

    jsxPointAttributes.current = {
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--mainGray"),
      visible: !verticesFixed.current && !SVs.hidden,
      withLabel: false,
      layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
      highlight: true,
      showInfoBox: SVs.showCoordsWhenDragging,
    };

    let jsxBorderAttributes = {
      highlight: false,
      visible: !SVs.hidden,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      fixed: true,
      strokeColor: lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
    };

    let jsxPolygonAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.labelForGraph !== "",
      fixed: fixed.current,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,

      //specific to polygon
      fillColor,
      fillOpacity: SVs.selectedStyle.fillOpacity,
      highlightFillColor: fillColor,
      highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
      highlight: !fixLocation.current,
      vertices: jsxPointAttributes.current,
      borders: jsxBorderAttributes,
    };

    jsxPolygonAttributes.label = {
      highlight: false,
    };
    if (SVs.labelHasLatex) {
      jsxPolygonAttributes.label.useMathJax = true;
    }

    if (SVs.applyStyleToLabel) {
      jsxPolygonAttributes.label.strokeColor = lineColor;
    } else {
      jsxPolygonAttributes.label.strokeColor = "var(--canvastext)";
    }

    if (SVs.filled) {
      jsxPolygonAttributes.hasInnerPoints = true;
    }

    board.suspendUpdate();

    let pts = [];

    for (let p of SVs.numericalVertices) {
      pts.push(board.create("point", [...p], jsxPointAttributes.current));
    }

    let newPolygonJXG = board.create("polygon", pts, jsxPolygonAttributes);
    newPolygonJXG.isDraggable = !fixLocation.current;

    initializePoints(newPolygonJXG);

    newPolygonJXG.on("drag", (e) => dragHandler(-1, e));
    newPolygonJXG.on("up", (e) => upHandler(-1));
    newPolygonJXG.on("keyfocusout", (e) => keyFocusOutHandler(-1));
    newPolygonJXG.on("keydown", (e) => keyDownHandler(-1, e));

    newPolygonJXG.on("down", (e) => downHandler(-1, e));
    newPolygonJXG.on("hit", (e) => hitHandler());

    board.unsuspendUpdate();

    previousNumVertices.current = SVs.numVertices;

    return newPolygonJXG;
  }

  function boardMoveHandler(e) {
    if (pointerIsDown.current) {
      //Protect against very small unintended move
      if (
        Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > 0.1
      ) {
        pointerMovedSinceDown.current = true;
      }
    }
  }

  function initializePoints(polygon) {
    for (let i = 0; i < SVs.numVertices; i++) {
      let vertex = polygon.vertices[i];
      vertex.off("drag");
      vertex.on("drag", (e) => dragHandler(i, e));
      vertex.off("up");
      vertex.on("up", () => upHandler(i));
      vertex.off("keyfocusout");
      vertex.on("keyfocusout", () => keyFocusOutHandler(i));
      vertex.off("keydown");
      vertex.on("keydown", (e) => keyDownHandler(i, e));
      vertex.off("down");
      vertex.on("down", (e) => downHandler(i, e));
      vertex.off("hit");
      vertex.on("hit", (e) => hitHandler());
    }
  }

  function deletePolygonJXG() {
    for (let i = 0; i < SVs.numVertices; i++) {
      let vertex = polygonJXG.current.vertices[i];
      if (vertex) {
        vertex.off("drag");
        vertex.off("up");
        vertex.off("down");
        vertex.off("hit");
      }
    }
    polygonJXG.current.off("drag");
    polygonJXG.current.off("up");
    polygonJXG.current.off("down");
    polygonJXG.current.off("hit");
    board.removeObject(polygonJXG.current);
    polygonJXG.current = null;
  }

  function dragHandler(i, e) {
    let viaPointer = e.type === "pointermove";

    //Protect against very small unintended drags
    if (
      !viaPointer ||
      Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
      Math.abs(e.y - pointerAtDown.current[1]) > 0.1
    ) {
      draggedPoint.current = i;

      if (i === -1) {
        pointCoords.current = [];

        var o = board.origin.scrCoords;

        for (let i = 0; i < polygonJXG.current.vertices.length - 1; i++) {
          if (viaPointer) {
            // the reason we calculate point positions with this algorithm,
            // is so that points don't get trapped on an attracting object
            // if you move the mouse slowly.
            let calculatedX =
              (pointsAtDown.current[i][1] +
                e.x -
                pointerAtDown.current[0] -
                o[1]) /
              board.unitX;
            let calculatedY =
              (o[2] -
                (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) /
              board.unitY;
            pointCoords.current.push([calculatedX, calculatedY]);
          } else {
            let vertex = polygonJXG.current.vertices[i];
            pointCoords.current.push([vertex.X(), vertex.Y()]);
          }
        }

        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
            transient: true,
            skippable: true,
          },
        });

        for (let j = 0; j < SVs.numVertices; j++) {
          polygonJXG.current.vertices[j].coords.setCoordinates(
            JXG.COORDS_BY_USER,
            [...lastPositionsFromCore.current[j]],
          );
        }
      } else {
        pointCoords.current = {};
        pointCoords.current[i] = [
          polygonJXG.current.vertices[i].X(),
          polygonJXG.current.vertices[i].Y(),
        ];
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
            transient: true,
            skippable: true,
            sourceDetails: { vertex: i },
          },
        });
        polygonJXG.current.vertices[i].coords.setCoordinates(
          JXG.COORDS_BY_USER,
          [...lastPositionsFromCore.current[i]],
        );
        board.updateInfobox(polygonJXG.current.vertices[i]);
      }
    }
  }

  function downHandler(i, e) {
    draggedPoint.current = null;
    pointerAtDown.current = [e.x, e.y];

    if (i === -1) {
      if (downOnPoint.current === null && !fixed.current) {
        // Note: counting on fact that down on polygon itself will trigger after down on points
        callAction({
          action: actions.polygonFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointsAtDown.current = polygonJXG.current.vertices.map((x) => [
        ...x.coords.scrCoords,
      ]);
    } else {
      if (!verticesFixed.current) {
        callAction({
          action: actions.polygonFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
      downOnPoint.current = i;
    }

    pointerIsDown.current = true;
    pointerMovedSinceDown.current = false;
  }

  function hitHandler() {
    draggedPoint.current = null;
    callAction({
      action: actions.polygonFocused,
      args: { name }, // send name so get original name if adapted
    });
  }

  function upHandler(i) {
    if (draggedPoint.current === i) {
      if (i === -1) {
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
          },
        });
      } else {
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
            sourceDetails: { vertex: i },
          },
        });
      }
    } else if (
      !pointerMovedSinceDown.current &&
      (downOnPoint.current === null || i !== -1) &&
      !fixed.current
    ) {
      // Note: counting on fact that up on polygon itself (i===-1) will trigger before up on points
      callAction({
        action: actions.polygonClicked,
        args: { name }, // send name so get original name if adapted
      });
    }

    if (i !== -1) {
      downOnPoint.current = null;
    }

    pointerIsDown.current = false;
  }

  function keyFocusOutHandler(i) {
    if (draggedPoint.current === i) {
      if (i === -1) {
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
          },
        });
      } else {
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
            sourceInformation: { vertex: i },
          },
        });
      }
    }
    draggedPoint.current = null;
  }

  function keyDownHandler(i, e) {
    if (e.key === "Enter") {
      if (draggedPoint.current === i) {
        if (i === -1) {
          callAction({
            action: actions.movePolygon,
            args: {
              pointCoords: pointCoords.current,
            },
          });
        } else {
          callAction({
            action: actions.movePolygon,
            args: {
              pointCoords: pointCoords.current,
              sourceInformation: { vertex: i },
            },
          });
        }
      }
      draggedPoint.current = null;
      callAction({
        action: actions.polygonClicked,
        args: { name }, // send name so get original name if adapted
      });
    }
  }

  if (board) {
    if (!polygonJXG.current) {
      polygonJXG.current = createPolygonJXG();
    } else if (!(SVs.numVertices >= 2)) {
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

      // add or delete points as required and change data array size
      if (SVs.numVertices > previousNumVertices.current) {
        for (let i = previousNumVertices.current; i < SVs.numVertices; i++) {
          let newPoint = board.create(
            "point",
            [...SVs.numericalVertices[i]],
            jsxPointAttributes.current,
          );
          polygonJXG.current.addPoints(newPoint);
        }
        initializePoints(polygonJXG.current);
      } else if (SVs.numVertices < previousNumVertices.current) {
        for (
          let i = previousNumVertices.current - 1;
          i >= SVs.numVertices;
          i--
        ) {
          polygonJXG.current.vertices[i].off("drag");
          polygonJXG.current.vertices[i].off("down");
          polygonJXG.current.vertices[i].off("hit");
          polygonJXG.current.vertices[i].off("up");
          polygonJXG.current.vertices[i].off("keyfocusout");
          polygonJXG.current.vertices[i].off("keydown");
          polygonJXG.current.removePoints(polygonJXG.current.vertices[i]);
        }
        initializePoints(polygonJXG.current);
      }

      let verticesVisible = !verticesFixed.current && !SVs.hidden;

      for (let i = 0; i < SVs.numVertices; i++) {
        polygonJXG.current.vertices[i].coords.setCoordinates(
          JXG.COORDS_BY_USER,
          [...SVs.numericalVertices[i]],
        );
        polygonJXG.current.vertices[i].needsUpdate = true;
        polygonJXG.current.vertices[i].update();
        // // let actuallyChangedVisibility = polygonJXG.current.vertices[i].visProp["visible"] !== verticesVisible;
        polygonJXG.current.vertices[i].visProp["visible"] = verticesVisible;
        polygonJXG.current.vertices[i].visPropCalc["visible"] = verticesVisible;
        polygonJXG.current.vertices[i].visProp.showinfobox =
          SVs.showCoordsWhenDragging;
      }

      if (
        sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let ind = sourceOfUpdate.sourceInformation[name].vertex;
        if (ind !== undefined) {
          board.updateInfobox(polygonJXG.current.vertices[ind]);
        }
      }

      let visibleNow = !SVs.hidden;
      if (!validCoords) {
        visibleNow = false;
      }

      polygonJXG.current.visProp.fixed = fixed.current;
      polygonJXG.current.visProp.highlight = !fixLocation.current;
      polygonJXG.current.isDraggable = !fixLocation.current;

      polygonJXG.current.visProp["visible"] = visibleNow;
      polygonJXG.current.visPropCalc["visible"] = visibleNow;
      // polygonJXG.current.setAttribute({visible: visibleNow})

      let polygonLayer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = polygonJXG.current.visProp.layer !== polygonLayer;
      let borderLayer, pointLayer;

      if (layerChanged) {
        borderLayer = 10 * SVs.layer + LINE_LAYER_OFFSET;
        pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
        polygonJXG.current.setAttribute({ layer: polygonLayer });
      }

      let lineColor =
        darkMode === "dark"
          ? SVs.selectedStyle.lineColorDarkMode
          : SVs.selectedStyle.lineColor;
      let fillColor =
        darkMode === "dark"
          ? SVs.selectedStyle.fillColorDarkMode
          : SVs.selectedStyle.fillColor;
      fillColor = SVs.filled ? fillColor : "none";

      polygonJXG.current.name = SVs.labelForGraph;

      if (polygonJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          polygonJXG.current.label.visProp.strokecolor = lineColor;
        } else {
          polygonJXG.current.label.visProp.strokecolor = "var(--canvastext)";
        }
        polygonJXG.current.label.needsUpdate = true;
        polygonJXG.current.label.update();
      }

      if (polygonJXG.current.visProp.fillcolor !== fillColor) {
        polygonJXG.current.visProp.fillcolor = fillColor;
        polygonJXG.current.visProp.highlightfillcolor = fillColor;
        polygonJXG.current.visProp.hasinnerpoints = SVs.filled;
      }

      if (
        polygonJXG.current.visProp.fillopacity !== SVs.selectedStyle.fillOpacity
      ) {
        polygonJXG.current.visProp.fillopacity = SVs.selectedStyle.fillOpacity;
        polygonJXG.current.visProp.highlightfillopacity =
          SVs.selectedStyle.fillOpacity * 0.5;
      }

      polygonJXG.current.needsUpdate = true;

      polygonJXG.current.update().updateVisibility();
      for (let i = 0; i < polygonJXG.current.borders.length; i++) {
        let border = polygonJXG.current.borders[i];
        border.visProp.visible = visibleNow;
        border.visPropCalc.visible = visibleNow;

        if (layerChanged) {
          border.setAttribute({ layer: borderLayer });
        }

        if (border.visProp.strokecolor !== lineColor) {
          border.visProp.strokecolor = lineColor;
          border.visProp.highlightstrokecolor = lineColor;
        }
        if (border.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
          border.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
          border.visProp.highlightstrokeopacity =
            SVs.selectedStyle.lineOpacity * 0.5;
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
        jsxPointAttributes.current.layer = pointLayer;
        for (let vertex of polygonJXG.current.vertices) {
          vertex.setAttribute({ layer: pointLayer });
          vertex.needsUpdate = true;
          vertex.update();
        }
      }

      previousNumVertices.current = SVs.numVertices;

      board.updateRenderer();
    }
  }

  if (SVs.hidden) {
    return null;
  }

  // don't think we want to return anything if not in board
  return (
    <>
      <a name={id} />
    </>
  );
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
