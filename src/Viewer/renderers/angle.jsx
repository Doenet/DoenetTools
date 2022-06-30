import React, { useEffect, useContext, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import me from 'math-expressions';
import { MathJax } from 'better-react-mathjax';

export default React.memo(function Angle(props) {
  let { name, SVs } = useDoenetRender(props);

  const board = useContext(BoardContext);

  let point1JXG = useRef(null)
  let point2JXG = useRef(null)
  let point3JXG = useRef(null)
  let angleJXG = useRef(null)
  let previousWithLabel = useRef(null);


  useEffect(() => {
    //On unmount
    return () => {
      deleteGraphicalObject();
    }
  }, [])

  function deleteGraphicalObject() {
    // if angle is defined
    if (point1JXG.current !== null) {
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
      return null;
    }

    let angleColor = getComputedStyle(document.documentElement).getPropertyValue("--solidLightBlue");

    let label = SVs.label;
    if (SVs.labelIsLatex) {
      label = "\\(" + label + "\\)";
    }

    var jsxAngleAttributes = {
      name: label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: true,//SVs.draggable !== true,
      layer: 10 * SVs.layer + 7,
      radius: SVs.numericalRadius,
      fillColor: angleColor,
      strokeColor: angleColor,
      highlight: false
    };

    if (SVs.labelIsLatex) {
      jsxAngleAttributes.label = { useMathJax: true };
    }

    previousWithLabel.current = SVs.showLabel && SVs.label !== "";

    let through;

    if (SVs.swapPointOrder) {
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

  if (board) {
    if (angleJXG.current === null) {
      angleJXG.current = createAngleJXG();
    } else if (SVs.numericalPoints.length !== 3 ||
      SVs.numericalPoints.some(x => x.length !== 2) ||
      !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)) {

      deleteGraphicalObject();

    } else {
      //update

      let through;
      if (SVs.swapPointOrder) {
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


      let label = SVs.label;
      if (SVs.labelIsLatex) {
        label = "\\(" + label + "\\)";
      }
      angleJXG.current.name = label;
  
      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        angleJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      angleJXG.current.needsUpdate = true;
      angleJXG.current.update();

      if (angleJXG.current.hasLabel) {
        angleJXG.current.label.needsUpdate = true;
        angleJXG.current.label.update();
      }
      board.updateRenderer();

    }

    return <><a name={name} /></>
  }



  let mathJaxify = "\\(" + SVs.latexForRenderer + "\\)";

  return <><a name={name} /><span id={name}><MathJax hideUntilTypeset={"first"} inline dynamic >{mathJaxify}</MathJax></span></>
})


