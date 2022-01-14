import React from 'react';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { sizeToCSS } from './utils/css';


export default class TextInput extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.currentValue = this.doenetSvData.value;
    this.valueToRevertTo = this.doenetSvData.value;

  }

  static initializeChildrenOnConstruction = false;

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

  async handleKeyPress(e) {
    if (e.key === "Enter") {
      this.valueToRevertTo = this.doenetSvData.value;
      if (this.doenetSvData.value !== this.doenetSvData.immediateValue) {
        await this.actions.updateValue();
      }
      if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
        await this.actions.submitAnswer();
      }
      this.forceUpdate();
    }
  }

  async handleKeyDown(e) {
    if (e.key === "Escape") {
      this.callAction({
        componentName: this.componentName,
        actionName: "updateImmediateValue",
        args: {
          text: this.valueToRevertTo
        }
      })

      this.forceUpdate();
    }
  }

  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }

  async handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    if (this.doenetSvData.immediateValue !== this.doenetSvData.value) {
      await this.actions.updateValue();
    }

    this.forceUpdate();
  }

  async onChangeHandler(e) {
    this.currentValue = e.target.value;
    this.callAction({
      componentName: this.componentName,
      actionName: "updateImmediateValue",
      args: {
        text: e.target.value
      }
    })
    // await this.actions.updateImmediateValue({
    //   text: e.target.value
    // });
    this.forceUpdate();
  }

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    this.updateValidationState();

    let disabled = this.doenetSvData.disabled;

    const inputKey = this.componentName + '_input';

    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }


    if (this.doenetSvData.immediateValue !== this.currentValue) {
      console.log(`immediateValue: ${this.doenetSvData.immediateValue}`)
      console.log(`currentValue: ${this.currentValue}`)
      this.currentValue = this.doenetSvData.immediateValue;
      this.valueToRevertTo = this.doenetSvData.immediateValue;
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

    let input;
    if (this.doenetSvData.expanded) {
      input = <textarea
        key={inputKey}
        id={inputKey}
        value={this.currentValue}
        disabled={disabled}
        onChange={this.onChangeHandler}
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        style={{
          width: sizeToCSS(this.doenetSvData.width),
          height: sizeToCSS(this.doenetSvData.height),
          fontSize: "14px",
          borderWidth: "1px",
          // borderColor: surroundingBorderColor,
          padding: "4px",
        }}
      />
    } else {
      input = <input
        key={inputKey}
        id={inputKey}
        value={this.currentValue}
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
        }}
      />
    }


    return <React.Fragment>
      <a name={this.componentName} />
      <span className="textInputSurroundingBox" id={this.componentName}>
        {input}
        {checkWorkButton}
      </span>

    </React.Fragment>

  }
}