import React, { useContext, useEffect, useRef } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { BoardContext, LINE_LAYER_OFFSET } from './graph';
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '../../Tools/_framework/DarkmodeController';

export default React.memo(function Circle(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props);

  Circle.ignoreActionsWithoutCore = true;

  const board = useContext(BoardContext);

  let circleJXG = useRef(null)

  let dragged = useRef(false);
  let pointerAtDown = useRef(false);
  let centerAtDown = useRef(false);
  let radiusAtDown = useRef(false);
  let throughAnglesAtDown = useRef(false);
  let previousWithLabel = useRef(false);
  let centerCoords = useRef(null);

  let lastCenterFromCore = useRef(null);
  let throughAnglesFromCore = useRef(null);

  lastCenterFromCore.current = SVs.numericalCenter;
  throughAnglesFromCore.current = SVs.throughAngles;

  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {

    //On unmount
    return () => {
      // if point is defined
      if (circleJXG.current) {
        deleteCircleJXG();
      }

    }
  }, [])

  function createCircleJXG() {

    if (!(Number.isFinite(SVs.numericalCenter[0])
      && Number.isFinite(SVs.numericalCenter[1])
      && SVs.numericalRadius > 0)
    ) {
      return null;
    }

    let fixed = !SVs.draggable || SVs.fixed;


    let lineColor = darkMode === "dark" ? SVs.selectedStyle.lineColorDarkMode : SVs.selectedStyle.lineColor;
    lineColor = lineColor.toLowerCase();
    let fillColor = darkMode === "dark" ? SVs.selectedStyle.fillColorDarkMode : SVs.selectedStyle.fillColor;
    fillColor = SVs.filled ? fillColor.toLowerCase() : "none";

    //things to be passed to JSXGraph as attributes
    var jsxCircleAttributes = {
      name: SVs.labelForGraph,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.labelForGraph !== "",
      fixed,
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
      highlight: !fixed,
    };


    if (SVs.filled) {
      jsxCircleAttributes.hasInnerPoints = true;
    }

    jsxCircleAttributes.label = {
      highlight: false
    }
    if (SVs.labelHasLatex) {
      jsxCircleAttributes.label.useMathJax = true
    }

    if (SVs.showLabel && SVs.labelForGraph !== "") {
      if (SVs.applyStyleToLabel) {
        jsxCircleAttributes.label.strokeColor = lineColor;
      } else {
        jsxCircleAttributes.label.strokeColor = "var(--canvastext)";
      }
    }

    let newCircleJXG = board.create('circle',
      [[...SVs.numericalCenter], SVs.numericalRadius],
      jsxCircleAttributes
    );


    newCircleJXG.on('drag', function (e) {
      //Protect against very small unintended drags
      if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1) {
        dragged.current = true;
      }

      centerCoords.current = calculateCenterPosition(e);
      callAction({
        action: actions.moveCircle,
        args: {
          center: centerCoords.current,
          radius: radiusAtDown.current,
          throughAngles: throughAnglesAtDown.current,
          transient: true,
          skippable: true,
        }
      })

      newCircleJXG.center.coords.setCoordinates(JXG.COORDS_BY_USER, [...lastCenterFromCore.current]);

    });

    newCircleJXG.on('up', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveCircle,
          args: {
            center: centerCoords.current,
            radius: radiusAtDown.current,
            throughAngles: throughAnglesAtDown.current,
          }
        })
      } else {
        callAction({
          action: actions.circleClicked
        });
      }
    });

    newCircleJXG.on('down', function (e) {
      dragged.current = false;
      pointerAtDown.current = [e.x, e.y];
      centerAtDown.current = [...newCircleJXG.center.coords.scrCoords];
      radiusAtDown.current = newCircleJXG.radius;
      throughAnglesAtDown.current = [...throughAnglesFromCore.current];
      callAction({
        action: actions.mouseDownOnCircle
      });
    });

    previousWithLabel.current = SVs.showLabel && SVs.labelForGraph !== "";

    return newCircleJXG;

  }

  function calculateCenterPosition(e) {

    // the reason we calculate point position with this algorithm,
    // rather than using .X() and .Y() directly
    // is so that center doesn't get trapped on an attracting object
    // if you move the mouse slowly.
    // The attributes .X() and .Y() are affected by
    // .setCoordinates functions called in update()
    // so will get modified to go back to the attracting object

    var o = board.origin.scrCoords;

    let calculatedX = (centerAtDown.current[1] + e.x - pointerAtDown.current[0]
      - o[1]) / board.unitX;
    let calculatedY = (o[2] -
      (centerAtDown.current[2] + e.y - pointerAtDown.current[1]))
      / board.unitY;
    return [calculatedX, calculatedY];
  }

  function deleteCircleJXG() {
    circleJXG.current.off('drag');
    circleJXG.current.off('down');
    circleJXG.current.off('up');
    board.removeObject(circleJXG.current);
    circleJXG.current = null;
  }


  if (board) {

    if (!circleJXG.current) {
      // attempt to create circleJXG.current if it doesn't exist yet

      circleJXG.current = createCircleJXG();


    } else if (!(Number.isFinite(SVs.numericalCenter[0])
      && Number.isFinite(SVs.numericalCenter[1])
      && SVs.numericalRadius > 0)
    ) {

      // can't render circle

      deleteCircleJXG();
    } else {


      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[id] = circleJXG.current;
      }


      let validCoords = SVs.numericalCenter.every(x => Number.isFinite(x));


      circleJXG.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [...SVs.numericalCenter]);
      circleJXG.current.setRadius(SVs.numericalRadius);


      let visible = !SVs.hidden;

      if (validCoords) {
        circleJXG.current.visProp["visible"] = visible;
        circleJXG.current.visPropCalc["visible"] = visible;
        // circleJXG.current.setAttribute({visible: visible})
      }
      else {
        circleJXG.current.visProp["visible"] = false;
        circleJXG.current.visPropCalc["visible"] = false;
        // circleJXG.current.setAttribute({visible: false})
      }

      let fixed = !SVs.draggable || SVs.fixed;


      circleJXG.current.visProp.fixed = fixed;
      circleJXG.current.visProp.highlight = !fixed;

      let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
      let layerChanged = circleJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        circleJXG.current.setAttribute({ layer });
      }

      let lineColor = darkMode === "dark" ? SVs.selectedStyle.lineColorDarkMode : SVs.selectedStyle.lineColor;
      lineColor = lineColor.toLowerCase();
      let fillColor = darkMode === "dark" ? SVs.selectedStyle.fillColorDarkMode : SVs.selectedStyle.fillColor;
      fillColor = SVs.filled ? fillColor.toLowerCase() : "none";

      if (circleJXG.current.visProp.strokecolor !== lineColor) {
        circleJXG.current.visProp.strokecolor = lineColor;
        circleJXG.current.visProp.highlightstrokecolor = lineColor;
      }
      if (circleJXG.current.visProp.strokeopacity !== SVs.selectedStyle.lineOpacity) {
        circleJXG.current.visProp.strokeopacity = SVs.selectedStyle.lineOpacity;
        circleJXG.current.visProp.highlightstrokeopacity = SVs.selectedStyle.lineOpacity * 0.5;
      }
      let newDash = styleToDash(SVs.selectedStyle.lineStyle);
      if (circleJXG.current.visProp.dash !== newDash) {
        circleJXG.current.visProp.dash = newDash;
      }
      if (circleJXG.current.visProp.strokewidth !== SVs.selectedStyle.lineWidth) {
        circleJXG.current.visProp.strokewidth = SVs.selectedStyle.lineWidth
        circleJXG.current.visProp.highlightstrokewidth = SVs.selectedStyle.lineWidth
      }

      if (circleJXG.current.visProp.fillcolor !== fillColor) {
        circleJXG.current.visProp.fillcolor = fillColor;
        circleJXG.current.visProp.highlightfillcolor = fillColor;
        circleJXG.current.visProp.hasinnerpoints = SVs.filled;
      }
      if (circleJXG.current.visProp.fillopacity !== SVs.selectedStyle.fillOpacity) {
        circleJXG.current.visProp.fillopacity = SVs.selectedStyle.fillOpacity;
        circleJXG.current.visProp.highlightfillopacity = SVs.selectedStyle.fillOpacity * 0.5;
      }

      circleJXG.current.name = SVs.labelForGraph;

      let withlabel = SVs.showLabel && SVs.labelForGraph !== "";
      if (withlabel != previousWithLabel.current) {
        circleJXG.current.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      circleJXG.current.needsUpdate = true;
      circleJXG.current.update();

      if (circleJXG.current.hasLabel) {
        if (SVs.applyStyleToLabel) {
          circleJXG.current.label.visProp.strokecolor = lineColor
        } else {
          circleJXG.current.label.visProp.strokecolor = "var(--canvastext)";
        }
        circleJXG.current.label.needsUpdate = true;
        circleJXG.current.label.update();
      }
      board.updateRenderer();
    }
  }

  if (SVs.hidden) {
    return null;
  }

  return <a name={id} />

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