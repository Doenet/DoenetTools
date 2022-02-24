import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function ChoiceInput(props) {
  let {name, SVs, actions, children, sourceOfUpdate, ignoreUpdate, callAction} = useDoenetRender(props);
  ChoiceInput.baseStateVariable = "selectedIndices";
  const [rendererSelectedIndices, setRendererSelectedIndices] = useState(SVs.selectedIndices);
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
      name
    }), /* @__PURE__ */ React.createElement("select", {
      id: name,
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
      height: "23px",
      display: "inline-block",
      backgroundColor: "rgb(2, 117, 216)",
      padding: "1px 6px 1px 6px",
      color: "white",
      fontWeight: "bold"
    };
    let checkworkComponent = null;
    if (SVs.includeCheckWork) {
      if (validationState === "unvalidated") {
        let checkWorkText = "Check Work";
        if (!SVs.showCorrectness) {
          checkWorkText = "Submit Response";
        }
        if (disabled) {
          checkWorkStyle.backgroundColor = "rgb(200,200,200)";
        }
        checkworkComponent = /* @__PURE__ */ React.createElement("button", {
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
        }), " ", checkWorkText);
      } else {
        if (SVs.showCorrectness) {
          if (validationState === "correct") {
            checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
            checkworkComponent = /* @__PURE__ */ React.createElement("span", {
              id: name + "_correct",
              style: checkWorkStyle
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faCheck
            }), "  Correct");
          } else if (validationState === "incorrect") {
            checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
            checkworkComponent = /* @__PURE__ */ React.createElement("span", {
              id: name + "_incorrect",
              style: checkWorkStyle
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faTimes
            }), "  Incorrect");
          } else if (validationState === "partialcorrect") {
            checkWorkStyle.backgroundColor = "#efab34";
            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent}% Correct`;
            checkworkComponent = /* @__PURE__ */ React.createElement("span", {
              id: name + "_partial",
              style: checkWorkStyle
            }, partialCreditContents);
          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = /* @__PURE__ */ React.createElement("span", {
            id: name + "_saved",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCloud
          }), "  Response Saved");
        }
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", SVs.numberOfAttemptsLeft, ")"));
    }
    let inputKey = name;
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
      return /* @__PURE__ */ React.createElement("li", {
        key: inputKey + "_choice" + (i + 1)
      }, /* @__PURE__ */ React.createElement("input", {
        type: inputType,
        id: keyBeginning + (i + 1) + "_input",
        name: inputKey,
        value: i + 1,
        checked: rendererSelectedIndices.includes(i + 1),
        onChange: onChangeHandler,
        disabled: disabled || svData.choicesDisabled[i]
      }), /* @__PURE__ */ React.createElement("label", {
        htmlFor: keyBeginning + (i + 1) + "_input"
      }, child));
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ol", {
      id: inputKey,
      style: listStyle
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), choiceDoenetTags), checkworkComponent);
  }
}
