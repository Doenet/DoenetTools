import React, { useContext, useEffect, useRef } from 'react';
import { createFunctionFromDefinition } from '../../Core/utils/function';
import useDoenetRender from '../useDoenetRenderer';
import { BoardContext } from './graph';


export default React.memo(function Curve(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Curve.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let curveJXG = useRef(null);
  let throughPointsJXG = useRef(null);
  let controlPointsJXG = useRef(null);

  let previousCurveType = useRef(null);
  let draggedControlPoint = useRef(null);
  let draggedThroughPoint = useRef(null);
  let updateSinceDown = useRef(false);
  let previousFlipFunction = useRef(null);
  let segmentAttributes = useRef(null);
  let throughPointAttributes = useRef(null);
  let throughPointAlwaysVisible = useRef(null);
  let throughPointHoverVisible = useRef(null);
  let controlPointAttributes = useRef(null);
  let previousNumberOfPoints = useRef(null);
  let segmentsJXG = useRef([]);
  let vectorControlsVisible = useRef(null);
  let hitObject = useRef(null);
  let vectorControlDirections = useRef(null);
  let previousVectorControlDirections = useRef(null);

  let tpCoords = useRef([]);
  let cvCoords = useRef([]);

  vectorControlDirections.current = SVs.vectorControlDirections;

  let lastThroughPointPositionsFromCore = useRef(null);
  lastThroughPointPositionsFromCore.current = SVs.numericalThroughPoints;

  let lastControlPointPositionsFromCore = useRef(null);
  lastControlPointPositionsFromCore.current = SVs.numericalControlPoints;

  useEffect(() => {

    //On unmount
    return () => {
      // if point is defined
      if (curveJXG.current) {
        deleteCurveJXG();
      }
    }
  }, [])



  function createCurveJXG() {

    if (SVs.curveType === "bezier" &&
      SVs.numericalThroughPoints.length < 2
    ) {
      return null;
    }

    //things to be passed to JSXGraph as attributes
    var curveAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed: true,
      layer: 10 * SVs.layer + 5,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      strokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed),
      highlight: false,
      lineCap: "butt"
    };


    if (SVs.showLabel && SVs.labelForGraph !== "") {
      let anchorx, offset, position;
      if (SVs.labelPosition === "upperright") {
        position = 'urt';
        offset = [-5, -10];
        anchorx = "right";
      } else if (SVs.labelPosition === "upperleft") {
        position = 'ulft';
        offset = [5, -10];
        anchorx = "left";
      } else if (SVs.labelPosition === "lowerright") {
        position = 'lrt';
        offset = [-5, 10];
        anchorx = "right";
      } else if (SVs.labelPosition === "lowerleft") {
        position = 'llft';
        offset = [5, 10];
        anchorx = "left";
      } else if (SVs.labelPosition === "top") {
        position = 'top';
        offset = [0, -10];
        anchorx = "left";
      } else if (SVs.labelPosition === "bottom") {
        position = 'bot';
        offset = [0, 10];
        anchorx = "left";
      } else if (SVs.labelPosition === "left") {
        position = 'lft';
        offset = [10, 0];
        anchorx = "left";
      } else {
        // right
        position = 'rt';
        offset = [-10, 0];
        anchorx = "right";
      }

      curveAttributes.label = {
        offset,
        position,
        anchorx,
        highlight: false
      };

      if (SVs.labelHasLatex) {
        curveAttributes.label.useMathJax = true;
      }

      if (SVs.applyStyleToLabel) {
        curveAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
      } else {
        curveAttributes.label.strokeColor = "#000000";
      }
    } else {
      curveAttributes.label = {
        highlight: false
      }
      if (SVs.labelHasLatex) {
        curveAttributes.label.useMathJax = true;
      }
    }


    let newCurveJXG;

    if (SVs.curveType === "parameterization") {
      let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
      let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);

      newCurveJXG = board.create('curve', [
        f1, f2,
        SVs.parMin, SVs.parMax
      ], curveAttributes);

    } else if (SVs.curveType === "bezier") {
      let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
      let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);
      newCurveJXG = board.create('curve', [
        f1, f2,
        SVs.parMin, SVs.parMax
      ], curveAttributes);

    } else {
      let f = createFunctionFromDefinition(SVs.fDefinitions[0]);
      if (SVs.flipFunction) {
        let ymin = SVs.graphYmin;
        let ymax = SVs.graphYmax;
        let minForF = Math.max(ymin - (ymax - ymin) * 0.1, SVs.parMin);
        let maxForF = Math.min(ymax + (ymax - ymin) * 0.1, SVs.parMax);
        newCurveJXG = board.create('curve', [f, x => x, minForF, maxForF], curveAttributes);
      } else {
        let xmin = SVs.graphXmin;
        let xmax = SVs.graphXmax;
        let minForF = Math.max(xmin - (xmax - xmin) * 0.1, SVs.parMin);
        let maxForF = Math.min(xmax + (xmax - xmin) * 0.1, SVs.parMax);
        newCurveJXG = board.create('functiongraph', [f, minForF, maxForF], curveAttributes);
      }
      previousFlipFunction.current = SVs.flipFunction;

    }

    previousCurveType.current = SVs.curveType;

    draggedControlPoint.current = null;
    draggedThroughPoint.current = null;

    newCurveJXG.on('up', function (e) {
      // TODO: don't think SVS.switchable, SVs.fixed will if change state variables
      // as useEffect will not be rerun
      if (!updateSinceDown.current && draggedControlPoint.current === null && draggedThroughPoint.current === null) {
        if (SVs.switchable && !SVs.fixed) {
          callAction({
            action: actions.switchCurve
          });
        }
        callAction({
          action: actions.curveClicked,
          args: { name }   // send name so get original name if adapted
        });
      }
    });

    if (SVs.curveType === "bezier") {

      board.on('up', upBoard);
      newCurveJXG.on('down', () => {
        downOther();
        callAction({
          action: actions.mouseDownOnCurve,
          args: { name }   // send name so get original name if adapted
        });

      });

      segmentAttributes.current = {
        visible: false,
        withLabel: false,
        fixed: true,
        strokeColor: 'var(--mainGray)',
        highlightStrokeColor: 'var(--mainGray)',
        layer: 10 * SVs.layer + 7,
        strokeWidth: 1,
        highlightStrokeWidth: 1,
      };
      throughPointAttributes.current = {
        visible: !SVs.hidden,
        withLabel: false,
        fixed: false,
        fillColor: 'none',
        strokeColor: 'none',
        highlightFillColor: 'var(--mainGray)',
        highlightStrokeColor: 'var(--mainGray)',
        strokeWidth: 1,
        highlightStrokeWidth: 1,
        layer: 10 * SVs.layer + 7,
        size: 3,
      };
      throughPointAlwaysVisible.current = {
        fillcolor: 'var(--mainGray)',
        strokecolor: 'var(--mainGray)',
      };
      throughPointHoverVisible.current = {
        fillcolor: 'none',
        strokecolor: 'none',
      };

      controlPointAttributes.current = {
        visible: false,
        withLabel: false,
        fixed: false,
        fillColor: 'var(--mainGray)',
        strokeColor: 'var(--mainGray)',
        highlightFillColor: 'var(--mainGray)',
        highlightStrokeColor: 'var(--mainGray)',
        strokeWidth: 1,
        highlightStrokeWidth: 1,
        layer: 10 * SVs.layer + 8,
        size: 2,
      };

      if (SVs.draggable && !SVs.fixed) {


        createControls();

        if (SVs.bezierControlsAlwaysVisible) {
          makeThroughPointsAlwaysVisible();
          showAllControls();
        }

        board.updateRenderer();

        previousNumberOfPoints.current = SVs.numericalThroughPoints.length;
        previousVectorControlDirections.current = [...SVs.vectorControlDirections];
      }

    } else {
      newCurveJXG.on('down', function (e) {
        updateSinceDown.current = false;
        callAction({
          action: actions.mouseDownOnCurve,
          args: { name }   // send name so get original name if adapted
        });
      });
    }
    return newCurveJXG;
  }

  function deleteCurveJXG() {
    board.off('up', upBoard);
    curveJXG.current.off('down');
    curveJXG.current.off('up');
    board.removeObject(curveJXG.current);
    curveJXG.current = null;
    deleteControls();
  }

  function createControls() {
    throughPointsJXG.current = [];
    controlPointsJXG.current = [];
    segmentsJXG.current = [];


    for (let i = 0; i < SVs.numericalThroughPoints.length; i++) {
      // middle through points have two controls
      let tp = board.create('point', [...SVs.numericalThroughPoints[i]], throughPointAttributes.current);
      throughPointsJXG.current.push(tp);
      let cp1 = board.create('point', [...SVs.numericalControlPoints[i][0]], controlPointAttributes.current);
      let cp2 = board.create('point', [...SVs.numericalControlPoints[i][1]], controlPointAttributes.current);
      controlPointsJXG.current.push([cp1, cp2]);
      let seg1 = board.create('segment', [tp, cp1], segmentAttributes.current);
      let seg2 = board.create('segment', [tp, cp2], segmentAttributes.current);
      segmentsJXG.current.push([seg1, seg2]);
      tp.on('drag', e => dragThroughPoint(i));
      tp.on('down', e => downThroughPoint(i, e));
      tp.on('up', e => upThroughPoint(i));
      cp1.on('drag', e => dragControlPoint(i, 0));
      cp2.on('drag', e => dragControlPoint(i, 1));
      cp1.on('down', downOther);
      cp2.on('down', downOther);
      seg1.on('down', downOther);
      seg1.on('down', downOther);
      cp1.on('up', e => upControlPoint(i, 0));
      cp2.on('up', e => upControlPoint(i, 1));
    }

    vectorControlsVisible.current = [];

  }

  function deleteControls() {
    if (segmentsJXG.current.length > 0) {
      segmentsJXG.current.forEach(x => x.forEach(y => {
        if (y) {
          y.off('down');
          board.removeObject(y)
        }
      }));
      segmentsJXG.current = [];
      controlPointsJXG.current.forEach(x => x.forEach(y => {
        if (y) {
          y.off('drag')
          y.off('down')
          y.off('up')
          board.removeObject(y)
        }
      }));
      controlPointsJXG.current = [];
      throughPointsJXG.current.forEach(x => {
        x.off('drag')
        x.off('down')
        x.off('up')
        board.removeObject(x)
      });
      throughPointsJXG.current = [];
    }
  }

  function dragThroughPoint(i) {
    draggedThroughPoint.current = i;

    tpCoords.current[i] = [throughPointsJXG.current[i].X(), throughPointsJXG.current[i].Y()];
    callAction({
      action: actions.moveThroughPoint,
      args: {
        throughPoint: tpCoords.current[i],
        throughPointInd: i,
        transient: true,
        skippable: true,
      }
    })

    throughPointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, lastThroughPointPositionsFromCore.current[i]);
    board.updateInfobox(throughPointsJXG.current[i]);

  }

  function upThroughPoint(i) {
    if (draggedThroughPoint.current !== i) {
      return;
    }

    callAction({
      action: actions.moveThroughPoint,
      args: {
        throughPoint: tpCoords.current[i],
        throughPointInd: i,
      }
    })

  }

  function dragControlPoint(point, i) {
    // console.log(`drag control point ${point}, ${i}`)

    draggedControlPoint.current = point + "_" + i;

    if (!cvCoords.current[point]) {
      cvCoords.current[point] = {}
    }

    cvCoords.current[point][i] = [
      controlPointsJXG.current[point][i].X() - throughPointsJXG.current[point].X(),
      controlPointsJXG.current[point][i].Y() - throughPointsJXG.current[point].Y()
    ]

    callAction({
      action: actions.moveControlVector,
      args: {
        controlVector: cvCoords.current[point][i],
        controlVectorInds: [point, i],
        transient: true,
        skippable: true,
      }
    });

    controlPointsJXG.current[point][i].coords.setCoordinates(JXG.COORDS_BY_USER, [...lastControlPointPositionsFromCore.current[point][i]]);
    board.updateInfobox(controlPointsJXG.current[point][i]);


  }

  function upControlPoint(point, i) {
    // console.log(`up control point ${point}, ${i}`)

    if (draggedControlPoint.current !== point + "_" + i) {
      return;
    }

    callAction({
      action: actions.moveControlVector,
      args: {
        controlVector: cvCoords.current[point][i],
        controlVectorInds: [point, i],
      }
    });

  }

  function makeThroughPointsAlwaysVisible() {
    for (let point of throughPointsJXG.current) {
      for (let attribute in throughPointAlwaysVisible.current) {
        point.visProp[attribute] = throughPointAlwaysVisible.current[attribute];
      }
      point.needsUpdate = true;
      point.update();
    }
  }

  function makeThroughPointsHoverVisible() {
    for (let point of throughPointsJXG.current) {
      for (let attribute in throughPointHoverVisible.current) {
        point.visProp[attribute] = throughPointHoverVisible.current[attribute];
      }
      point.needsUpdate = true;
      point.update();
    }
  }

  function hideAllControls() {
    for (let controlPair of controlPointsJXG.current) {
      for (let cp of controlPair) {
        if (cp) {
          cp.visProp.visible = false;
          cp.needsUpdate = true;
          cp.update();
        }
      }
    }
    for (let segmentPair of segmentsJXG.current) {
      for (let seg of segmentPair) {
        if (seg) {
          seg.visProp.visible = false;
          seg.needsUpdate = true;
          seg.update();
        }
      }
    }
    vectorControlsVisible.current = [];
  }

  function showAllControls() {
    for (let ind in controlPointsJXG.current) {
      makeVectorControlVisible(ind);
    }
  }

  function upBoard() {
    if (!SVs.draggable || SVs.fixed) {
      return;
    }
    if (hitObject.current !== true && !SVs.bezierControlsAlwaysVisible) {
      makeThroughPointsHoverVisible();
      hideAllControls();
      board.updateRenderer();
    }
    hitObject.current = false;
  }

  function downThroughPoint(i, e) {

    if (!SVs.draggable || SVs.fixed) {
      return;
    }

    draggedThroughPoint.current = null;
    draggedControlPoint.current = null;

    // console.log(`down through point: ${i}`)
    hitObject.current = true;

    makeThroughPointsAlwaysVisible();
    makeVectorControlVisible(i);
    board.updateRenderer();
  }

  function makeVectorControlVisible(i) {
    if (!SVs.hiddenControls[i]) {
      if (controlPointsJXG.current[i][0]) {
        let isVisible = (i > 0 || SVs.extrapolateBackward)
          && ["symmetric", "both", "previous"].includes(vectorControlDirections.current[i]);
        controlPointsJXG.current[i][0].visProp.visible = isVisible;
        controlPointsJXG.current[i][0].visPropCalc.visible = isVisible;
        controlPointsJXG.current[i][0].needsUpdate = true;
        controlPointsJXG.current[i][0].update();
        segmentsJXG.current[i][0].visProp.visible = isVisible;
        segmentsJXG.current[i][0].visPropCalc.visible = isVisible;
        segmentsJXG.current[i][0].needsUpdate = true;
        segmentsJXG.current[i][0].update();
      }

      if (controlPointsJXG.current[i][1]) {
        let isVisible = (i < throughPointsJXG.current.length - 1 || SVs.extrapolateForward)
          && ["symmetric", "both", "next"].includes(vectorControlDirections.current[i]);
        controlPointsJXG.current[i][1].visProp.visible = isVisible;
        controlPointsJXG.current[i][1].visPropCalc.visible = isVisible;
        controlPointsJXG.current[i][1].needsUpdate = true;
        controlPointsJXG.current[i][1].update();
        segmentsJXG.current[i][1].visProp.visible = isVisible;
        segmentsJXG.current[i][1].visPropCalc.visible = isVisible;
        segmentsJXG.current[i][1].needsUpdate = true;
        segmentsJXG.current[i][1].update();
      }

      vectorControlsVisible.current[i] = true;
    }
  }

  function downOther() {
    if (!SVs.draggable || SVs.fixed) {
      return;
    }

    draggedThroughPoint.current = null;
    draggedControlPoint.current = null;

    hitObject.current = true;

    updateSinceDown.current = false;

    makeThroughPointsAlwaysVisible();
    board.updateRenderer();
  }


  if (board) {

    if (!curveJXG.current) {
      // attempt to create curveJXG.current if it doesn't exist yet

      curveJXG.current = createCurveJXG();


    } else if (SVs.curveType === "bezier" &&
      SVs.numericalThroughPoints.length < 2
    ) {
      deleteCurveJXG();
    } else if (
      previousCurveType.current !== SVs.curveType ||
      (
        previousCurveType.current === "function" &&
        previousFlipFunction.current !== SVs.flipFunction
      )
    ) {

      // if curve type changed or if flip of function changed
      // delete and recreate curve

      deleteCurveJXG();
      curveJXG.current = createCurveJXG()


      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[id] = curveJXG.current;
      }

    } else {

      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[id] = curveJXG.current;
      }

      updateSinceDown.current = true;

      let visible = !SVs.hidden;

      curveJXG.current.name = SVs.labelForGraph;

      curveJXG.current.visProp["visible"] = visible;
      curveJXG.current.visPropCalc["visible"] = visible;

      let curveLayer = 10 * SVs.layer + 5;
      let layerChanged = curveJXG.current.visProp.layer !== curveLayer;

      if (layerChanged) {
        curveJXG.current.setAttribute({ layer: curveLayer });
        segmentAttributes.current.layer = curveLayer + 2;
        throughPointAttributes.current.layer = curveLayer + 2;
        controlPointAttributes.current.layer = curveLayer + 3;
      }

      if (curveJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        curveJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        curveJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      if (curveJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        curveJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
      if (curveJXG.current.visProp.dash !== newDash) {
        curveJXG.current.visProp.dash = newDash;
      }
      if (curveJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        curveJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth
      }


      if (SVs.curveType === "parameterization") {
        let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
        let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);

        curveJXG.current.X = f1;
        curveJXG.current.Y = f2;
        curveJXG.current.minX = () => SVs.parMin;
        curveJXG.current.maxX = () => SVs.parMax;

      } else if (SVs.curveType === "bezier") {
        curveJXG.current.X = createFunctionFromDefinition(SVs.fDefinitions[0]);
        curveJXG.current.Y = createFunctionFromDefinition(SVs.fDefinitions[1]);
        curveJXG.current.minX = () => SVs.parMin;
        curveJXG.current.maxX = () => SVs.parMax;

      } else {
        let f = createFunctionFromDefinition(SVs.fDefinitions[0]);
        if (SVs.flipFunction) {
          curveJXG.current.X = f;
          let ymin = SVs.graphYmin;
          let ymax = SVs.graphYmax;
          let minForF = Math.max(ymin - (ymax - ymin) * 0.1, SVs.parMin);
          let maxForF = Math.min(ymax + (ymax - ymin) * 0.1, SVs.parMax);
          curveJXG.current.minX = () => minForF;
          curveJXG.current.maxX = () => maxForF;
        } else {
          curveJXG.current.Y = f;
          let xmin = SVs.graphXmin;
          let xmax = SVs.graphXmax;
          let minForF = Math.max(xmin - (xmax - xmin) * 0.1, SVs.parMin);
          let maxForF = Math.min(xmax + (xmax - xmin) * 0.1, SVs.parMax);
          curveJXG.current.minX = () => minForF;
          curveJXG.current.maxX = () => maxForF;
        }
      }

      curveJXG.current.needsUpdate = true;
      curveJXG.current.updateCurve();
      if (curveJXG.current.hasLabel) {
        curveJXG.current.label.needsUpdate = true;
        curveJXG.current.label.visPropCalc.visible = SVs.showLabel && SVs.labelForGraph !== "";
        if (SVs.applyStyleToLabel) {
          curveJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor
        } else {
          curveJXG.current.label.visProp.strokecolor = "#000000";
        }
        curveJXG.current.label.update();
      }


      if (SVs.curveType !== "bezier") {
        board.updateRenderer();
        return <><a name={id} /></>
      }


      if (!SVs.draggable || SVs.fixed) {
        if (segmentsJXG.current.length > 0) {
          deleteControls();
        }
        board.updateRenderer();
        return <><a name={id} /></>
      }

      if (segmentsJXG.current.length === 0) {
        createControls();

        previousNumberOfPoints.current = SVs.numericalThroughPoints.length;
        previousVectorControlDirections.current = [...SVs.vectorControlDirections];

        board.updateRenderer();
        return <><a name={id} /></>
      }

      // add or delete segments and points if number changed
      if (SVs.numericalThroughPoints.length > previousNumberOfPoints.current) {
        // add new segments and point

        let iPreviousLast = previousNumberOfPoints.current - 1;

        let attributesForNewThroughPoints = Object.assign({}, throughPointAttributes.current)
        if (throughPointsJXG.current[iPreviousLast].visProp.fillcolor
          === throughPointAlwaysVisible.current.fillcolor
        ) {
          Object.assign(attributesForNewThroughPoints, throughPointAlwaysVisible.current)
        }

        for (let i = previousNumberOfPoints.current; i < SVs.numericalThroughPoints.length; i++) {

          // add point and its controls
          let tp = board.create('point', [...SVs.numericalThroughPoints[i]], attributesForNewThroughPoints);
          throughPointsJXG.current.push(tp);
          let cp1 = board.create('point', [...SVs.numericalControlPoints[i][0]], controlPointAttributes.current);
          let cp2 = board.create('point', [...SVs.numericalControlPoints[i][1]], controlPointAttributes.current);
          controlPointsJXG.current.push([cp1, cp2]);
          let seg1 = board.create('segment', [tp, cp1], segmentAttributes.current);
          let seg2 = board.create('segment', [tp, cp2], segmentAttributes.current);
          segmentsJXG.current.push([seg1, seg2]);

          cp1.visProp.visible = false;
          seg1.visProp.visible = false;
          cp2.visProp.visible = false;
          seg2.visProp.visible = false;


          tp.on('drag', e => dragThroughPoint(i));
          tp.on('down', e => downThroughPoint(i, e));
          tp.on('up', e => upThroughPoint(i));
          cp1.on('drag', e => dragControlPoint(i, 0));
          cp1.on('down', downOther);
          cp1.on('up', e => upControlPoint(i, 0));
          cp2.on('drag', e => dragControlPoint(i, 1));
          cp2.on('down', downOther);
          cp2.on('up', e => upControlPoint(i, 1));
          seg1.on('down', downOther);
          seg2.on('down', downOther);

        }

        if (vectorControlsVisible.current[iPreviousLast]) {
          // since added new point on one side of previous last point
          // (at least if not extrapolating)
          // refresh visibility to add extra handle
          makeVectorControlVisible(iPreviousLast);
        }
      } else if (SVs.numericalThroughPoints.length < previousNumberOfPoints.current) {
        // delete old segments and points

        for (let i = previousNumberOfPoints.current - 1; i >= SVs.numericalThroughPoints.length; i--) {

          segmentsJXG.current[i][0].off('down')
          segmentsJXG.current[i][1].off('down')
          board.removeObject(segmentsJXG.current[i][0])
          board.removeObject(segmentsJXG.current[i][1]);
          segmentsJXG.current.pop();

          controlPointsJXG.current[i][0].off('drag')
          controlPointsJXG.current[i][0].off('down')
          controlPointsJXG.current[i][0].off('up')
          controlPointsJXG.current[i][1].off('drag')
          controlPointsJXG.current[i][1].off('down')
          controlPointsJXG.current[i][1].off('up')
          board.removeObject(controlPointsJXG.current[i][0])
          board.removeObject(controlPointsJXG.current[i][1]);
          controlPointsJXG.current.pop();


          let tp = throughPointsJXG.current.pop();
          tp.off('drag')
          tp.off('down')
          tp.off('up')
          board.removeObject(tp);
        }

        let iNewLast = SVs.numericalThroughPoints.length - 1
        if (vectorControlsVisible.current[iNewLast]) {
          makeVectorControlVisible(iNewLast);
        }

      }

      // move old points and modify attributes, if needed
      let nOld = Math.min(SVs.numericalThroughPoints.length, previousNumberOfPoints.current);

      for (let i = 0; i < nOld; i++) {

        if (previousVectorControlDirections.current[i] !== SVs.vectorControlDirections[i]
          && vectorControlsVisible.current[i]
        ) {
          // refresh visibility
          makeVectorControlVisible(i);
        }

        if (layerChanged) {
          throughPointsJXG.current[i].setAttribute({ layer: curveLayer + 2 });
          segmentsJXG.current[i][0].setAttribute({ layer: curveLayer + 2 });
          controlPointsJXG.current[i][0].setAttribute({ layer: curveLayer + 3 });
          segmentsJXG.current[i][1].setAttribute({ layer: curveLayer + 2 });
          controlPointsJXG.current[i][1].setAttribute({ layer: curveLayer + 3 });
        }

        throughPointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalThroughPoints[i]]);
        throughPointsJXG.current[i].needsUpdate = true;
        throughPointsJXG.current[i].update();
        controlPointsJXG.current[i][0].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalControlPoints[i][0]]);
        controlPointsJXG.current[i][0].needsUpdate = true;
        controlPointsJXG.current[i][0].update();
        segmentsJXG.current[i][0].needsUpdate = true;
        segmentsJXG.current[i][0].update();
        controlPointsJXG.current[i][1].coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalControlPoints[i][1]]);
        controlPointsJXG.current[i][1].needsUpdate = true;
        controlPointsJXG.current[i][1].update();
        segmentsJXG.current[i][1].needsUpdate = true;
        segmentsJXG.current[i][1].update();
      }

      for (let i = 0; i < SVs.numericalThroughPoints.length; i++) {
        throughPointsJXG.current[i].visProp["visible"] = !SVs.hidden;
        throughPointsJXG.current[i].visPropCalc["visible"] = !SVs.hidden;
      }


      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let ind = sourceOfUpdate.sourceInformation[name].throughPointMoved;
        if (ind !== undefined) {
          board.updateInfobox(throughPointsJXG.current[ind]);
        } else {
          ind = sourceOfUpdate.sourceInformation[name].controlVectorMoved;
          if (ind !== undefined) {
            board.updateInfobox(controlPointsJXG.current[ind[0]][ind[1]]);
          }
        }
      }

      previousNumberOfPoints.current = SVs.numericalThroughPoints.length;
      previousVectorControlDirections.current = [...SVs.vectorControlDirections];

      board.updateRenderer();
    }
  }


  if (SVs.hidden) {
    return null;
  }

  // don't think we want to return anything if not in board
  return <><a name={id} /></>

})

function styleToDash(style, dash) {
  if (style === "dashed" || dash) {
    return 2;
  } else if (style === "solid") {
    return 0;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}


