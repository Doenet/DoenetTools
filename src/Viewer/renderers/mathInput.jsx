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
//  /Doenet/utils/math';
mathquill.addStyles(); //Styling for react-mathquill input field
let EditableMathField = mathquill.EditableMathField;

// const Prev = styled.div`
//   font-size: 23px;
//   // min-height: 30px;
//   background: rgba(0, 0, 0, 0.8);
//   width: auto;
//   display: inline-block;
//   border-radius: 5px;
//   color: white;
//   // line-height: 0px;
//   z-index: 10;
//   padding: 3px;
//   // position: absolute;
//   user-select: none;
//   // left: ${props => `${props.left}px`};
//   // top: ${props => `${props.top}px`};
// `;


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
    // this.handleDragEnter = this.handleDragEnter.bind(this);
    // this.handleDragThrough = this.handleDragThrough.bind(this);
    // this.handleDragExit = this.handleDragExit.bind(this);

    this.mathExpression = this.doenetSvData.valueForDisplay;

    if (this.doenetSvData.rawRendererValue !== null) {
      this.latexValue = this.doenetSvData.rawRendererValue
    } else {
      this.latexValue = stripLatex(this.doenetSvData.valueForDisplay.toLatex());
      this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: false
      })
    }
    this.latexValueSetInRender = true;

    // this.state = {isDragging: false, previewLeftOffset: this.doenetSvData.size * 10 + 80, previewTopOffset: 0, clickXOffset: 0, clickYOffset: 0};
    // this.inputRef = React.createRef();
    // this.mathInputRef = React.createRef();


    this.valueToRevertTo = this.doenetSvData.value;
    this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
    // this.latexValueToRevertTo = this.latexValue;
    // this.previewValue = "";

    //Remove __ value so it doesn't show
    if (this.latexValue === '\uFF3F') { this.latexValue = ""; }

  }

  static initializeChildrenOnConstruction = false;

  componentDidMount() {
    // if (this && this.mathInputRef){
    //   let rect = this.mathInputRef.current.getBoundingClientRect();
    // // this.setState({previewLeftOffset: rect.width + rect.left + 2, previewTopOffset: rect.top -17}); 
    // this.setState({previewLeftOffset: rect.left, previewTopOffset: rect.height + rect.top - 2 });
    // }
  }

  calculateMathExpressionFromLatex(text) {
    let expression;

    text = normalizeLatexString(text, { unionFromU: this.doenetSvData.unionFromU });

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

  async updateImmediateValueFromLatex(text) {

    // The check whether or not to call the updateImmediateValue action is subtle.
    // We need to achieve two effects:
    // 1. Do not call the updateImmediateValue action
    // when mathQuill invokes onChange from render()
    // due to differences in latex format between it and math-expressions.
    // 2. Call the updateImmediateValue action
    // whenever the user types anything into the input
    // even if it does not change the underlying math expression

    let currentMathExpressionNormalized = this.calculateMathExpressionFromLatex(this.latexValue);
    let newMathExpression = this.calculateMathExpressionFromLatex(text);

    let rawValueChanged = text !== this.latexValue || this.latexValueSetFromValueForDisplay;
    let transientForRaw = !this.latexValueSetInRender;

    let actuallyUpdate = !newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)
      || (!this.latexValueSetInRender && text !== this.latexValue);

    // Note: must set this.latexValue before calling updateImmediateValue action
    this.latexValue = text;
    this.latexValueSetInRender = false;
    this.latexValueSetFromValueForDisplay = false;

    if (actuallyUpdate) {
      this.mathExpression = newMathExpression;
      await this.actions.updateImmediateValue({
        mathExpression: newMathExpression,
        rawRendererValue: this.latexValue,
        transient: true,
        skippable: true,
      });
    } else if (rawValueChanged) {
      await this.actions.updateRawValue({
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

  // handleDragEnter(e) {
  //   this.setState({
  //     isDragging: true,
  //     clickXOffset: e.pageX - this.state.previewLeftOffset,
  //     clickYOffset: e.pageY - this.state.previewTopOffset,
  //   })
  // }

  // handleDragThrough(e) {
  //   if(this.state.isDragging){
  //     // console.log();
  //     this.setState({previewLeftOffset: e.pageX - this.state.clickXOffset, previewTopOffset: e.pageY - this.state.clickYOffset});
  //   }
  // }

  // handleDragExit(e){
  //   this.setState({
  //     isDragging: false,
  //     clickXOffset: 0,
  //     clickYOffset: 0,
  //   })
  // }

  async handlePressEnter(e) {
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.valueForDisplayToRevertTo = this.mathExpression;

    // this.latexValueToRevertTo = this.latexValue;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      await this.actions.updateValue();
    } else {
      await this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: false
      })
    }
    if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
      await this.actions.submitAnswer();
    }
    this.forceUpdate();
  }

  // handleKeyDown(e) {
  //   if (e.key === "Escape") {
  //     if (!this.mathExpression.equalsViaSyntax(this.valueForDisplayToRevertTo)) {
  //       this.mathExpression = this.valueForDisplayToRevertTo;
  //       this.actions.updateImmediateValue({
  //         mathExpression: this.valueToRevertTo
  //       });
  //       this.forceUpdate();
  //     }
  //   }
  // }

  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }

  async handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    this.valueForDisplayToRevertTo = this.mathExpression;
    // this.latexValueToRevertTo = this.latexValue;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      await this.actions.updateValue();
    } else {
      await this.actions.updateRawValue({
        rawRendererValue: this.latexValue,
        transient: false
      })
    }
    this.forceUpdate();

  }

  async onChangeHandler(e) {
    await this.updateImmediateValueFromLatex(e)
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

      this.mathExpression = this.doenetSvData.valueForDisplay;
      this.latexValue = stripLatex(this.mathExpression.toLatex());
      if (this.latexValue === '\uFF3F') {
        this.latexValue = "";
      }
      this.latexValueSetInRender = true;
      this.latexValueSetFromValueForDisplay = true;
      this.valueToRevertTo = this.doenetSvData.value;
      this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
      // this.latexValueToRevertTo = this.latexValue;

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
    return <React.Fragment>
      <a name={this.componentName} />


      <span className="textInputSurroundingBox" id={this.componentName}>
        {/* <input
        key={inputKey}
        id={inputKey}
        ref = {this.inputRef}
        value={this.textValue}
        disabled={disabled}
        onChange={this.onChangeHandler}
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        style={{
          width: `${this.doenetSvData.size * 10}px`,
          height: "22px",
          fontSize: "14px",
          borderWidth: "1px",
          borderColor: surroundingBorderColor,
          padding: "4px",
          // position: "absolute",
        }}
      /> */}
        <span style={{ margin: "10px" }}>
          <EditableMathField
            latex={this.latexValue}
            config={{
              autoCommands: "sqrt pi theta integral infinity",
              autoOperatorNames: 'arg deg det dim exp gcd hom ker lg lim ln log max min'
                + ' Pr'
                + ' sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'
                + ' sin cos tan sec cosec csc cotan cot ctg'
                + ' arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg'
                + ' sinh cosh tanh sech cosech csch cotanh coth ctgh'
                + ' arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh'
                + ' arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh',
              handlers: {
                enter: this.handlePressEnter
              }
            }}//more commands go here
            onChange={(mathField) => {
              this.onChangeHandler(mathField.latex())
            }}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
          />
          {/* <p>{this.mathExpression.toLatex()}</p> */}
        </span>
        {checkWorkButton}
        {/* {this.textValue ? 
      <Prev style = {{top: this.state.previewTopOffset+"px", left: this.state.previewLeftOffset+"px"}} onMouseDown = {this.handleDragEnter} onMouseMove = {this.handleDragThrough} onMouseUp = {this.handleDragExit} onMouseLeave = {this.handleDragExit}>
        <div>
          <MathJax.Context input='tex'>
              <div>
                  <MathJax.Node inline>{this.textValue ? this.previewValue : ''}</MathJax.Node>
              </div>
          </MathJax.Context>
        </div>
      </Prev> : 
      null} */}
      </span>



    </React.Fragment>

  }
}


function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, '').replaceAll(/\\var{([^{}]*)}/g, '$1');

  return s;

}


// TODO: how to fix case where have readyonly?
// need to revert mathExpression in that case

// else if(!this.mathExpression.equalsViaSyntax(this.doenetSvData.immediateValue)) {
//   console.log(`for ${this.componentName}`)
//   console.log(`math expression: ${this.mathExpression.toString()}`)
//   console.log(`immediateValue: ${this.doenetSvData.immediateValue.toString()}`)

//   this.mathExpression = this.doenetSvData.value;
//   this.textValue = this.mathExpression.toString();
//   if (this.textValue === '\uFF3F') {
//     this.textValue = "";
//   }
//   this.valueToRevertTo = this.doenetSvData.value;
//   this.textValueToRevertTo = this.textValue;

// }


