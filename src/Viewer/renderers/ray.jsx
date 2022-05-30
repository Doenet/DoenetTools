import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import me from 'math-expressions';

export default React.memo(function Ray(props) {
  let { name, SVs, actions, sourceOfUpdate, callAction } = useDoenetRender(props);

  Ray.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let rayJXG = useRef(null);

  let pointerAtDown = useRef(false);
  let pointsAtDown = useRef(false);
  let dragged = useRef(false);

  let previousWithLabel = useRef(false);
  let pointCoords = useRef(null);

  let lastEndpointFromCore = useRef(null);
  let lastThroughpointFromCore = useRef(null);

  lastEndpointFromCore.current = SVs.numericalEndpoint;
  lastThroughpointFromCore.current = SVs.numericalThroughpoint;

  useEffect(() => {

    //On unmount
    return () => {
      // if ray is defined
      if (Object.keys(rayJXG.current).length !== 0) {
        deleteRayJXG();
      }

    }
  }, [])

  function createRayJXG() {

    if (SVs.numericalEndpoint.length !== 2 ||
      SVs.numericalThroughpoint.length !== 2
    ) {
      rayJXG.current = null;

      return;
    }

    //things to be passed to JSXGraph as attributes
    var jsxRayAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: !SVs.draggable || SVs.fixed,
      layer: 10 * SVs.layer + 7,
      strokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle),
      straightFirst: false,
    };

    jsxRayAttributes.label = {};
    if (SVs.applyStyleToLabel) {
      jsxRayAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
    } else {
      jsxRayAttributes.label.strokeColor = "#000000";
    }

    let through = [
      [...SVs.numericalEndpoint],
      [...SVs.numericalThroughpoint]
    ];

    let newRayJXG = board.create('line', through, jsxRayAttributes);

    newRayJXG.on('drag', function (e) {
      dragged.current = true;

      pointCoords.current = calculatePointPositions(e);

      callAction({
        action: actions.moveRay,
        args: {
          endpointcoords: pointCoords.current[0],
          throughcoords: pointCoords.current[1],
          transient: true,
          skippable: true,
        }
      });

      rayJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastEndpointFromCore.current);
      rayJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastThroughpointFromCore.current);

    });

    newRayJXG.on('up', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveRay,
          args: {
            endpointcoords: pointCoords.current[0],
            throughcoords: pointCoords.current[1],
          }
        })
      }
    });

    newRayJXG.on('down', function (e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...newRayJXG.point1.coords.scrCoords],
        [...newRayJXG.point2.coords.scrCoords]
      ]

    });

    previousWithLabel.current = SVs.showLabel && SVs.label !== "";

    rayJXG.current = newRayJXG;

  }

  function deleteRayJXG() {
    rayJXG.current.off('drag');
    rayJXG.current.off('down');
    rayJXG.current.off('up');
    board.removeObject(rayJXG.current);
    rayJXG.current = null;
  }

  function calculatePointPositions(e) {

    // the reason we calculate point position with this algorithm,
    // rather than using .X() and .Y() directly
    // is so that points don't get trapped on an attracting object
    // if you move the mouse slowly.
    // The attributes .X() and .Y() are affected by
    // .setCoordinates functions called in update()
    // so will get modified to go back to the attracting object

    var o = board.origin.scrCoords;

    let pointCoords = []

    for (let i = 0; i < 2; i++) {
      let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0]
        - o[1]) / board.unitX;
      let calculatedY = (o[2] -
        (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1]))
        / board.unitY;
      pointCoords.push([calculatedX, calculatedY]);
    }
    return pointCoords;
  }

  if (board) {

    if (rayJXG.current === null) {
      createRayJXG();
    } else if (SVs.numericalEndpoint.length !== 2 ||
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

      rayJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoint);
      rayJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalThroughpoint);

      let visible = !SVs.hidden;

      if (validCoords) {
        let actuallyChangedVisibility = rayJXG.current.visProp["visible"] !== visible;
        rayJXG.current.visProp["visible"] = visible;
        rayJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // at least for point, this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          rayJXG.current.setAttribute({ visible: visible })
        }

      } else {
        rayJXG.current.visProp["visible"] = false;
        rayJXG.current.visPropCalc["visible"] = false;
        // rayJXG.current.setAttribute({visible: false})
      }

      if (rayJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        rayJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        rayJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
      if (rayJXG.current.visProp.dash !== newDash) {
        rayJXG.current.visProp.dash = newDash;
      }
      if (rayJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        rayJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth
      }

      rayJXG.current.name = SVs.label;
      // rayJXG.current.visProp.withlabel = this.showlabel && this.label !== "";

      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        rayJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      rayJXG.current.needsUpdate = true;
      rayJXG.current.update()
      if (rayJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          rayJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor
        } else {
          rayJXG.current.label.visProp.strokecolor = "#000000";
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

  return <><a name={name} /></>

})

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