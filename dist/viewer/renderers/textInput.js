import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {sizeToCSS} from "./utils/css.js";
export default function TextInput(props) {
  let {name, SVs, actions, sourceOfUpdate, ignoreUpdate, callAction} = useDoenetRender(props);
  TextInput.baseStateVariable = "immediateValue";
  const [rendererValue, setRendererValue] = useState(SVs.immediateValue);
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
      if (SVs.includeCheckWork && validationState === "unvalidated") {
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
  const inputKey = name + "_input";
  let surroundingBorderColor = "#efefef";
  if (focused.current) {
    surroundingBorderColor = "#82a5ff";
  }
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
    let checkWorkStyle = {
      position: "relative",
      width: "30px",
      height: "24px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ffffff",
      display: "inline-block",
      textAlign: "center",
      top: "3px",
      padding: "2px"
    };
    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = "rgb(200,200,200)";
      } else {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      }
      checkWorkButton = /* @__PURE__ */ React.createElement("button", {
        id: name + "_submit",
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
        icon: faLevelDownAlt,
        transform: {rotate: 90}
      }));
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: name + "_correct",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCheck
          }));
        } else if (validationState === "partialcorrect") {
          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";
          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: name + "_partial",
            style: checkWorkStyle
          }, partialCreditContents);
        } else {
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: name + "_incorrect",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faTimes
          }));
        }
      } else {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = /* @__PURE__ */ React.createElement("span", {
          id: name + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }));
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", SVs.numberOfAttemptsLeft, ")"));
    }
  }
  let input;
  if (SVs.expanded) {
    input = /* @__PURE__ */ React.createElement("textarea", {
      key: inputKey,
      id: inputKey,
      value: rendererValue,
      disabled,
      onChange: onChangeHandler,
      onKeyPress: handleKeyPress,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      style: {
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        fontSize: "14px",
        borderWidth: "1px",
        padding: "4px"
      }
    });
  } else {
    input = /* @__PURE__ */ React.createElement("input", {
      key: inputKey,
      id: inputKey,
      value: rendererValue,
      disabled,
      onChange: onChangeHandler,
      onKeyPress: handleKeyPress,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      style: {
        width: `${SVs.size * 10}px`,
        height: "22px",
        fontSize: "14px",
        borderWidth: "1px",
        borderColor: surroundingBorderColor,
        padding: "4px"
      }
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    className: "textInputSurroundingBox",
    id: name
  }, input, checkWorkButton));
}
