import React from 'react';
import ReactDOM from 'react-dom';import BaseRenderer from './BaseRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'

class BooleaninputRenderer extends BaseRenderer {
  constructor({ actions, boolean, key, label, includeCheckWork, creditAchieved,
    valueHasBeenValidated, numberTimesSubmitted, showCorrectness  }) {
    super({ key: key });

    this.inputKey = key + "_input";
    this.labelKey = key + "_label";
    this.actions = actions;

    this.boolean = boolean;
    this.label = label;

    this.includeCheckWork = includeCheckWork;
    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.numberTimesSubmitted = numberTimesSubmitted;
    this.showCorrectness = showCorrectness;

    this.localNumberTimesSubmitted = this.numberTimesSubmitted;

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.localSubmitAnswer = this.localSubmitAnswer.bind(this);

  }

  onChangeHandler(e) {
    this.actions.updateBoolean({
      boolean: e.target.checked
    });
  }

  updateBoolean({ boolean, label, creditAchieved, valueHasBeenValidated, numberTimesSubmitted }) {
    if (boolean !== this.boolean) {
      this.boolean = boolean;
    }
    if (label !== this.label) {
      this.label = label;
    }

    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.numberTimesSubmitted = numberTimesSubmitted;

  }


  updateValidationState() {
    if (this.localNumberTimesSubmitted !== this.numberTimesSubmitted) {
      // if number of times submitted doesn't match,
      // it means that the answer has been submitted since last pass
      this.localNumberTimesSubmitted = this.numberTimesSubmitted;
      this.lastSubmittedIndices = this.selectedindices;
      this.valueAsSubmitted = true;
    } else if (!this.valueHasBeenValidated) {
      this.valueAsSubmitted = false;
    } else if(this.valueAsSubmitted === undefined) {
      this.valueAsSubmitted = true;
    }

    this.validationState = "unvalidated";
    if (this.valueAsSubmitted) {
      if (this.creditAchieved === 1) {
        this.validationState = "correct";
      } else if (this.creditAchieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }

  localSubmitAnswer() {
    this.actions.submitAnswer();
  }

  jsxCode() {

  this.updateValidationState();

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
    if (this.includeCheckWork) {

      if (this.validationState === "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        checkWorkButton = <span
          id={this._key + '_submit'}
          tabIndex="0"
          ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          style={checkWorkStyle}
          onClick={this.localSubmitAnswer}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.localSubmitAnswer();
            }
          }}
        >
          <FontAwesomeIcon icon={faLevelDownAlt}  transform={{rotate:90}}/>
        </span>
      } else {
        if(this.showCorrectness) {
          if (this.validationState === "correct") {
            checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
            checkWorkButton = <span
              id={this._key + '_correct'}
              style={checkWorkStyle}
              ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </span>
          } else if (this.validationState === "partialcorrect") {
            //partial credit

            let percent = Math.round(this.creditAchieved * 100);
            let partialCreditContents = `${percent} %`;
            checkWorkStyle.width = "50px";

            checkWorkStyle.backgroundColor = "#efab34";
            checkWorkButton = <span
              id={this._key + '_partial'}
              style={checkWorkStyle}
              ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >{partialCreditContents}</span>
          } else {
            //incorrect
            checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
            checkWorkButton = <span
              id={this._key + '_incorrect'}
              style={checkWorkStyle}
              ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            ><FontAwesomeIcon icon={faTimes} /></span>

          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkWorkButton = <span
            id={this._key + '_saved'}
            style={checkWorkStyle}
            ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          >
            <FontAwesomeIcon icon={faCloud} />
          </span>
        }
      }
    }
    
    return <React.Fragment><label>
      <a name={this._key} />
      <input
        type="checkbox"
        key={this.inputKey}
        id={this.inputKey}
        checked={this.boolean}
        onChange={this.onChangeHandler}
      />
      {this.label}
      </label>
      {checkWorkButton}
      </React.Fragment>
  }

}

let AvailableRenderers = {
  booleaninput: BooleaninputRenderer,
}

export default AvailableRenderers;
