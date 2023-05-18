import React, { useContext, useEffect, useRef } from "react";
import useDoenetRender from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, POINT_LAYER_OFFSET } from "./graph";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../../Tools/_framework/DarkmodeController";
import {
  characterizeOffGraphCircleArc,
  characterizeOffGraphPoint,
} from "./utils/offGraphIndicators";
import {
  adjustPointLabelPosition,
  calculatePointLabelAnchor,
  getEffectiveBoundingBox,
  getGraphCornerWithBuffer,
  normalizePointSize,
  normalizePointStyle,
} from "./utils/graph";

export default React.memo(function Circle(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props);

  Circle.ignoreActionsWithoutCore = () => true;

  const board = useContext(BoardContext);

  let circleJXG = useRef(null);
  let indicatorJXG = useRef(null);

  let dragged = useRef(false);
  let pointerAtDown = useRef(null);
  let pointerIsDown = useRef(false);
  let pointerMovedSinceDown = useRef(false);
  let centerAtDown = useRef(null);
  let radiusAtDown = useRef(null);
  let throughAnglesAtDown = useRef(null);
  let previousWithLabel = useRef(null);
  let previousPointLabelPosition = useRef(null);
  let centerCoords = useRef(null);

  let lastCenterFromCore = useRef(null);
  let throughAnglesFromCore = useRef(null);
  let fixed = useRef(false);
  let fixLocation = useRef(false);

  // for each coordinate, will be -1 or 1 if moved off graph in that direction
  let displayOffGraphIndicator = useRef(false);
  let offGraphIndicatorOrientation = useRef([0, 0]);
  let offGraphIndicatorCoords = useRef([0, 0]);
  let offGraphIndicatorOffsetAtDown = useRef([0, 0]);

  lastCenterFromCore.current = SVs.numericalCenter;
  throughAnglesFromCore.current = SVs.throughAngles;
  fixed.current = SVs.fixed;
  fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    //On unmount
    return () => {
      // if point is defined
      if (circleJXG.current) {
        deleteCircleJXG();
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

  function createCircleJXG() {
    if (
      !(
        Number.isFinite(SVs.numericalCenter[0]) &&
        Number.isFinite(SVs.numericalCenter[1]) &&
        SVs.numericalRadius > 0
      )
    ) {
      return null;
    }

    let lineColor =
      darkMode === "dark"
        ? SVs.selectedStyle.lineColorDarkMode
        : SVs.selectedStyle.lineColor;
    let fillColor =
      darkMode === "dark"
        ? SVs.selectedStyle.fillColorDarkMode
        : SVs.selectedStyle.fillColor;
    fillColor = SVs.filled ? fillColor : "none";
    let markerColor =
      darkMode === "dark"
        ? SVs.selectedStyle.markerColorDarkMode
        : SVs.selectedStyle.markerColor;

    let withlabel = SVs.labelForGraph !== "";

    var jsxCircleAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withlabel,
      fixed: fixed.current,
      layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
      strokeColor: lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
      fillColor,
      fillOpacity: SVs.selectedStyle.fillOpacity,
      highlightFillColor: fillColor,
      highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
      highlight: !fixLocation.current,
    };

    if (SVs.filled) {
      jsxCircleAttributes.hasInnerPoints = true;
    }

    jsxCircleAttributes.label = {
      highlight: false,
    };
    if (SVs.labelHasLatex) {
      jsxCircleAttributes.label.useMathJax = true;
    }

    if (SVs.labelForGraph !== "") {
      if (SVs.applyStyleToLabel) {
        jsxCircleAttributes.label.strokeColor = lineColor;
      } else {
        jsxCircleAttributes.label.strokeColor = "var(--canvastext)";
      }
    }

    circleJXG.current = board.create(
      "circle",
      [[...SVs.numericalCenter], SVs.numericalRadius],
      jsxCircleAttributes,
    );

    circleJXG.current.isDraggable = !fixLocation.current;

    let jsxPointAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden && displayOffGraphIndicator.current,
      withlabel,
      fixed: fixed.current,
      layer: 10 * SVs.layer + POINT_LAYER_OFFSET,
      fillColor: markerColor,
      strokeColor: "none",
      strokeOpacity: SVs.selectedStyle.markerOpacity,
      fillOpacity: SVs.selectedStyle.markerOpacity,
      highlightFillColor: "var(--mainGray)",
      highlightStrokeColor: "var(--lightBlue)",
      size: normalizePointSize(
        SVs.selectedStyle.markerSize,
        SVs.selectedStyle.markerStyle,
      ),
      face: normalizePointStyle(
        SVs.selectedStyle.markerStyle,
        offGraphIndicatorOrientation.current,
      ),
      highlight: !fixLocation.current,
      showinfobox: false,
    };

    if (withlabel) {
      let labelPosition = adjustPointLabelPosition(
        "upperright",
        offGraphIndicatorOrientation.current,
      );
      previousPointLabelPosition.current = labelPosition;

      let { offset, anchorx, anchory } =
        calculatePointLabelAnchor(labelPosition);
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

    indicatorJXG.current = board.create(
      "point",
      [...offGraphIndicatorCoords.current],
      jsxPointAttributes,
    );

    indicatorJXG.isDraggable = !fixLocation.current;

    circleJXG.current.on("drag", function (e) {
      let viaPointer = e.type === "pointermove";

      //Protect against very small unintended drags
      if (
        !viaPointer ||
        Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > 0.1
      ) {
        dragged.current = true;
      }

      if (viaPointer) {
        // the reason we calculate point position with this algorithm,
        // rather than using .X() and .Y() directly
        // is so that center doesn't get trapped on an attracting object
        // if you move the mouse slowly.
        // The attributes .X() and .Y() are affected by
        // .setCoordinates functions called in update()
        // so will get modified to go back to the attracting object

        var o = board.origin.scrCoords;
        let calculatedX =
          (centerAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) /
          board.unitX;
        let calculatedY =
          (o[2] - (centerAtDown.current[2] + e.y - pointerAtDown.current[1])) /
          board.unitY;
        centerCoords.current = [calculatedX, calculatedY];
      } else {
        centerCoords.current = [
          circleJXG.current.center.X(),
          circleJXG.current.center.Y(),
        ];
      }

      callAction({
        action: actions.moveCircle,
        args: {
          center: centerCoords.current,
          radius: radiusAtDown.current,
          throughAngles: throughAnglesAtDown.current,
          transient: true,
          skippable: true,
        },
      });

      circleJXG.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [
        ...lastCenterFromCore.current,
      ]);
    });

    circleJXG.current.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveCircle,
          args: {
            center: centerCoords.current,
            radius: radiusAtDown.current,
            throughAngles: throughAnglesAtDown.current,
          },
        });
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        callAction({
          action: actions.circleClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointerIsDown.current = false;
    });

    circleJXG.current.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveCircle,
          args: {
            center: centerCoords.current,
            radius: radiusAtDown.current,
            throughAngles: throughAnglesAtDown.current,
          },
        });
        dragged.current = false;
      }
      pointerIsDown.current = false;
    });

    circleJXG.current.on("down", function (e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      centerAtDown.current = [...circleJXG.current.center.coords.scrCoords];
      radiusAtDown.current = circleJXG.current.radius;
      throughAnglesAtDown.current = [...throughAnglesFromCore.current];
      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      if (!fixed.current) {
        callAction({
          action: actions.circleFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    // hit is called by jsxgraph when focused in via keyboard
    circleJXG.current.on("hit", function (e) {
      dragged.current = false;
      centerAtDown.current = [...circleJXG.current.center.coords.scrCoords];
      radiusAtDown.current = circleJXG.current.radius;
      throughAnglesAtDown.current = [...throughAnglesFromCore.current];
      callAction({
        action: actions.circleFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    circleJXG.current.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveCircle,
            args: {
              center: centerCoords.current,
              radius: radiusAtDown.current,
              throughAngles: throughAnglesAtDown.current,
            },
          });
          dragged.current = false;
        }
        callAction({
          action: actions.circleClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    indicatorJXG.current.on("drag", function (e) {
      let viaPointer = e.type === "pointermove";

      //Protect against very small unintended drags
      if (
        !viaPointer ||
        Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > 0.1
      ) {
        dragged.current = true;
      }

      centerCoords.current = [
        indicatorJXG.current.X() + offGraphIndicatorOffsetAtDown.current[0],
        indicatorJXG.current.Y() + offGraphIndicatorOffsetAtDown.current[1],
      ];

      callAction({
        action: actions.moveCircle,
        args: {
          center: centerCoords.current,
          radius: radiusAtDown.current,
          throughAngles: throughAnglesAtDown.current,
          transient: true,
          skippable: true,
        },
      });
    });

    indicatorJXG.current.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveCircle,
          args: {
            center: centerCoords.current,
            radius: radiusAtDown.current,
            throughAngles: throughAnglesAtDown.current,
          },
        });
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        callAction({
          action: actions.circleClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointerIsDown.current = false;
    });

    indicatorJXG.current.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveCircle,
          args: {
            center: centerCoords.current,
            radius: radiusAtDown.current,
            throughAngles: throughAnglesAtDown.current,
          },
        });
        dragged.current = false;
      }
      pointerIsDown.current = false;
    });

    indicatorJXG.current.on("down", function (e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      centerAtDown.current = [...circleJXG.current.center.coords.scrCoords];
      radiusAtDown.current = circleJXG.current.radius;
      throughAnglesAtDown.current = [...throughAnglesFromCore.current];

      let { flippedX, flippedY } = getEffectiveBoundingBox(board);

      let xSign = flippedX ? -1 : 1;
      let ySign = flippedY ? -1 : 1;

      if (
        offGraphIndicatorOrientation.current[0] === 0 ||
        offGraphIndicatorOrientation.current[1] === 0
      ) {
        offGraphIndicatorOffsetAtDown.current = [
          xSign *
            offGraphIndicatorOrientation.current[0] *
            radiusAtDown.current,
          ySign *
            offGraphIndicatorOrientation.current[1] *
            radiusAtDown.current,
        ];
      } else {
        let sqrt2 = Math.sqrt(2);
        offGraphIndicatorOffsetAtDown.current = [
          (xSign / sqrt2) *
            offGraphIndicatorOrientation.current[0] *
            radiusAtDown.current,
          (ySign / sqrt2) *
            offGraphIndicatorOrientation.current[1] *
            radiusAtDown.current,
        ];
      }

      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      if (!fixed.current) {
        callAction({
          action: actions.circleFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    // hit is called by jsxgraph when focused in via keyboard
    indicatorJXG.current.on("hit", function (e) {
      dragged.current = false;
      centerAtDown.current = [...circleJXG.current.center.coords.scrCoords];
      radiusAtDown.current = circleJXG.current.radius;
      throughAnglesAtDown.current = [...throughAnglesFromCore.current];
      callAction({
        action: actions.circleFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    indicatorJXG.current.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveCircle,
            args: {
              center: centerCoords.current,
              radius: radiusAtDown.current,
              throughAngles: throughAnglesAtDown.current,
            },
          });
          dragged.current = false;
        }
        callAction({
          action: actions.circleClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    previousWithLabel.current = SVs.labelForGraph !== "";

    return circleJXG.current;
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

  function deleteCircleJXG() {
    indicatorJXG.current.off("drag");
    indicatorJXG.current.off("down");
    indicatorJXG.current.off("up");
    indicatorJXG.current.off("hit");
    indicatorJXG.current.off("keyfocusout");
    indicatorJXG.current.off("keydown");
    board.removeObject(indicatorJXG.current);
    indicatorJXG.current = null;

    circleJXG.current.off("drag");
    circleJXG.current.off("down");
    circleJXG.current.off("up");
    circleJXG.current.off("hit");
    circleJXG.current.off("keyfocusout");
    circleJXG.current.off("keydown");
    board.removeObject(circleJXG.current);
    circleJXG.current = null;
  }

  if (board) {
    lastCenterFromCore.current = [...SVs.numericalCenter];

    displayOffGraphIndicator.current = false;
    offGraphIndicatorOrientation.current = [0, 0];
    offGraphIndicatorCoords.current = [0, 0];

    if (!SVs.hideOffGraphIndicator) {
      let centerOffResults = characterizeOffGraphPoint(
        lastCenterFromCore.current,
        board,
      );

      if (centerOffResults.needIndicator) {
        // center is off graph

        let centerSides = centerOffResults.indicatorSides;
        let { flippedX, flippedY } = getEffectiveBoundingBox(board);
        let xSign = flippedX ? -1 : 1;
        let ySign = flippedY ? -1 : 1;

        if (centerSides[0] === 1) {
          if (centerSides[1] === 1) {
            // off to the upper right

            // first check if lower left point is off graph
            let lowerLeftPoint = [...lastCenterFromCore.current];
            lowerLeftPoint[0] -= SVs.numericalRadius * xSign;
            lowerLeftPoint[1] -= SVs.numericalRadius * ySign;
            let lowerLeftOffResults = characterizeOffGraphPoint(
              lowerLeftPoint,
              board,
            );

            if (lowerLeftOffResults.needIndicator) {
              displayOffGraphIndicator.current = true;
              offGraphIndicatorOrientation.current = [1, 1];
              offGraphIndicatorCoords.current = getGraphCornerWithBuffer(
                board,
                [1, 1],
              );
            } else {
              // check if a point in lower left quadrant is visible

              let arcResults = characterizeOffGraphCircleArc({
                center: SVs.numericalCenter,
                radius: SVs.numericalRadius,
                directionToCheck: [1, 1],
                board,
              });

              if (arcResults.needIndicator) {
                displayOffGraphIndicator.current = true;
                offGraphIndicatorOrientation.current =
                  arcResults.indicatorSides;
                offGraphIndicatorCoords.current = arcResults.indicatorCoords;
              }
            }
          } else if (centerSides[1] === -1) {
            // off to the lower right

            // first check if upper left point is off graph
            let upperLeftPoint = [...lastCenterFromCore.current];
            upperLeftPoint[0] -= SVs.numericalRadius * xSign;
            upperLeftPoint[1] += SVs.numericalRadius * ySign;
            let upperLeftOffResults = characterizeOffGraphPoint(
              upperLeftPoint,
              board,
            );

            if (upperLeftOffResults.needIndicator) {
              displayOffGraphIndicator.current = true;
              offGraphIndicatorOrientation.current = [1, -1];
              offGraphIndicatorCoords.current = getGraphCornerWithBuffer(
                board,
                [1, -1],
              );
            } else {
              // check if a point in upper left quadrant is visible

              let arcResults = characterizeOffGraphCircleArc({
                center: SVs.numericalCenter,
                radius: SVs.numericalRadius,
                directionToCheck: [1, -1],
                board,
              });

              if (arcResults.needIndicator) {
                displayOffGraphIndicator.current = true;
                offGraphIndicatorOrientation.current =
                  arcResults.indicatorSides;
                offGraphIndicatorCoords.current = arcResults.indicatorCoords;
              }
            }
          } else {
            // off to the right
            // check if left most point is off graph
            let leftPoint = [...lastCenterFromCore.current];
            leftPoint[0] -= SVs.numericalRadius * xSign;
            let leftOffResults = characterizeOffGraphPoint(leftPoint, board);

            if (leftOffResults.needIndicator) {
              displayOffGraphIndicator.current = true;
              offGraphIndicatorOrientation.current =
                leftOffResults.indicatorSides;
              offGraphIndicatorCoords.current = leftOffResults.indicatorCoords;
            }
          }
        } else if (centerSides[0] === -1) {
          if (centerSides[1] === 1) {
            // off to the upper left

            // first check if lower right point is off graph
            let lowerRightPoint = [...lastCenterFromCore.current];
            lowerRightPoint[0] += SVs.numericalRadius * xSign;
            lowerRightPoint[1] -= SVs.numericalRadius * ySign;
            let lowerRightOffResults = characterizeOffGraphPoint(
              lowerRightPoint,
              board,
            );

            if (lowerRightOffResults.needIndicator) {
              displayOffGraphIndicator.current = true;
              offGraphIndicatorOrientation.current = [-1, 1];
              offGraphIndicatorCoords.current = getGraphCornerWithBuffer(
                board,
                [-1, 1],
              );
            } else {
              // check if a point in lower right quadrant is visible

              let arcResults = characterizeOffGraphCircleArc({
                center: SVs.numericalCenter,
                radius: SVs.numericalRadius,
                directionToCheck: [-1, 1],
                board,
              });

              if (arcResults.needIndicator) {
                displayOffGraphIndicator.current = true;
                offGraphIndicatorOrientation.current =
                  arcResults.indicatorSides;
                offGraphIndicatorCoords.current = arcResults.indicatorCoords;
              }
            }
          } else if (centerSides[1] === -1) {
            // off to the lower left

            // first check if upper right point is off graph
            let upperRightPoint = [...lastCenterFromCore.current];
            upperRightPoint[0] += SVs.numericalRadius * xSign;
            upperRightPoint[1] += SVs.numericalRadius * ySign;
            let upperRightOffResults = characterizeOffGraphPoint(
              upperRightPoint,
              board,
            );

            if (upperRightOffResults.needIndicator) {
              displayOffGraphIndicator.current = true;
              offGraphIndicatorOrientation.current = [-1, -1];
              offGraphIndicatorCoords.current = getGraphCornerWithBuffer(
                board,
                [-1, -1],
              );
            } else {
              // check if a point in upper right quadrant is visible

              let arcResults = characterizeOffGraphCircleArc({
                center: SVs.numericalCenter,
                radius: SVs.numericalRadius,
                directionToCheck: [-1, -1],
                board,
              });

              if (arcResults.needIndicator) {
                displayOffGraphIndicator.current = true;
                offGraphIndicatorOrientation.current =
                  arcResults.indicatorSides;
                offGraphIndicatorCoords.current = arcResults.indicatorCoords;
              }
            }
          } else {
            // off to the left
            // check if right most point is off graph
            let rightPoint = [...lastCenterFromCore.current];
            rightPoint[0] += SVs.numericalRadius * xSign;
            let rightOffResults = characterizeOffGraphPoint(rightPoint, board);

            if (rightOffResults.needIndicator) {
              displayOffGraphIndicator.current = true;
              offGraphIndicatorOrientation.current =
                rightOffResults.indicatorSides;
              offGraphIndicatorCoords.current = rightOffResults.indicatorCoords;
            }
          }
        } else if (centerSides[1] === 1) {
          // off to the top
          // check if bottom point is off graph
          let bottomPoint = [...lastCenterFromCore.current];
          bottomPoint[1] -= SVs.numericalRadius * xSign;
          let bottomOffResults = characterizeOffGraphPoint(bottomPoint, board);

          if (bottomOffResults.needIndicator) {
            displayOffGraphIndicator.current = true;
            offGraphIndicatorOrientation.current =
              bottomOffResults.indicatorSides;
            offGraphIndicatorCoords.current = bottomOffResults.indicatorCoords;
          }
        } else {
          // off to the bottom
          // check if top point is off graph
          let topPoint = [...lastCenterFromCore.current];
          topPoint[1] += SVs.numericalRadius * xSign;
          let topOffResults = characterizeOffGraphPoint(topPoint, board);

          if (topOffResults.needIndicator) {
            displayOffGraphIndicator.current = true;
            offGraphIndicatorOrientation.current = topOffResults.indicatorSides;
            offGraphIndicatorCoords.current = topOffResults.indicatorCoords;
          }
        }
      }
    }

    if (!circleJXG.current) {
      // attempt to create circleJXG.current if it doesn't exist yet

      createCircleJXG();
    } else if (
      !(
        Number.isFinite(SVs.numericalCenter[0]) &&
        Number.isFinite(SVs.numericalCenter[1]) &&
        SVs.numericalRadius > 0
      )
    ) {
      // can't render circle

      deleteCircleJXG();
    } else {
      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[id] = circleJXG.current;
      }

      let validCoords = SVs.numericalCenter.every((x) => Number.isFinite(x));

      circleJXG.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [
        ...SVs.numericalCenter,
      ]);
      circleJXG.current.setRadius(SVs.numericalRadius);

      let visible = !SVs.hidden;

      if (validCoords) {
        circleJXG.current.visProp["visible"] = visible;
        circleJXG.current.visPropCalc["visible"] = visible;
        // circleJXG.current.setAttribute({visible: visible})
      } else {
        circleJXG.current.visProp["visible"] = false;
        circleJXG.current.visPropCalc["visible"] = false;
        // circleJXG.current.setAttribute({visible: false})
      }

      circleJXG.current.visProp.fixed = fixed.current;
      circleJXG.current.visProp.highlight = !fixLocation.current;
      circleJXG.current.isDraggable = !fixLocation.current;

      let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = circleJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        circleJXG.current.setAttribute({ layer });
      }

      let lineColor =
        darkMode === "dark"
          ? SVs.selectedStyle.lineColorDarkMode
          : SVs.selectedStyle.lineColor;
      let fillColor =
        darkMode === "dark"
          ? SVs.selectedStyle.fillColorDarkMode
          : SVs.selectedStyle.fillColor;
      fillColor = SVs.filled ? fillColor : "none";

      if (circleJXG.current.visProp.strokecolor !== lineColor) {
        circleJXG.current.visProp.strokecolor = lineColor;
        circleJXG.current.visProp.highlightstrokecolor = lineColor;
      }
      if (
        circleJXG.current.visProp.strokeopacity !==
        SVs.selectedStyle.lineOpacity
      ) {
        circleJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
        circleJXG.current.visProp.highlightstrokeopacity =
          SVs.selectedStyle.lineOpacity * 0.5;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle);
      if (circleJXG.current.visProp.dash !== newDash) {
        circleJXG.current.visProp.dash = newDash;
      }
      if (
        circleJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth
      ) {
        circleJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth;
        circleJXG.current.visProp.highlightstrokewidth =
          SVs.selectedStyle.lineWidth;
      }

      if (circleJXG.current.visProp.fillcolor !== fillColor) {
        circleJXG.current.visProp.fillcolor = fillColor;
        circleJXG.current.visProp.highlightfillcolor = fillColor;
        circleJXG.current.visProp.hasinnerpoints = SVs.filled;
      }
      if (
        circleJXG.current.visProp.fillopacity !== SVs.selectedStyle.fillOpacity
      ) {
        circleJXG.current.visProp.fillopacity = SVs.selectedStyle.fillOpacity;
        circleJXG.current.visProp.highlightfillopacity =
          SVs.selectedStyle.fillOpacity * 0.5;
      }

      circleJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        circleJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      circleJXG.current.needsUpdate = true;
      circleJXG.current.update();

      if (circleJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          circleJXG.current.label.visProp.strokecolor = lineColor;
        } else {
          circleJXG.current.label.visProp.strokecolor = "var(--canvastext)";
        }
        circleJXG.current.label.needsUpdate = true;
        circleJXG.current.label.update();
      }

      let showIndicator = displayOffGraphIndicator.current && !SVs.hidden;

      let actuallyChangedVisibility =
        indicatorJXG.current.visProp["visible"] !== showIndicator;

      indicatorJXG.current.visProp["visible"] = showIndicator;
      indicatorJXG.current.visPropCalc["visible"] = showIndicator;

      if (showIndicator) {
        indicatorJXG.current.coords.setCoordinates(
          JXG.COORDS_BY_USER,
          offGraphIndicatorCoords.current,
        );

        let layer = 10 * SVs.layer + POINT_LAYER_OFFSET;
        let layerChanged = indicatorJXG.current.visProp.layer !== layer;

        if (layerChanged) {
          indicatorJXG.current.setAttribute({ layer });
        }

        indicatorJXG.current.visProp.highlight = !fixLocation.current;
        indicatorJXG.current.visProp.fixed = fixed.current;
        indicatorJXG.current.isDraggable = !fixLocation.current;

        let markerColor =
          darkMode === "dark"
            ? SVs.selectedStyle.markerColorDarkMode
            : SVs.selectedStyle.markerColor;
        if (indicatorJXG.current.visProp.fillcolor !== markerColor) {
          indicatorJXG.current.visProp.fillcolor = markerColor;
        }
        if (
          indicatorJXG.current.visProp.strokeopacity !==
          SVs.selectedStyle.markerOpacity
        ) {
          indicatorJXG.current.visProp.strokeopacity =
            SVs.selectedStyle.markerOpacity;
          indicatorJXG.current.visProp.fillopacity =
            SVs.selectedStyle.markerOpacity;
        }

        let newFace = normalizePointStyle(
          SVs.selectedStyle.markerStyle,
          offGraphIndicatorOrientation.current,
        );
        if (indicatorJXG.current.visProp.face !== newFace) {
          indicatorJXG.current.setAttribute({ face: newFace });
        }
        let newSize = normalizePointSize(
          SVs.selectedStyle.markerSize,
          SVs.selectedStyle.markerStyle,
        );
        if (indicatorJXG.current.visProp.size !== newSize) {
          indicatorJXG.current.setAttribute({ size: newSize });
        }

        indicatorJXG.current.name = SVs.labelForGraph;

        if (withlabel != previousWithLabel.current) {
          indicatorJXG.current.setAttribute({ withlabel: withlabel });
        }

        if (indicatorJXG.current.hasLabel) {
          indicatorJXG.current.label.needsUpdate = true;
          if (SVs.applyStyleToLabel) {
            indicatorJXG.current.label.visProp.strokecolor = markerColor;
          } else {
            indicatorJXG.current.label.visProp.strokecolor =
              "var(--canvastext)";
          }

          let labelPosition = adjustPointLabelPosition(
            "upperright",
            offGraphIndicatorOrientation.current,
          );

          if (labelPosition !== previousPointLabelPosition.current) {
            let { offset, anchorx, anchory } =
              calculatePointLabelAnchor(labelPosition);
            indicatorJXG.current.label.visProp.anchorx = anchorx;
            indicatorJXG.current.label.visProp.anchory = anchory;
            indicatorJXG.current.label.visProp.offset = offset;
            previousPointLabelPosition.current = labelPosition;
            indicatorJXG.current.label.fullUpdate();
          } else {
            indicatorJXG.current.label.update();
          }
        }
      }

      if (showIndicator || actuallyChangedVisibility) {
        // seems to need full update or else indicator doesn't always
        // move when change axis bounds
        indicatorJXG.current.fullUpdate();
      } else {
        indicatorJXG.current.update();
      }
      board.updateRenderer();
    }
  }

  if (SVs.hidden) {
    return null;
  }

  return <a name={id} />;
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
