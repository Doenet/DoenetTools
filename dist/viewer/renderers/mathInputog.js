import React from "../../_snowpack/pkg/react.js";
import ReactDOM from "../../_snowpack/pkg/react-dom.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud,
  faPercentage
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import mathquill from "../../_snowpack/pkg/react-mathquill.js";
import {getFromLatex, normalizeLatexString} from "../../core/utils/math.js";
mathquill.addStyles();
let EditableMathField = mathquill.EditableMathField;
class DoenetRenderer {
  render() {
    return null;
  }
}
export default class MathInput extends DoenetRenderer {
  constructor(props) {
    console.log("old one");
    super(props);
    this.state = {latex: ""};
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.mathExpression = this.doenetSvData.valueForDisplay;
    if (this.doenetSvData.rawRendererValue !== null) {
      this.latexValue = this.doenetSvData.rawRendererValue;
    } else {
      this.latexValue = stripLatex(this.doenetSvData.valueForDisplay.toLatex());
      this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: false
      });
    }
    this.latexValueSetInRender = true;
    this.valueToRevertTo = this.doenetSvData.value;
    this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
    if (this.latexValue === "＿") {
      this.latexValue = "";
    }
  }
  static initializeChildrenOnConstruction = false;
  componentDidMount() {
  }
  calculateMathExpressionFromLatex(text) {
    let expression;
    text = normalizeLatexString(text);
    text = text.replace(/\^(\w)/g, "^{$1}");
    let fromLatex = getFromLatex({
      functionSymbols: this.doenetSvData.functionSymbols,
      splitSymbols: this.doenetSvData.splitSymbols
    });
    try {
      expression = fromLatex(text);
    } catch (e) {
      expression = me.fromAst("＿");
    }
    return expression;
  }
  updateImmediateValueFromLatex(text) {
    let currentMathExpressionNormalized = this.calculateMathExpressionFromLatex(this.latexValue);
    let newMathExpression = this.calculateMathExpressionFromLatex(text);
    let rawValueChanged = text !== this.latexValue || this.latexValueSetFromValueForDisplay;
    let transientForRaw = !this.latexValueSetInRender;
    let actuallyUpdate = !newMathExpression.equalsViaSyntax(currentMathExpressionNormalized) || !this.latexValueSetInRender && text !== this.latexValue;
    this.latexValue = text;
    this.latexValueSetInRender = false;
    this.latexValueSetFromValueForDisplay = false;
    if (actuallyUpdate) {
      this.mathExpression = newMathExpression;
      this.actions.updateImmediateValue({
        mathExpression: newMathExpression,
        rawRendererValue: this.latexValue,
        transient: true,
        skippable: true
      });
    } else if (rawValueChanged) {
      this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: transientForRaw,
        skippable: transientForRaw
      });
    }
  }
  updateValidationState() {
    this.validationState = "unvalidated";
    if (this.doenetSvData.valueHasBeenValidated || this.doenetSvData.numberOfAttemptsLeft < 1) {
      if (this.doenetSvData.creditAchieved === 1) {
        this.validationState = "correct";
      } else if (this.doenetSvData.creditAchieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }
  async handlePressEnter(e) {
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.valueForDisplayToRevertTo = this.mathExpression;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      await this.actions.updateValue();
    } else {
      await this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: false
      });
    }
    if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
      await this.actions.submitAnswer();
    }
    this.forceUpdate();
  }
  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }
  async handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.valueForDisplayToRevertTo = this.mathExpression;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      await this.actions.updateValue();
    } else {
      await this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: false
      });
    }
    this.forceUpdate();
  }
  async onChangeHandler(e) {
    this.updateImmediateValueFromLatex(e);
    this.forceUpdate();
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    this.updateValidationState();
    let disabled = this.doenetSvData.disabled;
    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }
    if (!this.valueForDisplayToRevertTo.equalsViaSyntax(this.doenetSvData.valueForDisplay)) {
      this.mathExpression = this.doenetSvData.valueForDisplay;
      this.latexValue = stripLatex(this.mathExpression.toLatex());
      if (this.latexValue === "＿") {
        this.latexValue = "";
      }
      this.latexValueSetInRender = true;
      this.latexValueSetFromValueForDisplay = true;
      this.valueToRevertTo = this.doenetSvData.value;
      this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
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
    if (this.doenetSvData.includeCheckWork) {
      if (this.validationState === "unvalidated") {
        if (disabled) {
          checkWorkStyle.backgroundColor = "rgb(200,200,200)";
        } else {
          checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        }
        checkWorkButton = /* @__PURE__ */ React.createElement("button", {
          id: this.componentName + "_submit",
          tabIndex: "0",
          disabled,
          ref: (c) => {
            this.target = c && ReactDOM.findDOMNode(c);
          },
          style: checkWorkStyle,
          onClick: this.actions.submitAnswer,
          onKeyPress: (e) => {
            if (e.key === "Enter") {
              this.actions.submitAnswer();
            }
          }
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faLevelDownAlt,
          transform: {rotate: 90}
        }));
      } else {
        if (this.doenetSvData.showCorrectness) {
          if (this.validationState === "correct") {
            checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
            checkWorkButton = /* @__PURE__ */ React.createElement("span", {
              id: this.componentName + "_correct",
              style: checkWorkStyle,
              ref: (c) => {
                this.target = c && ReactDOM.findDOMNode(c);
              }
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faCheck
            }));
          } else if (this.validationState === "partialcorrect") {
            let percent = Math.round(this.doenetSvData.creditAchieved * 100);
            let partialCreditContents = `${percent} %`;
            checkWorkStyle.width = "50px";
            checkWorkStyle.backgroundColor = "#efab34";
            checkWorkButton = /* @__PURE__ */ React.createElement("span", {
              id: this.componentName + "_partial",
              style: checkWorkStyle,
              ref: (c) => {
                this.target = c && ReactDOM.findDOMNode(c);
              }
            }, partialCreditContents);
          } else {
            checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
            checkWorkButton = /* @__PURE__ */ React.createElement("span", {
              id: this.componentName + "_incorrect",
              style: checkWorkStyle,
              ref: (c) => {
                this.target = c && ReactDOM.findDOMNode(c);
              }
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faTimes
            }));
          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: this.componentName + "_saved",
            style: checkWorkStyle,
            ref: (c) => {
              this.target = c && ReactDOM.findDOMNode(c);
            }
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCloud
          }));
        }
      }
      if (this.doenetSvData.numberOfAttemptsLeft < 0) {
        checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
      } else if (this.doenetSvData.numberOfAttemptsLeft < Infinity) {
        checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", this.doenetSvData.numberOfAttemptsLeft, ")"));
      }
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("span", {
      className: "textInputSurroundingBox",
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("span", {
      style: {margin: "10px"}
    }, /* @__PURE__ */ React.createElement(EditableMathField, {
      latex: this.latexValue,
      config: {
        autoCommands: "sqrt pi theta integral infinity",
        autoOperatorNames: "arg deg det dim exp gcd hom ker lg lim ln log max min Pr sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth sin cos tan sec cosec csc cotan cot ctg arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg sinh cosh tanh sech cosech csch cotanh coth ctgh arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh",
        handlers: {
          enter: this.handlePressEnter
        }
      },
      onChange: (mathField) => {
        this.onChangeHandler(mathField.latex());
      },
      onBlur: this.handleBlur,
      onFocus: this.handleFocus
    })), checkWorkButton));
  }
}
function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, "").replaceAll(/\\var{([^{}]*)}/g, "$1");
  return s;
}
