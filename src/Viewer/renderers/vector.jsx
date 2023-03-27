import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from './graph';
import me from 'math-expressions';
import { MathJax } from 'better-react-mathjax';

export default React.memo(function Vector(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Vector.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let vectorJXG = useRef({});
  let point1JXG = useRef({})
  let point2JXG = useRef({});

  let pointerAtDown = useRef(false);
  let pointsAtDown = useRef(false);
  let headBeingDragged = useRef(false);
  let tailBeingDragged = useRef(false);
  let downOnPoint = useRef(null);
  let headcoords = useRef(null);
  let tailcoords = useRef(null);

  let previousWithLabel = useRef(false);

  let lastPositionsFromCore = useRef(null);

  lastPositionsFromCore.current = SVs.numericalEndpoints;


  useEffect(() => {

    //On unmount
    return () => {
      // if vector is defined
      if (Object.keys(vectorJXG.current).length !== 0) {
        deleteVectorJXG();
      }

    }
  }, [])

  function createVectorJXG() {

    if (SVs.numericalEndpoints.length !== 2 ||
      SVs.numericalEndpoints.some(x => x.length !== 2)
    ) {
      vectorJXG.current = {};
      point1JXG.current = {};
      point2JXG.current = {};
      return;

    }

    let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
    let pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
    let fixed = !SVs.draggable || SVs.fixed;

    //things to be passed to JSXGraph as attributes
    var jsxVectorAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed,
      layer,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
      highlight: !fixed,
      lastArrow: { type: 1, size: 3, highlightSize: 3 },
    };


    let endpoints = [
      [...SVs.numericalEndpoints[0]],
      [...SVs.numericalEndpoints[1]]
    ];

    let jsxPointAttributes = Object.assign({}, jsxVectorAttributes);
    Object.assign(jsxPointAttributes, {
      withLabel: false,
      fixed: false,
      highlight: true,
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      layer: pointLayer,
    });

    // create invisible points at endpoints
    let tailPointAttributes = Object.assign({}, jsxPointAttributes);
    let tailDraggable = SVs.tailDraggable && !SVs.fixed;
    let tailVisible = tailDraggable && !SVs.hidden;
    tailPointAttributes.visible = tailVisible;
    let newPoint1JXG = board.create('point', endpoints[0], tailPointAttributes);

    let headPointAttributes = Object.assign({}, jsxPointAttributes);
    let headDraggable = SVs.headDraggable && !SVs.fixed;
    let headVisible = headDraggable && !SVs.hidden;
    headPointAttributes.visible = headVisible;
    let newPoint2JXG = board.create('point', endpoints[1], headPointAttributes);


    jsxVectorAttributes.label = {
      highlight: false
    }
    if (SVs.labelHasLatex) {
      jsxVectorAttributes.label.useMathJax = true
    }

    if (SVs.applyStyleToLabel) {
      jsxVectorAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxVectorAttributes.label.strokeColor = "#000000";
    }

    let newVectorJXG = board.create('arrow', [newPoint1JXG, newPoint2JXG], jsxVectorAttributes);

    newPoint1JXG.on('drag', e => onDragHandler(e, 0));
    newPoint2JXG.on('drag', e => onDragHandler(e, 1));
    newVectorJXG.on('drag', e => onDragHandler(e, -1));
    newPoint1JXG.on('up', e => {
      if (!headBeingDragged.current && tailBeingDragged.current) {
        callAction({
          action: actions.moveVector,
          args: { tailcoords: tailcoords.current }
        });
      } else if (!headBeingDragged.current && !tailBeingDragged.current) {
        callAction({
          action: actions.vectorClicked
        });
      }
      downOnPoint.current = null;
    });
    newPoint2JXG.on('up', e => {
      if (headBeingDragged.current && !tailBeingDragged.current) {
        callAction({
          action: actions.moveVector,
          args: { headcoords: headcoords.current }
        });
      } else if (!headBeingDragged.current && !tailBeingDragged.current) {
        callAction({
          action: actions.vectorClicked
        });
      }
      downOnPoint.current = null;
    });
    newVectorJXG.on('up', e => {
      if (headBeingDragged.current && tailBeingDragged.current) {
        callAction({
          action: actions.moveVector,
          args: {
            headcoords: headcoords.current,
            tailcoords: tailcoords.current
          }
        });
      } else if (!headBeingDragged.current && !tailBeingDragged.current && downOnPoint.current === null) {
        // Note: counting on fact that up on vector will trigger before up on points
        callAction({
          action: actions.vectorClicked
        });
      }
    });

    newPoint1JXG.on('down', function (e) {
      headBeingDragged.current = false;
      tailBeingDragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      downOnPoint.current = 1;
      callAction({
        action: actions.mouseDownOnVector
      });
    });
    newPoint2JXG.on('down', function (e) {
      headBeingDragged.current = false;
      tailBeingDragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      downOnPoint.current = 2;
      callAction({
        action: actions.mouseDownOnVector
      });
    });

    // if drag vector, need to keep track of original point positions
    // so that they won't get stuck in an attractor
    newVectorJXG.on('down', function (e) {
      headBeingDragged.current = false;
      tailBeingDragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...newVectorJXG.point1.coords.scrCoords],
        [...newVectorJXG.point2.coords.scrCoords]
      ];
      callAction({
        action: actions.mouseDownOnVector
      });
    });

    function onDragHandler(e, i) {
      //Protect against very small unintended drags
      if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1) {

        if (i === 0) {
          tailBeingDragged.current = true;
        } else if (i === 1) {
          headBeingDragged.current = true;
        } else {
          headBeingDragged.current = true;
          tailBeingDragged.current = true;
        }

        let instructions = { transient: true, skippable: true };

        if (headBeingDragged.current) {
          if (i === -1) {
            headcoords.current = calculatePointPosition(e, 1);
          } else {
            headcoords.current = [newVectorJXG.point2.X(), newVectorJXG.point2.Y()];
          }
          instructions.headcoords = headcoords.current;
        }
        if (tailBeingDragged.current) {
          if (i === -1) {
            tailcoords.current = calculatePointPosition(e, 0);
          } else {
            tailcoords.current = [newVectorJXG.point1.X(), newVectorJXG.point1.Y()];
          }
          instructions.tailcoords = tailcoords.current;

        }

        if (i === 0 || i === 1) {
          instructions.sourceDetails = { vertex: i };
        }

        callAction({
          action: actions.moveVector,
          args: instructions
        });

        newVectorJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[0]);
        newVectorJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[1]);
        if (i === 0) {
          board.updateInfobox(newPoint1JXG);
        } else if (i === 1) {
          board.updateInfobox(newPoint2JXG);
        }
      }

    }


    vectorJXG.current = newVectorJXG;
    point1JXG.current = newPoint1JXG;
    point2JXG.current = newPoint2JXG;
  }

  function deleteVectorJXG() {

    vectorJXG.current.off('drag');
    vectorJXG.current.off('down');
    vectorJXG.current.off('up');
    board.removeObject(vectorJXG.current);
    vectorJXG.current = {};


    point1JXG.current.off('drag');
    point1JXG.current.off('down');
    point1JXG.current.off('up');
    board.removeObject(point1JXG.current);
    point1JXG.current = {};

    point2JXG.current.off('drag');
    point2JXG.current.off('down');
    point2JXG.current.off('up');
    board.removeObject(point2JXG.current);
    point2JXG.current = {};
  }

  function calculatePointPosition(e, i) {
    var o = board.origin.scrCoords;


    let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0]
      - o[1]) / board.unitX;
    let calculatedY = (o[2] -
      (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1]))
      / board.unitY;
    let pointCoords = [calculatedX, calculatedY];

    return pointCoords;
  }


  if (board) {
    if (Object.keys(vectorJXG.current).length === 0) {

      createVectorJXG();

    } else if (SVs.numericalEndpoints.length !== 2 ||
      SVs.numericalEndpoints.some(x => x.length !== 2)
    ) {

      deleteVectorJXG();

    } else {

      let validPoints = true;

      for (let coords of [SVs.numericalEndpoints[0], SVs.numericalEndpoints[1]]) {
        if (!Number.isFinite(coords[0])) {
          validPoints = false;
        }
        if (!Number.isFinite(coords[1])) {
          validPoints = false;
        }
      }

      vectorJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoints[0]);
      vectorJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoints[1]);

      let visible = !SVs.hidden && validPoints;

      let fixed = !SVs.draggable || SVs.fixed;
      let tailDraggable = SVs.tailDraggable && !SVs.fixed;
      let tailVisible = tailDraggable && visible;
      let headDraggable = SVs.headDraggable && !SVs.fixed;
      let headVisible = headDraggable && visible;

      vectorJXG.current.visProp.fixed = fixed;
      vectorJXG.current.visProp.highlight = !fixed;

      vectorJXG.current.visProp["visible"] = visible;
      vectorJXG.current.visPropCalc["visible"] = visible;

      point1JXG.current.visProp["visible"] = tailVisible;
      point1JXG.current.visPropCalc["visible"] = tailVisible;

      point2JXG.current.visProp["visible"] = headVisible;
      point2JXG.current.visPropCalc["visible"] = headVisible;

      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let sourceInfo = sourceOfUpdate.sourceInformation[name]
        if (sourceInfo.vertex === 0) {
          board.updateInfobox(point1JXG.current);
        } else if (sourceInfo.vertex === 1) {
          board.updateInfobox(point2JXG.current);
        }
      }


      let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = vectorJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        let pointLayer = 10 * SVs.layer + VERTEX_LAYER_OFFSET;
        vectorJXG.current.setAttribute({ layer });
        point1JXG.current.setAttribute({ layer: pointLayer });
        point2JXG.current.setAttribute({ layer: pointLayer });
      }

      if (vectorJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        vectorJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        vectorJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      if (vectorJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        vectorJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth
        vectorJXG.current.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth
      }
      if (vectorJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        vectorJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity
        vectorJXG.current.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle);
      if (vectorJXG.current.visProp.dash !== newDash) {
        vectorJXG.current.visProp.dash = newDash;
      }

      vectorJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        vectorJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      vectorJXG.current.needsUpdate = true;
      vectorJXG.current.update()
      if (vectorJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          vectorJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor
        } else {
          vectorJXG.current.label.visProp.strokecolor = "#000000";
        }
        vectorJXG.current.label.needsUpdate = true;
        vectorJXG.current.label.update();
      }

      point1JXG.current.needsUpdate = true;
      point1JXG.current.update();
      point2JXG.current.needsUpdate = true;
      point2JXG.current.update();

      board.updateRenderer();

    }

    return <><a name={id} /></>

  }


  if (SVs.hidden) {
    return null;
  }

  let mathJaxify = "\\(" + SVs.latex + "\\)";
  return <><a name={id} /><span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{mathJaxify}</MathJax></span></>
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