import React, { useContext, useEffect, useState, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../../Tools/_framework/DarkmodeController";
// import me from 'math-expressions';

export default React.memo(function Ray(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRenderer(props);

  Ray.ignoreActionsWithoutCore = () => true;

  const board = useContext(BoardContext);

  let rayJXG = useRef({});

  let pointerAtDown = useRef(null);
  let pointsAtDown = useRef(null);
  let pointerIsDown = useRef(false);
  let pointerMovedSinceDown = useRef(false);
  let dragged = useRef(false);

  let previousWithLabel = useRef(null);
  let pointCoords = useRef(null);

  let lastEndpointFromCore = useRef(null);
  let lastThroughpointFromCore = useRef(null);
  let fixed = useRef(false);
  let fixLocation = useRef(false);

  lastEndpointFromCore.current = SVs.numericalEndpoint;
  lastThroughpointFromCore.current = SVs.numericalThroughpoint;
  fixed.current = SVs.fixed;
  fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    //On unmount
    return () => {
      // if ray is defined
      if (Object.keys(rayJXG.current).length !== 0) {
        deleteRayJXG();
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

  function createRayJXG() {
    if (
      SVs.numericalEndpoint.length !== 2 ||
      SVs.numericalThroughpoint.length !== 2
    ) {
      rayJXG.current = {};

      return;
    }

    let lineColor =
      darkMode === "dark"
        ? SVs.selectedStyle.lineColorDarkMode
        : SVs.selectedStyle.lineColor;

    //things to be passed to JSXGraph as attributes
    var jsxRayAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.labelForGraph !== "",
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      fixed: fixed.current,
      strokeColor: lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
      highlight: !fixLocation.current,
      straightFirst: false,
    };

    jsxRayAttributes.label = {
      highlight: false,
    };
    if (SVs.labelHasLatex) {
      jsxRayAttributes.label.useMathJax = true;
    }

    if (SVs.applyStyleToLabel) {
      jsxRayAttributes.label.strokeColor = lineColor;
    } else {
      jsxRayAttributes.label.strokeColor = "var(--canvastext)";
    }

    let through = [[...SVs.numericalEndpoint], [...SVs.numericalThroughpoint]];

    let newRayJXG = board.create("line", through, jsxRayAttributes);
    newRayJXG.isDraggable = !fixLocation.current;

    newRayJXG.on("drag", function (e) {
      let viaPointer = e.type === "pointermove";

      //Protect against very small unintended drags
      if (
        !viaPointer ||
        Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > 0.1
      ) {
        dragged.current = true;

        pointCoords.current = [];

        for (let i = 0; i < 2; i++) {
          if (viaPointer) {
            // the reason we calculate point position with this algorithm,
            // rather than using .X() and .Y() directly
            // is so that points don't get trapped on an attracting object
            // if you move the mouse slowly.
            // The attributes .X() and .Y() are affected by
            // .setCoordinates functions called in update()
            // so will get modified to go back to the attracting object
            var o = board.origin.scrCoords;
            let calculatedX =
              (pointsAtDown.current[i][1] +
                e.x -
                pointerAtDown.current[0] -
                o[1]) /
              board.unitX;
            let calculatedY =
              (o[2] -
                (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1])) /
              board.unitY;
            pointCoords.current.push([calculatedX, calculatedY]);
          } else {
            pointCoords.current.push([
              newRayJXG.point1.X(),
              newRayJXG.point1.Y(),
            ]);
            pointCoords.current.push([
              newRayJXG.point2.X(),
              newRayJXG.point2.Y(),
            ]);
          }
        }

        callAction({
          action: actions.moveRay,
          args: {
            endpointcoords: pointCoords.current[0],
            throughcoords: pointCoords.current[1],
            transient: true,
            skippable: true,
          },
        });
      }

      rayJXG.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastEndpointFromCore.current,
      );
      rayJXG.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastThroughpointFromCore.current,
      );
    });

    newRayJXG.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveRay,
          args: {
            endpointcoords: pointCoords.current[0],
            throughcoords: pointCoords.current[1],
          },
        });
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        callAction({
          action: actions.rayClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointerIsDown.current = false;
    });

    newRayJXG.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveRay,
          args: {
            point1coords: pointCoords.current[0],
            point2coords: pointCoords.current[1],
          },
        });
        dragged.current = false;
      }
    });

    newRayJXG.on("down", function (e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...newRayJXG.point1.coords.scrCoords],
        [...newRayJXG.point2.coords.scrCoords],
      ];
      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      if (!fixed.current) {
        callAction({
          action: actions.rayFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    newRayJXG.on("hit", function (e) {
      dragged.current = false;
      callAction({
        action: actions.rayFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    newRayJXG.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveRay,
            args: {
              point1coords: pointCoords.current[0],
              point2coords: pointCoords.current[1],
            },
          });
          dragged.current = false;
        }

        callAction({
          action: actions.rayClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    previousWithLabel.current = SVs.labelForGraph !== "";

    rayJXG.current = newRayJXG;
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

  function deleteRayJXG() {
    rayJXG.current.off("drag");
    rayJXG.current.off("down");
    rayJXG.current.off("hit");
    rayJXG.current.off("up");
    rayJXG.current.off("keyfocusout");
    rayJXG.current.off("keydown");
    board.removeObject(rayJXG.current);
    rayJXG.current = {};
  }

  if (board) {
    if (Object.keys(rayJXG.current).length === 0) {
      createRayJXG();
    } else if (
      SVs.numericalEndpoint.length !== 2 ||
      SVs.numericalThroughpoint.length !== 2
    ) {
      deleteRayJXG();
    } else {
      let validCoords = true;

      for (let coords of [SVs.numericalEndpoint, SVs.numericalThroughpoint]) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }

      rayJXG.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        SVs.numericalEndpoint,
      );
      rayJXG.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        SVs.numericalThroughpoint,
      );

      let visible = !SVs.hidden;

      if (validCoords) {
        let actuallyChangedVisibility =
          rayJXG.current.visProp["visible"] !== visible;
        rayJXG.current.visProp["visible"] = visible;
        rayJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // at least for point, this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          rayJXG.current.setAttribute({ visible: visible });
        }
      } else {
        rayJXG.current.visProp["visible"] = false;
        rayJXG.current.visPropCalc["visible"] = false;
        // rayJXG.current.setAttribute({visible: false})
      }

      rayJXG.current.visProp.fixed = fixed.current;
      rayJXG.current.visProp.highlight = !fixLocation.current;
      rayJXG.current.isDraggable = !fixLocation.current;

      let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = rayJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        rayJXG.current.setAttribute({ layer });
      }

      let lineColor =
        darkMode === "dark"
          ? SVs.selectedStyle.lineColorDarkMode
          : SVs.selectedStyle.lineColor;

      if (rayJXG.current.visProp.strokecolor !== lineColor) {
        rayJXG.current.visProp.strokecolor = lineColor;
        rayJXG.current.visProp.highlightstrokecolor = lineColor;
      }
      if (rayJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        rayJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth;
        rayJXG.current.visProp.highlightstrokewidth =
          SVs.selectedStyle.lineWidth;
      }
      if (
        rayJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity
      ) {
        rayJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
        rayJXG.current.visProp.highlightstrokeopacity =
          SVs.selectedStyle.lineOpacity * 0.5;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle);
      if (rayJXG.current.visProp.dash !== newDash) {
        rayJXG.current.visProp.dash = newDash;
      }

      rayJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        rayJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      rayJXG.current.needsUpdate = true;
      rayJXG.current.update();
      if (rayJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          rayJXG.current.label.visProp.strokecolor = lineColor;
        } else {
          rayJXG.current.label.visProp.strokecolor = "var(--canvastext)";
        }
        rayJXG.current.label.needsUpdate = true;
        rayJXG.current.label.update();
      }
      board.updateRenderer();
    }
  }

  if (SVs.hidden) {
    return null;
  }

  return (
    <>
      <a name={id} />
    </>
  );
});

function styleToDash(style) {
  if (style === "solid") {
    return 0;
  } else if (style === "dashed") {
    return 2;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}
