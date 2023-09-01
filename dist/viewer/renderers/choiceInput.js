import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {rendererState} from "./useDoenetRenderer.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import "./choiceInput.css.proxy.js";
const Button = styled.button`
  position: relative;
  /* width: 24px; */
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  text-align: center;
  padding: 2px;
  z-index: 0;
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  };
`;
export default React.memo(function ChoiceInput(props) {
  let {name, id, SVs, actions, children, sourceOfUpdate, ignoreUpdate, rendererName, callAction} = useDoenetRender(props);
  ChoiceInput.baseStateVariable = "selectedIndices";
  const [rendererSelectedIndices, setRendererSelectedIndices] = useState(SVs.selectedIndices);
  const setRendererState = useSetRecoilState(rendererState(rendererName));
  let selectedIndicesWhenSetState = useRef(null);
  if (!ignoreUpdate && selectedIndicesWhenSetState.current !== SVs.selectedIndices) {
    setRendererSelectedIndices(SVs.selectedIndices);
    selectedIndicesWhenSetState.current = SVs.selectedIndices;
  } else {
    selectedIndicesWhenSetState.current = null;
  }
  let validationState = "unvalidated";
  if (SVs.valueHasBeenValidated || SVs.numberOfAttemptsLeft < 1) {
    if (SVs.creditAchieved === 1) {
      validationState = "correct";
    } else if (SVs.creditAchieved === 0) {
      validationState = "incorrect";
    } else {
      validationState = "partialcorrect";
    }
  }
  function onChangeHandler(e) {
    let newSelectedIndices = [];
    if (SVs.inline) {
      if (e.target.value) {
        newSelectedIndices = Array.from(e.target.selectedOptions, (option) => Number(option.value));
      }
    } else {
      if (SVs.selectMultiple) {
        newSelectedIndices = [...rendererSelectedIndices];
        let index = Number(e.target.value);
        if (e.target.checked) {
          if (!newSelectedIndices.includes(index)) {
            newSelectedIndices.push(index);
            newSelectedIndices.sort((a, b) => a - b);
          }
        } else {
          let i = newSelectedIndices.indexOf(index);
          if (i !== -1) {
            newSelectedIndices.splice(i, 1);
          }
        }
      } else {
        newSelectedIndices = [Number(e.target.value)];
      }
    }
    if (rendererSelectedIndices.length !== newSelectedIndices.length || rendererSelectedIndices.some((v, i) => v != newSelectedIndices[i])) {
      setRendererSelectedIndices(newSelectedIndices);
      selectedIndicesWhenSetState.current = SVs.selectedIndices;
      setRendererState((was) => {
        let newObj = {...was};
        newObj.ignoreUpdate = true;
        return newObj;
      });
      callAction({
        action: actions.updateSelectedIndices,
        args: {
          selectedIndices: newSelectedIndices
        },
        baseVariableValue: newSelectedIndices
      });
    }
  }
  if (SVs.hidden) {
    return null;
  }
  let disabled = SVs.disabled;
  if (SVs.inline) {
    let checkWorkStyle = {
      cursor: "pointer",
      padding: "1px 6px 1px 6px",
      width: "24px"
    };
    let checkWorkButton = null;
    if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
      if (validationState === "unvalidated") {
        if (disabled) {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        }
        checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
          id: id + "_submit",
          disabled,
          tabIndex: "0",
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
    let svData = SVs;
    let optionsList = SVs.choiceTexts.map(function(s, i) {
      if (svData.choicesHidden[i]) {
        return null;
      }
      return /* @__PURE__ */ React.createElement("option", {
        key: i + 1,
        value: i + 1,
        disabled: svData.choicesDisabled[i]
      }, s);
    });
    let value = rendererSelectedIndices;
    if (value === void 0) {
      value = "";
    } else if (!SVs.selectMultiple) {
      value = value[0];
      if (value === void 0) {
        value = "";
      }
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), /* @__PURE__ */ React.createElement("select", {
      className: "custom-select",
      id,
      onChange: onChangeHandler,
      value,
      disabled,
      multiple: SVs.selectMultiple
    }, /* @__PURE__ */ React.createElement("option", {
      hidden: true,
      value: ""
    }, SVs.placeHolder), optionsList), checkWorkButton);
  } else {
    let checkWorkStyle = {
      height: "24px",
      display: "inline-block",
      padding: "1px 6px 1px 6px",
      cursor: "pointer"
    };
    let checkworkComponent = null;
    if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
      if (validationState === "unvalidated") {
        let checkWorkText = SVs.submitLabel;
        if (!SVs.showCorrectness) {
          checkWorkText = SVs.submitLabelNoCorrectness;
        }
        if (disabled) {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        }
        checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
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
        }), " ", checkWorkText);
      } else {
        if (SVs.showCorrectness) {
          if (validationState === "correct") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
            checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
              id: id + "_correct",
              style: checkWorkStyle
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faCheck
            }), "  Correct");
          } else if (validationState === "incorrect") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
            checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
              id: id + "_incorrect",
              style: checkWorkStyle
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faTimes
            }), "  Incorrect");
          } else if (validationState === "partialcorrect") {
            checkWorkStyle.backgroundColor = "#efab34";
            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent}% Correct`;
            checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
              id: id + "_partial",
              style: checkWorkStyle
            }, partialCreditContents);
          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
            id: id + "_saved",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCloud
          }), "  Response Saved");
        }
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(1 attempt remaining)"));
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(", SVs.numberOfAttemptsLeft, " attempts remaining)"));
    }
    let inputKey = id;
    let listStyle = {
      listStyleType: "none"
    };
    let keyBeginning = inputKey + "_choice";
    let inputType = "radio";
    if (SVs.selectMultiple) {
      inputType = "checkbox";
    }
    let svData = SVs;
    let choiceDoenetTags = SVs.choiceOrder.map((v) => children[v - 1]).map(function(child, i) {
      if (svData.choicesHidden[i]) {
        return null;
      }
      if (inputType == "radio") {
        return /* @__PURE__ */ React.createElement("label", {
          className: "radio-container",
          key: inputKey + "_choice" + (i + 1)
        }, /* @__PURE__ */ React.createElement("input", {
          type: "radio",
          id: keyBeginning + (i + 1) + "_input",
          name: inputKey,
          value: i + 1,
          checked: rendererSelectedIndices.includes(i + 1),
          onChange: onChangeHandler,
          disabled: disabled || svData.choicesDisabled[i]
        }), /* @__PURE__ */ React.createElement("span", {
          className: "radio-checkmark"
        }), /* @__PURE__ */ React.createElement("label", {
          htmlFor: keyBeginning + (i + 1) + "_input",
          style: {marginLeft: "2px"}
        }, child));
      } else if (inputType == "checkbox") {
        return /* @__PURE__ */ React.createElement("label", {
          className: "checkbox-container",
          key: inputKey + "_choice" + (i + 1)
        }, /* @__PURE__ */ React.createElement("input", {
          type: "checkbox",
          id: keyBeginning + (i + 1) + "_input",
          name: inputKey,
          value: i + 1,
          checked: rendererSelectedIndices.includes(i + 1),
          onChange: onChangeHandler,
          disabled: disabled || svData.choicesDisabled[i]
        }), /* @__PURE__ */ React.createElement("span", {
          className: "checkbox-checkmark"
        }), /* @__PURE__ */ React.createElement("label", {
          htmlFor: keyBeginning + (i + 1) + "_input",
          style: {marginLeft: "2px"}
        }, child));
      }
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ol", {
      id: inputKey,
      style: listStyle
    }, /* @__PURE__ */ React.createElement("a", {
      name: id
    }), choiceDoenetTags), checkworkComponent);
  }
});
