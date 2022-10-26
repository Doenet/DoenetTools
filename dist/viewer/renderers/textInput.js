import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {sizeToCSS} from "./utils/css.js";
import {rendererState} from "./useDoenetRenderer.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
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
  };
`;
const TextArea = styled.textarea`
  width: ${(props) => props.textAreaWidth};
  height: ${(props) => props.textAreaHeight}; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${(props) => props.surroundingBorder}; // Turns blue on focus

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`;
const Input = styled.input`
  width: ${(props) => props.inputWidth}px;
  height: 20px; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${(props) => props.surroundingBorder}; // Turns blue on focus

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`;
export default function TextInput(props) {
  let {name, id, SVs, actions, sourceOfUpdate, ignoreUpdate, rendererName, callAction} = useDoenetRender(props);
  let textAreaWidth = sizeToCSS(SVs.width);
  let textAreaHeight = sizeToCSS(SVs.height);
  let inputWidth = SVs.size * 10;
  TextInput.baseStateVariable = "immediateValue";
  const [rendererValue, setRendererValue] = useState(SVs.immediateValue);
  const setRendererState = useSetRecoilState(rendererState(rendererName));
  let valueToRevertTo = useRef(SVs.immediateValue);
  let focused = useRef(null);
  let immediateValueWhenSetState = useRef(null);
  if (!ignoreUpdate && immediateValueWhenSetState.current !== SVs.immediateValue) {
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
      valueToRevertTo.current = rendererValue;
      callAction({
        action: actions.updateValue,
        baseVariableValue: rendererValue
      });
      if (SVs.includeCheckWork && !SVs.suppressCheckwork && validationState === "unvalidated") {
        callAction({
          action: actions.submitAnswer
        });
      }
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Escape") {
      let oldValue = valueToRevertTo.current;
      if (oldValue !== rendererValue) {
        setRendererValue(oldValue);
        immediateValueWhenSetState.current = SVs.immediateValue;
        callAction({
          action: actions.updateImmediateValue,
          args: {
            text: oldValue
          },
          baseVariableValue: oldValue
        });
      }
    }
  }
  function handleFocus(e) {
    focused.current = true;
  }
  function handleBlur(e) {
    focused.current = false;
    valueToRevertTo.current = rendererValue;
    callAction({
      action: actions.updateValue,
      baseVariableValue: rendererValue
    });
  }
  function onChangeHandler(e) {
    let newValue = e.target.value;
    if (newValue !== rendererValue) {
      setRendererValue(newValue);
      setRendererState((was) => {
        let newObj = {...was};
        newObj.ignoreUpdate = true;
        return newObj;
      });
      immediateValueWhenSetState.current = SVs.immediateValue;
      callAction({
        action: actions.updateImmediateValue,
        args: {
          text: newValue
        },
        baseVariableValue: newValue
      });
    }
  }
  if (SVs.hidden) {
    return null;
  }
  let disabled = SVs.disabled;
  const inputKey = id + "_input";
  let surroundingBorder = getComputedStyle(document.documentElement).getPropertyValue("--mainBorder");
  let checkWorkButton = null;
  if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
    let checkWorkStyle = {
      cursor: "pointer",
      padding: "1px 6px 1px 6px"
    };
    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
      }
      checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
        id: id + "_submit",
        tabIndex: "0",
        disabled,
        style: checkWorkStyle,
        onClick: () => callAction({
          action: actions.submitAnswer
        }),
        onKeyPress: (e) => {
          if (e.key === "Enter") {
            callAction({
              action: actions.submitAnswer
            });
          }
        }
      }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        style: {},
        icon: faLevelDownAlt,
        transform: {rotate: 90}
      }));
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
          checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
            id: id + "_correct",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCheck
          }));
        } else if (validationState === "partialcorrect") {
          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "44px";
          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
            id: id + "_partial",
            style: checkWorkStyle
          }, partialCreditContents);
        } else {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
          checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
            id: id + "_incorrect",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faTimes
          }));
        }
      } else {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkStyle.padding = "1px 8px 1px 4px";
        checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
          id: id + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }));
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(1 attempt remaining)"));
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", SVs.numberOfAttemptsLeft, ")"));
    }
  }
  let input;
  if (SVs.expanded) {
    input = /* @__PURE__ */ React.createElement(TextArea, {
      key: inputKey,
      id: inputKey,
      value: rendererValue,
      disabled,
      onChange: onChangeHandler,
      onKeyPress: handleKeyPress,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      textAreaWidth,
      textAreaHeight,
      surroundingBorder,
      style: {margin: "0px 4px 4px 0px"}
    });
  } else {
    input = /* @__PURE__ */ React.createElement(Input, {
      key: inputKey,
      id: inputKey,
      value: rendererValue,
      disabled,
      onChange: onChangeHandler,
      onKeyPress: handleKeyPress,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      inputWidth,
      surroundingBorder,
      style: {margin: "0px 4px 4px 0px"}
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement("span", {
    className: "textInputSurroundingBox",
    id,
    style: {display: "inline-flex"}
  }, input, checkWorkButton));
}
