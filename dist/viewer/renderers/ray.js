import React, {useContext, useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default React.memo(function Ray(props) {
  let {name, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  Ray.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let rayJXG = useRef(null);
  let pointerAtDown = useRef(false);
  let pointsAtDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(false);
  let pointCoords = useRef(null);
  let lastEndpointFromCore = useRef(null);
  let lastThroughpointFromCore = useRef(null);
  lastEndpointFromCore.current = SVs.numericalEndpoint;
  lastThroughpointFromCore.current = SVs.numericalThroughpoint;
  useEffect(() => {
    return () => {
      if (Object.keys(rayJXG.current).length !== 0) {
        deleteRayJXG();
      }
    };
  }, []);
  function createRayJXG() {
    if (SVs.numericalEndpoint.length !== 2 || SVs.numericalThroughpoint.length !== 2) {
      rayJXG.current = null;
      return;
    }
    let fixed = !SVs.draggable || SVs.fixed;
    let label = SVs.label;
    if (SVs.labelIsLatex) {
      label = "\\(" + label + "\\)";
    }
    var jsxRayAttributes = {
      name: label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
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
      straightFirst: false
    };
    if (SVs.labelIsLatex) {
      jsxRayAttributes.label = {useMathJax: true};
    } else {
      jsxRayAttributes.label = {};
    }
    if (SVs.applyStyleToLabel) {
      jsxRayAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxRayAttributes.label.strokeColor = "#000000";
    }
    let through = [
      [...SVs.numericalEndpoint],
      [...SVs.numericalThroughpoint]
    ];
    let newRayJXG = board.create("line", through, jsxRayAttributes);
    newRayJXG.on("drag", function(e) {
      dragged.current = true;
      pointCoords.current = calculatePointPositions(e);
      callAction({
        action: actions.moveRay,
        args: {
          endpointcoords: pointCoords.current[0],
          throughcoords: pointCoords.current[1],
          transient: true,
          skippable: true
        }
      });
      rayJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastEndpointFromCore.current);
      rayJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastThroughpointFromCore.current);
    });
    newRayJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveRay,
          args: {
            endpointcoords: pointCoords.current[0],
            throughcoords: pointCoords.current[1]
          }
        });
      }
    });
    newRayJXG.on("down", function(e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...newRayJXG.point1.coords.scrCoords],
        [...newRayJXG.point2.coords.scrCoords]
      ];
    });
    previousWithLabel.current = SVs.showLabel && SVs.label !== "";
    rayJXG.current = newRayJXG;
  }
  function deleteRayJXG() {
    rayJXG.current.off("drag");
    rayJXG.current.off("down");
    rayJXG.current.off("up");
    board.removeObject(rayJXG.current);
    rayJXG.current = null;
  }
  function calculatePointPositions(e) {
    var o = board.origin.scrCoords;
    let pointCoords2 = [];
    for (let i = 0; i < 2; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      let calculatedY = (o[2] - (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) / board.unitY;
      pointCoords2.push([calculatedX, calculatedY]);
    }
    return pointCoords2;
  }
  if (board) {
    if (rayJXG.current === null) {
      createRayJXG();
    } else if (SVs.numericalEndpoint.length !== 2 || SVs.numericalThroughpoint.length !== 2) {
      deleteRayJXG();
    } else {
      let validCoords = true;
      for (let coords of [SVs.numericalEndpoint, SVs.numericalThroughpoint]) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }
      rayJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoint);
      rayJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalThroughpoint);
      let visible = !SVs.hidden;
      if (validCoords) {
        let actuallyChangedVisibility = rayJXG.current.visProp["visible"] !== visible;
        rayJXG.current.visProp["visible"] = visible;
        rayJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          rayJXG.current.setAttribute({visible});
        }
      } else {
        rayJXG.current.visProp["visible"] = false;
        rayJXG.current.visPropCalc["visible"] = false;
      }
      let fixed = !SVs.draggable || SVs.fixed;
      rayJXG.current.visProp.fixed = fixed;
      rayJXG.current.visProp.highlight = !fixed;
      let layer = 10 * SVs.layer + 7;
      let layerChanged = rayJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        rayJXG.current.setAttribute({layer});
      }
      if (rayJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        rayJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        rayJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      if (rayJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        rayJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth;
        rayJXG.current.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth;
      }
      if (rayJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        rayJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
        rayJXG.current.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
      if (rayJXG.current.visProp.dash !== newDash) {
        rayJXG.current.visProp.dash = newDash;
      }
      let label = SVs.label;
      if (SVs.labelIsLatex) {
        label = "\\(" + label + "\\)";
      }
      rayJXG.current.name = label;
      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        rayJXG.current.setAttribute({withlabel});
        previousWithLabel.current = withlabel;
      }
      rayJXG.current.needsUpdate = true;
      rayJXG.current.update();
      if (rayJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          rayJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor;
        } else {
          rayJXG.current.label.visProp.strokecolor = "#000000";
        }
        rayJXG.current.label.needsUpdate = true;
        rayJXG.current.label.update();
      }
      board.updateRenderer();
    }
  }
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }));
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
