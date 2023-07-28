import { MathJax } from "better-react-mathjax";

import React, { useContext, useEffect, useRef } from "react";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer from "../useDoenetRenderer";
import me from "math-expressions";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../../Tools/_framework/DarkmodeController";
import { textRendererStyle } from "../../Core/utils/style";
import { getPositionFromAnchorByCoordinate } from "../../Core/utils/graphical";

export default React.memo(function NumberComponent(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRenderer(props);

  NumberComponent.ignoreActionsWithoutCore = () => true;

  let numberJXG = useRef(null);
  let anchorPointJXG = useRef(null);
  let anchorRel = useRef(null);

  const board = useContext(BoardContext);

  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let pointerIsDown = useRef(false);
  let pointerMovedSinceDown = useRef(false);
  let dragged = useRef(false);

  let calculatedX = useRef(null);
  let calculatedY = useRef(null);

  let lastPositionFromCore = useRef(null);
  let previousPositionFromAnchor = useRef(null);

  let fixed = useRef(false);
  let fixLocation = useRef(false);

  fixed.current = SVs.fixed;
  fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    //On unmount
    return () => {
      if (numberJXG.current !== null) {
        deleteNumberJXG();
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

  function createNumberJXG() {
    let textColor =
      darkMode === "dark"
        ? SVs.selectedStyle.textColorDarkMode
        : SVs.selectedStyle.textColor;
    let backgroundColor =
      darkMode === "dark"
        ? SVs.selectedStyle.backgroundColorDarkMode
        : SVs.selectedStyle.backgroundColor;

    let cssStyle = ``;
    if (backgroundColor) {
      cssStyle += `background-color: ${backgroundColor}`;
    }

    //things to be passed to JSXGraph as attributes
    let jsxNumberAttributes = {
      visible: !SVs.hidden,
      fixed: fixed.current,
      layer: 10 * SVs.layer + TEXT_LAYER_OFFSET,
      cssStyle,
      highlightCssStyle: cssStyle,
      strokeColor: textColor,
      strokeOpacity: 1,
      highlightStrokeColor: textColor,
      highlightStrokeOpacity: 0.5,
      highlight: !fixLocation.current,
      parse: false,
    };

    let newAnchorPointJXG;

    try {
      let anchor = me.fromAst(SVs.anchor);
      let anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant(),
      ];
      if (!Number.isFinite(anchorCoords[0])) {
        anchorCoords[0] = 0;
        jsxNumberAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxNumberAttributes["visible"] = false;
      }

      newAnchorPointJXG = board.create("point", anchorCoords, {
        visible: false,
      });
    } catch (e) {
      jsxNumberAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], { visible: false });
    }

    jsxNumberAttributes.anchor = newAnchorPointJXG;

    let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
      SVs.positionFromAnchor,
    );
    jsxNumberAttributes.anchorx = anchorx;
    jsxNumberAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];

    let newNumberJXG = board.create(
      "text",
      [0, 0, SVs.text],
      jsxNumberAttributes,
    );
    newNumberJXG.isDraggable = !fixLocation.current;

    newNumberJXG.on("down", function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      if (!fixed.current) {
        callAction({
          action: actions.numberFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    newNumberJXG.on("hit", function (e) {
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
      callAction({
        action: actions.numberFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    newNumberJXG.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveNumber,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        callAction({
          action: actions.numberClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointerIsDown.current = false;
    });

    newNumberJXG.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveNumber,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      }
    });

    newNumberJXG.on("drag", function (e) {
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
      let width = newNumberJXG.size[0] / board.unitX;
      let height = newNumberJXG.size[1] / board.unitY;

      let anchorx = anchorRel.current[0];
      let anchory = anchorRel.current[1];

      let offsetx = 0;
      if (anchorx === "middle") {
        offsetx = -width / 2;
      } else if (anchorx === "right") {
        offsetx = -width;
      }
      let offsety = 0;
      if (anchory === "middle") {
        offsety = -height / 2;
      } else if (anchory === "top") {
        offsety = -height;
      }

      let xminAdjusted = xmin + 0.04 * (xmax - xmin) - offsetx - width;
      let xmaxAdjusted = xmax - 0.04 * (xmax - xmin) - offsetx;
      let yminAdjusted = ymin + 0.04 * (ymax - ymin) - offsety - height;
      let ymaxAdjusted = ymax - 0.04 * (ymax - ymin) - offsety;

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
        calculatedX.current =
          newAnchorPointJXG.X() + newNumberJXG.relativeCoords.usrCoords[1];
        calculatedY.current =
          newAnchorPointJXG.Y() + newNumberJXG.relativeCoords.usrCoords[2];
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
        action: actions.moveNumber,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        },
      });

      newNumberJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastPositionFromCore.current,
      );
    });

    newNumberJXG.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveNumber,
            args: {
              x: calculatedX.current,
              y: calculatedY.current,
            },
          });
          dragged.current = false;
        }
        callAction({
          action: actions.numberClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    numberJXG.current = newNumberJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;
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

  function deleteNumberJXG() {
    numberJXG.current.off("drag");
    numberJXG.current.off("down");
    numberJXG.current.off("hit");
    numberJXG.current.off("up");
    numberJXG.current.off("keyfocusout");
    numberJXG.current.off("keydown");
    board.removeObject(numberJXG.current);
    numberJXG.current = null;
  }

  if (board) {
    let anchorCoords;
    try {
      let anchor = me.fromAst(SVs.anchor);
      anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant(),
      ];
    } catch (e) {
      anchorCoords = [NaN, NaN];
    }

    lastPositionFromCore.current = anchorCoords;

    if (numberJXG.current === null) {
      createNumberJXG();
    } else {
      numberJXG.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0],
      );
      anchorPointJXG.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        anchorCoords,
      );

      numberJXG.current.setText(SVs.text);

      let visible = !SVs.hidden;

      if (
        Number.isFinite(anchorCoords[0]) &&
        Number.isFinite(anchorCoords[1])
      ) {
        let actuallyChangedVisibility =
          numberJXG.current.visProp["visible"] !== visible;
        numberJXG.current.visProp["visible"] = visible;
        numberJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          numberJXG.current.setAttribute({ visible });
        }
      } else {
        numberJXG.current.visProp["visible"] = false;
        numberJXG.current.visPropCalc["visible"] = false;
      }

      let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
      let layerChanged = numberJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        numberJXG.current.setAttribute({ layer });
      }

      let textColor =
        darkMode === "dark"
          ? SVs.selectedStyle.textColorDarkMode
          : SVs.selectedStyle.textColor;
      let backgroundColor =
        darkMode === "dark"
          ? SVs.selectedStyle.backgroundColorDarkMode
          : SVs.selectedStyle.backgroundColor;
      let cssStyle = ``;
      if (backgroundColor) {
        cssStyle += `background-color: ${backgroundColor}`;
      } else {
        cssStyle += `background-color: transparent`;
      }

      if (numberJXG.current.visProp.strokecolor !== textColor) {
        numberJXG.current.visProp.strokecolor = textColor;
        numberJXG.current.visProp.highlightstrokecolor = textColor;
      }
      if (numberJXG.current.visProp.cssstyle !== cssStyle) {
        numberJXG.current.visProp.cssstyle = cssStyle;
        numberJXG.current.visProp.highlightcssstyle = cssStyle;
      }

      numberJXG.current.visProp.highlight = !fixLocation.current;
      numberJXG.current.visProp.fixed = fixed.current;
      numberJXG.current.isDraggable = !fixLocation.current;

      numberJXG.current.needsUpdate = true;

      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
          SVs.positionFromAnchor,
        );
        numberJXG.current.visProp.anchorx = anchorx;
        numberJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        numberJXG.current.fullUpdate();
      } else {
        numberJXG.current.update();
      }

      anchorPointJXG.current.needsUpdate = true;
      anchorPointJXG.current.update();
      board.updateRenderer();
    }

    return <a name={id} />;
  }

  // not in board

  if (SVs.hidden) {
    return null;
  }

  let number = SVs.text;
  if (SVs.renderAsMath) {
    number = "\\(" + number + "\\)";
  }

  let style = textRendererStyle(darkMode, SVs.selectedStyle);
  return (
    <>
      <a name={id} />
      <span id={id} style={style}>
        <MathJax hideUntilTypeset={"first"} inline dynamic>
          {number}
        </MathJax>
      </span>
    </>
  );
});
