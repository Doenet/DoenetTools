import React from 'react';
import BaseRenderer from './BaseRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'



class AnswerRenderer extends BaseRenderer {
  constructor({ actions, key, includeCheckWork,
    creditachieved, valuesAsSubmitted, showCorrectness }) {
    super({ key: key });
    this.actions = actions;
    this._key = key;
    this.includeCheckWork = includeCheckWork;
    this.creditachieved = creditachieved;
    this.valuesAsSubmitted = valuesAsSubmitted;
    this.showCorrectness = showCorrectness;
  }

  updateAnswerRenderer({ creditachieved, valuesAsSubmitted }) {
    this.creditachieved = creditachieved;
    this.valuesAsSubmitted = valuesAsSubmitted;
  }


  updateValidationState() {
    this.validationState = "unvalidated";
    if (this.valuesAsSubmitted) {
      if (this.creditachieved === 1) {
        this.validationState = "correct";
      } else if (this.creditachieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }

  jsxCode() {
    super.jsxCode();

    if (this.includeCheckWork) {
      this.updateValidationState();

      let checkWorkStyle = {
        height: "23px",
        display: "inline-block",
        backgroundColor: "rgb(2, 117, 216)",
        padding: "1px 6px 1px 6px",
        color: "white",
        fontWeight: "bold",
        marginBottom: "30px",  //Space after check work
      }

      let checkWorkText = "Check Work";
      if(!this.showCorrectness) {
        checkWorkText = "Submit Response";
      }
      let checkworkComponent = (
        <span id={this._key + "_submit"}
          tabIndex="0"
          style={checkWorkStyle}
          onClick={this.actions.submitAnswer}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.actions.submitAnswer();
            }
          }}
        >
          <FontAwesomeIcon icon={faLevelDownAlt}  transform={{rotate:90}}/>
          &nbsp;
          {checkWorkText}
      </span>);

      if (this.showCorrectness) {
        if (this.validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkworkComponent = (
            <span id={this._key + "_correct"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCheck} />
              &nbsp;
              Correct
            </span>);
        } else if (this.validationState === "incorrect") {
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkworkComponent = (
            <span id={this._key + "_incorrect"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faTimes} />
              &nbsp;
              Incorrect
            </span>);
        } else if (this.validationState === "partialcorrect") {
          checkWorkStyle.backgroundColor = "#efab34";
          let percent = Math.round(this.creditachieved * 100);
          let partialCreditContents = `${percent}% Correct`;

          checkworkComponent = (
            <span id={this._key + "_partial"}
              style={checkWorkStyle}
            >
              {partialCreditContents}
            </span>);
        }
      } else {
        // showCorrectness is false
        if(this.validationState !== "unvalidated") {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = (
            <span id={this._key + "_saved"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCloud} />
              &nbsp;
              Response Saved
            </span>);
        }
      }

      return <span id={this._key}>
        {this.renderedChildren}
        {checkworkComponent}
      </span>;
    } else {
      return <span id={this._key}><a name={this._key} />{this.renderedChildren}</span>;
    }
  }

}

let AvailableRenderers = {
  answer: AnswerRenderer,
}

export default AvailableRenderers;
