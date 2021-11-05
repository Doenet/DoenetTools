import React, {useRef, useState, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import ReactDOM from "../../_snowpack/pkg/react-dom.js";
import DoenetRenderer from "./DoenetRenderer.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import mathquill from "../../_snowpack/pkg/react-mathquill.js";
mathquill.addStyles();
let EditableMathField = mathquill.EditableMathField;
import {focusedMathField, palletRef, buttonRef, functionRef} from "../../_framework/temp/MathInputSelector.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {getFromLatex, normalizeLatexString} from "../../core/utils/math.js";
export default function MathInput(props) {
  let [name, SVs, actions] = useDoenetRender(props);
  const [latex, setLatex] = useState("");
  const [focused, setFocus] = useState(false);
  let mathExpression = SVs.valueForDisplay;
  let latexValue = stripLatex(SVs.valueForDisplay.toLatex());
  const [mathField, setMathField] = useState(null);
  let validationState = "unvalidated";
  const setFocusedField = useSetRecoilState(focusedMathField);
  let valueToRevertTo = SVs.value;
  let valueForDisplayToRevertTo = SVs.valueForDisplay;
  const containerRef = useRecoilValue(palletRef);
  const toggleButtonRef = useRecoilValue(buttonRef);
  const functionTabRef = useRecoilValue(functionRef);
  if (latexValue === "＿") {
    latexValue = "";
  }
  let initializeChildrenOnConstruction = false;
  const calculateMathExpressionFromLatex = (text) => {
    let expression;
    text = normalizeLatexString(text);
    let fromLatex = getFromLatex({
      functionSymbols: SVs.functionSymbols
    });
    try {
      expression = fromLatex(text);
    } catch (e) {
      expression = me.fromAst("＿");
    }
    return expression;
  };
  const updateImmediateValueFromLatex = (text) => {
    let currentMathExpressionNormalized = calculateMathExpressionFromLatex(latexValue);
    latexValue = text;
    let newMathExpression = calculateMathExpressionFromLatex(text);
    if (!newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)) {
      mathExpression = newMathExpression;
      actions.updateImmediateValue({
        mathExpression: newMathExpression
      });
    }
  };
  const updateValidationState = () => {
    validationState = "unvalidated";
    if (SVs.valueHasBeenValidated) {
      if (SVs.creditAchieved === 1) {
        validationState = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState = "incorrect";
      } else {
        validationState = "partialcorrect";
      }
    }
  };
  const handleVirtualKeyboardClick = (text) => {
    mathField.focus();
    if (!text) {
      console.log("Empty value");
      return;
    }
    if (text.split(" ")[0] == "cmd") {
      mathField.cmd(text.split(" ")[1]);
    } else if (text.split(" ")[0] == "write") {
      mathField.write(text.split(" ")[1]);
    } else if (text.split(" ")[0] == "keystroke") {
      mathField.keystroke(text.split(" ")[1]);
    } else if (text.split(" ")[0] == "type") {
      mathField.typedText(text.split(" ")[1]);
    }
  };
  const handleDefaultVirtualKeyboardClick = (text) => {
    console.log("no mathinput field focused");
  };
  const handlePressEnter = (e) => {
    valueToRevertTo = SVs.immediateValue;
    valueForDisplayToRevertTo = mathExpression;
    if (!SVs.value.equalsViaSyntax(SVs.immediateValue)) {
      actions.updateValue();
    }
    if (SVs.includeCheckWork && validationState === "unvalidated") {
      actions.submitAnswer();
    }
  };
  const handleFocus = (e) => {
    setFocus(true);
    setFocusedField(() => handleVirtualKeyboardClick);
  };
  const handleBlur = (e) => {
    if (containerRef.current && containerRef.current.contains(e.relatedTarget)) {
    } else if (toggleButtonRef.current && toggleButtonRef.current.contains(e.relatedTarget)) {
    } else if (functionTabRef.current && functionTabRef.current.contains(e.relatedTarget)) {
    } else {
      valueToRevertTo = SVs.immediateValue;
      valueForDisplayToRevertTo = mathExpression;
      if (!SVs.value.equalsViaSyntax(SVs.immediateValue)) {
        actions.updateValue();
      }
      setFocus(false);
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
    }
  };
  const onChangeHandler = (e) => {
    updateImmediateValueFromLatex(e);
  };
  if (SVs.hidden) {
    return null;
  }
  updateValidationState();
  let surroundingBorderColor = "#efefef";
  if (focused) {
    surroundingBorderColor = "#82a5ff";
  }
  if (!valueForDisplayToRevertTo.equalsViaSyntax(SVs.valueForDisplay)) {
    mathExpression = SVs.valueForDisplay;
    latexValue = stripLatex(mathExpression.toLatex());
    if (latexValue === "＿") {
      latexValue = "";
    }
    valueToRevertTo = SVs.value;
    valueForDisplayToRevertTo = SVs.valueForDisplay;
  }
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
    padding: "2px",
    zIndex: "0"
  };
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
    if (validationState === "unvalidated") {
      checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      checkWorkButton = /* @__PURE__ */ React.createElement("button", {
        id: "_submit",
        tabIndex: "0",
        style: checkWorkStyle,
        onClick: actions.submitAnswer,
        onKeyPress: (e) => {
          if (e.key === "Enter") {
            actions.submitAnswer();
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
            id: "_correct",
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
            id: "_partial",
            style: checkWorkStyle
          }, partialCreditContents);
        } else {
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: "_incorrect",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faTimes
          }));
        }
      } else {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = /* @__PURE__ */ React.createElement("span", {
          id: "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }));
      }
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", null), /* @__PURE__ */ React.createElement("span", {
    className: "textInputSurroundingBox"
  }, /* @__PURE__ */ React.createElement("span", {
    style: {margin: "10px"}
  }, /* @__PURE__ */ React.createElement(EditableMathField, {
    latex: latexValue,
    config: {
      autoCommands: "sqrt pi theta integral infinity",
      autoOperatorNames: "arg deg det dim exp gcd hom ker lg lim ln log max min Pr sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth sin cos tan sec cosec csc cotan cot ctg arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg sinh cosh tanh sech cosech csch cotanh coth ctgh arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh",
      handlers: {
        enter: handlePressEnter
      }
    },
    onChange: (mathField2) => {
      onChangeHandler(mathField2.latex());
    },
    onBlur: handleBlur,
    onFocus: handleFocus,
    mathquillDidMount: (mf) => {
      setMathField(mf);
    }
  })), checkWorkButton));
}
function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, "");
  return s;
}
