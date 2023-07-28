import React, { useContext, useEffect, useState, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "../../Core/utils/function";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../../Tools/_framework/DarkmodeController";

export default React.memo(function RegionBetweenCurveXAxis(props) {
  let { name, id, SVs } = useDoenetRenderer(props);

  RegionBetweenCurveXAxis.ignoreActionsWithoutCore = () => true;

  const board = useContext(BoardContext);

  let curveJXG = useRef(null);
  let integralJXG = useRef(null);

  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    //On unmount
    return () => {
      // if integral is defined
      if (integralJXG.current !== null) {
        deleteRegion();
      }
    };
  }, []);

  function createRegion() {
    if (
      !SVs.haveFunction ||
      SVs.boundaryValues.length !== 2 ||
      !SVs.boundaryValues.every(Number.isFinite)
    ) {
      return null;
    }

    let fillColor =
      darkMode === "dark"
        ? SVs.selectedStyle.fillColorDarkMode
        : SVs.selectedStyle.fillColor;

    // Note: actual content of label is being ignored
    // but, if label is non-empty, then jsxgraph display a label
    // which is an integral sign = value of integral

    // TODO: either change behavior or change how label is specified

    let jsxAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.labelForGraph !== "",
      fixed: true,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,

      fillColor,
      fillOpacity: SVs.selectedStyle.fillOpacity,
      highlight: false,

      // don't display points at left and right endpoints along function
      curveLeft: { visible: false },
      curveRight: { visible: false },
    };

    jsxAttributes.label = {
      highlight: false,
    };

    let f = createFunctionFromDefinition(SVs.fDefinition);
    curveJXG.current = board.create("functiongraph", f, { visible: false });

    return board.create(
      "integral",
      [SVs.boundaryValues, curveJXG.current],
      jsxAttributes,
    );
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
    } else if (
      !SVs.haveFunction ||
      SVs.boundaryValues.length !== 2 ||
      !SVs.boundaryValues.every(Number.isFinite)
    ) {
      deleteRegion();
    } else {
      let f = createFunctionFromDefinition(SVs.fDefinition);

      curveJXG.current.Y = f;
      // Since not drawing curve, do we need to update it?
      // curveJXG.current.needsUpdate = true;
      // curveJXG.current.updateCurve();

      integralJXG.current.visProp["visible"] = !SVs.hidden;
      integralJXG.current.visPropCalc["visible"] = !SVs.hidden;

      let [x1, x2] = SVs.boundaryValues;
      let [y1, y2] = SVs.boundaryValues.map(f);
      integralJXG.current.curveLeft.coords.setCoordinates(JXG.COORDS_BY_USER, [
        x1,
        y1,
      ]);
      integralJXG.current.curveRight.coords.setCoordinates(JXG.COORDS_BY_USER, [
        x2,
        y2,
      ]);

      let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = integralJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        integralJXG.current.setAttribute({ layer });
      }

      let fillColor =
        darkMode === "dark"
          ? SVs.selectedStyle.fillColorDarkMode
          : SVs.selectedStyle.fillColor;

      if (integralJXG.current.visProp.fillcolor !== fillColor) {
        integralJXG.current.visProp.fillcolor = fillColor;
      }

      if (
        integralJXG.current.visProp.fillopacity !==
        SVs.selectedStyle.fillOpacity
      ) {
        integralJXG.current.visProp.fillopacity = SVs.selectedStyle.fillOpacity;
      }

      // including both update and full updates for all parts of curve and board
      // makes sure that it updates consistently.
      // Was experiencing intermitant failures without all these updates.
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

    return (
      <>
        <a name={id} />
      </>
    );
  }

  if (SVs.hidden) {
    return null;
  }

  // don't think we want to return anything if not in board
  return (
    <>
      <a name={id} />
    </>
  );
});
