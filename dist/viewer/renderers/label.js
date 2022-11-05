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
  const board = useContext(BoardContext);
  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);
  let calculatedX = useRef(null);
  let calculatedY = useRef(null);
  let lastPositionFromCore = useRef(null);
  let previousAnchorPosition = useRef(null);
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
    if (SVs.anchorPosition === "upperright") {
      anchorx = "right";
      anchory = "top";
    } else if (SVs.anchorPosition === "upperleft") {
      anchorx = "left";
      anchory = "top";
    } else if (SVs.anchorPosition === "lowerright") {
      anchorx = "right";
      anchory = "bottom";
    } else if (SVs.anchorPosition === "lowerleft") {
      anchorx = "left";
      anchory = "bottom";
    } else if (SVs.anchorPosition === "top") {
      anchorx = "middle";
      anchory = "top";
    } else if (SVs.anchorPosition === "bottom") {
      anchorx = "middle";
      anchory = "bottom";
    } else if (SVs.anchorPosition === "left") {
      anchorx = "left";
      anchory = "middle";
    } else if (SVs.anchorPosition === "right") {
      anchorx = "right";
      anchory = "middle";
    } else {
      anchorx = "middle";
      anchory = "middle";
    }
    jsxLabelAttributes.anchorx = anchorx;
    jsxLabelAttributes.anchory = anchory;
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
      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmax, Math.max(xmin, calculatedX.current));
      calculatedY.current = (o[2] - (pointAtDown.current[2] + e.y - pointerAtDown.current[1])) / board.unitY;
      calculatedY.current = Math.min(ymax, Math.max(ymin, calculatedY.current));
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
    previousAnchorPosition.current = SVs.anchorPosition;
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
      if (SVs.anchorPosition !== previousAnchorPosition.current) {
        let anchorx, anchory;
        if (SVs.anchorPosition === "upperright") {
          anchorx = "right";
          anchory = "top";
        } else if (SVs.anchorPosition === "upperleft") {
          anchorx = "left";
          anchory = "top";
        } else if (SVs.anchorPosition === "lowerright") {
          anchorx = "right";
          anchory = "bottom";
        } else if (SVs.anchorPosition === "lowerleft") {
          anchorx = "left";
          anchory = "bottom";
        } else if (SVs.anchorPosition === "top") {
          anchorx = "middle";
          anchory = "top";
        } else if (SVs.anchorPosition === "bottom") {
          anchorx = "middle";
          anchory = "bottom";
        } else if (SVs.anchorPosition === "left") {
          anchorx = "left";
          anchory = "middle";
        } else if (SVs.anchorPosition === "right") {
          anchorx = "right";
          anchory = "middle";
        } else {
          anchorx = "middle";
          anchory = "middle";
        }
        labelJXG.current.visProp.anchorx = anchorx;
        labelJXG.current.visProp.anchory = anchory;
        previousAnchorPosition.current = SVs.anchorPosition;
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
