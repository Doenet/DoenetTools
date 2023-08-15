import React, { useContext, useEffect, useRef } from "react";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer from "../useDoenetRenderer";
import me from "math-expressions";
import { textRendererStyle } from "../../Core/utils/style";
import { getPositionFromAnchorByCoordinate } from "../../Core/utils/graphical";
import { PageContext } from "../PageViewer";

export default React.memo(function Text(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRenderer(props);

  Text.ignoreActionsWithoutCore = () => true;

  let textJXG = useRef(null);
  let anchorPointJXG = useRef(null);
  let anchorRel = useRef(null);

  const board = useContext(BoardContext);

  let pointerAtDown = useRef(null);
  let pointAtDown = useRef(null);
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

  const { darkMode } = useContext(PageContext) || {};

  useEffect(() => {
    //On unmount
    return () => {
      if (textJXG.current !== null) {
        deleteTextJXG();
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

  function createTextJXG() {
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
    let jsxTextAttributes = {
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
        jsxTextAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxTextAttributes["visible"] = false;
      }

      newAnchorPointJXG = board.create("point", anchorCoords, {
        visible: false,
      });
    } catch (e) {
      jsxTextAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], { visible: false });
    }

    jsxTextAttributes.anchor = newAnchorPointJXG;

    let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
      SVs.positionFromAnchor,
    );
    jsxTextAttributes.anchorx = anchorx;
    jsxTextAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];

    let newTextJXG = board.create("text", [0, 0, SVs.text], jsxTextAttributes);
    newTextJXG.isDraggable = !fixLocation.current;

    newTextJXG.on("down", function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      if (!fixed.current) {
        callAction({
          action: actions.textFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    newTextJXG.on("hit", function (e) {
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
      callAction({
        action: actions.textFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    newTextJXG.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveText,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        callAction({
          action: actions.textClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointerIsDown.current = false;
    });

    newTextJXG.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveText,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      }
    });

    newTextJXG.on("drag", function (e) {
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
      let width = newTextJXG.size[0] / board.unitX;
      let height = newTextJXG.size[1] / board.unitY;

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
          newAnchorPointJXG.X() + newTextJXG.relativeCoords.usrCoords[1];
        calculatedY.current =
          newAnchorPointJXG.Y() + newTextJXG.relativeCoords.usrCoords[2];
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
        action: actions.moveText,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        },
      });

      newTextJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastPositionFromCore.current,
      );
    });

    newTextJXG.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveText,
            args: {
              x: calculatedX.current,
              y: calculatedY.current,
            },
          });
          dragged.current = false;
        }
        callAction({
          action: actions.textClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    textJXG.current = newTextJXG;
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

  function deleteTextJXG() {
    textJXG.current.off("drag");
    textJXG.current.off("down");
    textJXG.current.off("hit");
    textJXG.current.off("up");
    textJXG.current.off("keyfocusout");
    textJXG.current.off("keydown");
    board.removeObject(textJXG.current);
    textJXG.current = null;
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

    if (textJXG.current === null) {
      createTextJXG();
    } else {
      textJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      anchorPointJXG.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        anchorCoords,
      );

      textJXG.current.setText(SVs.text);

      let visible = !SVs.hidden;

      if (
        Number.isFinite(anchorCoords[0]) &&
        Number.isFinite(anchorCoords[1])
      ) {
        let actuallyChangedVisibility =
          textJXG.current.visProp["visible"] !== visible;
        textJXG.current.visProp["visible"] = visible;
        textJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          textJXG.current.setAttribute({ visible });
        }
      } else {
        textJXG.current.visProp["visible"] = false;
        textJXG.current.visPropCalc["visible"] = false;
      }

      let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
      let layerChanged = textJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        textJXG.current.setAttribute({ layer });
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

      if (textJXG.current.visProp.strokecolor !== textColor) {
        textJXG.current.visProp.strokecolor = textColor;
        textJXG.current.visProp.highlightstrokecolor = textColor;
      }
      if (textJXG.current.visProp.cssstyle !== cssStyle) {
        textJXG.current.visProp.cssstyle = cssStyle;
        textJXG.current.visProp.highlightcssstyle = cssStyle;
      }

      textJXG.current.visProp.highlight = !fixLocation.current;
      textJXG.current.visProp.fixed = fixed.current;
      textJXG.current.isDraggable = !fixLocation.current;

      textJXG.current.needsUpdate = true;

      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
          SVs.positionFromAnchor,
        );
        textJXG.current.visProp.anchorx = anchorx;
        textJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        textJXG.current.fullUpdate();
      } else {
        textJXG.current.update();
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

  let style = textRendererStyle(darkMode, SVs.selectedStyle);
  return (
    <>
      <a name={id} />
      <span id={id} style={style}>
        {SVs.text}
      </span>
    </>
  );
});
