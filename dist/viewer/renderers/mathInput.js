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
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.mathExpression = this.doenetSvData.valueForDisplay;
    this.latexValue = stripLatex(this.doenetSvData.valueForDisplay.toLatex());
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
    text = substituteUnicodeInLatexString(text);
    let fromLatex = getFromLatex({
      functionSymbols: this.doenetSvData.functionSymbols
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
    let actuallyUpdate = !newMathExpression.equalsViaSyntax(currentMathExpressionNormalized) || !this.latexValueSetInRender && text !== this.latexValue;
    this.latexValue = text;
    this.latexValueSetInRender = false;
    if (actuallyUpdate) {
      this.mathExpression = newMathExpression;
      this.actions.updateImmediateValue({
        mathExpression: newMathExpression
      });
    }
  }
  updateValidationState() {
    this.validationState = "unvalidated";
    if (this.doenetSvData.valueHasBeenValidated) {
      if (this.doenetSvData.creditAchieved === 1) {
        this.validationState = "correct";
      } else if (this.doenetSvData.creditAchieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }
  handlePressEnter(e) {
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.valueForDisplayToRevertTo = this.mathExpression;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      this.actions.updateValue();
    }
    if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
      this.actions.submitAnswer();
    }
    this.forceUpdate();
  }
  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }
  handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.valueForDisplayToRevertTo = this.mathExpression;
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
    if (!this.valueForDisplayToRevertTo.equalsViaSyntax(this.doenetSvData.valueForDisplay)) {
      this.mathExpression = this.doenetSvData.valueForDisplay;
      this.latexValue = stripLatex(this.mathExpression.toLatex());
      if (this.latexValue === "＿") {
        this.latexValue = "";
      }
      this.latexValueSetInRender = true;
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
  let s = latex.replaceAll(`\\,`, "");
  return s;
}
var appliedFunctionSymbols = [
  "abs",
  "exp",
  "log",
  "ln",
  "log10",
  "sign",
  "sqrt",
  "erf",
  "acos",
  "acosh",
  "acot",
  "acoth",
  "acsc",
  "acsch",
  "asec",
  "asech",
  "asin",
  "asinh",
  "atan",
  "atanh",
  "cos",
  "cosh",
  "cot",
  "coth",
  "csc",
  "csch",
  "sec",
  "sech",
  "sin",
  "sinh",
  "tan",
  "tanh",
  "arcsin",
  "arccos",
  "arctan",
  "arccsc",
  "arcsec",
  "arccot",
  "cosec",
  "arg",
  "min",
  "max",
  "mean",
  "median",
  "floor",
  "ceil",
  "round",
  "sum",
  "prod",
  "var",
  "std",
  "count",
  "mod"
];
function getFromLatex({functionSymbols}) {
  return (x) => me.fromAst(new me.converters.latexToAstObj({
    appliedFunctionSymbols,
    functionSymbols
  }).convert(x));
}
function substituteUnicodeInLatexString(latexString) {
  let substitutions = [
    ["α", "\\alpha "],
    ["β", "\\beta "],
    ["ϐ", "\\beta "],
    ["Γ", "\\Gamma "],
    ["γ", "\\gamma "],
    ["Δ", "\\Delta "],
    ["δ", "\\delta "],
    ["ε", "\\epsilon "],
    ["ϵ", "\\epsilon "],
    ["ζ", "\\zeta "],
    ["η", "\\eta "],
    ["Θ", "\\Theta "],
    ["ϴ", "\\Theta "],
    ["θ", "\\theta "],
    ["ᶿ", "\\theta "],
    ["ϑ", "\\theta "],
    ["ι", "\\iota "],
    ["κ", "\\kappa "],
    ["Λ", "\\Lambda "],
    ["λ", "\\lambda "],
    ["μ", "\\mu "],
    ["µ", "\\mu "],
    ["ν", "\\nu "],
    ["Ξ", "\\Xi "],
    ["ξ", "\\xi "],
    ["Π", "\\Pi "],
    ["π", "\\pi "],
    ["ϖ", "\\pi "],
    ["ρ", "\\rho "],
    ["ϱ", "\\rho "],
    ["Σ", "\\Sigma "],
    ["σ", "\\sigma "],
    ["ς", "\\sigma "],
    ["τ", "\\tau "],
    ["Υ", "\\Upsilon "],
    ["υ", "\\upsilon "],
    ["Φ", "\\Phi "],
    ["φ", "\\phi "],
    ["ϕ", "\\phi "],
    ["Ψ", "\\Psi "],
    ["ψ", "\\psi "],
    ["Ω", "\\Omega "],
    ["ω", "\\omega "],
    ["−", "-"],
    ["⋅", " \\cdot "],
    ["·", " \\cdot "]
  ];
  for (let sub of substitutions) {
    latexString = latexString.replaceAll(sub[0], sub[1]);
  }
  return latexString;
}
