import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { BoardContext, POINT_LAYER_OFFSET } from './graph';
import { MathJax } from 'better-react-mathjax';
import { darkModeAtom } from '../../Tools/_framework/DarkmodeController';
import { useRecoilValue } from 'recoil';
import { textRendererStyle } from '../../Core/utils/style';

export default React.memo(function Point(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Point.ignoreActionsWithoutCore = () => true;

  // console.log(`for point ${name}, SVs: `, SVs)

  const board = useContext(BoardContext);

  let pointJXG = useRef(null);
  let shadowPointJXG = useRef(null);

  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);
  let calculatedX = useRef(null);
  let calculatedY = useRef(null);

  let lastPositionFromCore = useRef(null);

  lastPositionFromCore.current = SVs.numericalXs;

  const darkMode = useRecoilValue(darkModeAtom);


  const useOpenSymbol = SVs.open || ["cross", "plus"].includes(SVs.selectedStyle.markerStyle); // Cross and plus should always be treated as "open" to remain visible on graph


  useEffect(() => {
    //On unmount
    return () => {
      // if point is defined
      if (pointJXG.current !== null) {
        shadowPointJXG.current.off('drag');
        shadowPointJXG.current.off('down');
        shadowPointJXG.current.off('up');
        board.removeObject(pointJXG.current);
        board.removeObject(shadowPointJXG.current);
        pointJXG.current = null;
        shadowPointJXG.current = null;
      }

    }
  }, [])

  function createPointJXG() {

    let markerColor = darkMode === "dark" ? SVs.selectedStyle.markerColorDarkMode : SVs.selectedStyle.markerColor;
    let fillColor = useOpenSymbol ? "var(--canvas)" : markerColor;
    let strokeColor = useOpenSymbol ? markerColor : "none";

    let fixed = !SVs.draggable || SVs.fixed;
    let withlabel = SVs.showLabel && SVs.labelForGraph !== "";

    //things to be passed to JSXGraph as attributes
    let jsxPointAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withlabel,
      fixed: true,
      layer: 10 * SVs.layer + POINT_LAYER_OFFSET,
      fillColor: fillColor,
      strokeColor,
      strokeOpacity: SVs.selectedStyle.markerOpacity,
      fillOpacity: SVs.selectedStyle.markerOpacity,
      highlightFillColor: getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),
      highlightStrokeColor: getComputedStyle(document.documentElement).getPropertyValue("--lightBlue"),
      size: normalizeSize(SVs.selectedStyle.markerSize, SVs.selectedStyle.markerStyle),
      face: normalizeStyle(SVs.selectedStyle.markerStyle),
      highlight: !fixed
    };


    if (withlabel) {
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
        // labelPosition === right
        offset = [10, 0];
        anchorx = "left";
        anchory = "middle";
      }
      jsxPointAttributes.label = {
        offset,
        anchorx,
        anchory,
        highlight: false,
      };

      if (SVs.labelHasLatex) {
        jsxPointAttributes.label.useMathJax = true;
      }

      if (SVs.applyStyleToLabel) {
        jsxPointAttributes.label.strokeColor = markerColor;
      } else {
        jsxPointAttributes.label.strokeColor = "var(--canvastext)";
      }
    } else {
      jsxPointAttributes.label = {
        highlight: false
      }
      if (SVs.labelHasLatex) {
        jsxPointAttributes.label.useMathJax = true
      }
    }

    if (fixed) {
      jsxPointAttributes.showInfoBox = false;
    } else {
      jsxPointAttributes.showInfoBox = SVs.showCoordsWhenDragging;
    }

    let coords = [SVs.numericalXs[0], SVs.numericalXs[1]];

    if (!Number.isFinite(coords[0])) {
      coords[0] = 0;
      jsxPointAttributes['visible'] = false;
    }
    if (!Number.isFinite(coords[1])) {
      coords[1] = 0;
      jsxPointAttributes['visible'] = false;
    }


    let shadowPointAttributes = { ...jsxPointAttributes };
    shadowPointAttributes.fixed = fixed;
    shadowPointAttributes.showInfoBox = false;
    shadowPointAttributes.withlabel = false;
    shadowPointAttributes.fillOpacity = 0;
    shadowPointAttributes.strokeOpacity = 0;

    let newShadowPointJXG = board.create('point', coords, shadowPointAttributes);

    let newPointJXG = board.create('point', coords, jsxPointAttributes);


    newShadowPointJXG.on('down', function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newShadowPointJXG.coords.scrCoords];
      dragged.current = false;
      shadowPointJXG.current.visProp.fillopacity = pointJXG.current.visProp.fillopacity;
      shadowPointJXG.current.visProp.strokeopacity = pointJXG.current.visProp.strokeopacity;
      callAction({
        action: actions.mouseDownOnPoint
      });
    });

    newShadowPointJXG.on('up', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.movePoint,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          }
        });
      } else if (SVs.switchable && !SVs.fixed) {

        // TODO: don't think SVS.switchable, SVs.fixed will if change state variables
        // as useEffect will not be rerun
        callAction({
          action: actions.switchPoint
        });
        callAction({
          action: actions.pointClicked
        });
      } else {
        callAction({
          action: actions.pointClicked
        });
      }
      dragged.current = false;

      shadowPointJXG.current.visProp.fillopacity = 0;
      shadowPointJXG.current.visProp.strokeopacity = 0;
    });

    newShadowPointJXG.on('drag', function (e) {
      // the reason we calculate point position with this algorithm,
      // rather than using .X() and .Y() directly
      // is that attributes .X() and .Y() are affected by the
      // .setCoordinates function called in update().
      // Due to this dependence, the location of .X() and .Y()
      // can be affected by constraints of objects that the points depends on,
      // leading to a different location on up than on drag
      // (as dragging uses the mouse location)
      // TODO: find an example where need this this additional complexity
      var o = board.origin.scrCoords;

      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0]
        - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmax, Math.max(xmin, calculatedX.current));

      calculatedY.current = (o[2] -
        (pointAtDown.current[2] + e.y - pointerAtDown.current[1]))
        / board.unitY;
      calculatedY.current = Math.min(ymax, Math.max(ymin, calculatedY.current));

      callAction({
        action: actions.movePoint,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        }
      });

      newPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);
      board.updateInfobox(newPointJXG);

      //Protect against very small unintended drags
      if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1) {
        dragged.current = true;
      }

    });

    pointJXG.current = newPointJXG;
    shadowPointJXG.current = newShadowPointJXG;
    previousLabelPosition.current = SVs.labelPosition;
    previousWithLabel.current = withlabel;
  }



  if (board) {
    if (pointJXG.current === null) {
      createPointJXG();
    } else {
      //if values update
      let markerColor = darkMode === "dark" ? SVs.selectedStyle.markerColorDarkMode : SVs.selectedStyle.markerColor;
      let fillColor = useOpenSymbol ? "var(--canvas)" : markerColor;
      let strokeColor = useOpenSymbol ? markerColor : "none";

      if (pointJXG.current.visProp.fillcolor !== fillColor) {
        pointJXG.current.visProp.fillcolor = fillColor;
      }

      //Note label update in jsxGraph maybe slow (so check previous value)

      // Note: for now, putting ?. after numericalXs
      // because found a case involving an intersections
      // where a line was turned into a point
      // and the point renderer was called with the SVs of a line
      // TODO: is this a problem for which we should find a general fix?

      //if coordinates update
      let x = SVs.numericalXs?.[0];
      let y = SVs.numericalXs?.[1];

      pointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
      if (!dragged.current) {
        shadowPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
      }

      let visible = !SVs.hidden;

      if (Number.isFinite(x) && Number.isFinite(y)) {
        let actuallyChangedVisibility = pointJXG.current.visProp["visible"] !== visible;
        pointJXG.current.visProp["visible"] = visible;
        pointJXG.current.visPropCalc["visible"] = visible;
        shadowPointJXG.current.visProp["visible"] = visible;
        shadowPointJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          pointJXG.current.setAttribute({ visible: visible })
          shadowPointJXG.current.setAttribute({ visible: visible })
        }
      } else {
        pointJXG.current.visProp["visible"] = false;
        pointJXG.current.visPropCalc["visible"] = false;
        shadowPointJXG.current.visProp["visible"] = false;
        shadowPointJXG.current.visPropCalc["visible"] = false;
        // pointJXG.current.setAttribute({visible: false})
      }

      let layer = 10 * SVs.layer + POINT_LAYER_OFFSET;
      let layerChanged = pointJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        pointJXG.current.setAttribute({ layer });
        shadowPointJXG.current.setAttribute({ layer });
      }

      let fixed = !SVs.draggable || SVs.fixed;

      pointJXG.current.visProp.highlight = !fixed;
      shadowPointJXG.current.visProp.highlight = !fixed;
      shadowPointJXG.current.visProp.fixed = fixed;

      if (pointJXG.current.visProp.strokecolor !== strokeColor) {
        pointJXG.current.visProp.strokecolor = strokeColor;
        shadowPointJXG.current.visProp.strokecolor = strokeColor;
        pointJXG.current.visProp.fillColor = fillColor;
        shadowPointJXG.current.visProp.fillColor = fillColor;
      }
      if (pointJXG.current.visProp.strokeopacity !== SVs.selectedStyle.markerOpacity) {
        pointJXG.current.visProp.strokeopacity = SVs.selectedStyle.markerOpacity;
        pointJXG.current.visProp.fillopacity = SVs.selectedStyle.markerOpacity;
      }

      let newFace = normalizeStyle(SVs.selectedStyle.markerStyle);
      if (pointJXG.current.visProp.face !== newFace) {
        pointJXG.current.setAttribute({ face: newFace });
        shadowPointJXG.current.setAttribute({ face: newFace });
      }
      let newSize = normalizeSize(SVs.selectedStyle.markerSize, SVs.selectedStyle.markerStyle);
      if (pointJXG.current.visProp.size !== newSize) {
        pointJXG.current.setAttribute({ size: newSize });
        shadowPointJXG.current.setAttribute({ size: newSize });
      }

      if (fixed) {
        pointJXG.current.visProp.showinfobox = false;
      } else {
        pointJXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;
      }

      //Update only when the change was initiated with this point
      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        board.updateInfobox(pointJXG.current);
      }

      pointJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        pointJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      if (pointJXG.current.hasLabel) {
        pointJXG.current.label.needsUpdate = true;
        if (SVs.applyStyleToLabel) {
          pointJXG.current.label.visProp.strokecolor = markerColor;
        } else {
          pointJXG.current.label.visProp.strokecolor = "var(--canvastext)";
        }
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
            // labelPosition === right
            offset = [10, 0];
            anchorx = "left";
            anchory = "middle";
          }
          pointJXG.current.label.visProp.anchorx = anchorx;
          pointJXG.current.label.visProp.anchory = anchory;
          pointJXG.current.label.visProp.offset = offset;
          previousLabelPosition.current = SVs.labelPosition;
          pointJXG.current.label.fullUpdate();
        } else {
          pointJXG.current.label.update();
        }
      }


      pointJXG.current.needsUpdate = true;
      pointJXG.current.update();
      shadowPointJXG.current.needsUpdate = true;
      shadowPointJXG.current.update();
      board.updateRenderer();
    }

    return <a name={id} />
  }

  // not in board

  if (SVs.hidden) {
    return null;
  }

  //Render text coordinates when outside of graph

  let mathJaxify = "\\(" + SVs.latex + "\\)";
  let style = textRendererStyle(darkMode, SVs.selectedStyle);
  return <><a name={id} /><span id={id} style={style}><MathJax hideUntilTypeset={"first"} inline dynamic >{mathJaxify}</MathJax></span></>


})

function normalizeSize(size, style) {
  if (style === "diamond") {
    return size * 1.4;
  } else if (style === "plus") {
    return size * 1.2;
  } else if (style === "square") {
    return size * 1.1;
  } else if (style.substring(0, 8) === "triangle") {
    return size * 1.5;
  } else return size;
}
function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}