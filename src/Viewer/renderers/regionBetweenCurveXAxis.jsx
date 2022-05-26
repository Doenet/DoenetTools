import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import { createFunctionFromDefinition } from '../../Core/utils/function';

export default React.memo(function RegionBetweenCurveXAxis(props) {
  let { name, SVs } = useDoenetRender(props);

  RegionBetweenCurveXAxis.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let curveJXG = useRef(null)
  let integralJXG = useRef(null)

  useEffect(() => {
    //On unmount
    return () => {
      // if integral is defined
      if (integralJXG.current !== null) {
        deleteRegion();
      }
    }
  }, [])


  function createRegion() {

    if (!SVs.haveFunction || SVs.boundaryValues.length !== 2 ||
      !SVs.boundaryValues.every(Number.isFinite)
    ) {
      return null;
    }

    let jsxAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: true,
      layer: 10 * SVs.layer + 7,

      // TODO: use more appropriate style attribute
      fillColor: SVs.selectedStyle.lineColor,
      highlight: false,

      curveLeft: { visible: false },
      curveRight: { visible: false }
    };

    let f = createFunctionFromDefinition(SVs.fDefinition);
    curveJXG.current = board.create('functiongraph', f, { visible: false });

    return board.create('integral', [SVs.boundaryValues, curveJXG.current], jsxAttributes);

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
    } else if (!SVs.haveFunction || SVs.boundaryValues.length !== 2 ||
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
      let [y1, y2] = SVs.boundaryValues.map(f)
      integralJXG.current.curveLeft.coords.setCoordinates(JXG.COORDS_BY_USER, [x1, y1]);
      integralJXG.current.curveRight.coords.setCoordinates(JXG.COORDS_BY_USER, [x2, y2]);


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

    return <><a name={name} /></>

  }

  if (SVs.hidden) {
    return null;
  }

  // don't think we want to return anything if not in board
  return <><a name={name} /></>
})
