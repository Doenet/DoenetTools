import React, {useContext, useRef} from "../../_snowpack/pkg/react.js";
import {BoardContext} from "./graph.js";
import useDoenetRender from "./useDoenetRenderer.js";
import me from "../../_snowpack/pkg/math-expressions.js";
export default React.memo(function Text(props) {
  let {name, id, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  Text.ignoreActionsWithoutCore = true;
  let textJXG = useRef(null);
  let anchorPointJXG = useRef(null);
  let anchorRel = useRef(null);
  const board = useContext(BoardContext);
  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);
  let calculatedX = useRef(null);
  let calculatedY = useRef(null);
  let lastPositionFromCore = useRef(null);
  let previousPositionFromAnchor = useRef(null);
  function createTextJXG() {
    let fixed = !SVs.draggable || SVs.fixed;
    let jsxTextAttributes = {
      visible: !SVs.hidden,
      fixed,
      layer: 10 * SVs.layer + 9,
      highlight: !fixed
    };
    let newAnchorPointJXG;
    try {
      let anchor = me.fromAst(SVs.anchor);
      let anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ];
      if (!Number.isFinite(anchorCoords[0])) {
        anchorCoords[0] = 0;
        jsxTextAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxTextAttributes["visible"] = false;
      }
      newAnchorPointJXG = board.create("point", anchorCoords, {visible: false});
    } catch (e) {
      jsxTextAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], {visible: false});
    }
    jsxTextAttributes.anchor = newAnchorPointJXG;
    let anchorx, anchory;
    if (SVs.positionFromAnchor === "center") {
      anchorx = "middle";
      anchory = "middle";
    } else if (SVs.positionFromAnchor === "lowerleft") {
      anchorx = "right";
      anchory = "top";
    } else if (SVs.positionFromAnchor === "lowerright") {
      anchorx = "left";
      anchory = "top";
    } else if (SVs.positionFromAnchor === "upperleft") {
      anchorx = "right";
      anchory = "bottom";
    } else if (SVs.positionFromAnchor === "upperright") {
      anchorx = "left";
      anchory = "bottom";
    } else if (SVs.positionFromAnchor === "bottom") {
      anchorx = "middle";
      anchory = "top";
    } else if (SVs.positionFromAnchor === "top") {
      anchorx = "middle";
      anchory = "bottom";
    } else if (SVs.positionFromAnchor === "right") {
      anchorx = "left";
      anchory = "middle";
    } else {
      anchorx = "right";
      anchory = "middle";
    }
    jsxTextAttributes.anchorx = anchorx;
    jsxTextAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];
    let newTextJXG = board.create("text", [0, 0, SVs.text], jsxTextAttributes);
    newTextJXG.on("down", function(e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
    });
    newTextJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveText,
          args: {
            x: calculatedX.current,
            y: calculatedY.current
          }
        });
      }
      dragged.current = false;
    });
    newTextJXG.on("drag", function(e) {
      var o = board.origin.scrCoords;
      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
      let width = newTextJXG.size[0] / board.unitX;
      let height = newTextJXG.size[1] / board.unitY;
      let anchorx2 = anchorRel.current[0];
      let anchory2 = anchorRel.current[1];
      let offsetx = 0;
      if (anchorx2 === "middle") {
        offsetx = -width / 2;
      } else if (anchorx2 === "right") {
        offsetx = -width;
      }
      let offsety = 0;
      if (anchory2 === "middle") {
        offsety = -height / 2;
      } else if (anchory2 === "top") {
        offsety = -height;
      }
      let xminAdjusted = xmin + 0.04 * (xmax - xmin) - offsetx - width;
      let xmaxAdjusted = xmax - 0.04 * (xmax - xmin) - offsetx;
      let yminAdjusted = ymin + 0.04 * (ymax - ymin) - offsety - height;
      let ymaxAdjusted = ymax - 0.04 * (ymax - ymin) - offsety;
      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmaxAdjusted, Math.max(xminAdjusted, calculatedX.current));
      calculatedY.current = (o[2] - (pointAtDown.current[2] + e.y - pointerAtDown.current[1])) / board.unitY;
      calculatedY.current = Math.min(ymaxAdjusted, Math.max(yminAdjusted, calculatedY.current));
      callAction({
        action: actions.moveText,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true
        }
      });
      newTextJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);
      if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
        dragged.current = true;
      }
    });
    textJXG.current = newTextJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;
  }
  if (board) {
    let anchorCoords;
    try {
      let anchor = me.fromAst(SVs.anchor);
      anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ];
    } catch (e) {
      anchorCoords = [NaN, NaN];
    }
    lastPositionFromCore.current = anchorCoords;
    if (textJXG.current === null) {
      createTextJXG();
    } else {
      textJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      anchorPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, anchorCoords);
      textJXG.current.setText(SVs.text);
      let visible = !SVs.hidden;
      if (Number.isFinite(anchorCoords[0]) && Number.isFinite(anchorCoords[1])) {
        let actuallyChangedVisibility = textJXG.current.visProp["visible"] !== visible;
        textJXG.current.visProp["visible"] = visible;
        textJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          textJXG.current.setAttribute({visible});
        }
      } else {
        textJXG.current.visProp["visible"] = false;
        textJXG.current.visPropCalc["visible"] = false;
      }
      let layer = 10 * SVs.layer + 9;
      let layerChanged = textJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        textJXG.current.setAttribute({layer});
      }
      let fixed = !SVs.draggable || SVs.fixed;
      textJXG.current.visProp.highlight = !fixed;
      textJXG.current.visProp.fixed = fixed;
      textJXG.current.needsUpdate = true;
      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
        let anchorx, anchory;
        if (SVs.positionFromAnchor === "center") {
          anchorx = "middle";
          anchory = "middle";
        } else if (SVs.positionFromAnchor === "lowerleft") {
          anchorx = "right";
          anchory = "top";
        } else if (SVs.positionFromAnchor === "lowerright") {
          anchorx = "left";
          anchory = "top";
        } else if (SVs.positionFromAnchor === "upperleft") {
          anchorx = "right";
          anchory = "bottom";
        } else if (SVs.positionFromAnchor === "upperright") {
          anchorx = "left";
          anchory = "bottom";
        } else if (SVs.positionFromAnchor === "bottom") {
          anchorx = "middle";
          anchory = "top";
        } else if (SVs.positionFromAnchor === "top") {
          anchorx = "middle";
          anchory = "bottom";
        } else if (SVs.positionFromAnchor === "right") {
          anchorx = "left";
          anchory = "middle";
        } else {
          anchorx = "right";
          anchory = "middle";
        }
        textJXG.current.visProp.anchorx = anchorx;
        textJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        textJXG.current.fullUpdate();
      } else {
        textJXG.current.update();
      }
      anchorPointJXG.current.needsUpdate = true;
      anchorPointJXG.current.update();
      board.updateRenderer();
    }
    return /* @__PURE__ */ React.createElement("a", {
      name: id
    });
  }
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement("span", {
    id
  }, SVs.text));
});
