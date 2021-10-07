import React from 'react';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import me from 'math-expressions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
// import MathJax from 'react-mathjax2';
//snowpack is not a fan of destructing here for some reason?
import mathquill from 'react-mathquill';
import { getFromLatex, normalizeLatexString } from '../../Core/utils/math';
import { deepClone } from '../../Core/utils/deepFunctions';
//  /Doenet/utils/math';
mathquill.addStyles(); //Styling for react-mathquill input field
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
`

export default class MathInput extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.state = { latex: "" };
    // const [latex, setLatex] = useState("");
    // const config = {
    //   autoCommands: "sqrt pi theta",
    //   autoOperatorNames: "cos sin"
    // };

    this.handlePressEnter = this.handlePressEnter.bind(this);
    // this.handleKeyDown = this.handleKeyDown.bind(this);
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
          latexRow.push(
            stripLatex(this.doenetSvData.componentDisplayValues[rowInd][colInd].toLatex())
          );
          updatedRendererValues = true;
        }
      }
      this.latexValues.push(latexRow);
    }

    if (updatedRendererValues) {
      this.actions.updateRawValues({
        rawRendererValues: this.latexValues,
        transient: false
      })
    }

    this.latexValueSetInRender = true;


    this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
    // this.previewValue = "";

    //Remove __ value so it doesn't show
    this.latexValues = this.latexValues.map(x =>
      x.map(y => y === "\uFF3F" ? "" : y)
    )

  }

  static initializeChildrenOnConstruction = false;


  calculateMathExpressionFromLatex(text) {
    let expression;

    text = normalizeLatexString(text);

    // replace ^25 with ^{2}5, since mathQuill uses standard latex conventions
    // unlike math-expression's latex parser
    text = text.replace(/\^(\w)/g, '^{$1}');

    let fromLatex = getFromLatex({
      functionSymbols: this.doenetSvData.functionSymbols,
      splitSymbols: this.doenetSvData.splitSymbols,
    });

    try {
      expression = fromLatex(text);
    } catch (e) {
      // TODO: error on bad text
      expression = me.fromAst('\uFF3F');

    }
    return expression;
  }

  updateImmediateValueFromLatex(latex, rowInd, colInd) {

    // The check whether or not to call the updateImmediateValue action is subtle.
    // We need to achieve two effects:
    // 1. Do not call the updateImmediateValue action
    // when mathQuill invokes onChange from render()
    // due to differences in latex format between it and math-expressions.
    // 2. Call the updateImmediateValue action
    // whenever the user types anything into the input
    // even if it does not change the underlying math expression

    let currentMathExpressionNormalized = this.calculateMathExpressionFromLatex(this.latexValues[rowInd][colInd]);
    let newMathExpression = this.calculateMathExpressionFromLatex(latex);

    let rawValueChanged = latex !== this.latexValues[rowInd][colInd] || this.latexValueSetFromValueForDisplay;
    let transientForRaw = !this.latexValueSetInRender;

    let actuallyUpdate = !newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)
      || (!this.latexValueSetInRender && latex !== this.latexValues[rowInd][colInd]);

    // Note: must set this.latexValues before calling updateImmediateValue action
    this.latexValues[rowInd][colInd] = latex;
    this.latexValueSetInRender = false;
    this.latexValueSetFromValueForDisplay = false;

    if (actuallyUpdate) {
      this.mathExpression = this.updateMathExpression(newMathExpression, rowInd, colInd)
      this.actions.updateImmediateValue({
        mathExpression: this.mathExpression,
        rawRendererValues: this.latexValues,
        transient: true,
        skippable: true,
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
      this.mathExpression = createMathExpressionFromLatexValues()
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

      matrixValues.push(row)
    }

    let newTree = ["matrix",
      ["tuple", this.doenetSvData.numRows, this.doenetSvData.numColumns],
      ["tuple", ...matrixValues]
    ]

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
      })
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
      })
    }
    this.forceUpdate();

  }

  async onChangeHandler(latex, rowInd, colInd) {
    this.updateImmediateValueFromLatex(latex, rowInd, colInd)
    this.forceUpdate();
  }



  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    this.updateValidationState();

    let disabled = this.doenetSvData.disabled;

    // const inputKey = this.componentName + '_input';

    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }

    if (!this.valueForDisplayToRevertTo.equalsViaSyntax(this.doenetSvData.valueForDisplay)) {
      // The valueForDisplay coming from the mathInput component
      // is not the same as the renderer's value
      // so we change the renderer's value to match

      this.latexValues = [];
      for (let rowInd = 0; rowInd < this.doenetSvData.numRows; rowInd++) {
        let latexRow = [];
        for (let colInd = 0; colInd < this.doenetSvData.numColumns; colInd++) {
          let lVal = stripLatex(this.doenetSvData.componentDisplayValues[rowInd][colInd].toLatex());
          if (lVal === "\uFF3F") {
            latexRow.push("")
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
      zIndex: "0",
    }
    //Assume we don't have a check work button
    let checkWorkButton = null;
    if (this.doenetSvData.includeCheckWork) {

      if (this.validationState === "unvalidated") {
        if (disabled) {
          checkWorkStyle.backgroundColor = "rgb(200,200,200)";
        } else {
          checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        }
        checkWorkButton = <button
          id={this.componentName + '_submit'}
          tabIndex="0"
          disabled={disabled}
          ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          style={checkWorkStyle}
          onClick={this.actions.submitAnswer}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.actions.submitAnswer();
            }
          }}
        >
          <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        </button>
      } else {
        if (this.doenetSvData.showCorrectness) {
          if (this.validationState === "correct") {
            checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
            checkWorkButton = <span
              id={this.componentName + '_correct'}
              style={checkWorkStyle}
              ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </span>
          } else if (this.validationState === "partialcorrect") {
            //partial credit

            let percent = Math.round(this.doenetSvData.creditAchieved * 100);
            let partialCreditContents = `${percent} %`;
            checkWorkStyle.width = "50px";

            checkWorkStyle.backgroundColor = "#efab34";
            checkWorkButton = <span
              id={this.componentName + '_partial'}
              style={checkWorkStyle}
              ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >{partialCreditContents}</span>
          } else {
            //incorrect
            checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
            checkWorkButton = <span
              id={this.componentName + '_incorrect'}
              style={checkWorkStyle}
              ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            ><FontAwesomeIcon icon={faTimes} /></span>

          }
        } else {
          // showCorrectness is false
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkWorkButton = <span
            id={this.componentName + '_saved'}
            style={checkWorkStyle}
            ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          ><FontAwesomeIcon icon={faCloud} /></span>

        }
      }

      if (this.doenetSvData.numberOfAttemptsLeft < 0) {
        checkWorkButton = <>
          {checkWorkButton}
          <span>
            (no attempts remaining)
          </span>
        </>
      } else if (this.doenetSvData.numberOfAttemptsLeft < Infinity) {

        checkWorkButton = <>
          {checkWorkButton}
          <span>
            (attempts remaining: {this.doenetSvData.numberOfAttemptsLeft})
          </span>
        </>
      }

    }

    // TODO: remove inf and sup from the autoOperatorNames so that
    // the autoCommand infinity will work.  Is there a better way
    // so that could still use inf?
    // Also, just copied the list of autoCommands from MathQuill.
    // Should change it to match the functions that <math> understand,
    // i.e., import from the util/math.js in Core

    let autoCommands = "sqrt pi theta integral infinity";
    let autoOperatorNames = 'arg deg det dim exp gcd hom ker lg lim ln log max min'
      + ' Pr'
      + ' sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'
      + ' sin cos tan sec cosec csc cotan cot ctg'
      + ' arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg'
      + ' sinh cosh tanh sech cosech csch cotanh coth ctgh'
      + ' arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh'
      + ' arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh';

    let matrixInputs = [];

    for (let rowInd = 0; rowInd < this.doenetSvData.numRows; rowInd++) {
      let mathinputRow = [];

      for (let colInd = 0; colInd < this.doenetSvData.numColumns; colInd++) {
        mathinputRow.push(
          <td style={{ margin: "10px" }} key={colInd} id={this.componentName+"_component_" + rowInd + "_" + colInd}>
            <EditableMathField
              latex={this.latexValues[rowInd][colInd]}
              config={{
                autoCommands,
                autoOperatorNames,
                handlers: {
                  enter: this.handlePressEnter
                }
              }}//more commands go here
              onChange={(mathField) => {
                this.onChangeHandler(mathField.latex(), rowInd, colInd)
              }}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
            />
          </td>
        )
      }

      matrixInputs.push(
        <tr key={rowInd}>
          {mathinputRow}
        </tr>
      )

    }

    let rowNumControls = null;
    if (this.doenetSvData.showSizeControls) {
      rowNumControls = <span>
        <button id={this.componentName + "_rowDecrement"} onClick={() => this.actions.updateNumRows({ numRows: this.doenetSvData.numRows - 1 })} disabled={this.doenetSvData.numRows < 2}>
          r-
        </button>
        <button id={this.componentName + "_rowIncrement"} onClick={() => this.actions.updateNumRows({ numRows: this.doenetSvData.numRows + 1 })}>
          r+
        </button>
      </span>
    }
    let colNumControls = null;
    if (this.doenetSvData.showSizeControls) {
      colNumControls = <span>
        <button id={this.componentName + "_columnDecrement"} onClick={() => this.actions.updateNumColumns({ numColumns: this.doenetSvData.numColumns - 1 })} disabled={this.doenetSvData.numColumns < 2}>
          c-
        </button>
        <button id={this.componentName + "_columnIncrement"} onClick={() => this.actions.updateNumColumns({ numColumns: this.doenetSvData.numColumns + 1 })}>
          c+
        </button>
      </span>
    }

    return <React.Fragment>
      <a name={this.componentName} />
      <Matrix className="matrixInputSurroundingBox" id={this.componentName}>
        <table><tbody>
          {matrixInputs}
        </tbody></table>
      </Matrix>


      {rowNumControls}
      {colNumControls}
      {checkWorkButton}
    </React.Fragment>

  }
}


function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, '').replaceAll(/\\var{([^{}]*)}/g, '$1');

  return s;

}



