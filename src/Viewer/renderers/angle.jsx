import React, { useEffect, useContext, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';

export default function Angle(props) {
  let { name, SVs, children } = useDoenetRender(props);

  const board = useContext(BoardContext);
  console.log("SVs.numericalPoints",SVs.numericalPoints)

  let point1JXG = useRef(null)
  let point2JXG = useRef(null)
  let point3JXG = useRef(null)
  let angleJXG = useRef(null)
  let previousWithLabel = SVs.showLabel && SVs.label !== "";

  useEffect(() => {
    if (!board && window.MathJax) {
      window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  })

  useEffect(() => {
    //On unmount
    return () => {
      deleteGraphicalObject();
    }
  }, [])

  function deleteGraphicalObject(){
    // if point is defined
      if (pointJXG.current !== null) {
        board.removeObject(angleJXG.current);
        angleJXG.current = null;
        board.removeObject(point1JXG.current);
        point1JXG.current = null;
        board.removeObject(point2JXG.current);
        point2JXG.current = null;
        board.removeObject(point3JXG.current);
        point3JXG.current = null;
      }

  }

  function createAngleJXG() {

    if (SVs.numericalPoints.length !== 3 ||
      SVs.numericalPoints.some(x => x.length !== 2) ||
      !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)) {
      return;
    }

    let angleColor = "#FF7F00";

    var jsxAngleAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: true,//SVs.draggable !== true,
      layer: 10 * SVs.layer + 7,
      radius: SVs.numericalRadius,
      fillColor: angleColor,
      strokeColor: angleColor,
      highlightFillColor: angleColor,
      highlightStrokeColor: angleColor,
    };


    let through;

    if (SVs.renderAsAcuteAngle && (SVs.degrees.evaluate_to_constant() % 360) > 180) {
      through = [
        [...SVs.numericalPoints[2]],
        [...SVs.numericalPoints[1]],
        [...SVs.numericalPoints[0]]
      ];
    } else {
      through = [
        [...SVs.numericalPoints[0]],
        [...SVs.numericalPoints[1]],
        [...SVs.numericalPoints[2]]
      ];
    }


    let jsxPointAttributes = {
      visible: false,
    };

    // create invisible points at through
    point1JXG.current = board.create('point', through[0], jsxPointAttributes);
    point2JXG.current = board.create('point', through[1], jsxPointAttributes);
    point3JXG.current = board.create('point', through[2], jsxPointAttributes);

    return board.create('angle', [point1JXG.current, point2JXG.current, point3JXG.current], jsxAngleAttributes);

  }

  if (SVs.hidden) {
    return null;
  }

  if (board){
    if (angleJXG.current === null) {
      angleJXG.current = createAngleJXG();
    } else {
      //update
      if (SVs.numericalPoints.length !== 3 ||
        SVs.numericalPoints.some(x => x.length !== 2) ||
        !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)) {
        deleteGraphicalObject();
      }
  
      let through;
      if (SVs.renderAsAcuteAngle && (SVs.degrees.evaluate_to_constant() % 360) > 180) {
        through = [
          [...SVs.numericalPoints[2]],
          [...SVs.numericalPoints[1]],
          [...SVs.numericalPoints[0]]
        ];
      } else {
        through = [
          [...SVs.numericalPoints[0]],
          [...SVs.numericalPoints[1]],
          [...SVs.numericalPoints[2]]
        ];
      }
  
      // in JSXgraph, point 1 and point 2 are switched
      angleJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, through[0]);
      angleJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, through[1]);
      angleJXG.current.point3.coords.setCoordinates(JXG.COORDS_BY_USER, through[2]);
  
      angleJXG.current.setAttribute({ radius: SVs.numericalRadius, visible: !SVs.hidden });
  
      angleJXG.current.name = SVs.label;
  
      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel) {
        angleJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel = withlabel;
      }
  
      angleJXG.current.needsUpdate = true;
      angleJXG.current.update();
  
      if (angleJXG.current.hasLabel) {
        angleJXG.current.label.needsUpdate = true;
        angleJXG.current.label.update();
      }
      board.updateRenderer();
  
    }


    return <><a name={name} />{children}</>
  }
  
  let mathJaxify;
    if (SVs.inDegrees) {
      mathJaxify = "\\(" + SVs.degrees + "^\\circ \\)";
    } else {
      mathJaxify = "\\(" + SVs.radians + "\\)";
    }

    return <><a name={name} /><span id={name}>{mathJaxify}</span></>
}


