import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import me from 'math-expressions';
import { MathJax } from 'better-react-mathjax';

export default React.memo(function Point(props) {
  let { name, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Point.ignoreActionsWithoutCore = true;

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
    let fillColor = SVs.open ? "white" : SVs.selectedStyle.markerColor;

    //things to be passed to JSXGraph as attributes
    let jsxPointAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: true,
      layer: 10 * SVs.layer + 9,
      fillColor: fillColor,
      strokeColor: SVs.selectedStyle.markerColor,
      // highlightFillColor: SVs.selectedStyle.markerColor,
      // highlightStrokeColor: SVs.selectedStyle.markerColor,
      size: SVs.selectedStyle.markerSize,
      face: normalizeStyle(SVs.selectedStyle.markerStyle),
    };

    if (SVs.showLabel && SVs.label !== "") {
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
        anchory
      };
      if (SVs.applyStyleToLabel) {
        jsxPointAttributes.label.strokeColor = SVs.selectedStyle.markerColor;
      } else {
        jsxPointAttributes.label.strokeColor = "#000000";
      }
    }

    if (SVs.draggable && !SVs.fixed) {
      jsxPointAttributes.highlightFillColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
      jsxPointAttributes.highlightStrokeColor = getComputedStyle(document.documentElement).getPropertyValue("--lightBlue");
      jsxPointAttributes.showInfoBox = SVs.showCoordsWhenDragging;
    } else {
      jsxPointAttributes.highlightFillColor = fillColor;
      jsxPointAttributes.highlightStrokeColor = SVs.selectedStyle.markerColor;
      jsxPointAttributes.showInfoBox = false;
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

    let newPointJXG = board.create('point', coords, jsxPointAttributes);

    let shadowPointAttributes = { ...jsxPointAttributes };
    shadowPointAttributes.layer--;
    shadowPointAttributes.fixed = !SVs.draggable || SVs.fixed;
    shadowPointAttributes.showInfoBox = false;
    shadowPointAttributes.withLabel = false;

    let newShadowPointJXG = board.create('point', coords, shadowPointAttributes);


    newShadowPointJXG.on('down', function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newShadowPointJXG.coords.scrCoords];
      dragged.current = false;
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
      }
      dragged.current = false;
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
  }



  if (board) {
    if (pointJXG.current === null) {
      createPointJXG();
    } else {
      //if values update
      let newFillColor = SVs.open ? "white" : SVs.selectedStyle.markerColor;
      if (pointJXG.current.visProp.fillcolor !== newFillColor) {
        pointJXG.current.visProp.fillcolor = newFillColor;
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

      if (pointJXG.current.visProp.strokecolor !== SVs.selectedStyle.markerColor) {
        pointJXG.current.visProp.strokecolor = SVs.selectedStyle.markerColor;
        shadowPointJXG.current.visProp.strokecolor = SVs.selectedStyle.markerColor;
      }

      let newFace = normalizeStyle(SVs.selectedStyle.markerStyle);
      if (pointJXG.current.visProp.face !== newFace) {
        pointJXG.current.setAttribute({ face: newFace });
        shadowPointJXG.current.setAttribute({ face: newFace });
      }
      if (pointJXG.current.visProp.size !== SVs.selectedStyle.markerSize) {
        pointJXG.current.visProp.size = SVs.selectedStyle.markerSize
        shadowPointJXG.current.visProp.size = SVs.selectedStyle.markerSize
      }

      if (SVs.draggable && !SVs.fixed) {
        pointJXG.current.visProp.highlightfillcolor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        pointJXG.current.visProp.highlightstrokecolor = getComputedStyle(document.documentElement).getPropertyValue("--lightBlue");
        pointJXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;
        shadowPointJXG.current.visProp.highlightfillcolor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        shadowPointJXG.current.visProp.highlightstrokecolor = getComputedStyle(document.documentElement).getPropertyValue("--lightBlue");
        shadowPointJXG.current.visProp.fixed = false;
      } else {
        pointJXG.current.visProp.highlightfillcolor = newFillColor;
        pointJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.markerColor;
        pointJXG.current.visProp.showinfobox = false;
        shadowPointJXG.current.visProp.highlightfillcolor = newFillColor;
        shadowPointJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.markerColor;
        shadowPointJXG.current.visProp.fixed = true;
      }

      //Update only when the change was initiated with this point
      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        board.updateInfobox(pointJXG.current);
      }

      pointJXG.current.name = SVs.label;

      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        pointJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      if (pointJXG.current.hasLabel) {
        pointJXG.current.label.needsUpdate = true;
        if (SVs.applyStyleToLabel) {
          pointJXG.current.label.visProp.strokecolor = SVs.selectedStyle.markerColor;
        } else {
          pointJXG.current.label.visProp.strokecolor = "#000000";
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

    return <a name={name} />
  }

  // not in board

  if (SVs.hidden) {
    return null;
  }

  //Render text coordinates when outside of graph

  let mathJaxify = "\\(" + me.fromAst(SVs.coordsForDisplay).toLatex() + "\\)";
  return <><a name={name} /><span id={name}><MathJax hideUntilTypeset={"first"} inline dynamic >{mathJaxify}</MathJax></span></>


})

function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}