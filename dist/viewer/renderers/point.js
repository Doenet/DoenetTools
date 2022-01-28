import React, {useContext, useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
export default function Point(props) {
  let {name, SVs, actions, sourceOfUpdate} = useDoenetRender(props);
  const board = useContext(BoardContext);
  const [pointJXG, setPointJXG] = useState({});
  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);
  useEffect(() => {
    if (board) {
      let fillColor = SVs.open ? "white" : SVs.selectedStyle.markerColor;
      let jsxPointAttributes = {
        name: SVs.label,
        visible: !SVs.hidden,
        withLabel: SVs.showLabel && SVs.label !== "",
        fixed: !SVs.draggable || SVs.fixed,
        layer: 10 * SVs.layer + 9,
        fillColor,
        strokeColor: SVs.selectedStyle.markerColor,
        size: SVs.selectedStyle.markerSize,
        face: normalizeStyle(SVs.selectedStyle.markerStyle)
      };
      if (SVs.showLabel && SVs.label !== "") {
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
          anchory
        };
      }
      if (SVs.draggable && !SVs.fixed) {
        jsxPointAttributes.highlightFillColor = "#EEEEEE";
        jsxPointAttributes.highlightStrokeColor = "#C3D9FF";
        jsxPointAttributes.showInfoBox = SVs.showCoordsWhenDragging;
      } else {
        jsxPointAttributes.highlightFillColor = fillColor;
        jsxPointAttributes.highlightStrokeColor = SVs.selectedStyle.markerColor;
        jsxPointAttributes.showInfoBox = false;
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
      newPointJXG.on("down", function(e) {
        pointerAtDown.current = [e.x, e.y];
        pointAtDown.current = [...newPointJXG.coords.scrCoords];
        dragged.current = false;
      });
      newPointJXG.on("up", function(e) {
        if (dragged.current) {
          actions.finalizePointPosition();
        } else if (SVs.switchable && !SVs.fixed) {
          actions.switchPoint();
        }
      });
      newPointJXG.on("drag", function(e) {
        var o = board.origin.scrCoords;
        let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
        let calculatedX = (pointAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
        calculatedX = Math.min(xmax, Math.max(xmin, calculatedX));
        let calculatedY = (o[2] - (pointAtDown.current[2] + e.y - pointerAtDown.current[1])) / board.unitY;
        calculatedY = Math.min(ymax, Math.max(ymin, calculatedY));
        actions.movePoint({
          x: calculatedX,
          y: calculatedY,
          transient: true,
          skippable: true
        });
        if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
          dragged.current = true;
        }
      });
      setPointJXG(newPointJXG);
    } else {
      if (window.MathJax) {
        window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
        window.MathJax.Hub.processSectionDelay = 0;
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
      }
    }
    return () => {
      if (Object.keys(pointJXG).length !== 0) {
        pointJXG.off("drag");
        pointJXG.off("down");
        pointJXG.off("up");
        board.removeObject(pointJXG);
        setPointJXG({});
      }
    };
  }, []);
  if (SVs.hidden) {
    return null;
  }
  if (Object.keys(pointJXG).length !== 0) {
    let newFillColor = SVs.open ? "white" : SVs.selectedStyle.markerColor;
    if (pointJXG.visProp.fillcolor !== newFillColor) {
      pointJXG.visProp.fillcolor = newFillColor;
    }
    let x = SVs.numericalXs[0];
    let y = SVs.numericalXs[1];
    pointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
    let visible = !SVs.hidden;
    if (Number.isFinite(x) && Number.isFinite(y)) {
      let actuallyChangedVisibility = pointJXG.visProp["visible"] !== visible;
      pointJXG.visProp["visible"] = visible;
      pointJXG.visPropCalc["visible"] = visible;
      if (actuallyChangedVisibility) {
        pointJXG.setAttribute({visible});
      }
    } else {
      pointJXG.visProp["visible"] = false;
      pointJXG.visPropCalc["visible"] = false;
    }
    if (pointJXG.visProp.strokecolor !== SVs.selectedStyle.markerColor) {
      pointJXG.visProp.strokecolor = SVs.selectedStyle.markerColor;
    }
    let newFace = normalizeStyle(SVs.selectedStyle.markerStyle);
    if (pointJXG.visProp.face !== newFace) {
      pointJXG.setAttribute({face: newFace});
    }
    if (pointJXG.visProp.size !== SVs.selectedStyle.markerSize) {
      pointJXG.visProp.size = SVs.selectedStyle.markerSize;
    }
    if (SVs.draggable && !SVs.fixed) {
      pointJXG.visProp.highlightfillcolor = "#EEEEEE";
      pointJXG.visProp.highlightstrokecolor = "#C3D9FF";
      pointJXG.visProp.showinfobox = SVs.showCoordsWhenDragging;
      pointJXG.visProp.fixed = false;
    } else {
      pointJXG.visProp.highlightfillcolor = newFillColor;
      pointJXG.visProp.highlightstrokecolor = SVs.selectedStyle.markerColor;
      pointJXG.visProp.showinfobox = false;
      pointJXG.visProp.fixed = true;
    }
    if (sourceOfUpdate.sourceInformation && name in sourceOfUpdate.sourceInformation) {
      board.updateInfobox(pointJXG);
    }
    pointJXG.name = SVs.label;
    let withlabel = SVs.showLabel && SVs.label !== "";
    if (withlabel != previousWithLabel.current) {
      pointJXG.setAttribute({withlabel});
      previousWithLabel.current = withlabel;
    }
    if (pointJXG.hasLabel) {
      pointJXG.label.needsUpdate = true;
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
        pointJXG.label.visProp.anchorx = anchorx;
        pointJXG.label.visProp.anchory = anchory;
        pointJXG.label.visProp.offset = offset;
        previousLabelPosition.current = SVs.labelPosition;
        pointJXG.label.fullUpdate();
      } else {
        pointJXG.label.update();
      }
    }
    pointJXG.needsUpdate = true;
    pointJXG.update();
    board.updateRenderer();
  }
  if (board) {
    return /* @__PURE__ */ React.createElement("a", {
      name
    });
  }
  if (window.MathJax) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
  }
  let mathJaxify = "\\(" + SVs.coordsForDisplay.toLatex() + "\\)";
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    id: name
  }, mathJaxify));
}
function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}
