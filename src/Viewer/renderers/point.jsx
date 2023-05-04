import React, { useContext, useEffect, useState, useRef } from "react";
import useDoenetRender from "../useDoenetRenderer";
import { BoardContext, POINT_LAYER_OFFSET } from "./graph";
import { MathJax } from "better-react-mathjax";
import { darkModeAtom } from "../../Tools/_framework/DarkmodeController";
import { useRecoilValue } from "recoil";
import { textRendererStyle } from "../../Core/utils/style";

export default React.memo(function Point(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRender(props);

  Point.ignoreActionsWithoutCore = () => true;

  // console.log(`for point ${name}, SVs: `, SVs)

  const board = useContext(BoardContext);

  let pointJXG = useRef(null);
  let shadowPointJXG = useRef(null);

  let pointerAtDown = useRef(null);
  let pointAtDown = useRef(null);
  let pointerIsDown = useRef(false);
  let pointerMovedSinceDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);
  let calculatedX = useRef(null);
  let calculatedY = useRef(null);

  let lastPositionFromCore = useRef(null);

  // for each coordinate, will be -1 or 1 if moved off graph in that direction
  let offGraphIndicator = useRef([0, 0]);

  // for each coordinate, will be -1 or 1 if near edge of graph (or off graph) in that direction
  let nearEdgeOfGraph = useRef([0, 0]);

  let fixed = useRef(false);
  let fixLocation = useRef(false);
  let switchable = useRef(false);

  fixed.current = SVs.fixed;
  fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;
  switchable.current = SVs.switchable && !SVs.fixed;

  const darkMode = useRecoilValue(darkModeAtom);

  const useOpenSymbol =
    SVs.open || ["cross", "plus"].includes(SVs.selectedStyle.markerStyle); // Cross and plus should always be treated as "open" to remain visible on graph

  useEffect(() => {
    //On unmount
    return () => {
      // if point is defined
      if (pointJXG.current !== null) {
        shadowPointJXG.current.off("drag");
        shadowPointJXG.current.off("down");
        shadowPointJXG.current.off("hit");
        shadowPointJXG.current.off("up");
        shadowPointJXG.current.off("keyfocusout");
        shadowPointJXG.current.off("keydown");
        board.removeObject(pointJXG.current);
        board.removeObject(shadowPointJXG.current);
        pointJXG.current = null;
        shadowPointJXG.current = null;
      }

      if (board) {
        board.off("move", boardMoveHandler);
      }
    };
  }, []);

  useEffect(() => {
    if (board) {
      board.on("move", boardMoveHandler);
    }
  }, [board]);

  function createPointJXG() {
    let markerColor =
      darkMode === "dark"
        ? SVs.selectedStyle.markerColorDarkMode
        : SVs.selectedStyle.markerColor;
    let fillColor = useOpenSymbol ? "var(--canvas)" : markerColor;
    let strokeColor = useOpenSymbol ? markerColor : "none";

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
      highlightFillColor: getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--mainGray"),
      highlightStrokeColor: getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--lightBlue"),
      size: normalizeSize(
        SVs.selectedStyle.markerSize,
        SVs.selectedStyle.markerStyle,
      ),
      face: normalizeStyle(
        SVs.selectedStyle.markerStyle,
        offGraphIndicator.current,
      ),
      highlight: !fixLocation.current,
    };

    if (withlabel) {
      let labelPosition = adjustLabelPosition(
        SVs.labelPosition,
        nearEdgeOfGraph.current,
      );
      previousLabelPosition.current = labelPosition;

      let { offset, anchorx, anchory } = calculateLabelAnchor(labelPosition);
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
        highlight: false,
      };
      if (SVs.labelHasLatex) {
        jsxPointAttributes.label.useMathJax = true;
      }
    }

    if (fixLocation.current) {
      jsxPointAttributes.showInfoBox = false;
    } else {
      jsxPointAttributes.showInfoBox = SVs.showCoordsWhenDragging;
    }

    let coords = [
      lastPositionFromCore.current[0],
      lastPositionFromCore.current[1],
    ];

    if (!Number.isFinite(coords[0])) {
      coords[0] = 0;
      jsxPointAttributes["visible"] = false;
    }
    if (!Number.isFinite(coords[1])) {
      coords[1] = 0;
      jsxPointAttributes["visible"] = false;
    }

    let shadowPointAttributes = { ...jsxPointAttributes };
    shadowPointAttributes.fixed = fixed.current;
    shadowPointAttributes.showInfoBox = false;
    shadowPointAttributes.withlabel = false;
    shadowPointAttributes.fillOpacity = 0;
    shadowPointAttributes.strokeOpacity = 0;
    shadowPointAttributes.highlightFillOpacity = 0;
    shadowPointAttributes.highlightStrokeOpacity = 0;

    let newShadowPointJXG = board.create(
      "point",
      coords,
      shadowPointAttributes,
    );
    newShadowPointJXG.isDraggable = !fixLocation.current;

    let newPointJXG = board.create("point", coords, jsxPointAttributes);

    newShadowPointJXG.on("down", function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newShadowPointJXG.coords.scrCoords];
      dragged.current = false;
      shadowPointJXG.current.visProp.highlightfillopacity =
        pointJXG.current.visProp.fillopacity;
      shadowPointJXG.current.visProp.highlightstrokeopacity =
        pointJXG.current.visProp.strokeopacity;

      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;

      if (!fixed.current) {
        callAction({
          action: actions.pointFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    newShadowPointJXG.on("hit", function (e) {
      dragged.current = false;
      callAction({
        action: actions.pointFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    newShadowPointJXG.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.movePoint,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        if (switchable.current) {
          callAction({
            action: actions.switchPoint,
          });
          callAction({
            action: actions.pointClicked,
            args: { name }, // send name so get original name if adapted
          });
        } else {
          callAction({
            action: actions.pointClicked,
            args: { name }, // send name so get original name if adapted
          });
        }
      }
      pointerIsDown.current = false;

      shadowPointJXG.current.visProp.highlightfillopacity = 0;
      shadowPointJXG.current.visProp.highlightstrokeopacity = 0;
    });

    newShadowPointJXG.on("hit", function (e) {
      board.updateInfobox(pointJXG.current);
    });

    newShadowPointJXG.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.movePoint,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      }
    });

    newShadowPointJXG.on("drag", function (e) {
      let viaPointer = e.type === "pointermove";

      //Protect against very small unintended drags
      if (
        !viaPointer ||
        Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > 0.1
      ) {
        dragged.current = true;
      }

      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

      let xminAdjusted = xmin;
      let xmaxAdjusted = xmax;
      let yminAdjusted = ymin;
      let ymaxAdjusted = ymax;

      if (xmax < xmin) {
        [xmaxAdjusted, xminAdjusted] = [xminAdjusted, xmaxAdjusted];
      }
      if (ymax < ymin) {
        [ymaxAdjusted, yminAdjusted] = [yminAdjusted, ymaxAdjusted];
      }

      let xscale = xmaxAdjusted - xminAdjusted;
      let yscale = ymaxAdjusted - yminAdjusted;

      xmaxAdjusted -= xscale * 0.01;
      xminAdjusted += xscale * 0.01;
      ymaxAdjusted -= yscale * 0.01;
      yminAdjusted += yscale * 0.01;

      if (viaPointer) {
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
        calculatedX.current =
          (pointAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) /
          board.unitX;
        calculatedY.current =
          (o[2] - (pointAtDown.current[2] + e.y - pointerAtDown.current[1])) /
          board.unitY;
      } else {
        calculatedX.current = newShadowPointJXG.X();
        calculatedY.current = newShadowPointJXG.Y();
      }

      calculatedX.current = Math.min(
        xmaxAdjusted,
        Math.max(xminAdjusted, calculatedX.current),
      );
      calculatedY.current = Math.min(
        ymaxAdjusted,
        Math.max(yminAdjusted, calculatedY.current),
      );

      callAction({
        action: actions.movePoint,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        },
      });

      let shadowX = Math.min(
        xmaxAdjusted,
        Math.max(xminAdjusted, newShadowPointJXG.X()),
      );
      let shadowY = Math.min(
        ymaxAdjusted,
        Math.max(yminAdjusted, newShadowPointJXG.Y()),
      );
      newShadowPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, [
        shadowX,
        shadowY,
      ]);

      newPointJXG.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastPositionFromCore.current,
      );
      board.updateInfobox(newPointJXG);
    });

    newShadowPointJXG.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.movePoint,
            args: {
              x: calculatedX.current,
              y: calculatedY.current,
            },
          });
          dragged.current = false;
        }

        if (switchable.current) {
          callAction({
            action: actions.switchPoint,
          });
          callAction({
            action: actions.pointClicked,
            args: { name }, // send name so get original name if adapted
          });
        } else {
          callAction({
            action: actions.pointClicked,
            args: { name }, // send name so get original name if adapted
          });
        }
      }
    });

    pointJXG.current = newPointJXG;
    shadowPointJXG.current = newShadowPointJXG;
    previousWithLabel.current = withlabel;
  }

  function boardMoveHandler(e) {
    if (pointerIsDown.current) {
      //Protect against very small unintended move
      if (
        Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > 0.1
      ) {
        pointerMovedSinceDown.current = true;
      }
    }
  }

  if (board) {
    lastPositionFromCore.current = [...SVs.numericalXs];
    offGraphIndicator.current = [0, 0];
    nearEdgeOfGraph.current = [0, 0];
    let flippedX = false;
    let flippedY = false;

    let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

    if (xmax < xmin) {
      flippedX = true;
      [xmax, xmin] = [xmin, xmax];
    }
    if (ymax < ymin) {
      flippedY = true;
      [ymax, ymin] = [ymin, ymax];
    }

    let xscale = xmax - xmin;
    let yscale = ymax - ymin;

    let xminAdjusted, xmaxAdjusted, yminAdjusted, ymaxAdjusted;

    if (!SVs.hideOffGraphIndicator) {
      xminAdjusted = xmin + xscale * 0.01;
      xmaxAdjusted = xmax - xscale * 0.01;
      yminAdjusted = ymin + yscale * 0.01;
      ymaxAdjusted = ymax - yscale * 0.01;

      if (lastPositionFromCore.current[0] < xminAdjusted) {
        offGraphIndicator.current[0] = flippedX ? 1 : -1;
        lastPositionFromCore.current[0] = xminAdjusted;
      } else if (lastPositionFromCore.current[0] > xmaxAdjusted) {
        offGraphIndicator.current[0] = flippedX ? -1 : 1;
        lastPositionFromCore.current[0] = xmaxAdjusted;
      }

      if (lastPositionFromCore.current[1] < yminAdjusted) {
        offGraphIndicator.current[1] = flippedY ? 1 : -1;
        lastPositionFromCore.current[1] = yminAdjusted;
      } else if (lastPositionFromCore.current[1] > ymaxAdjusted) {
        offGraphIndicator.current[1] = flippedY ? -1 : 1;
        lastPositionFromCore.current[1] = ymaxAdjusted;
      }
    }

    // TODO: use a measure of label width rather than 0.05 for x
    xminAdjusted = xmin + xscale * 0.05;
    xmaxAdjusted = xmax - xscale * 0.05;
    yminAdjusted = ymin + yscale * 0.05;
    ymaxAdjusted = ymax - yscale * 0.05;

    if (lastPositionFromCore.current[0] < xminAdjusted) {
      nearEdgeOfGraph.current[0] = flippedX ? 1 : -1;
    } else if (lastPositionFromCore.current[0] > xmaxAdjusted) {
      nearEdgeOfGraph.current[0] = flippedX ? -1 : 1;
    }

    if (lastPositionFromCore.current[1] < yminAdjusted) {
      nearEdgeOfGraph.current[1] = flippedY ? 1 : -1;
    } else if (lastPositionFromCore.current[1] > ymaxAdjusted) {
      nearEdgeOfGraph.current[1] = flippedY ? -1 : 1;
    }

    if (pointJXG.current === null) {
      createPointJXG();
    } else {
      //if values update
      let markerColor =
        darkMode === "dark"
          ? SVs.selectedStyle.markerColorDarkMode
          : SVs.selectedStyle.markerColor;
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
      let x = lastPositionFromCore.current?.[0];
      let y = lastPositionFromCore.current?.[1];

      pointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);
      if (!dragged.current) {
        shadowPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, [
          x,
          y,
        ]);
      }

      let visible = !SVs.hidden;

      if (Number.isFinite(x) && Number.isFinite(y)) {
        let actuallyChangedVisibility =
          pointJXG.current.visProp["visible"] !== visible;
        pointJXG.current.visProp["visible"] = visible;
        pointJXG.current.visPropCalc["visible"] = visible;
        shadowPointJXG.current.visProp["visible"] = visible;
        shadowPointJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          pointJXG.current.setAttribute({ visible: visible });
          shadowPointJXG.current.setAttribute({ visible: visible });
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

      pointJXG.current.visProp.highlight = !fixLocation.current;
      shadowPointJXG.current.visProp.highlight = !fixLocation.current;
      shadowPointJXG.current.visProp.fixed = fixed.current;
      shadowPointJXG.current.isDraggable = !fixLocation.current;

      if (pointJXG.current.visProp.strokecolor !== strokeColor) {
        pointJXG.current.visProp.strokecolor = strokeColor;
        shadowPointJXG.current.visProp.strokecolor = strokeColor;
        pointJXG.current.visProp.fillColor = fillColor;
        shadowPointJXG.current.visProp.fillColor = fillColor;
      }
      if (
        pointJXG.current.visProp.strokeopacity !==
        SVs.selectedStyle.markerOpacity
      ) {
        pointJXG.current.visProp.strokeopacity =
          SVs.selectedStyle.markerOpacity;
        pointJXG.current.visProp.fillopacity = SVs.selectedStyle.markerOpacity;
      }

      let newFace = normalizeStyle(
        SVs.selectedStyle.markerStyle,
        offGraphIndicator.current,
      );
      if (pointJXG.current.visProp.face !== newFace) {
        pointJXG.current.setAttribute({ face: newFace });
        shadowPointJXG.current.setAttribute({ face: newFace });
      }
      let newSize = normalizeSize(
        SVs.selectedStyle.markerSize,
        SVs.selectedStyle.markerStyle,
      );
      if (pointJXG.current.visProp.size !== newSize) {
        pointJXG.current.setAttribute({ size: newSize });
        shadowPointJXG.current.setAttribute({ size: newSize });
      }

      if (
        fixLocation.current ||
        offGraphIndicator.current[0] ||
        offGraphIndicator.current[1]
      ) {
        pointJXG.current.visProp.showinfobox = false;
        board.displayInfobox(false);
      } else {
        pointJXG.current.visProp.showinfobox = SVs.showCoordsWhenDragging;
      }

      if (shadowPointJXG.current.highlighted) {
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

        let labelPosition = adjustLabelPosition(
          SVs.labelPosition,
          nearEdgeOfGraph.current,
        );

        if (labelPosition !== previousLabelPosition.current) {
          let { offset, anchorx, anchory } =
            calculateLabelAnchor(labelPosition);
          pointJXG.current.label.visProp.anchorx = anchorx;
          pointJXG.current.label.visProp.anchory = anchory;
          pointJXG.current.label.visProp.offset = offset;
          previousLabelPosition.current = labelPosition;
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

    return <a name={id} />;
  }

  // not in board

  if (SVs.hidden) {
    return null;
  }

  //Render text coordinates when outside of graph

  let mathJaxify = "\\(" + SVs.latex + "\\)";
  let style = textRendererStyle(darkMode, SVs.selectedStyle);
  return (
    <>
      <a name={id} />
      <span id={id} style={style}>
        <MathJax hideUntilTypeset={"first"} inline dynamic>
          {mathJaxify}
        </MathJax>
      </span>
    </>
  );
});

