import React, { useContext, useEffect, useRef } from "react";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRender from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import me from "math-expressions";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../../Tools/_framework/DarkmodeController";
import { textRendererStyle } from "../../Core/utils/style";
import { getPositionFromAnchorByCoordinate } from "../../Core/utils/graphical";
import { cesc } from "../../_utils/url";

export default React.memo(function MathComponent(props) {
  let { name, id, SVs, actions, sourceOfUpdate, callAction } =
    useDoenetRender(props);

  MathComponent.ignoreActionsWithoutCore = () => true;

  let mathJXG = useRef(null);
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

  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    //On unmount
    return () => {
      if (mathJXG.current !== null) {
        deleteMathJXG();
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

  function createMathJXG() {
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
    let jsxMathAttributes = {
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
      useMathJax: true,
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
        jsxMathAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxMathAttributes["visible"] = false;
      }

      newAnchorPointJXG = board.create("point", anchorCoords, {
        visible: false,
      });
    } catch (e) {
      jsxMathAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], { visible: false });
    }

    jsxMathAttributes.anchor = newAnchorPointJXG;

    let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
      SVs.positionFromAnchor,
    );
    jsxMathAttributes.anchorx = anchorx;
    jsxMathAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];

    let beginDelim, endDelim;
    if (SVs.renderMode === "inline") {
      beginDelim = "\\(";
      endDelim = "\\)";
    } else if (SVs.renderMode === "display") {
      beginDelim = "\\[";
      endDelim = "\\]";
    } else if (SVs.renderMode === "numbered") {
      beginDelim = `\\begin{gather}\\tag{${SVs.equationTag}}`;
      endDelim = "\\end{gather}";
    } else if (SVs.renderMode === "align") {
      beginDelim = "\\begin{align}";
      endDelim = "\\end{align}";
    } else {
      // treat as inline if have unrecognized renderMode
      beginDelim = "\\(";
      endDelim = "\\)";
    }

    let newMathJXG = board.create(
      "text",
      [0, 0, beginDelim + SVs.latex + endDelim],
      jsxMathAttributes,
    );
    newMathJXG.isDraggable = !fixLocation.current;

    newMathJXG.on("down", function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
      pointerIsDown.current = true;
      pointerMovedSinceDown.current = false;
      if (!fixed.current) {
        callAction({
          action: actions.mathFocused,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    newMathJXG.on("hit", function (e) {
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
      callAction({
        action: actions.mathFocused,
        args: { name }, // send name so get original name if adapted
      });
    });

    newMathJXG.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveMath,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      } else if (!pointerMovedSinceDown.current && !fixed.current) {
        callAction({
          action: actions.mathClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
      pointerIsDown.current = false;
    });

    newMathJXG.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveMath,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      }
    });

    newMathJXG.on("drag", function (e) {
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
      let width = newMathJXG.size[0] / board.unitX;
      let height = newMathJXG.size[1] / board.unitY;

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
          newAnchorPointJXG.X() + newMathJXG.relativeCoords.usrCoords[1];
        calculatedY.current =
          newAnchorPointJXG.Y() + newMathJXG.relativeCoords.usrCoords[2];
      }

      calculatedX.current = Math.min(
        xmaxAdjusted,
        Math.max(xminAdjusted, calculatedX.current),
      );
      calculatedY.current = Math.min(
        ymaxAdjusted,
        Math.max(yminAdjusted, calculatedY.current),
      );

      let args = {
        x: calculatedX.current,
        y: calculatedY.current,
        transient: true,
        skippable: true,
      };

      if (!viaPointer) {
        args.viaKeyboard = true;
        args.lastPosition = lastPositionFromCore.current;
        args.limits = [
          [xminAdjusted, xmaxAdjusted],
          [yminAdjusted, ymaxAdjusted],
        ];
      }

      callAction({
        action: actions.moveMath,
        args,
      });

      newMathJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastPositionFromCore.current,
      );
    });

    newMathJXG.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveMath,
            args: {
              x: calculatedX.current,
              y: calculatedY.current,
            },
          });
          dragged.current = false;
        }
        callAction({
          action: actions.mathClicked,
          args: { name }, // send name so get original name if adapted
        });
      }
    });

    mathJXG.current = newMathJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;

    // Note: no idea why one has to update the math after waiting
    // But, if we don't do that, the math isn't positioned correctly if any anchors are "middle",
    // and, especially for displayed math, the drag handlers may not be called
    // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
    setTimeout(() => {
      if (mathJXG.current) {
        mathJXG.current.needsUpdate = true;
        mathJXG.current.setText(beginDelim + SVs.latex + endDelim);
        mathJXG.current.update();
        board.updateRenderer();
      }
    }, 1000);
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

  function deleteMathJXG() {
    mathJXG.current.off("drag");
    mathJXG.current.off("down");
    mathJXG.current.off("hit");
    mathJXG.current.off("up");
    mathJXG.current.off("keyfocusout");
    mathJXG.current.off("keydown");
    board.removeObject(mathJXG.current);
    mathJXG.current = null;
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

    if (mathJXG.current === null) {
      createMathJXG();
    } else {
      mathJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      anchorPointJXG.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        anchorCoords,
      );

      let beginDelim, endDelim;
      if (SVs.renderMode === "inline") {
        beginDelim = "\\(";
        endDelim = "\\)";
      } else if (SVs.renderMode === "display") {
        beginDelim = "\\[";
        endDelim = "\\]";
      } else if (SVs.renderMode === "numbered") {
        beginDelim = `\\begin{gather}\\tag{${SVs.equationTag}}`;
        endDelim = "\\end{gather}";
      } else if (SVs.renderMode === "align") {
        beginDelim = "\\begin{align}";
        endDelim = "\\end{align}";
      } else {
        // treat as inline if have unrecognized renderMode
        beginDelim = "\\(";
        endDelim = "\\)";
      }

      mathJXG.current.setText(beginDelim + SVs.latex + endDelim);

      let visible = !SVs.hidden;

      if (
        Number.isFinite(anchorCoords[0]) &&
        Number.isFinite(anchorCoords[1])
      ) {
        let actuallyChangedVisibility =
          mathJXG.current.visProp["visible"] !== visible;
        mathJXG.current.visProp["visible"] = visible;
        mathJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          mathJXG.current.setAttribute({ visible });
        }
      } else {
        mathJXG.current.visProp["visible"] = false;
        mathJXG.current.visPropCalc["visible"] = false;
      }

      let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
      let layerChanged = mathJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        mathJXG.current.setAttribute({ layer });
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

      if (mathJXG.current.visProp.strokecolor !== textColor) {
        mathJXG.current.visProp.strokecolor = textColor;
        mathJXG.current.visProp.highlightstrokecolor = textColor;
      }
      if (mathJXG.current.visProp.cssstyle !== cssStyle) {
        mathJXG.current.visProp.cssstyle = cssStyle;
        mathJXG.current.visProp.highlightcssstyle = cssStyle;
      }

      mathJXG.current.visProp.highlight = !fixLocation.current;
      mathJXG.current.visProp.fixed = fixed.current;
      mathJXG.current.isDraggable = !fixLocation.current;

      mathJXG.current.needsUpdate = true;

      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
          SVs.positionFromAnchor,
        );
        mathJXG.current.visProp.anchorx = anchorx;
        mathJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        mathJXG.current.fullUpdate();
      } else {
        mathJXG.current.update();
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

  let beginDelim, endDelim;
  if (SVs.renderMode === "inline") {
    beginDelim = "\\(";
    endDelim = "\\)";
  } else if (SVs.renderMode === "display") {
    beginDelim = "\\[";
    endDelim = "\\]";
  } else if (SVs.renderMode === "numbered") {
    beginDelim = `\\begin{gather}\\tag{${SVs.equationTag}}`;
    endDelim = "\\end{gather}";
  } else if (SVs.renderMode === "align") {
    beginDelim = "\\begin{align}";
    endDelim = "\\end{align}";
  } else {
    // treat as inline if have unrecognized renderMode
    beginDelim = "\\(";
    endDelim = "\\)";
  }

  // if element of latexOrInputChildren is a number,
  // then that element is an index of which child (a mathInput) to render
  // else, that element is a latex string

  // TODO: we don't want deliminers around each piece,
  // instead, we want to be able to put the mathInput inside mathjax
  // This is just a stopgap solution that works in a few simple cases!!!

  // Note: when a component type gets switched, sometimes state variables change before renderer
  // so protect against case where the latexWithInputChildren is gone but renderer is still math
  if (!SVs.latexWithInputChildren) {
    return null;
  }

  let latexOrInputChildren = SVs.latexWithInputChildren.map((x) =>
    typeof x === "number" ? this.children[x] : beginDelim + x + endDelim,
  );

  let anchors = [<a name={id} key={id} />];
  if (SVs.mrowChildNames) {
    anchors.push(
      ...SVs.mrowChildNames.map((x) => {
        let rowId = cesc(x);
        return <a name={rowId} key={rowId} id={rowId} />;
      }),
    );
  }

  let style = textRendererStyle(darkMode, SVs.selectedStyle);

  // TODO: BADBADBAD
  // Don't understand why MathJax isn't updating when using {latexOrInputChildren}
  // so hard coded the only two cases using so far: with 1 or 2 entries

  if (latexOrInputChildren.length === 0) {
    return (
      <>
        {anchors}
        <span id={id} style={style}></span>
      </>
    );
  } else if (latexOrInputChildren.length === 1) {
    return (
      <>
        {anchors}
        <span id={id} style={style}>
          <MathJax hideUntilTypeset={"first"} inline dynamic>
            {latexOrInputChildren[0]}
          </MathJax>
        </span>
      </>
    );
  } else if (latexOrInputChildren.length === 2) {
    return (
      <>
        {anchors}
        <span id={id} style={style}>
          <MathJax hideUntilTypeset={"first"} inline dynamic>
            {latexOrInputChildren[0]}
            {latexOrInputChildren[1]}
          </MathJax>
        </span>
      </>
    );
  } else {
    return (
      <>
        {anchors}
        <span id={id} style={style}>
          <MathJax hideUntilTypeset={"first"} inline dynamic>
            {latexOrInputChildren[0]}
          </MathJax>
        </span>
      </>
    );
  }
});
