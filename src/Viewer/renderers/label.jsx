import React, { useContext, useEffect, useRef } from 'react';
import { BoardContext, TEXT_LAYER_OFFSET } from './graph';
import useDoenetRender from '../useDoenetRenderer';
import { MathJax } from "better-react-mathjax";
import me from 'math-expressions';
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '../../Tools/_framework/DarkmodeController';
import { textRendererStyle } from '../../Core/utils/style';
import { getPositionFromAnchorByCoordinate } from '../../Core/utils/graphical';

export default React.memo(function Label(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRender(props);

  Label.ignoreActionsWithoutCore = () => true;

  let labelJXG = useRef(null);
  let anchorPointJXG = useRef(null);
  let anchorRel = useRef(null);

  const board = useContext(BoardContext);

  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);

  let calculatedX = useRef(null);
  let calculatedY = useRef(null);

  let lastPositionFromCore = useRef(null);
  let previousPositionFromAnchor = useRef(null);

  const darkMode = useRecoilValue(darkModeAtom);


  useEffect(() => {
    //On unmount
    return () => {
      if (labelJXG.current !== null) {
        labelJXG.current.off('drag');
        labelJXG.current.off('down');
        labelJXG.current.off('up');
        board?.removeObject(labelJXG.current);
        labelJXG.current = null;
      }

    }
  }, [])

  function createLabelJXG() {

    let fixed = !SVs.draggable || SVs.fixed;

    let textColor = darkMode === "dark" ? SVs.selectedStyle.textColorDarkMode : SVs.selectedStyle.textColor;
    let backgroundColor = darkMode === "dark" ? SVs.selectedStyle.backgroundColorDarkMode : SVs.selectedStyle.backgroundColor;

    let cssStyle = ``;
    if (backgroundColor) {
      cssStyle += `background-color: ${backgroundColor}`;
    }

    //things to be passed to JSXGraph as attributes
    let jsxLabelAttributes = {
      visible: !SVs.hidden,
      fixed,
      layer: 10 * SVs.layer + TEXT_LAYER_OFFSET,
      cssStyle,
      highlightCssStyle: cssStyle,
      strokeColor: textColor,
      strokeOpacity: 1,
      highlightStrokeColor: textColor,
      highlightStrokeOpacity: 0.5,
      highlight: !fixed,
      useMathJax: SVs.hasLatex,
      parse: false,
    };


    let newAnchorPointJXG;

    try {
      let anchor = me.fromAst(SVs.anchor);
      let anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ]

      if (!Number.isFinite(anchorCoords[0])) {
        anchorCoords[0] = 0;
        jsxLabelAttributes['visible'] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxLabelAttributes['visible'] = false;
      }

      newAnchorPointJXG = board.create('point', anchorCoords, { visible: false });


    } catch (e) {
      jsxLabelAttributes['visible'] = false;
      newAnchorPointJXG = board.create('point', [0, 0], { visible: false });
    }

    jsxLabelAttributes.anchor = newAnchorPointJXG;

    let { anchorx, anchory } = getPositionFromAnchorByCoordinate(SVs.positionFromAnchor);
    jsxLabelAttributes.anchorx = anchorx;
    jsxLabelAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];


    let newLabelJXG = board.create('text', [0, 0, SVs.value], jsxLabelAttributes);

    newLabelJXG.on('down', function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;

    });

    newLabelJXG.on('up', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveLabel,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          }
        });
      }
      dragged.current = false;

    });

    newLabelJXG.on('drag', function (e) {
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
      let width = newLabelJXG.size[0] / board.unitX;
      let height = newLabelJXG.size[1] / board.unitY;

      let anchorx = anchorRel.current[0];
      let anchory = anchorRel.current[1];

      let offsetx = 0;
      if (anchorx === "middle") {
        offsetx = -width / 2
      } else if (anchorx === "right") {
        offsetx = -width;
      }
      let offsety = 0;
      if (anchory === "middle") {
        offsety = -height / 2
      } else if (anchory === "top") {
        offsety = -height;
      }

      let xminAdjusted = xmin + 0.04 * (xmax - xmin) - offsetx - width;
      let xmaxAdjusted = xmax - 0.04 * (xmax - xmin) - offsetx;
      let yminAdjusted = ymin + 0.04 * (ymax - ymin) - offsety - height;
      let ymaxAdjusted = ymax - 0.04 * (ymax - ymin) - offsety;

      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0]
        - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmaxAdjusted, Math.max(xminAdjusted, calculatedX.current));

      calculatedY.current = (o[2] -
        (pointAtDown.current[2] + e.y - pointerAtDown.current[1]))
        / board.unitY;
      calculatedY.current = Math.min(ymaxAdjusted, Math.max(yminAdjusted, calculatedY.current));

      callAction({
        action: actions.moveLabel,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        }
      });

      newLabelJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);

      //Protect against very small unintended drags
      if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1) {
        dragged.current = true;
      }

    });


    labelJXG.current = newLabelJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;

    // Note: no idea why one has to update the label after waiting
    // But, if we don't do that, the label isn't positioned correctly if any anchors are "middle"
    // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
    if (SVs.hasLatex) {
      setTimeout(() => {

        if (labelJXG.current) {
          labelJXG.current.needsUpdate = true;
          labelJXG.current.setText(SVs.value)
          labelJXG.current.update();
          board?.updateRenderer();
        }

      }, 1000)
    }
  }

  if (board) {
    let anchorCoords;
    try {
      let anchor = me.fromAst(SVs.anchor);
      anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ]
    } catch (e) {
      anchorCoords = [NaN, NaN];
    }

    lastPositionFromCore.current = anchorCoords;


    if (labelJXG.current === null) {
      createLabelJXG();
    } else {

      labelJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      anchorPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, anchorCoords);

      labelJXG.current.setText(SVs.value)

      let visible = !SVs.hidden;

      if (Number.isFinite(anchorCoords[0]) && Number.isFinite(anchorCoords[1])) {
        let actuallyChangedVisibility = labelJXG.current.visProp["visible"] !== visible;
        labelJXG.current.visProp["visible"] = visible;
        labelJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          labelJXG.current.setAttribute({ visible })
        }
      } else {
        labelJXG.current.visProp["visible"] = false;
        labelJXG.current.visPropCalc["visible"] = false;
      }

      let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
      let layerChanged = labelJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        labelJXG.current.setAttribute({ layer });
      }

      let textColor = darkMode === "dark" ? SVs.selectedStyle.textColorDarkMode : SVs.selectedStyle.textColor;
      let backgroundColor = darkMode === "dark" ? SVs.selectedStyle.backgroundColorDarkMode : SVs.selectedStyle.backgroundColor;
      let cssStyle = ``;
      if (backgroundColor) {
        cssStyle += `background-color: ${backgroundColor}`;
      } else {
        cssStyle += `background-color: transparent`;
      }

      if (labelJXG.current.visProp.strokecolor !== textColor) {
        labelJXG.current.visProp.strokecolor = textColor;
        labelJXG.current.visProp.highlightstrokecolor = textColor;
      }
      if (labelJXG.current.visProp.cssstyle !== cssStyle) {
        labelJXG.current.visProp.cssstyle = cssStyle;
        labelJXG.current.visProp.highlightcssstyle = cssStyle;
      }


      let fixed = !SVs.draggable || SVs.fixed;


      labelJXG.current.visProp.highlight = !fixed;
      labelJXG.current.visProp.fixed = fixed;

      labelJXG.current.needsUpdate = true;

      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(SVs.positionFromAnchor);
        labelJXG.current.visProp.anchorx = anchorx;
        labelJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        labelJXG.current.fullUpdate();
      } else {
        labelJXG.current.update();
      }

      anchorPointJXG.current.needsUpdate = true;
      anchorPointJXG.current.update();
      board.updateRenderer();
    }

    return <a name={id} />

  }

  // not in board

  if (SVs.hidden) {
    return null;
  }


  let style = textRendererStyle(darkMode, SVs.selectedStyle);
  style.marginRight = "12px";

  let label = SVs.value;

  if (SVs.hasLatex) {
    label = <MathJax hideUntilTypeset={"first"} inline dynamic >{label}</MathJax>
  }
  return <span id={id} style={style}><a name={id} />{label}</span>;



})
