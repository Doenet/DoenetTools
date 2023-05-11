import React, { useContext, useEffect, useRef } from "react";
import useDoenetRender from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "../../Core/utils/function";

export default React.memo(function CobwebPolyline(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRender(props);

  CobwebPolyline.ignoreActionsWithoutCore = () => true;

  const board = useContext(BoardContext);

  let curveJXG = useRef(null);
  let diagonalJXG = useRef(null);
  let polylineJXG = useRef(null);
  let pointsJXG = useRef(null);

  let pointCoords = useRef(null);
  let draggedPoint = useRef(null);
  let previousNPoints = useRef(null);
  let jsxPointAttributes = useRef(null);

  let lastPositionsFromCore = useRef(null);
  lastPositionsFromCore.current = SVs.numericalVertices;

  useEffect(() => {
    //On unmount
    return () => {
      // if point is defined
      if (polylineJXG.current) {
        deleteCobwebPolylineJXG();
      }
    };
  }, []);

  function createCobwebPolylineJXG() {
    // if (SVs.numericalVertices.length !== SVs.numVertices ||
    //   SVs.numericalVertices.some(x => x.length !== 2)
    // ) {
    //   return null;
    // }

    let functionAttributes = {
      visible: !SVs.hidden,
      withLabel: false,
      fixed: true,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      strokeColor: "green",
      highlightStrokeColor: "green",
      strokeWidth: 3,
      dash: styleToDash("solid"),
    };

    let f = createFunctionFromDefinition(SVs.fDefinition);

    curveJXG.current = board.create("functiongraph", [f], functionAttributes);

    let diagonalAttributes = {
      visible: !SVs.hidden,
      withLabel: false,
      fixed: true,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      strokeColor: "gray",
      highlightStrokeColor: "gray",
      strokeWidth: 2,
      dash: styleToDash("solid"),
    };
    diagonalJXG.current = board.create(
      "line",
      [
        [0, 0],
        [1, 1],
      ],
      diagonalAttributes,
    );

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
      name: SVs.labelForGraph,
      visible: !SVs.hidden && validCoords,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed: true,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      strokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
    };

    jsxPolylineAttributes.label = {
      highlight: false,
    };
    if (SVs.labelHasLatex) {
      jsxPolylineAttributes.label.useMathJax = true;
    }

    jsxPointAttributes.current = {
      fixed: !SVs.draggable || SVs.fixed,
      visible: !SVs.hidden && validCoords && SVs.draggable,
      withLabel: true,
      name: "A",
      layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
      fillColor: SVs.selectedStyle.markerColor,
      strokeColor: SVs.selectedStyle.markerColor,
      size: SVs.selectedStyle.markerSize,
      face: normalizeStyle(SVs.selectedStyle.markerStyle),
    };

    if (SVs.draggable) {
      jsxPointAttributes.current.highlightFillColor = "#EEEEEE";
      jsxPointAttributes.current.highlightStrokeColor = "#C3D9FF";
      jsxPointAttributes.current.showInfoBox = true;
    } else {
      jsxPointAttributes.current.highlightFillColor =
        SVs.selectedStyle.markerColor;
      jsxPointAttributes.current.highlightStrokeColor =
        SVs.selectedStyle.markerColor;
      jsxPointAttributes.current.showInfoBox = false;
    }

    pointsJXG.current = [];
    let varName = SVs.variable.toString();

    for (let i = 0; i < SVs.numPoints; i++) {
      let pointAttributes = Object.assign({}, jsxPointAttributes.current);
      if (i === 0) {
        pointAttributes.name = `(${varName}_0,0)`;
      } else if (i % 2 === 1) {
        pointAttributes.name = `(${varName}_${(i - 1) / 2}, ${varName}_${
          (i + 1) / 2
        })`;
      } else {
        pointAttributes.name = `(${varName}_${i / 2}, ${varName}_${i / 2})`;
      }
      if (i !== SVs.numPoints - 1) {
        pointAttributes.visible = false;
      }
      pointsJXG.current.push(
        board.create("point", [...SVs.numericalVertices[i]], pointAttributes),
      );
    }

    let x = [],
      y = [];
    SVs.numericalVertices.forEach((z) => {
      x.push(z[0]);
      y.push(z[1]);
    });

    let newPolylineJXG = board.create("curve", [x, y], jsxPolylineAttributes);

    for (let i = 0; i < SVs.numPoints; i++) {
      pointsJXG.current[i].on("drag", (e) => dragHandler(i, e));
      pointsJXG.current[i].on("up", (x) => upHandler(i));
      pointsJXG.current[i].on("keyfocusout", () => keyFocusOutHandler(i));
      pointsJXG.current[i].on("keydown", (e) => keyDownHandler(i, e));
      pointsJXG.current[i].on("down", (x) => (draggedPoint.current = null));
    }

    previousNPoints.current = SVs.numPoints;

    return newPolylineJXG;
  }

  function deleteCobwebPolylineJXG() {
    board.removeObject(polylineJXG.current);
    polylineJXG.current = null;

    board.removeObject(curveJXG.current);
    curveJXG.current = null;

    board.removeObject(diagonalJXG.current);
    diagonalJXG.current = null;

    for (let i = 0; i < SVs.numPoints; i++) {
      if (pointsJXG.current[i]) {
        pointsJXG.current[i].off("drag");
        pointsJXG.current[i].off("up");
        pointsJXG.current[i].off("keyfocusout");
        pointsJXG.current[i].off("keydown");
        pointsJXG.current[i].off("down");
        board.removeObject(pointsJXG.current[i]);
        delete pointsJXG.current[i];
      }
    }
  }

  function dragHandler(i, e) {
    let viaPointer = e.type === "pointermove";

    draggedPoint.current = i;

    pointCoords.current = {};
    pointCoords.current[i] = [
      pointsJXG.current[i].X(),
      pointsJXG.current[i].Y(),
    ];
    callAction({
      action: actions.movePolyline,
      args: {
        pointCoords: pointCoords.current,
        transient: true,
        skippable: true,
        sourceDetails: { vertex: i },
      },
    });

    pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
      ...lastPositionsFromCore.current[i],
    ]);
    board.updateInfobox(pointsJXG.current[i]);
  }

  function upHandler(i) {
    if (draggedPoint.current !== i) {
      return;
    }

    callAction({
      action: actions.movePolyline,
      args: {
        pointCoords: pointCoords.current,
        sourceDetails: { vertex: i },
      },
    });
  }

  function keyFocusOutHandler(i) {
    if (draggedPoint.current !== i) {
      draggedPoint.current = null;
      return;
    }
    draggedPoint.current = null;

    callAction({
      action: actions.movePolyline,
      args: {
        pointCoords: pointCoords.current,
        sourceInformation: { vertex: i },
      },
    });
  }

  function keyDownHandler(i, e) {
    if (e.key === "Enter") {
      if (draggedPoint.current === i) {
        callAction({
          action: actions.movePolyline,
          args: {
            pointCoords: pointCoords.current,
            sourceInformation: { vertex: i },
          },
        });
      }
      draggedPoint.current = null;
    }
  }

  if (board) {
    if (!polylineJXG.current) {
      polylineJXG.current = createCobwebPolylineJXG();
      // } else if (SVs.numericalVertices.length !== SVs.numVertices ||
      //   SVs.numericalVertices.some(x => x.length !== 2)
      // ) {
      //   deleteCobwebPolylineJXG();
    } else {
      let f = createFunctionFromDefinition(SVs.fDefinition);

      curveJXG.current.Y = f;
      curveJXG.current.needsUpdate = true;
      curveJXG.current.updateCurve();

      let validCoords = true;

      for (let coords of SVs.numericalVertices) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }

      let varName = SVs.variable.toString();

      // add or delete points as required and change data array size
      if (SVs.numPoints > previousNPoints.current) {
        for (let i = previousNPoints.current; i < SVs.numPoints; i++) {
          let pointAttributes = Object.assign({}, jsxPointAttributes.current);
          if (i === 0) {
            pointAttributes.name = `(${varName}_0,0)`;
          } else if (i % 2 === 1) {
            pointAttributes.name = `(${varName}_${(i - 1) / 2}, ${varName}_${
              (i + 1) / 2
            })`;
          } else {
            pointAttributes.name = `(${varName}_${i / 2}, ${varName}_${i / 2})`;
          }
          if (i !== SVs.numPoints - 1) {
            pointAttributes.visible = false;
          }
          pointsJXG.current.push(
            board.create(
              "point",
              [...SVs.numericalVertices[i]],
              pointAttributes,
            ),
          );

          pointsJXG.current[i].on("drag", (e) => dragHandler(i, e));
          pointsJXG.current[i].on("up", (x) => upHandler(i));
          pointsJXG.current[i].on("keyfocusout", () => keyFocusOutHandler(i));
          pointsJXG.current[i].on("keydown", (e) => keyDownHandler(i, e));
          pointsJXG.current[i].on("down", (x) => (draggedPoint.current = null));
        }
      } else if (SVs.numPoints < previousNPoints.current) {
        for (let i = SVs.numPoints; i < previousNPoints.current; i++) {
          let pt = pointsJXG.current.pop();
          pt.off("drag");
          pt.off("up");
          pt.off("keyfocusout");
          pt.off("keydown");
          pt.off("down");
          console.log("about to remove", pt);
          board.removeObject(pt);
          board.update();
        }
        polylineJXG.current.dataX.length = SVs.numPoints;
      }

      previousNPoints.current = SVs.numPoints;

      let shiftX = polylineJXG.current.transformMat[1][0];
      let shiftY = polylineJXG.current.transformMat[2][0];

      for (let i = 0; i < SVs.numPoints; i++) {
        pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
          ...SVs.numericalVertices[i],
        ]);
        polylineJXG.current.dataX[i] = SVs.numericalVertices[i][0] - shiftX;
        polylineJXG.current.dataY[i] = SVs.numericalVertices[i][1] - shiftY;
      }

      let visible = !SVs.hidden;

      if (validCoords) {
        polylineJXG.current.visProp["visible"] = visible;
        polylineJXG.current.visPropCalc["visible"] = visible;
        // polylineJXG.current.setAttribute({visible: visible})

        for (let i = 0; i < SVs.numPoints - 1; i++) {
          pointsJXG.current[i].visProp["visible"] = false;
          pointsJXG.current[i].visPropCalc["visible"] = false;
        }
        if (SVs.numPoints > 0) {
          if (SVs.draggable) {
            pointsJXG.current[SVs.numPoints - 1].visProp["visible"] = visible;
            pointsJXG.current[SVs.numPoints - 1].visPropCalc["visible"] =
              visible;
          }
        }
      } else {
        polylineJXG.current.visProp["visible"] = false;
        polylineJXG.current.visPropCalc["visible"] = false;
        // polylineJXG.current.setAttribute({visible: false})

        for (let i = 0; i < SVs.numPoints; i++) {
          pointsJXG.current[i].visProp["visible"] = false;
          pointsJXG.current[i].visPropCalc["visible"] = false;
        }
      }

      if (
        sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let vertexUpdated = sourceOfUpdate.sourceInformation[name].vertex;

        if (Number.isFinite(vertexUpdated)) {
          board.updateInfobox(pointsJXG.current[vertexUpdated]);
        }
      }

      polylineJXG.current.needsUpdate = true;
      polylineJXG.current.update().updateVisibility();
      for (let i = 0; i < SVs.numPoints; i++) {
        pointsJXG.current[i].needsUpdate = true;
        pointsJXG.current[i].update();
      }
      if (SVs.numPoints > 0) {
        pointsJXG.current[SVs.numPoints - 1].setAttribute({ withlabel: true });
        pointsJXG.current[SVs.numPoints - 1].label.needsUpdate = true;
        pointsJXG.current[SVs.numPoints - 1].label.update();
      }

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

function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}
