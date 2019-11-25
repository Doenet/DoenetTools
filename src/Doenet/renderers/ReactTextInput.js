import React from 'react';
import ReactDOM from 'react-dom';
import me from 'math-expressions';
import './css/textinput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'

export default class ReactTextInput extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.valueHasBeenValidated) {
      this.lastSubmittedTextValue = this.props.free.sharedState.textValue;
      this.valueAsSubmitted = true;
    }else {
      this.valueAsSubmitted = false;
    }

    this.localNumberTimesSubmitted = this.props.numbertimessubmitted;

    this.delayToDisplayError = 2000;
    
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.localSubmitAnswer = this.localSubmitAnswer.bind(this);
    this.diplayErrorInMathPreview = this.diplayErrorInMathPreview.bind(this);

  }

  updateValidationState() {
    if(this.localNumberTimesSubmitted !== this.props.numbertimessubmitted) {
      // if number of times submitted doesn't match,
      // it means that the answer has been submitted since last pass
      this.localNumberTimesSubmitted = this.props.numbertimessubmitted;
      this.lastSubmittedTextValue = this.props.free.sharedState.textValue;
      this.valueAsSubmitted = true;
    }else if(!this.props.valueHasBeenValidated) {
      this.valueAsSubmitted = false;
    }

    this.validationState = "unvalidated";
    if (this.valueAsSubmitted) {
      if (this.props.creditachieved === 1) {
        this.validationState = "correct";
       } else if (this.props.creditachieved === 0) {
          this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }

  createMathPreviewText() {

    // if have a timeout to display an error message
    // clear the timeout
    if(this.mathPreviewErrorMessageTimeoutID !== undefined) {
      window.clearTimeout(this.mathPreviewErrorMessageTimeoutID);
      delete this.mathPreviewErrorMessageTimeoutID;
    }

    let textVal = this.props.free.sharedState.textValue.trim();

    // if(textVal === "" || Number.isFinite(Number(textVal))) {
      if(textVal === "" ) {
      // if blank or just a number, don't create preview
      this.parsePreviewWithMathJax = false;
      this.mathPreviewText = null;
      return;
    }

    let expression;
    try {
      expression = me.fromText(this.props.free.sharedState.textValue);
    }catch (e) {
      
      this.mathPreviewErrorMessage = <React.Fragment><strong>Error</strong><br/>{e.message}</React.Fragment>
      if(this.newlyFocused) {
        // if newly focused, display the error message right away
        this.mathPreviewText = this.mathPreviewErrorMessage;
        this.parsePreviewWithMathJax = false;
      } else {
        // if not newly focused, then wait before showing an error message
        // while waiting don't change the preview
        this.mathPreviewErrorMessageTimeoutID = window.setTimeout(
          this.diplayErrorInMathPreview,
          this.delayToDisplayError
        );
      }
      return;
    }
    this.parsePreviewWithMathJax = true;
    this.mathPreviewText = "\\(" + expression.toLatex() + "\\)";
  }

  diplayErrorInMathPreview() {
    this.mathPreviewText = this.mathPreviewErrorMessage;
    this.parsePreviewWithMathJax = false;
    this.setToErrorMessage = true;
    this.forceUpdate();
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.props.free.pushNewTextValue();
      if (this.props.includeCheckWork && this.validationState === "unvalidated") {
        this.localSubmitAnswer();
      }
    }
  }

  handleKeyDown(e) {
    if(e.key === "Tab") {
      this.pressedTab = true;
      this.forceUpdate();
    }
  }

  handleFocus(e) {
    this.focused = true;
    this.newlyFocused = true;
    this.forceUpdate();
  }

  handleBlur(e) {
    this.focused = false;
    this.props.free.pushNewTextValue();
    this.forceUpdate();
  }

  onChangeHandler(e) {
    this.props.free.sharedState.textValue = e.target.value;
    if(this.props.valueHasBeenValidated && this.props.numbertimessubmitted > 0 && this.lastSubmittedTextValue === this.props.free.sharedState.textValue) {
      if(!this.valueAsSubmitted) {
        // since changed the value back to the value that was last submitted, need to
        // 1. call action to let core know this input is back to submitted value
        //    (for case when the submit button is controlled by other component)
        // 2. change valueAsSubmitted (for case when submit button is local)
        this.props.actions.setRendererValueAsSubmitted(true);
        this.valueAsSubmitted = true;
      }
    }else {
      if(this.valueAsSubmitted) {
        // since changed the value from last submitted to something different, need to
        // 1. call action to let core know this input is no longer the submitted value
        //    (for case when the submit button is controlled by other component)
        // 2. change valueAsSubmitted (for case when submit button is local)
        this.props.actions.setRendererValueAsSubmitted(false);
        this.valueAsSubmitted = false;
      }
    }
    this.forceUpdate();
  }

  componentDidMount(){
    if(this.props.showMathPreview) {
      window.MathJax.Hub.Config({showProcessingMessages: false, "fast-preview": {disabled: true}});
      window.MathJax.Hub.processSectionDelay = 0;
    }
  }
  
  componentDidUpdate(){
    if(this.props.showMathPreview) {
      if(this.parsePreviewWithMathJax) {
        window.MathJax.Hub.Queue(["Typeset",window.MathJax.Hub, "#"+this.props._key + "_preview"]);
      }
    }
  }
  
  componentWillUnmount() {
    this.props.free.sharedState = undefined;
    this.props.free.pushNewTextValue = undefined;
  }

  localSubmitAnswer() {
    // this.lastSubmittedTextValue = this.props.free.sharedState.textValue;
    this.props.actions.submitAnswer();
  }

  render() {
    this.updateValidationState();

    const inputKey = this.props._key + '_input';
    const overlayKey = inputKey + '_preview';

    let checkWorkStyle = {
      position:"relative",
      width:"30px",
      height:"24px",
      fontSize:"20px",
      fontWeight:"bold",
      color:"#ffffff",
      display:"inline-block",
      textAlign: "center",
      top: "3px",
      padding: "2px",
    }

    //Assume we don't have a check work button
    let checkWorkButton = null;
    if (this.props.includeCheckWork) {
 
      if (this.validationState === "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        checkWorkButton = <span
        id={this.props._key + '_submit'}
        tabIndex="0"
        ref={c => {this.target = c && ReactDOM.findDOMNode(c);}}
        style={checkWorkStyle}
        onClick={this.localSubmitAnswer}
        onKeyPress={(e)=>{
          if (e.key === 'Enter'){
            this.localSubmitAnswer();
          }
        }}
        >
          <FontAwesomeIcon icon={faLevelDownAlt} transform={{rotate:90}} />
        </span>
      } else {
        if (this.props.showCorrectness) {
          if (this.validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkWorkButton = <span 
          id={this.props._key + '_correct'}
          style={checkWorkStyle}
          ref={c => {this.target = c && ReactDOM.findDOMNode(c);}}
          >
            <FontAwesomeIcon icon={faCheck} />
            </span>
        } else if(this.validationState === "partialcorrect"){
          //partial credit
        
          let percent = Math.round(this.props.creditachieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";
        
          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = <span 
          id={this.props._key + '_partial'}
          style={checkWorkStyle} 
          ref={c => {this.target = c && ReactDOM.findDOMNode(c);}}
          >{partialCreditContents}</span>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = <span 
          id={this.props._key + '_incorrect'}
          style={checkWorkStyle}
          ref={c => {this.target = c && ReactDOM.findDOMNode(c);}}
          ><FontAwesomeIcon icon={faTimes} /></span>

        }
        } else {
          // showCorrectness is false
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkWorkButton = <span 
          id={this.props._key + '_saved'}
          style={checkWorkStyle}
          ref={c => {this.target = c && ReactDOM.findDOMNode(c);}}
          ><FontAwesomeIcon icon={faCloud} /></span>

        }
      }
    }

    let mathPreview = null;
    if(this.props.showMathPreview && this.focused && !this.pressedTab) {
      if(this.setToErrorMessage) {
        this.setToErrorMessage = false;
      } else {
        this.createMathPreviewText();
      }
      if(this.mathPreviewText !== null) {
        mathPreview = <span id={"#"+this.props._key + "_preview"}>{this.mathPreviewText}</span>
      }
    }
    this.pressedTab = false;

    let surroundingBorderColor = "#efefef";
    if (this.focused){
      surroundingBorderColor = "#82a5ff";

    }
  
    // let overlayStyle = {display:"none"};
    // let triangleStyle = {display:"none"};
    // if (this.target !== undefined && this.focused && mathPreview !== null){
    //   let position = this.target.getBoundingClientRect();
      
    //   overlayStyle = {
    //     position:"absolute",
    //     top: position.y - 2,
    //     left: position.x + position.width + 9,
    //     backgroundColor: "#2d2d2d",
    //     zIndex: "10",
    //     borderStyle: "solid",
    //     borderWidth: "1px",
    //     // borderColor: "black",
    //     paddingTop: "4px",
    //     paddingBottom: "4px",
    //     paddingLeft: "8px",
    //     paddingRight: "8px",
    //     minHeight: "30px",
    //     color: "white",
    //     opacity: 0.9,
    //     verticalAlign: "middle",
    //     }
    //     triangleStyle = {
    //       opacity: 0.8,
    //       position: "absolute",
    //       width: "14px",
    //       height: "14px",
    //       top: position.y + 7,
    //       left: position.x + position.width - 4,
    //       zIndex: "11",
    //       borderRight: "7px solid black",
    //       borderTop: "7px solid transparent",
    //       borderBottom: "7px solid transparent",
    //       borderLeft: "7px solid transparent",


    //     }
    // }

    let mathPreviewStyle = {};

    if (this.target === undefined || !this.focused || mathPreview === null){
      mathPreviewStyle = {display:"none"};

    }

    

    this.newlyFocused = false;

    //if no checkwork button then inputRef is on the input box
    let inputRef = null;
    if (!this.props.includeCheckWork){
       inputRef = c => {this.target = c && ReactDOM.findDOMNode(c);};
    }


    // includeCheckWork
    return <React.Fragment>
      <a name={this.props._key} />
      <div className="textInputSurroundingBox" >
        <input
          key={inputKey}
          id={inputKey}
          value={this.props.free.sharedState.textValue}
          onChange={this.onChangeHandler}
          onKeyPress={this.handleKeyPress}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          style={{
            width:`${this.props.size*10}px`,
            height:"22px",
            fontSize:"14px",
            borderWidth:"1px",
            borderColor: surroundingBorderColor,
            padding: "4px",
          }}
        ref={inputRef}
        />
        {checkWorkButton}
        <span id={overlayKey} className="mathPreview" style={mathPreviewStyle}>
        {mathPreview}
        </span>
        <span className="mathPreviewTriangle" style={mathPreviewStyle}></span>
      </div>
      
    </React.Fragment>


  }
}