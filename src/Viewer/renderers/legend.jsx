import React, { useContext, useEffect, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';

export default React.memo(function Legend(props) {
  let { name, id, SVs } = useDoenetRender(props);

  const board = useContext(BoardContext);

  let swatches = useRef([]);
  let labels = useRef([])

  useEffect(() => {

    //On unmount
    return () => {
      // if line is defined
      if (Object.keys(lineJXG.current).length !== 0) {
        deleteLegend();
      }

    }
  }, [])


  function createLegend() {

    let { xmin, xmax, ymin, ymax } = SVs.graphLimits;


    let legendDy = (ymax - ymin) * 0.06;
    let legendLineLength = (xmax - xmin) * 0.05;
    let legendDx = (xmax - xmin) * 0.02;

    let legendX = xmin + (xmax - xmin) * 0.05

    let legendY;

    if (SVs.position.slice(0, 5) === "upper") {
      legendY = ymin + (ymax - ymin) * 0.95;
    } else {
      legendY = ymin + (ymax - ymin) * 0.05 + legendDy * SVs.legendElements.length;
    }

    let atRight = SVs.position.slice(SVs.position.length - 5, SVs.position.length) === "right";

    swatches.current = [];
    labels.current = [];

    let maxTextWidth = 0;

    let usedMathJax = false;

    for (let [ind, element] of SVs.legendElements.entries()) {
      if (element.label) {
        let y = legendY - ind * legendDy;

        let textAttrs = {
          fixed: true,
          highlight: false,
        };

        if (element.label.hasLatex) {
          textAttrs.useMathJax = true;
          textAttrs.parse = false;
          usedMathJax = true;
        }

        let txt = board.create('text', [legendX + legendLineLength + legendDx, y, element.label.value],
          textAttrs)

        labels.current.push(txt)

        maxTextWidth = Math.max(maxTextWidth, txt.rendNode.offsetWidth);

      }
    }

    maxTextWidth /= board.unitX;

    if (atRight) {
      legendX = Math.max(legendX, xmax - legendLineLength - 3 * legendDx - maxTextWidth);
    }

    for (let [ind, element] of SVs.legendElements.entries()) {
      let y = legendY - ind * legendDy;
      if (element.swatchType === "marker") {
        let pointStyle = {
          fillColor: element.markerColor,
          fillOpacity: element.lineOpacity,
          strokeColor: "none",
          size: element.markerSize,
          face: normalizeStyle(element.markerStyle),
          fixed: true,
          highlight: false,
          withLabel: false,
          showInfoBox: false,
        }
        let point = board.create('point', [legendX + legendLineLength / 2, y], pointStyle);
        swatches.current.push(point);

      } else if (element.swatchType === "rectangle") {
        let rectangleStyle = {
          fillColor: element.filled ? element.fillColor.toLowerCase() : "none",
          fillOpacity: element.fillOpacity,
          fixed: true,
          highlight: false,
          vertices: { visible: false },
          borders: {
            strokeColor: element.lineColor,
            strokeWidth: element.lineWidth,
            strokeOpacity: element.lineOpacity,
            dash: styleToDash(element.lineStyle),
            fixed: true,
            highlight: false,
          }
        }

        let seg = board.create('polygon', [
          [legendX, y + legendDy / 4], [legendX + legendLineLength, y + legendDy / 4],
          [legendX + legendLineLength, y - legendDy / 4], [legendX, y - legendDy / 4]
        ], rectangleStyle)
        swatches.current.push(seg);
      } else {
        let lineStyle = {
          strokeColor: element.lineColor,
          strokeWidth: element.lineWidth,
          strokeOpacity: element.lineOpacity,
          dash: styleToDash(element.lineStyle),
          fixed: true,
          highlight: false,
        }
        let seg = board.create('segment', [[legendX, y], [legendX + legendLineLength, y]], lineStyle)
        swatches.current.push(seg);
      }
      if (atRight && element.label) {
        labels.current[ind].coords.setCoordinates(JXG.COORDS_BY_USER, [legendX + legendLineLength + legendDx, y])
      }
    }


    if (atRight && usedMathJax) {
      MathJax.Hub.Queue(() => {

        maxTextWidth = 0;
        for (let txt of labels.current) {
          maxTextWidth = Math.max(maxTextWidth, txt.rendNode.offsetWidth);
        }

        maxTextWidth /= board.unitX;

        legendX = Math.max(legendX, xmax - legendLineLength - 3 * legendDx - maxTextWidth);

        for (let [ind, swatch] of swatches.current.entries()) {

          let y = legendY - ind * legendDy;
          if (swatch.elType === "point") {
            swatch.coords.setCoordinates(JXG.COORDS_BY_USER, [legendX + legendLineLength / 2, y])
            swatch.needsUpdate = true;
            swatch.update();
          } else if (swatch.elType === "polygon") {
            swatch.vertices[0].coords.setCoordinates(JXG.COORDS_BY_USER, [legendX, y + legendDy / 4]);
            swatch.vertices[1].coords.setCoordinates(JXG.COORDS_BY_USER, [legendX + legendLineLength, y + legendDy / 4]);
            swatch.vertices[2].coords.setCoordinates(JXG.COORDS_BY_USER, [legendX + legendLineLength, y - legendDy / 4]);
            swatch.vertices[3].coords.setCoordinates(JXG.COORDS_BY_USER, [legendX, y - legendDy / 4]);

            for (let i = 0; i < 4; i++) {
              swatch.vertices[i].needsUpdate = true;
              swatch.vertices[i].update();
              swatch.borders[i].needsUpdate = true;
              swatch.borders[i].update();
            }
            swatch.needsUpdate = true;
            swatch.update();
          } else {
            swatch.point1.coords.setCoordinates(JXG.COORDS_BY_USER, [legendX, y]);
            swatch.point2.coords.setCoordinates(JXG.COORDS_BY_USER, [legendX + legendLineLength, y]);
            swatch.needsUpdate = true;
            swatch.update();
          }

          if (labels.current[ind]) {
            labels.current[ind].coords.setCoordinates(JXG.COORDS_BY_USER, [legendX + legendLineLength + legendDx, y])
            labels.current[ind].needsUpdate = true;
            labels.current[ind].update();
          }
        }

        board.updateRenderer();


      })
    }

  }


  function deleteLegend() {
    for (let swatch of swatches.current) {
      board.removeObject(swatch);
    }
    for (let txt of labels.current) {
      board.removeObject(txt);
    }
    swatches.current = [];
    labels.current = [];

  }


  if (board) {
    if (swatches.current.length > 0) {

      deleteLegend();

    }

    createLegend();

    return <><a name={id} /></>

  }

  if (SVs.hidden) {
    return null;
  }


  // don't return anything if not in board
  return <><a name={id} /></>
})

function styleToDash(style) {
  if (style === "dashed") {
    return 2;
  } else if (style === "solid") {
    return 0;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}

function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}