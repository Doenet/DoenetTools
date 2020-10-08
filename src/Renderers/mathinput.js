import React from 'react';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import me from 'math-expressions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import MathJax from 'react-mathjax2';

const Prev = styled.div`
  font-size: 23px;
  // min-height: 30px;
  background: rgba(0, 0, 0, 0.8);
  width: auto;
  display: inline-block;
  border-radius: 5px;
  color: white;
  // line-height: 0px;
  z-index: 1;
  padding: 3px;
  position: absolute;
  user-select: none;
  // left: ${props => `${props.left}px`};
  // top: ${props => `${props.top}px`};
`;


export default class MathInput extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragThrough = this.handleDragThrough.bind(this);
    this.handleDragExit = this.handleDragExit.bind(this);

    this.mathExpression = this.doenetSvData.value;
    this.textValue = this.doenetSvData.value.toString();


    this.state = {isDragging: false, previewLeftOffset: this.doenetSvData.size * 10 + 20, previewTopOffset: 0, clickXOffset: 0, clickYOffset: 0};
    this.inputRef = React.createRef();
    

    this.valueToRevertTo = this.mathExpression;
    this.textValueToRevertTo = this.textValue;

    //Remove __ value so it doesn't show
    if (this.textValue === '\uFF3F') { this.textValue = ""; }

  }

  static initializeChildrenOnConstruction = false;

  componentDidMount() {
    this.setState({previewLeftOffset: this.inputRef.current.getBoundingClientRect().width + this.inputRef.current.getBoundingClientRect().left + 3, previewTopOffset: this.inputRef.current.getBoundingClientRect().top});
    console.log('left offset', this.inputRef.current.getBoundingClientRect());
    // console.log('width: ', this.doenetSvData.size * 10, 'offset: ',  this.inputRef.current.getBoundingClientRect().left);
  }

  calculateMathExpressionFromText(text) {
    let expression;
    try {
      expression = me.fromText(text);
    } catch (e) {
      // TODO: error on bad text
      expression = me.fromAst('\uFF3F');

    }
    return expression;
  }

  updateImmediateValueFromText(text) {
    this.textValue = text;
    let newMathExpression = this.calculateMathExpressionFromText(text);
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

  handleDragEnter(e) {
    this.setState({
      isDragging: true,
      clickXOffset: e.pageX - this.state.previewLeftOffset,
      clickYOffset: e.pageY - this.state.previewTopOffset,
    })
  }

  handleDragThrough(e) {
    if(this.state.isDragging){
      // console.log();
      this.setState({previewLeftOffset: e.pageX - this.state.clickXOffset, previewTopOffset: e.pageY - this.state.clickYOffset});
    }
  }

  handleDragExit(e){
    this.setState({
      isDragging: false,
      clickXOffset: 0,
      clickYOffset: 0,
    })
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.valueToRevertTo = this.doenetSvData.immediateValue;
      this.textValueToRevertTo = this.textValue;
      if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
        this.actions.updateValue();
      }
      if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
        this.actions.submitAnswer();
      }
      this.forceUpdate();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      if (!this.mathExpression.equalsViaSyntax(this.valueToRevertTo)) {
        this.textValue = this.textValueToRevertTo;
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
    this.textValueToRevertTo = this.textValue;
    if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
      this.actions.updateValue();
    }
    this.forceUpdate();
  }

  onChangeHandler(e) {
    this.updateImmediateValueFromText(e.target.value)
    this.forceUpdate();
  }

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    this.updateValidationState();

    const inputKey = this.componentName + '_input';

    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }

    if (!this.valueToRevertTo.equalsViaSyntax(this.doenetSvData.value)) {
      this.mathExpression = this.doenetSvData.value;
      this.textValue = this.mathExpression.toString();
      if (this.textValue === '\uFF3F') {
        this.textValue = "";
      }
      this.valueToRevertTo = this.doenetSvData.value;
      this.textValueToRevertTo = this.textValue;

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
    }

    //Assume we don't have a check work button
    let checkWorkButton = null;
    if (this.doenetSvData.includeCheckWork) {

      if (this.validationState === "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        checkWorkButton = <button
          id={this.componentName + '_submit'}
          tabIndex="0"
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

            let percent = Math.round(this.doenetSvData.creditAchievedForSubmitButton * 100);
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
    }

    // let leftOffset = `${this.doenetSvData.size * 10 + 20}px`;

    return <React.Fragment>
      <a name={this.componentName} />
      <div className="textInputSurroundingBox" style = {{height: "35px", display: "inline-block", width:"112px", }} id={this.componentName}>
        <input
          key={inputKey}
          id={inputKey}
          ref = {this.inputRef}
          value={this.textValue}
          disabled={this.doenetSvData.disabled}
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
            position: "absolute",
          }}
        />
        {checkWorkButton}
        {/* {console.log("eval", this.mathExpression.toLatex())} */}
        {this.textValue ? 
        <Prev style = {{top: this.state.previewTopOffset+"px", left: this.state.previewLeftOffset+"px"}} onMouseDown = {this.handleDragEnter} onMouseMove = {this.handleDragThrough} onMouseUp = {this.handleDragExit} onMouseLeave = {this.handleDragExit}>
          <div>
            <MathJax.Context input='tex'>
                <div>
                    <MathJax.Node inline>{this.textValue ? this.mathExpression.toLatex() : ''}</MathJax.Node>
                </div>
            </MathJax.Context>
          </div>
        </Prev> : 
        null}
      </div>
    
    </React.Fragment>

  }
}