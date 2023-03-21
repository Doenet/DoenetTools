import React, { useContext, useEffect, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from './graph';


export default React.memo(function Polygon(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

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

    //On unmount
    return () => {
      // if point is defined
      if (polygonJXG.current) {
        deletePolygonJXG();
      }
    }
  }, [])



  function createPolygonJXG() {

    if (!(SVs.nVertices >= 2)) {
      return null;
    }

    let fixed = !SVs.draggable || SVs.fixed;
    let verticesFixed = !SVs.verticesDraggable || SVs.fixed;

    jsxPointAttributes.current = {
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      visible: !verticesFixed && !SVs.hidden,
      withLabel: false,
      layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
      highlight: true,
    };

    let jsxBorderAttributes = {
      highlight: false,
      visible: !SVs.hidden,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      fixed: true,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
    };

    const fillColor = SVs.filled ? SVs.selectedStyle.fillColor.toLowerCase() : "none";

    let jsxPolygonAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,

      //specific to polygon
      fillColor,
      fillOpacity: SVs.selectedStyle.fillOpacity,
      highlightFillColor: fillColor,
      highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
      highlight: !fixed,
      vertices: jsxPointAttributes.current,
      borders: jsxBorderAttributes,
    };

    jsxPolygonAttributes.label = {
      highlight: false
    }
    if (SVs.labelHasLatex) {
      jsxPolygonAttributes.label.useMathJax = true
    }

    if (SVs.applyStyleToLabel) {
      jsxPolygonAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxPolygonAttributes.label.strokeColor = "#000000";
    }

    if (SVs.filled) {
      jsxPolygonAttributes.hasInnerPoints = true;
    }


    board.suspendUpdate();

    let pts = [];

    for (let p of SVs.numericalVertices) {
      pts.push(
        board.create('point', [...p], jsxPointAttributes.current)
      )
    }


    let newPolygonJXG = board.create('polygon', pts, jsxPolygonAttributes);

    initializePoints(newPolygonJXG);

    newPolygonJXG.on('drag', e => dragHandler(-1, e));
    newPolygonJXG.on('up', e => upHandler(-1));

    newPolygonJXG.on('down', function (e) {
      draggedPoint.current = null
      pointerAtDown.current = [e.x, e.y];

      pointsAtDown.current = newPolygonJXG.vertices.map(x => [...x.coords.scrCoords])

      if (downOnPoint.current === null) {
        // Note: counting on fact that down on polygon itself will trigger after down on points
        callAction({
          action: actions.mouseDownOnPolygon
        });
      }
    });


    board.unsuspendUpdate();

    previousNVertices.current = SVs.nVertices;

    return newPolygonJXG;

  }


  function initializePoints(polygon) {
    for (let i = 0; i < SVs.nVertices; i++) {
      let vertex = polygon.vertices[i];
      vertex.off('drag');
      vertex.on('drag', (e) => dragHandler(i, e));
      vertex.off('up');
      vertex.on('up', () => upHandler(i));
      vertex.off('down');
      vertex.on('down', (e) => {
        draggedPoint.current = null;
        pointerAtDown.current = [e.x, e.y];
        downOnPoint.current = i;
        callAction({
          action: actions.mouseDownOnPolygon
        });
      });
    }
  }

  function deletePolygonJXG() {
    for (let i = 0; i < SVs.nVertices; i++) {
      let vertex = polygonJXG.current.vertices[i];
      if (vertex) {
        vertex.off('drag');
        vertex.off('up');
        vertex.off('down');
      }
    }
    polygonJXG.current.off('drag');
    polygonJXG.current.off('up');
    polygonJXG.current.off('down');
    polygonJXG.current.off('hit');
    board.removeObject(polygonJXG.current);
    polygonJXG.current = null;
  }

  function dragHandler(i, e) {
    //Protect against very small unintended drags
    if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
      Math.abs(e.y - pointerAtDown.current[1]) > .1) {
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
        })

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
            sourceDetails: { vertex: i }
          }
        })
        polygonJXG.current.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastPositionsFromCore.current[i]]);
        board.updateInfobox(polygonJXG.current.vertices[i])
      }
    }
  }

  function upHandler(i) {
    if (draggedPoint.current === i) {
      if (i === -1) {
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
          }
        })
      } else {
        callAction({
          action: actions.movePolygon,
          args: {
            pointCoords: pointCoords.current,
            sourceDetails: { vertex: i }
          }
        })

      }
    } else if (draggedPoint.current === null && (downOnPoint.current === null || i !== -1)) {
      // Note: counting on fact that up on polygon itself (i===-1) will trigger before up on points
      callAction({
        action: actions.polygonClicked
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

    for (let i = 0; i < polygonJXG.current.vertices.length - 1; i++) {
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

      // add or delete points as required and change data array size
      if (SVs.nVertices > previousNVertices.current) {
        for (let i = previousNVertices.current; i < SVs.nVertices; i++) {
          let newPoint = board.create('point', [...SVs.numericalVertices[i]], jsxPointAttributes.current)
          polygonJXG.current.addPoints(newPoint);
        }
        initializePoints(polygonJXG.current);

      } else if (SVs.nVertices < previousNVertices.current) {
        for (let i = previousNVertices.current - 1; i >= SVs.nVertices; i--) {
          polygonJXG.current.vertices[i].off('drag')
          polygonJXG.current.vertices[i].off('down')
          polygonJXG.current.vertices[i].off('up')
          polygonJXG.current.removePoints(polygonJXG.current.vertices[i]);
        }
        initializePoints(polygonJXG.current);
      }

      let fixed = !SVs.draggable || SVs.fixed;
      let verticesFixed = !SVs.verticesDraggable || SVs.fixed;
      let verticesVisible = !verticesFixed && !SVs.hidden;

      for (let i = 0; i < SVs.nVertices; i++) {
        polygonJXG.current.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalVertices[i]]);
        polygonJXG.current.vertices[i].needsUpdate = true;
        polygonJXG.current.vertices[i].update();
        // // let actuallyChangedVisibility = polygonJXG.current.vertices[i].visProp["visible"] !== verticesVisible;
        polygonJXG.current.vertices[i].visProp["visible"] = verticesVisible;
        polygonJXG.current.vertices[i].visPropCalc["visible"] = verticesVisible;


      }


      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let ind = sourceOfUpdate.sourceInformation[name].vertex;
        if (ind !== undefined) {
          board.updateInfobox(polygonJXG.current.vertices[ind])
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
      // polygonJXG.current.setAttribute({visible: visibleNow})

      let polygonLayer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = polygonJXG.current.visProp.layer !== polygonLayer;
      let borderLayer, pointLayer;

      if (layerChanged) {
        borderLayer = 10 * SVs.layer + LINE_LAYER_OFFSET;
        pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
        polygonJXG.current.setAttribute({ layer: polygonLayer });
      }


      polygonJXG.current.name = SVs.labelForGraph;

      if (polygonJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          polygonJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor
        } else {
          polygonJXG.current.label.visProp.strokecolor = "#000000";
        }
        polygonJXG.current.label.needsUpdate = true;
        polygonJXG.current.label.update();
      }

      const fillColor = SVs.filled ? SVs.selectedStyle.fillColor.toLowerCase() : "none";

      if (polygonJXG.current.visProp.fillcolor !== fillColor) {
        polygonJXG.current.visProp.fillcolor = fillColor;
        polygonJXG.current.visProp.highlightfillcolor = fillColor;
        polygonJXG.current.visProp.hasinnerpoints = SVs.filled;
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
          border.setAttribute({ layer: borderLayer });
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
          border.visProp.strokewidth = SVs.selectedStyle.lineWidth
          border.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth
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

      previousNVertices.current = SVs.nVertices;

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