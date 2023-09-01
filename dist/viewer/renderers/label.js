import React, {useContext, useRef} from "../../_snowpack/pkg/react.js";
import {BoardContext} from "./graph.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
import me from "../../_snowpack/pkg/math-expressions.js";
export default React.memo(function Label(props) {
  let {name, id, SVs, children, actions, callAction} = useDoenetRender(props);
  Label.ignoreActionsWithoutCore = true;
  let labelJXG = useRef(null);
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
  function createLabelJXG() {
    let fixed = !SVs.draggable || SVs.fixed;
    let jsxLabelAttributes = {
      visible: !SVs.hidden,
      fixed,
      layer: 10 * SVs.layer + 9,
      highlight: !fixed,
      useMathJax: SVs.hasLatex,
      parse: false
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
        jsxLabelAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxLabelAttributes["visible"] = false;
      }
      newAnchorPointJXG = board.create("point", anchorCoords, {visible: false});
    } catch (e) {
      jsxLabelAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], {visible: false});
    }
    jsxLabelAttributes.anchor = newAnchorPointJXG;
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
    jsxLabelAttributes.anchorx = anchorx;
    jsxLabelAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];
    let newLabelJXG = board.create("text", [0, 0, SVs.value], jsxLabelAttributes);
    newLabelJXG.on("down", function(e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
    });
    newLabelJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveLabel,
          args: {
            x: calculatedX.current,
            y: calculatedY.current
          }
        });
      }
      dragged.current = false;
    });
    newLabelJXG.on("drag", function(e) {
      var o = board.origin.scrCoords;
      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
      let width = newLabelJXG.size[0] / board.unitX;
      let height = newLabelJXG.size[1] / board.unitY;
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
        action: actions.moveLabel,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true
        }
      });
      newLabelJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);
      if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
        dragged.current = true;
      }
    });
    labelJXG.current = newLabelJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;
    if (SVs.hasLatex) {
      setTimeout(() => {
        labelJXG.current.needsUpdate = true;
        labelJXG.current.setText(SVs.value);
        labelJXG.current.update();
        board.updateRenderer();
      }, 1e3);
    }
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
    if (labelJXG.current === null) {
      createLabelJXG();
    } else {
      labelJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      anchorPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, anchorCoords);
      labelJXG.current.setText(SVs.value);
      let visible = !SVs.hidden;
      if (Number.isFinite(anchorCoords[0]) && Number.isFinite(anchorCoords[1])) {
        let actuallyChangedVisibility = labelJXG.current.visProp["visible"] !== visible;
        labelJXG.current.visProp["visible"] = visible;
        labelJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          labelJXG.current.setAttribute({visible});
        }
      } else {
        labelJXG.current.visProp["visible"] = false;
        labelJXG.current.visPropCalc["visible"] = false;
      }
      let layer = 10 * SVs.layer + 9;
      let layerChanged = labelJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        labelJXG.current.setAttribute({layer});
      }
      let fixed = !SVs.draggable || SVs.fixed;
      labelJXG.current.visProp.highlight = !fixed;
      labelJXG.current.visProp.fixed = fixed;
      labelJXG.current.needsUpdate = true;
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
        labelJXG.current.visProp.anchorx = anchorx;
        labelJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        labelJXG.current.fullUpdate();
      } else {
        labelJXG.current.update();
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
  if (children.length > 0) {
    return /* @__PURE__ */ React.createElement("span", {
      id,
      style: {marginRight: "12px"}
    }, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), children);
  } else {
    let label = SVs.value;
    if (SVs.hasLatex) {
      label = /* @__PURE__ */ React.createElement(MathJax, {
        hideUntilTypeset: "first",
        inline: true,
        dynamic: true
      }, label);
    }
    return /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), label);
  }
});
