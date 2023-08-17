import React, { useContext, useEffect, useRef, useState } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud,
  faPercentage,
} from "@fortawesome/free-solid-svg-icons";
import { rendererState } from "../useDoenetRenderer";
import { useSetRecoilState } from "recoil";
import ToggleButton from "../../_reactComponents/PanelHeaderComponents/ToggleButton";
import styled from "styled-components";
import "./booleanInput.css";
import { MathJax } from "better-react-mathjax";
import { BoardContext } from "./graph";
import me from "math-expressions";
import { getPositionFromAnchorByCoordinate } from "../../Core/utils/graphical";

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
  position: relative;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  /* text-align: center; */
  padding: 2px;
  /* z-index: 0; */
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  }
`;

export default React.memo(function BooleanInput(props) {
  let { name, id, SVs, actions, ignoreUpdate, rendererName, callAction } =
    useDoenetRenderer(props);

  BooleanInput.baseStateVariable = "value";
  BooleanInput.ignoreActionsWithoutCore = (actionName) =>
    actionName === "moveInput";

  const [rendererValue, setRendererValue] = useState(SVs.value);

  // add ref, because event handler called from jsxgraph doesn't get new value
  let rendererValueRef = useRef(null);
  rendererValueRef.current = rendererValue;

  const setRendererState = useSetRecoilState(rendererState(rendererName));

  let valueWhenSetState = useRef(null);

  let inputJXG = useRef(null);
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

  let fixed = useRef(false);
  let fixLocation = useRef(false);

  fixed.current = SVs.fixed;
  fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

  useEffect(() => {
    //On unmount
    return () => {
      if (inputJXG.current !== null) {
        deleteInputJXG();
      }
    };
  }, []);

  if (!ignoreUpdate && valueWhenSetState.current !== SVs.value) {
    // console.log(`setting value to ${SVs.value}`)
    setRendererValue(SVs.value);
    valueWhenSetState.current = SVs.value;
  } else {
    valueWhenSetState.current = null;
  }

  function onChangeHandler(e) {
    let newValue = !rendererValueRef.current;

    setRendererValue(newValue);
    valueWhenSetState.current = SVs.value;

    setRendererState((was) => {
      let newObj = { ...was };
      newObj.ignoreUpdate = true;
      return newObj;
    });

    callAction({
      action: actions.updateBoolean,
      args: {
        boolean: newValue,
      },
      baseVariableValue: newValue,
    });
  }

  function createInputJXG() {
    let jsxInputAttributes = {
      visible: !SVs.hidden,
      fixed: fixed.current,
      disabled: SVs.disabled,
      checked: rendererValue,
      useMathJax: SVs.labelHasLatex,
      strokeColor: "var(--canvastext)",
      highlightStrokeColor: "var(--canvastext)",
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
        jsxInputAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxInputAttributes["visible"] = false;
      }

      newAnchorPointJXG = board.create("point", anchorCoords, {
        visible: false,
      });
    } catch (e) {
      jsxInputAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], { visible: false });
      return;
    }

    jsxInputAttributes.anchor = newAnchorPointJXG;

    let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
      SVs.positionFromAnchor,
    );
    jsxInputAttributes.anchorx = anchorx;
    jsxInputAttributes.anchory = anchory;
    anchorRel.current = [anchorx, anchory];

    let newInputJXG = board.create(
      "checkbox",
      [0, 0, SVs.label],
      jsxInputAttributes,
    );
    newInputJXG.rendNodeCheckbox.addEventListener("change", onChangeHandler);

    newInputJXG.isDraggable = !fixLocation.current;

    newInputJXG.on("down", function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
    });

    newInputJXG.on("hit", function (e) {
      dragged.current = false;
    });

    newInputJXG.on("up", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveInput,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      }
    });

    newInputJXG.on("keyfocusout", function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveInput,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          },
        });
        dragged.current = false;
      }
    });

    newInputJXG.on("drag", function (e) {
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
      let width = newInputJXG.size[0] / board.unitX;
      let height = newInputJXG.size[1] / board.unitY;

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
          newAnchorPointJXG.X() + newInputJXG.relativeCoords.usrCoords[1];
        calculatedY.current =
          newAnchorPointJXG.Y() + newInputJXG.relativeCoords.usrCoords[2];
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
        action: actions.moveInput,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        },
      });

      newInputJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]);
      newAnchorPointJXG.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        lastPositionFromCore.current,
      );
    });

    newInputJXG.on("keydown", function (e) {
      if (e.key === "Enter") {
        if (dragged.current) {
          callAction({
            action: actions.moveInput,
            args: {
              x: calculatedX.current,
              y: calculatedY.current,
            },
          });
          dragged.current = false;
        }
      }
    });

    inputJXG.current = newInputJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;

    // Note: no idea why one has to update the label after waiting
    // But, if we don't do that, the label isn't positioned correctly if any anchors are "middle"
    // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
    if (SVs.labelHasLatex) {
      setTimeout(() => {
        if (inputJXG.current) {
          inputJXG.current.needsUpdate = true;
          inputJXG.current.setText(SVs.label);
          inputJXG.current.update();
          board?.updateRenderer();
        }
      }, 1000);
    }
  }

  function deleteInputJXG() {
    inputJXG.current.rendNodeCheckbox.removeEventListener(
      "change",
      onChangeHandler,
    );
    inputJXG.current.off("drag");
    inputJXG.current.off("down");
    inputJXG.current.off("hit");
    inputJXG.current.off("up");
    inputJXG.current.off("keyfocusout");
    inputJXG.current.off("keydown");
    board.removeObject(inputJXG.current);
    inputJXG.current = null;
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

    if (inputJXG.current === null) {
      createInputJXG();
    } else {
      if (inputJXG.current.Value() !== rendererValue) {
        inputJXG.current.setAttribute({ checked: rendererValue });
      }

      inputJXG.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0],
      );
      anchorPointJXG.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        anchorCoords,
      );

      inputJXG.current.setText(SVs.label);

      let visible = !SVs.hidden;

      if (
        Number.isFinite(anchorCoords[0]) &&
        Number.isFinite(anchorCoords[1])
      ) {
        let actuallyChangedVisibility =
          inputJXG.current.visProp["visible"] !== visible;
        inputJXG.current.visProp["visible"] = visible;
        inputJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          inputJXG.current.setAttribute({ visible });
        }
      } else {
        inputJXG.current.visProp["visible"] = false;
        inputJXG.current.visPropCalc["visible"] = false;
      }

      if (inputJXG.current.visProp.disabled !== SVs.disabled) {
        inputJXG.current.visProp.disabled = SVs.disabled;
        inputJXG.current.setAttribute({ disabled: SVs.disabled });
      }

      inputJXG.current.visProp.highlight = !fixLocation.current;
      inputJXG.current.visProp.fixed = fixed.current;
      inputJXG.current.isDraggable = !fixLocation.current;

      inputJXG.current.needsUpdate = true;

      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
          SVs.positionFromAnchor,
        );
        inputJXG.current.visProp.anchorx = anchorx;
        inputJXG.current.visProp.anchory = anchory;
        anchorRel.current = [anchorx, anchory];
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        inputJXG.current.fullUpdate();
      } else {
        inputJXG.current.update();
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

  let disabled = SVs.disabled;

  const inputKey = id + "_input";

  let checkWorkStyle = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px",
  };

  //Assume we don't have a check work button
  let checkWorkButton = null;
  let icon = props.icon;
  if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
    let validationState = "unvalidated";
    if (SVs.valueHasBeenValidated) {
      if (SVs.creditAchieved === 1) {
        validationState = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState = "incorrect";
      } else {
        validationState = "partialcorrect";
      }
    }

    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(
          document.documentElement,
        ).getPropertyValue("--mainGray");
        checkWorkStyle.cursor = "not-allowed";
      }
      checkWorkButton = (
        <Button
          id={id + "_submit"}
          tabIndex="0"
          disabled={disabled}
          // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          style={checkWorkStyle}
          onClick={() =>
            callAction({
              action: actions.submitAnswer,
            })
          }
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              callAction({
                action: actions.submitAnswer,
              });
            }
          }}
        >
          <FontAwesomeIcon
            style={
              {
                /*marginRight: "4px", paddingLeft: "2px"*/
              }
            }
            icon={faLevelDownAlt}
            transform={{ rotate: 90 }}
          />
        </Button>
      );
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(
            document.documentElement,
          ).getPropertyValue("--mainGreen");
          checkWorkButton = (
            <Button id={id + "_correct"} style={checkWorkStyle}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          );
        } else if (validationState === "partialcorrect") {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "44px";

          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = (
            <Button id={id + "_partial"} style={checkWorkStyle}>
              {partialCreditContents}
            </Button>
          );
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = getComputedStyle(
            document.documentElement,
          ).getPropertyValue("--mainRed");
          checkWorkButton = (
            <Button id={id + "_incorrect"} style={checkWorkStyle}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          );
        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
        checkWorkButton = (
          <Button id={id + "_saved"} style={checkWorkStyle}>
            <FontAwesomeIcon icon={faCloud} />
          </Button>
        );
      }
    }

    if (SVs.numAttemptsLeft < 0) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(no attempts remaining)</span>
        </>
      );
    } else if (SVs.numAttemptsLeft == 1) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(1 attempt remaining)</span>
        </>
      );
    } else if (Number.isFinite(SVs.numAttemptsLeft)) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>({SVs.numAttemptsLeft} attempts remaining)</span>
        </>
      );
    }
  }

  let input;
  let label = SVs.label;
  if (SVs.labelHasLatex) {
    label = (
      <MathJax hideUntilTypeset={"first"} inline dynamic>
        {label}
      </MathJax>
    );
  }
  if (SVs.asToggleButton) {
    input = (
      <ToggleButton
        id={inputKey}
        key={inputKey}
        isSelected={rendererValue}
        onClick={onChangeHandler}
        value={label}
        disabled={disabled}
      />
    );
  } else {
    let containerClass = "container";
    let checkmarkClass = "checkmark";
    if (disabled) {
      containerClass += " container-disabled";
      checkmarkClass += " checkmark-disabled";
    }
    input = (
      <label className={containerClass}>
        <input
          type="checkbox"
          key={inputKey}
          id={inputKey}
          checked={rendererValue}
          onChange={onChangeHandler}
          disabled={disabled}
        />
        <span className={checkmarkClass}></span>
        {label != "" ? (
          <span style={{ marginLeft: "2px" }}>{label}</span>
        ) : (
          <span>{label}</span>
        )}
      </label>
    );
    {
      checkWorkButton;
    }
  }

  return (
    <React.Fragment>
      <span id={id}>
        <a name={id} />
        {input}
      </span>
      {checkWorkButton}
    </React.Fragment>
  );
});
