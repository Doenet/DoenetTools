import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {rendererState} from "./useDoenetRenderer.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import ToggleButton from "../../_reactComponents/PanelHeaderComponents/ToggleButton.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import "./booleanInput.css.proxy.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
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
  };
`;
export default React.memo(function BooleanInput(props) {
  let {name, id, SVs, actions, ignoreUpdate, rendererName, callAction} = useDoenetRender(props);
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
    let newValue = !rendererValue;
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
  const inputKey = id + "_input";
  let checkWorkStyle = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px"
  };
  let checkWorkButton = null;
  let icon = props.icon;
  if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        checkWorkStyle.cursor = "not-allowed";
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
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(", SVs.numberOfAttemptsLeft, " attempts remaining)"));
    }
  }
  let input;
  let label = SVs.label;
  if (SVs.labelHasLatex) {
    label = /* @__PURE__ */ React.createElement(MathJax, {
      hideUntilTypeset: "first",
      inline: true,
      dynamic: true
    }, label);
  }
  if (SVs.asToggleButton) {
    input = /* @__PURE__ */ React.createElement(ToggleButton, {
      id: inputKey,
      key: inputKey,
      isSelected: rendererValue,
      onClick: onChangeHandler,
      value: label,
      disabled
    });
  } else {
    input = /* @__PURE__ */ React.createElement("label", {
      className: "container"
    }, /* @__PURE__ */ React.createElement("input", {
      type: "checkbox",
      key: inputKey,
      id: inputKey,
      checked: rendererValue,
      onChange: onChangeHandler,
      disabled
    }), /* @__PURE__ */ React.createElement("span", {
      className: "checkmark"
    }), label != "" ? /* @__PURE__ */ React.createElement("span", {
      style: {marginLeft: "2px"}
    }, label) : /* @__PURE__ */ React.createElement("span", null, label));
    {
      checkWorkButton;
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
    id
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), input), checkWorkButton);
});
