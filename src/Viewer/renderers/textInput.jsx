import React, { useContext, useEffect, useRef, useState } from "react";
import useDoenetRender from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud,
  faPercentage,
} from "@fortawesome/free-solid-svg-icons";
import { sizeToCSS } from "./utils/css";
import { rendererState } from "../useDoenetRenderer";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";
import { BoardContext } from "./graph";
import me from "math-expressions";
import { getPositionFromAnchorByCoordinate } from "../../Core/utils/graphical";

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
  position: relative;
  height: 24px;
  width: 24px;
  display: inline-block;
  color: white;
  background-color: var(--mainBlue);
  padding: 2px;
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  }
`;

const TextArea = styled.textarea`
  width: ${(props) => props.width};
  height: ${(props) =>
    props.height}; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${(props) =>
    props.disabled ? "2px solid var(--mainGray)" : "var(--mainBorder)"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "auto")};

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`;

const Input = styled.input`
  width: ${(props) => props.width};
  height: 20px; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${(props) =>
    props.disabled ? "2px solid var(--mainGray)" : "var(--mainBorder)"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "auto")};

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`;

export default function TextInput(props) {
  let {
    name,
    id,
    SVs,
    actions,
    sourceOfUpdate,
    ignoreUpdate,
    rendererName,
    callAction,
  } = useDoenetRender(props);

  let width = sizeToCSS(SVs.width);
  let height = sizeToCSS(SVs.height); // only for TextArea

  TextInput.baseStateVariable = "immediateValue";
  TextInput.ignoreActionsWithoutCore = (actionName) =>
    actionName === "moveInput";

  const [rendererValue, setRendererValue] = useState(SVs.immediateValue);

  // add ref, because event handler called from jsxgraph doesn't get new value
  let rendererValueRef = useRef(null);
  rendererValueRef.current = rendererValue;

  const setRendererState = useSetRecoilState(rendererState(rendererName));

  let valueToRevertTo = useRef(SVs.immediateValue);
  let focused = useRef(null);

  let immediateValueWhenSetState = useRef(null);

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

  if (
    !ignoreUpdate &&
    immediateValueWhenSetState.current !== SVs.immediateValue
  ) {
    // console.log(`setting value to ${SVs.immediateValue}`)
    setRendererValue(SVs.immediateValue);
    immediateValueWhenSetState.current = SVs.immediateValue;
    valueToRevertTo.current = SVs.immediateValue;
  } else {
    immediateValueWhenSetState.current = null;
  }

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

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      valueToRevertTo.current = rendererValueRef.current;

      callAction({
        action: actions.updateValue,
        baseVariableValue: rendererValueRef.current,
      });

      if (
        SVs.includeCheckWork &&
        !SVs.suppressCheckwork &&
        !SVs.expanded &&
        validationState === "unvalidated"
      ) {
        callAction({
          action: actions.submitAnswer,
        });
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      let oldValue = valueToRevertTo.current;

      if (oldValue !== rendererValueRef.current) {
        setRendererValue(oldValue);
        immediateValueWhenSetState.current = SVs.immediateValue;

        callAction({
          action: actions.updateImmediateValue,
          args: {
            text: oldValue,
          },
          baseVariableValue: oldValue,
        });
      }
    }
  }

  function handleFocus(e) {
    focused.current = true;
  }

  function handleBlur(e) {
    focused.current = false;

    valueToRevertTo.current = rendererValueRef.current;

    callAction({
      action: actions.updateValue,
      baseVariableValue: rendererValueRef.current,
    });
  }

  function onChangeHandler(e) {
    let newValue = e.target.value;

    // console.log(`on change handler for ${id}, desired value: ${newValue}`)

    if (newValue !== rendererValueRef.current) {
      setRendererValue(newValue);

      setRendererState((was) => {
        let newObj = { ...was };
        newObj.ignoreUpdate = true;
        return newObj;
      });
      immediateValueWhenSetState.current = SVs.immediateValue;

      callAction({
        action: actions.updateImmediateValue,
        args: {
          text: newValue,
        },
        baseVariableValue: newValue,
      });
    }
  }

  function createInputJXG() {
    let jsxInputAttributes = {
      visible: !SVs.hidden,
      fixed: fixed.current,
      disabled: SVs.disabled,
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
      "input",
      [0, 0, rendererValue, SVs.label],
      jsxInputAttributes,
    );
    newInputJXG.isDraggable = !fixLocation.current;

    newInputJXG.rendNodeInput.addEventListener("input", onChangeHandler);
    newInputJXG.rendNodeInput.addEventListener("keypress", handleKeyPress);
    newInputJXG.rendNodeInput.addEventListener("keydown", handleKeyDown);
    newInputJXG.rendNodeInput.addEventListener("blur", handleBlur);
    newInputJXG.rendNodeInput.addEventListener("focus", handleFocus);

    newInputJXG.rendNodeInput.style.width = width;
    newInputJXG.rendNodeInput.style.color = "var(--canvastext)";
    newInputJXG.rendNodeInput.style.background = "var(--canvas)";
    newInputJXG.rendNodeInput.style.borderColor = "var(--canvastext)";

    newInputJXG.rendNodeLabel.style.marginRight = "2px";

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
    inputJXG.current.rendNodeInput.removeEventListener(
      "input",
      onChangeHandler,
    );
    inputJXG.current.rendNodeInput.removeEventListener(
      "keypress",
      handleKeyPress,
    );
    inputJXG.current.rendNodeInput.removeEventListener(
      "keydown",
      handleKeyDown,
    );
    inputJXG.current.rendNodeInput.removeEventListener("blur", handleBlur);
    inputJXG.current.rendNodeInput.removeEventListener("focus", handleFocus);

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
        inputJXG.current.set(rendererValue);
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

      inputJXG.current.rendNodeInput.style.width = width;

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

  if (disabled) {
    checkWorkStyle.backgroundColor = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--mainGray");
    checkWorkStyle.cursor = "not-allowed";
    checkWorkStyle.color = "black";
  }

  // Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
    if (validationState === "unvalidated") {
      checkWorkButton = (
        <Button
          id={id + "_submit"}
          tabIndex="0"
          disabled={disabled}
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

    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(no attempts remaining)</span>
        </>
      );
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(1 attempt remaining)</span>
        </>
      );
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(attempts remaining: {SVs.numberOfAttemptsLeft})</span>
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
  if (SVs.expanded) {
    input = (
      <label style={{ display: "inline-flex", maxWidth: "100%" }}>
        {label}
        <TextArea
          key={inputKey}
          id={inputKey}
          value={rendererValue}
          disabled={disabled}
          onChange={onChangeHandler}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          width={width}
          height={height}
          style={{
            margin: "0px 4px 4px 4px",
            color: "var(--canvastext)",
            background: "var(--canvas)",
          }}
        />
      </label>
    );
  } else {
    input = (
      <label style={{ display: "inline-flex", maxWidth: "100%" }}>
        {label}
        <Input
          key={inputKey}
          id={inputKey}
          value={rendererValue}
          disabled={disabled}
          onChange={onChangeHandler}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          width={width}
          style={{
            margin: "0px 4px 4px 4px",
            color: "var(--canvastext)",
            background: "var(--canvas)",
          }}
        />
      </label>
    );
  }

  return (
    <React.Fragment>
      <a name={id} />
      <span
        className="textInputSurroundingBox"
        id={id}
        style={{ display: "inline-flex", maxWidth: "100%" }}
      >
        {input}
        {checkWorkButton}
      </span>
    </React.Fragment>
  );
}