function adjustLabelPosition(labelPosition, nearEdgeOfGraph) {
  if (nearEdgeOfGraph[0] === -1) {
    if (
      labelPosition.substring(
        labelPosition.length - 4,
        labelPosition.length,
      ) === "left"
    ) {
      labelPosition =
        labelPosition.substring(0, labelPosition.length - 4) + "right";
    } else if (labelPosition === "top") {
      labelPosition = "upperright";
    } else if (labelPosition === "bottom") {
      labelPosition = "lowerright";
    }
  } else if (nearEdgeOfGraph[0] === 1) {
    if (
      labelPosition.substring(
        labelPosition.length - 5,
        labelPosition.length,
      ) === "right"
    ) {
      labelPosition =
        labelPosition.substring(0, labelPosition.length - 5) + "left";
    } else if (labelPosition === "top") {
      labelPosition = "upperleft";
    } else if (labelPosition === "bottom") {
      labelPosition = "lowerleft";
    }
  }

  if (nearEdgeOfGraph[1] === -1) {
    if (labelPosition.substring(0, 5, labelPosition.length) === "lower") {
      labelPosition =
        "upper" + labelPosition.substring(5, labelPosition.length);
    } else if (labelPosition === "left") {
      labelPosition = "upperleft";
    } else if (labelPosition === "right") {
      labelPosition = "upperright";
    }
  } else if (nearEdgeOfGraph[1] === 1) {
    if (labelPosition.substring(0, 5, labelPosition.length) === "upper") {
      labelPosition =
        "lower" + labelPosition.substring(5, labelPosition.length);
    } else if (labelPosition === "left") {
      labelPosition = "lowerleft";
    } else if (labelPosition === "right") {
      labelPosition = "lowerright";
    }
  }

  return labelPosition;
}

