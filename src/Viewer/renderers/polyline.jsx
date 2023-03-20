import React, { useContext, useEffect, useRef } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { BoardContext } from './graph';


export default React.memo(function Polyline(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Polyline.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let polylineJXG = useRef(null);
  let pointsJXG = useRef(null);

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

    //On unmount
    return () => {
      // if point is defined
      if (polylineJXG.current) {
        deletePolylineJXG();
      }
    }
  }, [])



  function createPolylineJXG() {

    if (SVs.numericalVertices.length !== SVs.nVertices ||
      SVs.numericalVertices.some(x => x.length !== 2)
    ) {
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

    let fixed = !SVs.draggable || SVs.fixed;

    //things to be passed to JSXGraph as attributes
    let jsxPolylineAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden && validCoords,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      layer: 10 * SVs.layer + 7,
      fixed,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
      highlight: !fixed,
      lineCap: "butt"
    };

    let verticesFixed = !SVs.verticesDraggable || SVs.fixed;

    jsxPointAttributes.current = Object.assign({}, jsxPolylineAttributes);
    Object.assign(jsxPointAttributes.current, {
      fixed: false,
      highlight: true,
      withLabel: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      layer: 10 * SVs.layer + 9,
    });
    if (verticesFixed || SVs.hidden || !validCoords) {
      jsxPointAttributes.current.visible = false;
    }
    jsxPolylineAttributes.label = {
      highlight: false
    }
    if (SVs.labelHasLatex) {
      jsxPolylineAttributes.label.useMathJax = true
    }
    if (SVs.applyStyleToLabel) {
      jsxPolylineAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxPolylineAttributes.label.strokeColor = "#000000";
    }

    // create invisible points at endpoints
    pointsJXG.current = [];
    for (let i = 0; i < SVs.nVertices; i++) {
      pointsJXG.current.push(
        board.create('point', [...SVs.numericalVertices[i]], jsxPointAttributes.current)
      );
    }

    let x = [], y = [];
    SVs.numericalVertices.forEach(z => { x.push(z[0]); y.push(z[1]) });

    let newPolylineJXG = board.create('curve', [x, y], jsxPolylineAttributes);

    for (let i = 0; i < SVs.nVertices; i++) {
      pointsJXG.current[i].on('drag', (e) => dragHandler(i, e));
      pointsJXG.current[i].on('up', () => upHandler(i));
      pointsJXG.current[i].on('down', (e) => {
        draggedPoint.current = null;
        pointerAtDown.current = [e.x, e.y];
        downOnPoint.current = i;
        callAction({
          action: actions.mouseDownOnPolyline
        });
      });
    }

    newPolylineJXG.on('drag', e => dragHandler(-1, e));
    newPolylineJXG.on('up', () => upHandler(-1));

    newPolylineJXG.on('down', function (e) {
      draggedPoint.current = null
      pointerAtDown.current = [e.x, e.y];

      pointsAtDown.current = newPolylineJXG.points.map(x => [...x.scrCoords])

      if (downOnPoint.current === null) {
        // Note: counting on fact that down on polyline itself will trigger after down on points
        callAction({
          action: actions.mouseDownOnPolyline
        });
      }
    });

    previousNVertices.current = SVs.nVertices;

    return newPolylineJXG;

  }

  function deletePolylineJXG() {


    polylineJXG.current.off('drag');
    polylineJXG.current.off('down');
    polylineJXG.current.off('up');
    board.removeObject(polylineJXG.current);
    polylineJXG.current = null;

    for (let i = 0; i < SVs.nVertices; i++) {
      pointsJXG.current[i].off('drag');
      pointsJXG.current[i].off('down');
      pointsJXG.current[i].off('up');
      board.removeObject(pointsJXG.current[i]);
      delete pointsJXG.current[i];
    }
  }

  function dragHandler(i, e) {
    //Protect against very small unintended drags
    if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
      Math.abs(e.y - pointerAtDown.current[1]) > .1) {
      draggedPoint.current = i;

      if (i === -1) {
        pointCoords.current = calculatePointPositions(e);

        callAction({
          action: actions.movePolyline,
          args: {
            pointCoords: pointCoords.current,
            transient: true,
            skippable: true,
          }
        })

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
            sourceInformation: { vertex: i }
          }
        })
        pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastPositionsFromCore.current[i]]);
        board.updateInfobox(pointsJXG.current[i])

      }
    }
  }

  function upHandler(i) {
    if (draggedPoint.current === i) {
      if (i === -1) {
        callAction({
          action: actions.movePolyline,
          args: {
            pointCoords: pointCoords.current,
          }
        })
      } else {
        callAction({
          action: actions.movePolyline,
          args: {
            pointCoords: pointCoords.current,
            sourceInformation: { vertex: i }
          }
        })
      }
    } else if (draggedPoint.current === null && (downOnPoint.current === null || i !== -1)) {
      // Note: counting on fact that up on polyline itself (i===-1) will trigger before up on points
      callAction({
        action: actions.polylineClicked
      });
    }

    if (i !== -1) {
      downOnPoint.current = null;
    }
  }

  function calculatePointPositions(e) {

    // the reason we calculate point positions with this algorithm,
    // is so that points don't get trapped on an attracting object
    // if you move the mouse slowly.

    var o = board.origin.scrCoords;

    let pointCoords = []

    for (let i = 0; i < polylineJXG.current.points.length; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0]
        - o[1]) / board.unitX;
      let calculatedY = (o[2] -
        (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1]))
        / board.unitY;
      pointCoords.push([calculatedX, calculatedY]);
    }
    return pointCoords;
  }



  if (board) {

    if (!polylineJXG.current) {
      polylineJXG.current = createPolylineJXG();
    } else if (SVs.numericalVertices.length !== SVs.nVertices ||
      SVs.numericalVertices.some(x => x.length !== 2)
    ) {
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

      let fixed = !SVs.draggable || SVs.fixed;

      polylineJXG.current.visProp.fixed = fixed;
      polylineJXG.current.visProp.highlight = !fixed;

      let polylineLayer = 10 * SVs.layer + 7;
      let layerChanged = polylineJXG.current.visProp.layer !== polylineLayer;

      if (layerChanged) {
        polylineJXG.current.setAttribute({ layer: polylineLayer });
        jsxPointAttributes.current.layer = polylineLayer + 2;
      }


      // add or delete points as required and change data array size
      if (SVs.nVertices > previousNVertices.current) {
        for (let i = previousNVertices.current; i < SVs.nVertices; i++) {
          pointsJXG.current.push(
            board.create('point', [...SVs.numericalVertices[i]], jsxPointAttributes.current)
          );
          polylineJXG.current.dataX.length = SVs.nVertices;

          pointsJXG.current[i].on('drag', x => dragHandler(i, true));
          pointsJXG.current[i].on('up', x => dragHandler(i, false));
          pointsJXG.current[i].on('down', x => draggedPoint.current = null);
        }
      } else if (SVs.nVertices < previousNVertices.current) {
        for (let i = SVs.nVertices; i < previousNVertices.current; i++) {
          let pt = pointsJXG.current.pop()
          pt.off('drag');
          pt.off('down');
          pt.off('up');
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
        // polylineJXG.current.setAttribute({visible: visible})

        let verticesFixed = !SVs.verticesDraggable || SVs.fixed;
        let pointsVisible = visible && !verticesFixed;

        for (let i = 0; i < SVs.nVertices; i++) {
          pointsJXG.current[i].visProp["visible"] = pointsVisible;
          pointsJXG.current[i].visPropCalc["visible"] = pointsVisible;
        }
      }
      else {
        polylineJXG.current.visProp["visible"] = false;
        polylineJXG.current.visPropCalc["visible"] = false;
        // polylineJXG.current.setAttribute({visible: false})

        for (let i = 0; i < SVs.nVertices; i++) {
          pointsJXG.current[i].visProp["visible"] = false;
          pointsJXG.current[i].visPropCalc["visible"] = false;
        }
      }

      if (polylineJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        polylineJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        polylineJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      if (polylineJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        polylineJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth
        polylineJXG.current.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth
      }
      if (polylineJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        polylineJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity
        polylineJXG.current.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle);
      if (polylineJXG.current.visProp.dash !== newDash) {
        polylineJXG.current.visProp.dash = newDash;
      }


      polylineJXG.current.name = SVs.labelForGraph;

      if (polylineJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          polylineJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor
        } else {
          polylineJXG.current.label.visProp.strokecolor = "#000000";
        }
        polylineJXG.current.label.needsUpdate = true;
        polylineJXG.current.label.update();
      }

      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let vertexUpdated = sourceOfUpdate.sourceInformation[name].vertex;

        if (Number.isFinite(vertexUpdated)) {
          board.updateInfobox(pointsJXG.current[vertexUpdated]);
        }
      }

      polylineJXG.current.needsUpdate = true;
      polylineJXG.current.update().updateVisibility();
      for (let i = 0; i < SVs.nVertices; i++) {
        if (layerChanged) {
          pointsJXG.current[i].setAttribute({ layer: polylineLayer + 2 });
        }
        pointsJXG.current[i].needsUpdate = true;
        pointsJXG.current[i].update();
      }
      board.updateRenderer();

    }
  }

  if (SVs.hidden) {
    return null;
  }

  // don't think we want to return anything if not in board
  return <><a name={id} /></>
})

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