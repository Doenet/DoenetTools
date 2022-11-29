import React, {useContext, useRef} from "../../_snowpack/pkg/react.js";
import {BoardContext} from "./graph.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
import me from "../../_snowpack/pkg/math-expressions.js";
export default React.memo(function MathComponent(props) {
  let {name, id, SVs, actions, sourceOfUpdate, callAction} = useDoenetRender(props);
  MathComponent.ignoreActionsWithoutCore = true;
  let mathJXG = useRef(null);
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
  function createMathJXG() {
    let fixed = !SVs.draggable || SVs.fixed;
    let jsxMathAttributes = {
      visible: !SVs.hidden,
      fixed,
      layer: 10 * SVs.layer + 9,
      highlight: !fixed,
      useMathJax: true,
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
        jsxMathAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxMathAttributes["visible"] = false;
      }
      newAnchorPointJXG = board.create("point", anchorCoords, {visible: false});
    } catch (e) {
      jsxMathAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], {visible: false});
    }
    jsxMathAttributes.anchor = newAnchorPointJXG;
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
    jsxMathAttributes.anchorx = anchorx;
    jsxMathAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];
    let beginDelim2, endDelim2;
    if (SVs.renderMode === "inline") {
      beginDelim2 = "\\(";
      endDelim2 = "\\)";
    } else if (SVs.renderMode === "display") {
      beginDelim2 = "\\[";
      endDelim2 = "\\]";
    } else if (SVs.renderMode === "numbered") {
      beginDelim2 = `\\begin{gather}\\tag{${SVs.equationTag}}`;
      endDelim2 = "\\end{gather}";
    } else if (SVs.renderMode === "align") {
      beginDelim2 = "\\begin{align}";
      endDelim2 = "\\end{align}";
    } else {
      beginDelim2 = "\\(";
      endDelim2 = "\\)";
    }
    let newMathJXG = board.create("text", [0, 0, beginDelim2 + SVs.latex + endDelim2], jsxMathAttributes);
    newMathJXG.on("down", function(e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
    });
    newMathJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveMath,
          args: {
            x: calculatedX.current,
            y: calculatedY.current
          }
        });
      }
      dragged.current = false;
    });
    newMathJXG.on("drag", function(e) {
      var o = board.origin.scrCoords;
      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
      let width = newMathJXG.size[0] / board.unitX;
      let height = newMathJXG.size[1] / board.unitY;
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
        action: actions.moveMath,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true
        }
      });
      newMathJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);
      if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
        dragged.current = true;
      }
    });
    mathJXG.current = newMathJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;
    setTimeout(() => {
      mathJXG.current.needsUpdate = true;
      mathJXG.current.setText(beginDelim2 + SVs.latex + endDelim2);
      mathJXG.current.update();
      board.updateRenderer();
    }, 1e3);
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
    if (mathJXG.current === null) {
      createMathJXG();
    } else {
      mathJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      anchorPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, anchorCoords);
      let beginDelim2, endDelim2;
      if (SVs.renderMode === "inline") {
        beginDelim2 = "\\(";
        endDelim2 = "\\)";
      } else if (SVs.renderMode === "display") {
        beginDelim2 = "\\[";
        endDelim2 = "\\]";
      } else if (SVs.renderMode === "numbered") {
        beginDelim2 = `\\begin{gather}\\tag{${SVs.equationTag}}`;
        endDelim2 = "\\end{gather}";
      } else if (SVs.renderMode === "align") {
        beginDelim2 = "\\begin{align}";
        endDelim2 = "\\end{align}";
      } else {
        beginDelim2 = "\\(";
        endDelim2 = "\\)";
      }
      mathJXG.current.setText(beginDelim2 + SVs.latex + endDelim2);
      let visible = !SVs.hidden;
      if (Number.isFinite(anchorCoords[0]) && Number.isFinite(anchorCoords[1])) {
        let actuallyChangedVisibility = mathJXG.current.visProp["visible"] !== visible;
        mathJXG.current.visProp["visible"] = visible;
        mathJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          mathJXG.current.setAttribute({visible});
        }
      } else {
        mathJXG.current.visProp["visible"] = false;
        mathJXG.current.visPropCalc["visible"] = false;
      }
      let layer = 10 * SVs.layer + 9;
      let layerChanged = mathJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        mathJXG.current.setAttribute({layer});
      }
      let fixed = !SVs.draggable || SVs.fixed;
      mathJXG.current.visProp.highlight = !fixed;
      mathJXG.current.visProp.fixed = fixed;
      mathJXG.current.needsUpdate = true;
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
        mathJXG.current.visProp.anchorx = anchorx;
        mathJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        mathJXG.current.fullUpdate();
      } else {
        mathJXG.current.update();
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
  let beginDelim, endDelim;
  if (SVs.renderMode === "inline") {
    beginDelim = "\\(";
    endDelim = "\\)";
  } else if (SVs.renderMode === "display") {
    beginDelim = "\\[";
    endDelim = "\\]";
  } else if (SVs.renderMode === "numbered") {
    beginDelim = `\\begin{gather}\\tag{${SVs.equationTag}}`;
    endDelim = "\\end{gather}";
  } else if (SVs.renderMode === "align") {
    beginDelim = "\\begin{align}";
    endDelim = "\\end{align}";
  } else {
    beginDelim = "\\(";
    endDelim = "\\)";
  }
  if (!SVs.latexWithInputChildren) {
    return null;
  }
  let latexOrInputChildren = SVs.latexWithInputChildren.map((x) => typeof x === "number" ? this.children[x] : beginDelim + x + endDelim);
  let anchors = [
    /* @__PURE__ */ React.createElement("a", {
      name: id,
      key: id
    })
  ];
  if (SVs.mrowChildNames) {
    anchors.push(...SVs.mrowChildNames.map((x) => /* @__PURE__ */ React.createElement("a", {
      name: x,
      key: x,
      id: x
    })));
  }
  if (latexOrInputChildren.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }));
  } else if (latexOrInputChildren.length === 1) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, latexOrInputChildren[0])));
  } else if (latexOrInputChildren.length === 2) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, latexOrInputChildren[0], latexOrInputChildren[1])));
  } else {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, anchors, /* @__PURE__ */ React.createElement("span", {
      id
    }, /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, latexOrInputChildren[0])));
  }
});