function calculateLabelAnchor(labelPosition) {
  let anchorx, anchory, offset;
  if (labelPosition === "upperright") {
    offset = [5, 5];
    anchorx = "left";
    anchory = "bottom";
  } else if (labelPosition === "upperleft") {
    offset = [-5, 5];
    anchorx = "right";
    anchory = "bottom";
  } else if (labelPosition === "lowerright") {
    offset = [5, -5];
    anchorx = "left";
    anchory = "top";
  } else if (labelPosition === "lowerleft") {
    offset = [-5, -5];
    anchorx = "right";
    anchory = "top";
  } else if (labelPosition === "top") {
    offset = [0, 10];
    anchorx = "middle";
    anchory = "bottom";
  } else if (labelPosition === "bottom") {
    offset = [0, -10];
    anchorx = "middle";
    anchory = "top";
  } else if (labelPosition === "left") {
    offset = [-10, 0];
    anchorx = "right";
    anchory = "middle";
  } else {
    // labelPosition === right
    offset = [10, 0];
    anchorx = "left";
    anchory = "middle";
  }
  return { offset, anchorx, anchory };
}

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

function normalizeStyle(style, movedFromOffGraph) {
  if (movedFromOffGraph[1] === -1) {
    return "triangledown";
  } else if (movedFromOffGraph[1] === 1) {
    return "triangleup";
  } else if (movedFromOffGraph[0] === -1) {
    return "triangleleft";
  } else if (movedFromOffGraph[0] === 1) {
    return "triangleright";
  } else if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}
