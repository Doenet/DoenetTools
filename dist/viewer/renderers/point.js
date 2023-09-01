import React, {useContext, useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
export default React.memo(function Point(props) {
  let {name, id, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  Point.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let pointJXG = useRef(null);
  let shadowPointJXG = useRef(null);
  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);
  let calculatedX = useRef(null);
  let calculatedY = useRef(null);
  let lastPositionFromCore = useRef(null);
  lastPositionFromCore.current = SVs.numericalXs;
  useEffect(() => {
    return () => {
      if (pointJXG.current !== null) {
        shadowPointJXG.current.off("drag");
        shadowPointJXG.current.off("down");
        shadowPointJXG.current.off("up");
        board.removeObject(pointJXG.current);
        board.removeObject(shadowPointJXG.current);
        pointJXG.current = null;
        shadowPointJXG.current = null;
      }
    };
  }, []);
  function createPointJXG() {
    let fillColor = SVs.open ? "var(--canvas)" : SVs.selectedStyle.markerColor;
    let strokeColor = SVs.open ? SVs.selectedStyle.markerColor : "none";
    let fixed = !SVs.draggable || SVs.fixed;
    let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
    let jsxPointAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withlabel,
      fixed: true,
      layer: 10 * SVs.layer + 9,
      fillColor,
      strokeColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      fillOpacity: SVs.selectedStyle.lineOpacity,
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      highlightStrokeColor: getComputedStyle(document.documentElement).getPropertyValue("--lightBlue"),
      size: normalizeSize(SVs.selectedStyle.markerSize, SVs.selectedStyle.markerStyle),
      face: normalizeStyle(SVs.selectedStyle.markerStyle),
      highlight: !fixed
    };
    if (withlabel) {
      let anchorx, anchory, offset;
      if (SVs.labelPosition === "upperright") {
        offset = [5, 5];
        anchorx = "left";
        anchory = "bottom";
      } else if (SVs.labelPosition === "upperleft") {
        offset = [-5, 5];
        anchorx = "right";
        anchory = "bottom";
      } else if (SVs.labelPosition === "lowerright") {
        offset = [5, -5];
        anchorx = "left";
        anchory = "top";
      } else if (SVs.labelPosition === "lowerleft") {
        offset = [-5, -5];
        anchorx = "right";
        anchory = "top";
      } else if (SVs.labelPosition === "top") {
        offset = [0, 10];
        anchorx = "middle";
        anchory = "bottom";
      } else if (SVs.labelPosition === "bottom") {
        offset = [0, -10];
        anchorx = "middle";
        anchory = "top";
      } else if (SVs.labelPosition === "left") {
        offset = [-10, 0];
        anchorx = "right";
        anchory = "middle";
      } else {
        offset = [10, 0];
        anchorx = "left";
        anchory = "middle";
      }
      jsxPointAttributes.label = {
        offset,
        anchorx,
        anchory,
        highlight: false
      };
      if (SVs.labelHasLatex) {
        jsxPointAttributes.label.useMathJax = true;
      }
      if (SVs.applyStyleToLabel) {
        jsxPointAttributes.label.strokeColor = SVs.selectedStyle.markerColor;
      } else {
        jsxPointAttributes.label.strokeColor = "#000000";
      }
    } else {
      jsxPointAttributes.label = {
        highlight: false
      };
      if (SVs.labelHasLatex) {
        jsxPointAttributes.label.useMathJax = true;
      }
    }
    if (fixed) {
      jsxPointAttributes.showInfoBox = false;
    } else {
      jsxPointAttributes.showInfoBox = SVs.showCoordsWhenDragging;
    }
    let coords = [SVs.numericalXs[0], SVs.numericalXs[1]];
    if (!Number.isFinite(coords[0])) {
      coords[0] = 0;
      jsxPointAttributes["visible"] = false;
    }
    if (!Number.isFinite(coords[1])) {
      coords[1] = 0;
      jsxPointAttributes["visible"] = false;
    }
    let newPointJXG = board.create("point", coords, jsxPointAttributes);
    let shadowPointAttributes = {...jsxPointAttributes};
    shadowPointAttributes.layer--;
    shadowPointAttributes.fixed = fixed;
    shadowPointAttributes.showInfoBox = false;
    shadowPointAttributes.withLabel = false;
    shadowPointAttributes.fillOpacity = 0;
    shadowPointAttributes.strokeOpacity = 0;
    let newShadowPointJXG = board.create("point", coords, shadowPointAttributes);
    newShadowPointJXG.on("down", function(e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newShadowPointJXG.coords.scrCoords];
      dragged.current = false;
      shadowPointJXG.current.visProp.fillopacity = pointJXG.current.visProp.fillopacity;
      shadowPointJXG.current.visProp.strokeopacity = pointJXG.current.visProp.strokeopacity;
    });
    newShadowPointJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.movePoint,
          args: {
            x: calculatedX.current,
            y: calculatedY.current
          }
        });
      } else if (SVs.switchable && !SVs.fixed) {
        callAction({
          action: actions.switchPoint
        });
        callAction({
          action: actions.pointClicked
        });
      } else {
        callAction({
          action: actions.pointClicked
        });
      }
      dragged.current = false;
      shadowPointJXG.current.visProp.fillopacity = 0;
      shadowPointJXG.current.visProp.strokeopacity = 0;
    });
    newShadowPointJXG.on("drag", function(e) {
      var o = board.origin.scrCoords;
      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmax, Math.max(xmin, calculatedX.current));
      calculatedY.current = (o[2] - (pointAtDown.current[2] + e.y - pointerAtDown.current[1])) / board.unitY;
      calculatedY.current = Math.min(ymax, Math.max(ymin, calculatedY.current));
      callAction({
        action: actions.movePoint,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true
        }
      });
      newPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);
      board.updateInfobox(newPointJXG);
      if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
        dragged.current = true;
      }
    });
    pointJXG.current = newPointJXG;
    shadowPointJXG.current = newShadowPointJXG;
    previousLabelPosition.current = SVs.labelPosition;
    previousWithLabel.current = withlabel;
  }
  if (board) {
    if (pointJXG.current === null) {
      createPointJXG();
    } else {
      let newFillColor = SVs.open ? "var(--canvas)" : SVs.selectedStyle.markerColor;
      if (pointJXG.current.visProp.fillcolor !== newFillColor) {
        pointJXG.current.visProp.fillcolor = newFillColor;
      }
      let x = SVs.numericalXs?.[0];
      let y = SVs.numericalXs?.[1];
      pointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
      if (!dragged.current) {
        shadowPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
      }
      let visible = !SVs.hidden;
      if (Number.isFinite(x) && Number.isFinite(y)) {
        let actuallyChangedVisibility = pointJXG.current.visProp["visible"] !== visible;
        pointJXG.current.visProp["visible"] = visible;
        pointJXG.current.visPropCalc["visible"] = visible;
        shadowPointJXG.current.visProp["visible"] = visible;
        shadowPointJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          pointJXG.current.setAttribute({visible});
          shadowPointJXG.current.setAttribute({visible});
        }
      } else {
        pointJXG.current.visProp["visible"] = false;
        pointJXG.current.visPropCalc["visible"] = false;
        shadowPointJXG.current.visProp["visible"] = false;
        shadowPointJXG.current.visPropCalc["visible"] = false;
      }
      let layer = 10 * SVs.layer + 9;
      let layerChanged = pointJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        pointJXG.current.setAttribute({layer});
      }
      let fixed = !SVs.draggable || SVs.fixed;
      let fillColor = SVs.open ? "var(--canvas)" : SVs.selectedStyle.markerColor;
      let strokeColor = SVs.open ? SVs.selectedStyle.markerColor : "none";
      pointJXG.current.visProp.highlight = !fixed;
      shadowPointJXG.current.visProp.highlight = !fixed;
      shadowPointJXG.current.visProp.fixed = fixed;
      if (pointJXG.current.visProp.strokecolor !== strokeColor) {
        pointJXG.current.visProp.strokecolor = strokeColor;
        shadowPointJXG.current.visProp.strokecolor = strokeColor;
        pointJXG.current.visProp.fillColor = fillColor;
        shadowPointJXG.current.visProp.fillColor = fillColor;
      }
      if (pointJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        pointJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
        pointJXG.current.visProp.fillopacity = SVs.selectedStyle.lineOpacity;
      }
      let newFace = normalizeStyle(SVs.selectedStyle.markerStyle);
      if (pointJXG.current.visProp.face !== newFace) {
        pointJXG.current.setAttribute({face: newFace});
        shadowPointJXG.current.setAttribute({face: newFace});
      }
      let newSize = normalizeSize(SVs.selectedStyle.markerSize, SVs.selectedStyle.markerStyle);
      if (pointJXG.current.visProp.size !== newSize) {
        pointJXG.current.setAttribute({size: newSize});
        shadowPointJXG.current.setAttribute({size: newSize});
      }
      if (fixed) {
        pointJXG.current.visProp.showinfobox = false;
      } else {
        pointJXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;
      }
      if (sourceOfUpdate.sourceInformation && name in sourceOfUpdate.sourceInformation) {
        board.updateInfobox(pointJXG.current);
      }
      pointJXG.current.name = SVs.labelForGraph;
      let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        pointJXG.current.setAttribute({withlabel});
        previousWithLabel.current = withlabel;
      }
      if (pointJXG.current.hasLabel) {
        pointJXG.current.label.needsUpdate = true;
        if (SVs.applyStyleToLabel) {
          pointJXG.current.label.visProp.strokecolor = SVs.selectedStyle.markerColor;
        } else {
          pointJXG.current.label.visProp.strokecolor = "#000000";
        }
        if (SVs.labelPosition !== previousLabelPosition.current) {
          let anchorx, anchory, offset;
          if (SVs.labelPosition === "upperright") {
            offset = [5, 5];
            anchorx = "left";
            anchory = "bottom";
          } else if (SVs.labelPosition === "upperleft") {
            offset = [-5, 5];
            anchorx = "right";
            anchory = "bottom";
          } else if (SVs.labelPosition === "lowerright") {
            offset = [5, -5];
            anchorx = "left";
            anchory = "top";
          } else if (SVs.labelPosition === "lowerleft") {
            offset = [-5, -5];
            anchorx = "right";
            anchory = "top";
          } else if (SVs.labelPosition === "top") {
            offset = [0, 10];
            anchorx = "middle";
            anchory = "bottom";
          } else if (SVs.labelPosition === "bottom") {
            offset = [0, -10];
            anchorx = "middle";
            anchory = "top";
          } else if (SVs.labelPosition === "left") {
            offset = [-10, 0];
            anchorx = "right";
            anchory = "middle";
          } else {
            offset = [10, 0];
            anchorx = "left";
            anchory = "middle";
          }
          pointJXG.current.label.visProp.anchorx = anchorx;
          pointJXG.current.label.visProp.anchory = anchory;
          pointJXG.current.label.visProp.offset = offset;
          previousLabelPosition.current = SVs.labelPosition;
          pointJXG.current.label.fullUpdate();
        } else {
          pointJXG.current.label.update();
        }
      }
      pointJXG.current.needsUpdate = true;
      pointJXG.current.update();
      shadowPointJXG.current.needsUpdate = true;
      shadowPointJXG.current.update();
      board.updateRenderer();
    }
    return /* @__PURE__ */ React.createElement("a", {
      name: id
    });
  }
  if (SVs.hidden) {
    return null;
  }
  let mathJaxify = "\\(" + SVs.latex + "\\)";
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement("span", {
    id
  }, /* @__PURE__ */ React.createElement(MathJax, {
    hideUntilTypeset: "first",
    inline: true,
    dynamic: true
  }, mathJaxify)));
});
function normalizeSize(size, style) {
  if (style.substring(0, 8) === "triangle" || style === "diamond") {
    return size * 1.4;
  } else
    return size;
}
function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}
