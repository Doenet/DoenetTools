import React from "../../_snowpack/pkg/react.js";
import ReactDOM from "../../_snowpack/pkg/react-dom.js";
import DoenetRenderer from "./DoenetRenderer.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import mathquill from "../../_snowpack/pkg/react-mathquill.js";
import {getFromLatex, normalizeLatexString} from "../../core/utils/math.js";
import {deepClone} from "../../core/utils/deepFunctions.js";
mathquill.addStyles();
let EditableMathField = mathquill.EditableMathField;
const Matrix = styled.div`
  position: relative;
  margin: 6px;
  display: inline-block;
  vertical-align: middle;
  width:auto;
  border-style: none;

  :before {
    content: "";
    position: absolute;
    left: -6px;
    top: -6px;
    border: 1px solid #000;
    border-right: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }

  :after {
    content: "";
    position: absolute;
    right: -6px;
    top: -6px;
    border: 1px solid #000;
    border-left: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }
`;
export default class MathInput extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.state = {latex: ""};
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.mathExpression = this.doenetSvData.valueForDisplay;
    this.latexValues = [];
    let updatedRendererValues = false;
    for (let rowInd = 0; rowInd < this.doenetSvData.numRows; rowInd++) {
      let latexRow = [];
      let rowRendererValues = this.doenetSvData.rawRendererValues[rowInd];
      for (let colInd = 0; colInd < this.doenetSvData.numColumns; colInd++) {
        if (rowRendererValues?.[colInd]) {
          latexRow.push(rowRendererValues[colInd]);
        } else {
          latexRow.push(stripLatex(this.doenetSvData.componentDisplayValues[rowInd][colInd].toLatex()));
          updatedRendererValues = true;
        }
      }
      this.latexValues.push(latexRow);
    }
    if (updatedRendererValues) {
      this.actions.updateRawValues({
        rawRendererValues: this.latexValues,
        transient: false
      });
    }
    this.latexValueSetInRender = true;
    this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
    this.latexValues = this.latexValues.map((x) => x.map((y) => y === "＿" ? "" : y));
  }
  static initializeChildrenOnConstruction = false;
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
  updateImmediateValueFromLatex(latex, rowInd, colInd) {
    let currentMathExpressionNormalized = this.calculateMathExpressionFromLatex(this.latexValues[rowInd][colInd]);
    let newMathExpression = this.calculateMathExpressionFromLatex(latex);
    let rawValueChanged = latex !== this.latexValues[rowInd][colInd] || this.latexValueSetFromValueForDisplay;
    let transientForRaw = !this.latexValueSetInRender;
    let actuallyUpdate = !newMathExpression.equalsViaSyntax(currentMathExpressionNormalized) || !this.latexValueSetInRender && latex !== this.latexValues[rowInd][colInd];
    this.latexValues[rowInd][colInd] = latex;
    this.latexValueSetInRender = false;
    this.latexValueSetFromValueForDisplay = false;
    if (actuallyUpdate) {
      this.mathExpression = this.updateMathExpression(newMathExpression, rowInd, colInd);
      this.actions.updateImmediateValue({
        mathExpression: this.mathExpression,
        rawRendererValues: this.latexValues,
        transient: true,
        skippable: true
      });
    } else if (rawValueChanged) {
      this.actions.updateRawValues({
        rawRendererValues: this.latexValues,
        transient: transientForRaw,
        skippable: transientForRaw
      });
    }
  }
  updateMathExpression(componentValue, rowInd, colInd) {
    if (this.mathExpression.tree[0] !== "matrix") {
      this.mathExpression = createMathExpressionFromLatexValues();
      return this.mathExpression;
    }
    let newTree = deepClone(this.mathExpression.tree);
    newTree[2][rowInd + 1][colInd + 1] = componentValue.tree;
    this.mathExpression = me.fromAst(newTree);
    return this.mathExpression;
  }
  createMathExpressionFromLatexValues() {
    let matrixValues = [];
    for (let rowInd = 0; rowInd < this.doenetSvData.numRows; rowInd++) {
      let row = ["tuple"];
      for (let colInd = 0; colInd < this.doenetSvData.numColumns; colInd++) {
        row.push(this.calculateMathExpressionFromLatex(this.latexValues[rowInd][colInd]).tree);
      }
      matrixValues.push(row);
    }
    let newTree = [
      "matrix",
      ["tuple", this.doenetSvData.numRows, this.doenetSvData.numColumns],
      ["tuple", ...matrixValues]
    ];
    this.mathExpression = me.fromAst(newTree);
    return this.mathExpression;
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
    this.valueForDisplayToRevertTo = this.mathExpression;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      await this.actions.updateValue();
    } else {
      await this.actions.updateRawValues({
        rawRendererValues: this.latexValues,
        transient: false
      });
    }
    this.forceUpdate();
  }
  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }
  async handleBlur(e) {
    this.focused = false;
    this.valueForDisplayToRevertTo = this.mathExpression;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      await this.actions.updateValue();
    } else {
      await this.actions.updateRawValues({
        rawRendererValues: this.latexValues,
        transient: false
      });
    }
    this.forceUpdate();
  }
  async onChangeHandler(latex, rowInd, colInd) {
    this.updateImmediateValueFromLatex(latex, rowInd, colInd);
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
      this.latexValues = [];
      for (let rowInd = 0; rowInd < this.doenetSvData.numRows; rowInd++) {
        let latexRow = [];
        for (let colInd = 0; colInd < this.doenetSvData.numColumns; colInd++) {
          let lVal = stripLatex(this.doenetSvData.componentDisplayValues[rowInd][colInd].toLatex());
          if (lVal === "＿") {
            latexRow.push("");
          } else {
            latexRow.push(lVal);
          }
        }
        this.latexValues.push(latexRow);
      }
      this.mathExpression = this.doenetSvData.valueForDisplay;
      this.latexValueSetInRender = true;
      this.latexValueSetFromValueForDisplay = true;
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
    let autoCommands = "sqrt pi theta integral infinity";
    let autoOperatorNames = "arg deg det dim exp gcd hom ker lg lim ln log max min Pr sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth sin cos tan sec cosec csc cotan cot ctg arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg sinh cosh tanh sech cosech csch cotanh coth ctgh arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh";
    let matrixInputs = [];
    for (let rowInd = 0; rowInd < this.doenetSvData.numRows; rowInd++) {
      let mathinputRow = [];
      for (let colInd = 0; colInd < this.doenetSvData.numColumns; colInd++) {
        mathinputRow.push(/* @__PURE__ */ React.createElement("td", {
          style: {margin: "10px"},
          key: colInd,
          id: this.componentName + "_component_" + rowInd + "_" + colInd
        }, /* @__PURE__ */ React.createElement(EditableMathField, {
          latex: this.latexValues[rowInd][colInd],
          config: {
            autoCommands,
            autoOperatorNames,
            handlers: {
              enter: this.handlePressEnter
            }
          },
          onChange: (mathField) => {
            this.onChangeHandler(mathField.latex(), rowInd, colInd);
          },
          onBlur: this.handleBlur,
          onFocus: this.handleFocus
        })));
      }
      matrixInputs.push(/* @__PURE__ */ React.createElement("tr", {
        key: rowInd
      }, mathinputRow));
    }
    let rowNumControls = null;
    if (this.doenetSvData.showSizeControls) {
      rowNumControls = /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_rowDecrement",
        onClick: () => this.actions.updateNumRows({numRows: this.doenetSvData.numRows - 1}),
        disabled: this.doenetSvData.numRows < 2
      }, "r-"), /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_rowIncrement",
        onClick: () => this.actions.updateNumRows({numRows: this.doenetSvData.numRows + 1})
      }, "r+"));
    }
    let colNumControls = null;
    if (this.doenetSvData.showSizeControls) {
      colNumControls = /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_columnDecrement",
        onClick: () => this.actions.updateNumColumns({numColumns: this.doenetSvData.numColumns - 1}),
        disabled: this.doenetSvData.numColumns < 2
      }, "c-"), /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_columnIncrement",
        onClick: () => this.actions.updateNumColumns({numColumns: this.doenetSvData.numColumns + 1})
      }, "c+"));
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement(Matrix, {
      className: "matrixInputSurroundingBox",
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tbody", null, matrixInputs))), rowNumControls, colNumControls, checkWorkButton);
  }
}
function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, "").replaceAll(/\\var{([^{}]*)}/g, "$1");
  return s;
}
