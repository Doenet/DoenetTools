import React, {useContext, useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {BoardContext} from "./graph.js";
import {createFunctionFromDefinition} from "../../core/utils/function.js";
export default React.memo(function RegionBetweenCurveXAxis(props) {
  let {name, id, SVs} = useDoenetRender(props);
  RegionBetweenCurveXAxis.ignoreActionsWithoutCore = true;
  const board = useContext(BoardContext);
  let curveJXG = useRef(null);
  let integralJXG = useRef(null);
  useEffect(() => {
    return () => {
      if (integralJXG.current !== null) {
        deleteRegion();
      }
    };
  }, []);
  function createRegion() {
    if (!SVs.haveFunction || SVs.boundaryValues.length !== 2 || !SVs.boundaryValues.every(Number.isFinite)) {
      return null;
    }
    let fillColor = SVs.selectedStyle.fillColor;
    if (fillColor === "none") {
      fillColor = SVs.selectedStyle.lineColor;
    }
    let jsxAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed: true,
      layer: 10 * SVs.layer + 7,
      fillColor,
      fillOpacity: SVs.selectedStyle.fillOpacity,
      highlight: false,
      curveLeft: {visible: false},
      curveRight: {visible: false}
    };
    jsxAttributes.label = {
      highlight: false
    };
    let f = createFunctionFromDefinition(SVs.fDefinition);
    curveJXG.current = board.create("functiongraph", f, {visible: false});
    return board.create("integral", [SVs.boundaryValues, curveJXG.current], jsxAttributes);
  }
  function deleteRegion() {
    if (integralJXG.current) {
      board.removeObject(integralJXG.current);
      integralJXG.current = null;
      board.removeObject(curveJXG.current);
      curveJXG.current = null;
    }
  }
  if (board) {
    if (integralJXG.current === null) {
      integralJXG.current = createRegion();
    } else if (!SVs.haveFunction || SVs.boundaryValues.length !== 2 || !SVs.boundaryValues.every(Number.isFinite)) {
      deleteRegion();
    } else {
      let f = createFunctionFromDefinition(SVs.fDefinition);
      curveJXG.current.Y = f;
      integralJXG.current.visProp["visible"] = !SVs.hidden;
      integralJXG.current.visPropCalc["visible"] = !SVs.hidden;
      let [x1, x2] = SVs.boundaryValues;
      let [y1, y2] = SVs.boundaryValues.map(f);
      integralJXG.current.curveLeft.coords.setCoordinates(JXG.COORDS_BY_USER, [x1, y1]);
      integralJXG.current.curveRight.coords.setCoordinates(JXG.COORDS_BY_USER, [x2, y2]);
      let layer = 10 * SVs.layer + 7;
      let layerChanged = integralJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        integralJXG.current.setAttribute({layer});
      }
      let fillColor = SVs.selectedStyle.fillColor;
      if (fillColor === "none") {
        fillColor = SVs.selectedStyle.lineColor;
      }
      if (integralJXG.current.visProp.fillcolor !== fillColor) {
        integralJXG.current.visProp.fillcolor = fillColor;
      }
      if (integralJXG.current.visProp.fillopacity !== SVs.selectedStyle.fillOpacity) {
        integralJXG.current.visProp.fillopacity = SVs.selectedStyle.fillOpacity;
      }
      integralJXG.current.curveLeft.needsUpdate = true;
      integralJXG.current.curveLeft.update();
      integralJXG.current.curveLeft.fullUpdate();
      integralJXG.current.curveRight.needsUpdate = true;
      integralJXG.current.curveLeft.update();
      integralJXG.current.curveRight.fullUpdate();
      integralJXG.current.needsUpdate = true;
      integralJXG.current.curveLeft.update();
      integralJXG.current.fullUpdate();
      board.update();
      board.fullUpdate();
      board.updateRenderer();
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: id
    }));
  }
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name: id
  }));
});
