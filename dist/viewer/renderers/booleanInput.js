import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {rendererState} from "./useDoenetRenderer.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
export default function BooleanInput(props) {
  let {name, SVs, actions, ignoreUpdate, rendererName, callAction} = useDoenetRender(props);
  BooleanInput.baseStateVariable = "value";
  const [rendererValue, setRendererValue] = useState(SVs.value);
  const setRendererState = useSetRecoilState(rendererState(rendererName));
  let valueWhenSetState = useRef(null);
  if (!ignoreUpdate && valueWhenSetState.current !== SVs.value) {
    setRendererValue(SVs.value);
    valueWhenSetState.current = SVs.value;
  } else {
    valueWhenSetState.current = null;
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
  function onChangeHandler(e) {
    let newValue = e.target.checked;
    setRendererValue(newValue);
    valueWhenSetState.current = SVs.value;
    setRendererState((was) => {
      let newObj = {...was};
      newObj.ignoreUpdate = true;
      return newObj;
    });
    callAction({
      action: actions.updateBoolean,
      args: {
        boolean: newValue
      },
      baseVariableValue: newValue
    });
  }
  if (SVs.hidden) {
    return null;
  }
  let disabled = SVs.disabled;
  const inputKey = name + "_input";
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
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", {
    type: "checkbox",
    key: inputKey,
    id: inputKey,
    checked: rendererValue,
    onChange: onChangeHandler,
    disabled
  }), SVs.label), checkWorkButton));
}
