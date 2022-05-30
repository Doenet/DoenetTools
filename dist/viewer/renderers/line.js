import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
export default React.memo(function Line(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props);
  Line.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let lineJXG = useRef({});
  let pointerAtDown = useRef(false);
  let pointsAtDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let pointCoords = useRef(null);
  let lastPositionsFromCore = useRef(null);
  lastPositionsFromCore.current = SVs.numericalPoints;
  useEffect(() => {
    return () => {
      if (Object.keys(lineJXG.current).length !== 0) {
        deleteLineJXG();
      }
    };
  }, []);
  function createLineJXG() {
    if (SVs.numericalPoints?.length !== 2 || SVs.numericalPoints.some((x) => x.length !== 2)) {
      lineJXG.current = {};
      return;
    }
    var jsxLineAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: !SVs.draggable || SVs.fixed,
      layer: 10 * SVs.layer + 7,
      strokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed)
    };
    jsxLineAttributes.label = {};
    if (SVs.applyStyleToLabel) {
      jsxLineAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxLineAttributes.label.strokeColor = "#000000";
    }
    let through = [
      [...SVs.numericalPoints[0]],
      [...SVs.numericalPoints[1]]
    ];
    let newLineJXG = board.create("line", through, jsxLineAttributes);
    newLineJXG.on("drag", function(e) {
      dragged.current = true;
      calculatePointPositions(e);
      callAction({
        action: actions.moveLine,
        args: {
          point1coords: pointCoords.current[0],
          point2coords: pointCoords.current[1],
          transient: true,
          skippable: true
        }
      });
      newLineJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[0]);
      newLineJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[1]);
    });
    newLineJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveLine,
          args: {
            point1coords: pointCoords.current[0],
            point2coords: pointCoords.current[1]
          }
        });
      } else if (SVs.switchable && !SVs.fixed) {
        callAction({
          action: actions.switchLine
        });
      }
    });
    newLineJXG.on("down", function(e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...newLineJXG.point1.coords.scrCoords],
        [...newLineJXG.point2.coords.scrCoords]
      ];
    });
    previousWithLabel.current = SVs.showLabel && SVs.label !== "";
    lineJXG.current = newLineJXG;
  }
  function calculatePointPositions(e) {
    var o = board.origin.scrCoords;
    pointCoords.current = [];
    for (let i = 0; i < 2; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      let calculatedY = (o[2] - (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) / board.unitY;
      pointCoords.current.push([calculatedX, calculatedY]);
    }
  }
  function deleteLineJXG() {
    lineJXG.current.off("drag");
    lineJXG.current.off("down");
    lineJXG.current.off("up");
    board.removeObject(lineJXG.current);
    lineJXG.current = {};
  }
  if (board) {
    if (Object.keys(lineJXG.current).length === 0) {
      createLineJXG();
    } else if (SVs.numericalPoints?.length !== 2 || SVs.numericalPoints.some((x) => x.length !== 2)) {
      deleteLineJXG();
    } else {
      let validCoords = true;
      for (let coords of [SVs.numericalPoints[0], SVs.numericalPoints[1]]) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }
      lineJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalPoints[0]);
      lineJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalPoints[1]);
      let visible = !SVs.hidden;
      if (validCoords) {
        let actuallyChangedVisibility = lineJXG.current.visProp["visible"] !== visible;
        lineJXG.current.visProp["visible"] = visible;
        lineJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          lineJXG.current.setAttribute({visible});
        }
      } else {
        lineJXG.current.visProp["visible"] = false;
        lineJXG.current.visPropCalc["visible"] = false;
      }
      if (SVs.draggable && !SVs.fixed) {
        lineJXG.current.visProp.fixed = false;
      } else {
        lineJXG.current.visProp.fixed = true;
      }
      if (lineJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        lineJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        lineJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
      if (lineJXG.current.visProp.dash !== newDash) {
        lineJXG.current.visProp.dash = newDash;
      }
      if (lineJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        lineJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth;
      }
      lineJXG.current.name = SVs.label;
      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        lineJXG.current.setAttribute({withlabel});
        previousWithLabel.current = withlabel;
      }
      lineJXG.current.needsUpdate = true;
      lineJXG.current.update();
      if (lineJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          lineJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor;
        } else {
          lineJXG.current.label.visProp.strokecolor = "#000000";
        }
        lineJXG.current.label.needsUpdate = true;
        lineJXG.current.label.update();
      }
      board.updateRenderer();
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name
    }));
  }
  if (SVs.hidden) {
    return null;
  }
  let mathJaxify = "\\(" + me.fromAst(SVs.equation).toLatex() + "\\)";
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    id: name
  }, /* @__PURE__ */ React.createElement(MathJax, {
    hideUntilTypeset: "first",
    inline: true,
    dynamic: true
  }, mathJaxify)));
});
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
