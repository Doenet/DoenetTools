import React, { useContext, useEffect, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import me from 'math-expressions';
import { MathJax } from 'better-react-mathjax';


export default React.memo(function Line(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props);

  Line.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let lineJXG = useRef({});

  let pointerAtDown = useRef(null);
  let pointsAtDown = useRef(null);
  let pointerIsDown = useRef(false);
  let pointerMovedSinceDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);
  let pointCoords = useRef(null);

  let lastPositionsFromCore = useRef(null);

  lastPositionsFromCore.current = SVs.numericalPoints;


  useEffect(() => {

    //On unmount
    return () => {
      // if line is defined
      if (Object.keys(lineJXG.current).length !== 0) {
        deleteLineJXG();
      }

      if (board) {
        board.off('move', boardMoveHandler);
      }

    }
  }, [])


  useEffect(() => {
    if (board) {
      board.on('move', boardMoveHandler)
    }
  }, [board])


  function createLineJXG() {

    if (SVs.numericalPoints?.length !== 2 ||
      SVs.numericalPoints.some(x => x.length !== 2)
    ) {
      lineJXG.current = {};
      return;
    }

    let fixed = !SVs.draggable || SVs.fixed;
    let withlabel = SVs.showLabel && SVs.labelForGraph !== "";

    //things to be passed to JSXGraph as attributes
    var jsxLineAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withlabel,
      fixed,
      layer: 10 * SVs.layer + 7,
      strokeColor: SVs.selectedStyle.lineColor,
      strokeOpacity: SVs.selectedStyle.lineOpacity,
      highlightStrokeColor: SVs.selectedStyle.lineColor,
      highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
      strokeWidth: SVs.selectedStyle.lineWidth,
      highlightStrokeWidth: SVs.selectedStyle.lineWidth,
      dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed),
      highlight: !fixed,
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
      } else {
        // lower left
        offset = [-5, -5];
        anchorx = "right";
        anchory = "top";
      }

      jsxLineAttributes.label = {
        offset,
        anchorx,
        anchory,
        position: "top",
        highlight: false
      }

      if (SVs.labelHasLatex) {
        jsxLineAttributes.label.useMathJax = true
      }

      if (SVs.applyStyleToLabel) {
        jsxLineAttributes.label.strokeColor = SVs.selectedStyle.lineColor;
      } else {
        jsxLineAttributes.label.strokeColor = "#000000";
      }
    } else {
      jsxLineAttributes.label = {
        highlight: false
      }
      if (SVs.labelHasLatex) {
        jsxLineAttributes.label.useMathJax = true
      }
    }

    let through = [
      [...SVs.numericalPoints[0]],
      [...SVs.numericalPoints[1]]
    ];

    let newLineJXG = board.create('line', through, jsxLineAttributes);

    newLineJXG.on('drag', function (e) {

      let viaPointer = e.type === "pointermove";

      //Protect against very small unintended drags
      if (!viaPointer ||
        Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1
      ) {
        dragged.current = true;
      }

      pointCoords.current = []

      if (viaPointer) {
        var o = board.origin.scrCoords;
        for (let i = 0; i < 2; i++) {
          // the reason we calculate point position with this algorithm,
          // rather than using .X() and .Y() directly
          // is so that points don't get trapped on an attracting object
          // if you move the mouse slowly.
          // The attributes .X() and .Y() are affected by
          // .setCoordinates functions called in update()
          // so will get modified to go back to the attracting object

          let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0]
            - o[1]) / board.unitX;
          let calculatedY = (o[2] -
            (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1]))
            / board.unitY;
          pointCoords.current.push([calculatedX, calculatedY]);
        }
      } else {
        pointCoords.current.push([newLineJXG.point1.X(), newLineJXG.point1.Y()]);
        pointCoords.current.push([newLineJXG.point2.X(), newLineJXG.point2.Y()]);
      }

      callAction({
        action: actions.moveLine,
        args: {
          point1coords: pointCoords.current[0],
          point2coords: pointCoords.current[1],
          transient: true,
          skippable: true,
        }
      })

      newLineJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[0]);
      newLineJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[1]);
    })

    newLineJXG.on('up', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveLine,
          args: {
            point1coords: pointCoords.current[0],
            point2coords: pointCoords.current[1],
          }
        })
      } else if (!pointerMovedSinceDown.current) {

        if (SVs.switchable && !SVs.fixed) {
          callAction({
            action: actions.switchLine,
          })
          callAction({
            action: actions.lineClicked
          });
        } else {
          callAction({
            action: actions.lineClicked
          });
        }
      }
      pointerIsDown.current = false;
    })

    newLineJXG.on('keyfocusout', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveLine,
          args: {
            point1coords: pointCoords.current[0],
            point2coords: pointCoords.current[1],
          }
        })
        dragged.current = false;
      }
    })

    newLineJXG.on('down', function (e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      pointsAtDown.current = [
        [...newLineJXG.point1.coords.scrCoords],
        [...newLineJXG.point2.coords.scrCoords]
      ]
      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      callAction({
        action: actions.mouseDownOnLine
      });

    })


    newLineJXG.on('keydown', function (e) {

      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveLine,
            args: {
              point1coords: pointCoords.current[0],
              point2coords: pointCoords.current[1],
            }
          })
          dragged.current = false;
        }
        if (SVs.switchable && !SVs.fixed) {
          callAction({
            action: actions.switchLine,
          })
          callAction({
            action: actions.lineClicked
          });
        } else {
          callAction({
            action: actions.lineClicked
          });
        }
      }
    })


    previousWithLabel.current = SVs.showLabel && SVs.labelForGraph !== "";

    lineJXG.current = newLineJXG;

  }

  function boardMoveHandler(e) {
    if (pointerIsDown.current) {
      //Protect against very small unintended move
      if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1
      ) {
        pointerMovedSinceDown.current = true;
      }
    }
  }


  function deleteLineJXG() {
    lineJXG.current.off('drag');
    lineJXG.current.off('down');
    lineJXG.current.off('up');
    lineJXG.current.off('keyfocusout');
    lineJXG.current.off('keydown');
    board.removeObject(lineJXG.current);
    lineJXG.current = {};
  }


  if (board) {
    if (Object.keys(lineJXG.current).length === 0) {

      createLineJXG();

    } else if (SVs.numericalPoints?.length !== 2 ||
      SVs.numericalPoints.some(x => x.length !== 2)
    ) {

      deleteLineJXG();

    } else {

      let validCoords = true;

      for (let coords of [SVs.numericalPoints[0], SVs.numericalPoints[1]]) {
        if (!Number.isFinite(coords[0])) {
          validCoords = false;
        }
        if (!Number.isFinite(coords[1])) {
          validCoords = false;
        }
      }

      lineJXG.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalPoints[0]);
      lineJXG.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalPoints[1]);

      let visible = !SVs.hidden;

      if (validCoords) {
        let actuallyChangedVisibility = lineJXG.current.visProp["visible"] !== visible;
        lineJXG.current.visProp["visible"] = visible;
        lineJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // at least for point, this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          lineJXG.current.setAttribute({ visible: visible })
        }

      } else {
        lineJXG.current.visProp["visible"] = false;
        lineJXG.current.visPropCalc["visible"] = false;
        // lineJXG.current.setAttribute({visible: false})
      }

      let fixed = !SVs.draggable || SVs.fixed;

      lineJXG.current.visProp.fixed = fixed;
      lineJXG.current.visProp.highlight = !fixed;

      let layer = 10 * SVs.layer + 7;
      let layerChanged = lineJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        lineJXG.current.setAttribute({ layer });
      }

      if (lineJXG.current.visProp.strokecolor !== SVs.selectedStyle.lineColor) {
        lineJXG.current.visProp.strokecolor = SVs.selectedStyle.lineColor;
        lineJXG.current.visProp.highlightstrokecolor = SVs.selectedStyle.lineColor;
      }
      if (lineJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        lineJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth
        lineJXG.current.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth
      }
      if (lineJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        lineJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity
        lineJXG.current.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
      if (lineJXG.current.visProp.dash !== newDash) {
        lineJXG.current.visProp.dash = newDash;
      }

      lineJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        lineJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      lineJXG.current.needsUpdate = true;
      lineJXG.current.update()
      if (lineJXG.current.hasLabel) {
        lineJXG.current.label.needsUpdate = true;
        if (SVs.applyStyleToLabel) {
          lineJXG.current.label.visProp.strokecolor = SVs.selectedStyle.lineColor
        } else {
          lineJXG.current.label.visProp.strokecolor = "#000000";
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
          } else {
            // lower left
            offset = [-5, -5];
            anchorx = "right";
            anchory = "top";
          }

          lineJXG.current.label.visProp.anchorx = anchorx;
          lineJXG.current.label.visProp.anchory = anchory;
          lineJXG.current.label.visProp.offset = offset;
          previousLabelPosition.current = SVs.labelPosition;
          lineJXG.current.label.fullUpdate();
        } else {
          lineJXG.current.label.update();
        }

      }
      board.updateRenderer();
    }

    return <><a name={id} /></>

  }

  if (SVs.hidden) {
    return null;
  }



  let mathJaxify = "\\(" + SVs.latex + "\\)";
  return <><a name={id} /><span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{mathJaxify}</MathJax></span></>
})

function styleToDash(style, dash) {
  if (style === "dashed" || dash) {
    return 2;
  } else if (style === "solid") {
    return 0;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}