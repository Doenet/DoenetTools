import React, { useEffect, useContext, useRef } from "react";
import useDoenetRender from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import me from "math-expressions";
import { MathJax } from "better-react-mathjax";

export default React.memo(function Angle(props) {
  let { name, id, SVs } = useDoenetRender(props);

  const board = useContext(BoardContext);

  let point1JXG = useRef(null);
  let point2JXG = useRef(null);
  let point3JXG = useRef(null);
  let angleJXG = useRef(null);
  let previousWithLabel = useRef(null);

  useEffect(() => {
    //On unmount
    return () => {
      deleteGraphicalObject();
    };
  }, []);

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
    if (
      SVs.numericalPoints.length !== 3 ||
      SVs.numericalPoints.some((x) => x.length !== 2) ||
      !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)
    ) {
      return null;
    }

    var jsxAngleAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.labelForGraph !== "",
      fixed: true,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      radius: SVs.numericalRadius,
      fillColor: SVs.selectedStyle.fillColor,
      strokeColor: SVs.selectedStyle.lineColor,
      highlight: false,
      orthoType: SVs.emphasizeRightAngle ? "square" : "sector",
    };

    jsxAngleAttributes.label = {
      highlight: false,
    };
    if (SVs.labelHasLatex) {
      jsxAngleAttributes.label.useMathJax = true;
    }

    previousWithLabel.current = SVs.labelForGraph !== "";

    let through;

    if (SVs.swapPointOrder) {
      through = [
        [...SVs.numericalPoints[2]],
        [...SVs.numericalPoints[1]],
        [...SVs.numericalPoints[0]],
      ];
    } else {
      through = [
        [...SVs.numericalPoints[0]],
        [...SVs.numericalPoints[1]],
        [...SVs.numericalPoints[2]],
      ];
    }

    let jsxPointAttributes = {
      visible: false,
    };

    // create invisible points at through
    point1JXG.current = board.create("point", through[0], jsxPointAttributes);
    point2JXG.current = board.create("point", through[1], jsxPointAttributes);
    point3JXG.current = board.create("point", through[2], jsxPointAttributes);

    return board.create(
      "angle",
      [point1JXG.current, point2JXG.current, point3JXG.current],
      jsxAngleAttributes,
    );
  }

  if (SVs.hidden) {
    return null;
  }

  if (board) {
    if (angleJXG.current === null) {
      angleJXG.current = createAngleJXG();
    } else if (
      SVs.numericalPoints.length !== 3 ||
      SVs.numericalPoints.some((x) => x.length !== 2) ||
      !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)
    ) {
      deleteGraphicalObject();
    } else {
      //update

      let through;
      if (SVs.swapPointOrder) {
        through = [
          [...SVs.numericalPoints[2]],
          [...SVs.numericalPoints[1]],
          [...SVs.numericalPoints[0]],
        ];
      } else {
        through = [
          [...SVs.numericalPoints[0]],
          [...SVs.numericalPoints[1]],
          [...SVs.numericalPoints[2]],
        ];
      }

      // in JSXgraph, point 1 and point 2 are switched
      angleJXG.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        through[0],
      );
      angleJXG.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        through[1],
      );
      angleJXG.current.point3.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        through[2],
      );

      angleJXG.current.setAttribute({
        radius: SVs.numericalRadius,
        visible: !SVs.hidden,
      });

      let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = angleJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        angleJXG.current.setAttribute({ layer });
      }

      if (angleJXG.current.visProp.fillcolor !== SVs.selectedStyle.fillColor) {
        angleJXG.current.visProp.fillcolor = SVs.selectedStyle.fillColor;
      }
      if (
        angleJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor
      ) {
        angleJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
      }

      angleJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        angleJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      angleJXG.current.visProp.orthotype = SVs.emphasizeRightAngle
        ? "square"
        : "sector";

      angleJXG.current.needsUpdate = true;
      angleJXG.current.update();

      if (angleJXG.current.hasLabel) {
        angleJXG.current.label.needsUpdate = true;
        angleJXG.current.label.update();
      }
      board.updateRenderer();
    }

    return (
      <>
        <a name={id} />
      </>
    );
  }

  let mathJaxify = "\\(" + SVs.latexForRenderer + "\\)";

  return (
    <>
      <a name={id} />
      <span id={id}>
        <MathJax hideUntilTypeset={"first"} inline dynamic>
          {mathJaxify}
        </MathJax>
      </span>
    </>
  );
});
