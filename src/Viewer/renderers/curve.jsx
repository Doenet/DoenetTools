import React, { useContext, useEffect, useRef, useState } from 'react';
import { createFunctionFromDefinition } from '../../Core/utils/function';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import me from 'math-expressions';


export default function Curve(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  const board = useContext(BoardContext);
  const [curveJXG, setCurveJXG] = useState({})


  // TODO: deal with children

  // this.doenetPropsForChildren = { board: board };
  // this.initializeChildren();

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
  let throughPointsJXG = useRef(null);
  let controlPointsJXG = useRef(null);
  let segmentsJXG = useRef(null);
  let vectorControlsVisible = useRef(null);
  let hitObject = useRef(null);
  let vectorControlDirections = useRef(null);
  let previousVectorControlDirections = useRef(null);

  vectorControlDirections.current = SVs.vectorControlDirections;

  let lastThroughPointPositionsFromCore = useRef(null);
  lastThroughPointPositionsFromCore.current = SVs.numericalThroughPoints;


  useEffect(() => {
    if (board) {

      //things to be passed to JSXGraph as attributes
      var curveAttributes = {
        name: SVs.label,
        visible: !SVs.hidden,
        withLabel: SVs.showLabel && SVs.label !== "",
        fixed: true, //SVs.draggable !== true,
        layer: 10 * SVs.layer + 5,
        strokeColor: SVs.selectedStyle.lineColor,
        highlightStrokeColor: SVs.selectedStyle.lineColor,
        strokeWidth: SVs.selectedStyle.lineWidth,
        dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed),
      };


      if (SVs.showLabel && SVs.label !== "") {
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
          position = 'llft'
          offset = [5, 10];
          anchorx = "left";
        } else if (SVs.labelPosition === "top") {
          position = 'top'
          offset = [0, -10];
          anchorx = "left";
        } else if (SVs.labelPosition === "bottom") {
          position = 'bot'
          offset = [0, 10];
          anchorx = "left";
        } else if (SVs.labelPosition === "left") {
          position = 'lft'
          offset = [10, 0];
          anchorx = "left";
        } else {
          // right
          position = 'rt'
          offset = [-10, 0];
          anchorx = "right";
        }

        curveAttributes.label = {
          offset,
          position,
          anchorx,
        }
      }


      if (!SVs.draggable || SVs.fixed) {
        curveAttributes.highlightStrokeWidth = SVs.selectedStyle.lineWidth;
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
        let fs = createFunctionFromDefinition(SVs.fDefinitions[0]);
        newCurveJXG = board.create('curve', [
          fs[0], fs[1],
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

        if (!updateSinceDown.current && draggedControlPoint.current === null && draggedThroughPoint.current === null
          && SVs.switchable && !SVs.fixed
        ) {
          props.callAction({
            componentName: name,
            actionName: "switchCurve"
          })
        }
      })

      if (SVs.curveType === "bezier") {

        board.on('up', upBoard);
        newCurveJXG.on('down', downOther);

        segmentAttributes.current = {
          visible: false,
          withLabel: false,
          fixed: true,
          strokeColor: 'lightgray',
          highlightStrokeColor: 'lightgray',
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
          highlightFillColor: 'lightgray',
          highlightStrokeColor: 'lightgray',
          strokeWidth: 1,
          highlightStrokeWidth: 1,
          layer: 10 * SVs.layer + 7,
          size: 3,
        };
        throughPointAlwaysVisible.current = {
          fillcolor: 'lightgray',
          strokecolor: 'lightgray',
        }
        throughPointHoverVisible.current = {
          fillcolor: 'none',
          strokecolor: 'none',
        }

        controlPointAttributes.current = {
          visible: false,
          withLabel: false,
          fixed: false,
          fillColor: 'gray',
          strokeColor: 'gray',
          highlightFillColor: 'gray',
          highlightStrokeColor: 'gray',
          strokeWidth: 1,
          highlightStrokeWidth: 1,
          layer: 10 * SVs.layer + 8,
          size: 2,
        };

        if (SVs.draggable && !SVs.fixed) {


          createControls();

          if (SVs.bezierControlsAlwaysVisible) {
            makeThroughPointsAlwaysVisible()
            showAllControls();
          }

          board.updateRenderer();

          previousNumberOfPoints.current = SVs.numericalThroughPoints.length;
          previousVectorControlDirections.current = [...SVs.vectorControlDirections];
        }

      } else {
        newCurveJXG.on('down', function (e) {
          updateSinceDown.current = false;
        });
      }
      setCurveJXG(newCurveJXG)

    } else {
      // not in board
      // do anything here?
    }

    //On unmount
    return () => {
      // if point is defined
      if (Object.keys(curveJXG).length !== 0) {


        board.off('up', upBoard);
        curveJXG.off('down');
        board.removeObject(curveJXG);
        setCurveJXG({})

        deleteControls();

      }

    }
  }, [])


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
      tp.on('drag', e => dragThroughPoint(i, true, e));
      tp.on('down', e => downThroughPoint(i, e));
      tp.on('up', e => dragThroughPoint(i, false, e));
      cp1.on('drag', e => dragControlPoint(i, 0, true, e));
      cp2.on('drag', e => dragControlPoint(i, 1, true, e));
      cp1.on('down', downOther);
      cp2.on('down', downOther);
      seg1.on('down', downOther);
      seg1.on('down', downOther);
      cp1.on('up', e => dragControlPoint(i, 0, false, e));
      cp2.on('up', e => dragControlPoint(i, 1, false, e));
    }

    vectorControlsVisible.current = [];

  }


  function deleteControls() {
    if (segmentsJXG.current) {
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

  function dragThroughPoint(i, transient) {
    if (transient) {
      draggedThroughPoint.current = i;
    } else if (draggedThroughPoint.current !== i) {
      return;
    }

    let tpcoords = [throughPointsJXG.current[i].X(), throughPointsJXG.current[i].Y()];
    props.callAction({
      actionName: "moveThroughPoint",
      componentName: name,
      args: {
        throughPoint: tpcoords,
        throughPointInd: i,
        transient,
        skippable: transient,
      }
    })

    throughPointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, lastThroughPointPositionsFromCore.current[i]);
    board.updateInfobox(throughPointsJXG.current[i]);


  }

  function dragControlPoint(point, i, transient) {
    // console.log(`drag control point ${point}, ${i}`)

    if (transient) {
      draggedControlPoint.current = point + "_" + i;
    } else if (draggedControlPoint.current !== point + "_" + i) {
      return;
    }

    props.callAction({
      actionName: "moveControlVector",
      componentName: name,
      args: {
        controlVector: [controlPointsJXG.current[point][i].X() - throughPointsJXG.current[point].X(),
        controlPointsJXG.current[point][i].Y() - throughPointsJXG.current[point].Y()],
        controlVectorInds: [point, i],
        transient,
        skippable: transient,
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



  if (Object.keys(curveJXG).length !== 0) {

    // TODO: where put this check?

    //   if (SVs.curveType === "bezier" &&
    //   SVs.numericalThroughPoints.length < 2
    // ) {
    //   return;
    // }

    // if (SVs.curveType === "bezier" && SVs.numericalThroughPoints.length < 2) {
    //   this.deleteGraphicalObject();
    //   return;
    // }


    if (
      previousCurveType.current !== SVs.curveType ||
      (
        previousCurveType.current === "function" &&
        previousFlipFunction.current !== SVs.flipFunction
      )
    ) {

      throw Error("how do we recreate?")

      // redraw entire curve curve type changed or if flip of function changed
      this.deleteGraphicalObject();
      let result = this.createGraphicalObject();

      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[name] = curveJXG;
      }

      return result;
    }

    if (board.updateQuality === board.BOARD_QUALITY_LOW) {
      board.itemsRenderedLowQuality[name] = curveJXG;
    }

    updateSinceDown.current = true;

    let visible = !SVs.hidden;

    curveJXG.name = SVs.label;

    curveJXG.visProp["visible"] = visible;
    curveJXG.visPropCalc["visible"] = visible;


    if (curveJXG.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
      curveJXG.visProp.strokecolor = SVs.selectedStyle.lineColor;
      curveJXG.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
    }
    let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
    if (curveJXG.visProp.dash !== newDash) {
      curveJXG.visProp.dash = newDash;
    }
    if (curveJXG.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
      curveJXG.visProp.strokewidth = SVs.selectedStyle.lineWidth
    }


    if (SVs.curveType === "parameterization") {
      let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
      let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);

      curveJXG.X = f1;
      curveJXG.Y = f2;
      curveJXG.minX = () => SVs.parMin;
      curveJXG.maxX = () => SVs.parMax;

    } else if (SVs.curveType === "bezier") {
      let fs = createFunctionFromDefinition(SVs.fDefinitions[0]);
      curveJXG.X = fs[0];
      curveJXG.Y = fs[1];
      curveJXG.minX = () => SVs.parMin;
      curveJXG.maxX = () => SVs.parMax;

    } else {
      let f = createFunctionFromDefinition(SVs.fDefinitions[0]);
      if (SVs.flipFunction) {
        curveJXG.X = f;
        let ymin = SVs.graphYmin;
        let ymax = SVs.graphYmax;
        let minForF = Math.max(ymin - (ymax - ymin) * 0.1, SVs.parMin);
        let maxForF = Math.min(ymax + (ymax - ymin) * 0.1, SVs.parMax);
        curveJXG.minX = () => minForF;
        curveJXG.maxX = () => maxForF;
      } else {
        curveJXG.Y = f;
        let xmin = SVs.graphXmin;
        let xmax = SVs.graphXmax;
        let minForF = Math.max(xmin - (xmax - xmin) * 0.1, SVs.parMin);
        let maxForF = Math.min(xmax + (xmax - xmin) * 0.1, SVs.parMax);
        curveJXG.minX = () => minForF;
        curveJXG.maxX = () => maxForF;
      }
    }

    curveJXG.needsUpdate = true;
    curveJXG.updateCurve();
    if (curveJXG.hasLabel) {
      curveJXG.label.needsUpdate = true;
      curveJXG.label.visPropCalc.visible = SVs.showLabel && SVs.label !== "";
      curveJXG.label.update();
    }


    if (SVs.curveType !== "bezier") {
      board.updateRenderer();
      return <><a name={name} /></>
    }


    if (!SVs.draggable || SVs.fixed) {
      if (segmentsJXG.current) {
        deleteControls();
      }
      board.updateRenderer();
      return <><a name={name} /></>
    }

    if (!segmentsJXG.current) {
      createControls();

      previousNumberOfPoints.current = SVs.numericalThroughPoints.length;
      previousVectorControlDirections.current = [...SVs.vectorControlDirections];

      board.updateRenderer();
      return <><a name={name} /></>
    }

    // add or delete segments and points if number changed
    if (SVs.numericalThroughPoints.length > previousNumberOfPoints.current) {

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


        tp.on('drag', e => dragThroughPoint(i, true, e));
        tp.on('down', e => downThroughPoint(i, e));
        tp.on('up', e => dragThroughPoint(i, false, e));
        cp1.on('drag', e => dragControlPoint(i, 0, true, e));
        cp1.on('down', downOther);
        cp1.on('up', e => dragControlPoint(i, 0, false, e));
        cp2.on('drag', e => dragControlPoint(i, 1, true, e));
        cp2.on('down', downOther);
        cp2.on('up', e => dragControlPoint(i, 1, false, e));
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

    // move old points
    let nOld = Math.min(SVs.numericalThroughPoints.length, previousNumberOfPoints.current);

    for (let i = 0; i < nOld; i++) {

      if (previousVectorControlDirections.current[i] !== SVs.vectorControlDirections[i]
        && vectorControlsVisible.current[i]
      ) {
        // refresh visibility
        makeVectorControlVisible(i);
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
      let ind = sourceOfUpdate.sourceInformation.throughPointMoved;
      if (ind !== undefined) {
        board.updateInfobox(throughPointsJXG.current[ind]);
      } else {
        ind = sourceOfUpdate.sourceInformation.controlVectorMoved;
        if (ind !== undefined) {
          board.updateInfobox(controlPointsJXG.current[ind[0]][ind[1]]);
        }
      }
    }

    previousNumberOfPoints.current = SVs.numericalThroughPoints.length;
    previousVectorControlDirections.current = [...SVs.vectorControlDirections];

    board.updateRenderer();
  }


  if (SVs.hidden) {
    return null;
  }

  // don't think we want to return anything if not in board
  return <><a name={name} /></>

}

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


