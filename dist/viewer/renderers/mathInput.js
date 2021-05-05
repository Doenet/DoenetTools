import React from "../../_snowpack/pkg/react.js";
import ReactDOM from "../../_snowpack/pkg/react-dom.js";
import DoenetRenderer from "./DoenetRenderer.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import mathquill from "../../_snowpack/pkg/react-mathquill.js";
mathquill.addStyles();
let EditableMathField = mathquill.EditableMathField;
export default class MathInput extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.state = {latex: ""};
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.mathExpression = this.doenetSvData.value;
    this.latexValue = stripLatex(this.doenetSvData.value.toLatex());
    this.valueToRevertTo = this.mathExpression;
    this.latexValueToRevertTo = this.latexValue;
    if (this.latexValue === "\uFF3F") {
      this.latexValue = "";
    }
  }
  static initializeChildrenOnConstruction = false;
  componentDidMount() {
  }
  calculateMathExpressionFromLatex(text) {
    let expression;
    text = substituteUnicodeInLatexString(text);
    try {
      expression = me.fromLatex(text);
    } catch (e) {
      expression = me.fromAst("\uFF3F");
    }
    return expression;
  }
  updateImmediateValueFromLatex(text) {
    this.latexValue = text;
    let newMathExpression = this.calculateMathExpressionFromLatex(text);
    if (!newMathExpression.equalsViaSyntax(this.mathExpression)) {
      this.mathExpression = newMathExpression;
      this.actions.updateImmediateValue({
        mathExpression: newMathExpression
      });
    }
  }
  updateValidationState() {
    this.validationState = "unvalidated";
    if (this.doenetSvData.valueHasBeenValidated) {
      if (this.doenetSvData.creditAchievedForSubmitButton === 1) {
        this.validationState = "correct";
      } else if (this.doenetSvData.creditAchievedForSubmitButton === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }
  handlePressEnter(e) {
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.latexValueToRevertTo = this.latexValue;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      this.actions.updateValue();
    }
    if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
      this.actions.submitAnswer();
    }
    this.forceUpdate();
  }
  handleKeyDown(e) {
    if (e.key === "Escape") {
      if (!this.mathExpression.equalsViaSyntax(this.valueToRevertTo)) {
        this.mathExpression = this.valueToRevertTo;
        this.actions.updateImmediateValue({
          mathExpression: this.valueToRevertTo
        });
        this.forceUpdate();
      }
    }
  }
  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }
  handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.latexValueToRevertTo = this.latexValue;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      this.actions.updateValue();
    }
    this.forceUpdate();
  }
  onChangeHandler(e) {
    this.updateImmediateValueFromLatex(e);
    this.forceUpdate();
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    this.updateValidationState();
    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }
    if (!this.valueToRevertTo.equalsViaSyntax(this.doenetSvData.value)) {
      this.mathExpression = this.doenetSvData.value;
      this.latexValue = stripLatex(this.mathExpression.toLatex());
      if (this.latexValue === "\uFF3F") {
        this.latexValue = "";
      }
      this.valueToRevertTo = this.doenetSvData.value;
      this.latexValueToRevertTo = this.latexValue;
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
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        checkWorkButton = /* @__PURE__ */ React.createElement("button", {
          id: this.componentName + "_submit",
          tabIndex: "0",
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
            let percent = Math.round(this.doenetSvData.creditAchievedForSubmitButton * 100);
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
        autoCommands: "sqrt pi theta integral",
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
  let s = latex.replaceAll(`\\,`, "");
  return s;
}
function substituteUnicodeInLatexString(latexString) {
  let substitutions = [
    ["\u03B1", "\\alpha "],
    ["\u03B2", "\\beta "],
    ["\u03D0", "\\beta "],
    ["\u0393", "\\Gamma "],
    ["\u03B3", "\\gamma "],
    ["\u0394", "\\Delta "],
    ["\u03B4", "\\delta "],
    ["\u03B5", "\\epsilon "],
    ["\u03F5", "\\epsilon "],
    ["\u03B6", "\\zeta "],
    ["\u03B7", "\\eta "],
    ["\u0398", "\\Theta "],
    ["\u03F4", "\\Theta "],
    ["\u03B8", "\\theta "],
    ["\u1DBF", "\\theta "],
    ["\u03D1", "\\theta "],
    ["\u03B9", "\\iota "],
    ["\u03BA", "\\kappa "],
    ["\u039B", "\\Lambda "],
    ["\u03BB", "\\lambda "],
    ["\u03BC", "\\mu "],
    ["\xB5", "\\mu "],
    ["\u03BD", "\\nu "],
    ["\u039E", "\\Xi "],
    ["\u03BE", "\\xi "],
    ["\u03A0", "\\Pi "],
    ["\u03C0", "\\pi "],
    ["\u03D6", "\\pi "],
    ["\u03C1", "\\rho "],
    ["\u03F1", "\\rho "],
    ["\u03A3", "\\Sigma "],
    ["\u03C3", "\\sigma "],
    ["\u03C2", "\\sigma "],
    ["\u03C4", "\\tau "],
    ["\u03A5", "\\Upsilon "],
    ["\u03C5", "\\upsilon "],
    ["\u03A6", "\\Phi "],
    ["\u03C6", "\\phi "],
    ["\u03D5", "\\phi "],
    ["\u03A8", "\\Psi "],
    ["\u03C8", "\\psi "],
    ["\u03A9", "\\Omega "],
    ["\u03C9", "\\omega "]
  ];
  for (let sub of substitutions) {
    latexString = latexString.replaceAll(sub[0], sub[1]);
  }
  return latexString;
}
