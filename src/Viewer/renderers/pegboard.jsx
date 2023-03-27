import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { BASE_LAYER_OFFSET, BoardContext } from './graph';
import me from 'math-expressions';

export default React.memo(function Pegboard(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Pegboard.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let pegboardJXG = useRef(null);

  let previousBounds = useRef(null);

  let dx = useRef(null);
  let dy = useRef(null);
  let xoffset = useRef(null);
  let yoffset = useRef(null);

  dx.current = SVs.dx;
  dy.current = SVs.dy;
  xoffset.current = SVs.xoffset;
  yoffset.current = SVs.yoffset;

  let jsxPointAttributes = useRef({
    visible: !SVs.hidden,
    fixed: true,
    withlabel: false,
    layer: 10 * SVs.layer + BASE_LAYER_OFFSET,
    fillColor: "darkgray",
    strokeColor: "darkgray",
    size: 0.1,
    face: "circle",
    highlight: false,
    showinfobox: false,
  });

  jsxPointAttributes.current.visible = !SVs.hidden;
  jsxPointAttributes.current.layer = 10 * SVs.layer + BASE_LAYER_OFFSET;

  useEffect(() => {
    //On unmount
    return () => {
      deletePegboardJXG();
    }
  }, [])



  function createPegboardJXG() {

    let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

    let xind1 = (xmin - xoffset.current) / dx.current;
    let xind2 = (xmax - xoffset.current) / dx.current;
    let yind1 = (ymin - yoffset.current) / dy.current;
    let yind2 = (ymax - yoffset.current) / dy.current;

    // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
    let minXind = me.math.round(Math.min(xind1, xind2) + 1);
    let maxXind = me.math.round(Math.max(xind1, xind2) - 1);
    let minYind = me.math.round(Math.min(yind1, yind2) + 1);
    let maxYind = me.math.round(Math.max(yind1, yind2) - 1);

    previousBounds.current = [minXind, maxXind, minYind, maxYind];

    if (Number.isFinite(minXind) && Number.isFinite(maxXind) && Number.isFinite(minYind) && Number.isFinite(maxYind)) {

      let pegs = [];

      for (let yind = minYind; yind <= maxYind; yind++) {
        let y = yind * SVs.dy + SVs.yoffset;
        let row = [];
        for (let xind = minXind; xind <= maxXind; xind++) {
          row.push(board.create('point', [xind * SVs.dx + SVs.xoffset, y], jsxPointAttributes.current));
        }
        pegs.push(row);
      }

      pegboardJXG.current = pegs;

    }


    board.on('boundingbox', () => {

      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

      let xind1 = (xmin - xoffset.current) / dx.current;
      let xind2 = (xmax - xoffset.current) / dx.current;
      let yind1 = (ymin - yoffset.current) / dy.current;
      let yind2 = (ymax - yoffset.current) / dy.current;

      // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
      let minXind = me.math.round(Math.min(xind1, xind2) + 1);
      let maxXind = me.math.round(Math.max(xind1, xind2) - 1);
      let minYind = me.math.round(Math.min(yind1, yind2) + 1);
      let maxYind = me.math.round(Math.max(yind1, yind2) - 1);

      let [prevXmin, prevXmax, prevYmin, prevYmax] = previousBounds.current;

      if (minXind !== prevXmin || maxXind !== prevXmax || minYind !== prevYmin || maxYind !== prevYmax) {

        recalculatePegboard(minXind, maxXind, minYind, maxYind)
      }

    })
  }

  function deletePegboardJXG() {
    if (pegboardJXG.current !== null) {
      for (let row of pegboardJXG.current) {
        for (let point of row) {
          board.removeObject(point)
        }
      }
    }

    pegboardJXG.current = null;

  }


  function recalculatePegboard(minXind, maxXind, minYind, maxYind) {

    if (pegboardJXG.current === null) {
      return createPegboardJXG();
    }

    if (!Number.isFinite(minXind) || !Number.isFinite(maxXind) || !Number.isFinite(minYind) || !Number.isFinite(maxYind)) {
      return deletePegboardJXG();
    }


    let [prevXmin, prevXmax, prevYmin, prevYmax] = previousBounds.current;

    let nRows = maxYind - minYind + 1;
    let prevNrows = prevYmax - prevYmin + 1;
    let nCols = maxXind - minXind + 1;
    let prevNcols = prevXmax - prevXmin + 1;

    for (let i = 0; i < Math.min(nRows, prevNrows); i++) {
      let row = pegboardJXG.current[i];
      let y = (i + minYind) * dy.current + yoffset.current;

      for (let j = 0; j < Math.min(nCols, prevNcols); j++) {

        let x = (j + minXind) * dx.current + xoffset.current;

        row[j].coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);

        row[j].needsUpdate = true;
        row[j].update();
      }
      if (prevNcols > nCols) {
        for (let j = nCols; j < prevNcols; j++) {
          let point = row.pop();
          board.removeObject(point)
        }
      } else if (prevNcols < nCols) {
        for (let j = prevNcols; j < nCols; j++) {
          let x = (j + minXind) * dx.current + xoffset.current;
          row.push(board.create('point', [x, y], jsxPointAttributes.current));
        }
      }
    }

    if (prevNrows > nRows) {
      for (let i = nRows; i < prevNrows; i++) {
        let row = pegboardJXG.current.pop();
        for (let j = 0; j < prevNcols; j++) {
          let point = row.pop();
          board.removeObject(point)
        }
      }
    } else if (prevNrows < nRows) {
      for (let i = prevNrows; i < nRows; i++) {
        let row = [];
        let y = (i + minYind) * dy.current + yoffset.current;
        for (let j = 0; j < nCols; j++) {
          let x = (j + minXind) * dx.current + xoffset.current;
          row.push(board.create('point', [x, y], jsxPointAttributes.current));
        }
        pegboardJXG.current.push(row);
      }
    }

    previousBounds.current = [minXind, maxXind, minYind, maxYind];

    board.updateRenderer();
  }

  if (board) {
    if (pegboardJXG.current === null) {
      createPegboardJXG();
    } else {
      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

      let xind1 = (xmin - xoffset.current) / dx.current;
      let xind2 = (xmax - xoffset.current) / dx.current;
      let yind1 = (ymin - yoffset.current) / dy.current;
      let yind2 = (ymax - yoffset.current) / dy.current;

      // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
      let minXind = me.math.round(Math.min(xind1, xind2) + 1);
      let maxXind = me.math.round(Math.max(xind1, xind2) - 1);
      let minYind = me.math.round(Math.min(yind1, yind2) + 1);
      let maxYind = me.math.round(Math.max(yind1, yind2) - 1);

      recalculatePegboard(minXind, maxXind, minYind, maxYind)

      let firstPeg = pegboardJXG.current[0]?.[0];
      if (firstPeg) {
        let layer = 10 * SVs.layer + BASE_LAYER_OFFSET;
        let layerChanged = firstPeg.visProp.layer !== layer;

        if (layerChanged) {
          for (let row of pegboardJXG.current) {
            for (let peg of row) {
              peg.setAttribute({ layer });

            }
          }
        }
      }

    }
  }

  return null;

})