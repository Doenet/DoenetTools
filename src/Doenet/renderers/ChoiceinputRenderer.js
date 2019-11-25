import React from 'react';
import ReactDOM from 'react-dom';
import Doenet from '../../React/Doenet';
import BaseRenderer from './BaseRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'

class ChoiceinputRenderer extends BaseRenderer {
  constructor({ key, actions, choicetexts,
    selectedindices, selectmultiple, inline,
    includeCheckWork, creditachieved, valueHasBeenValidated,
    numbertimessubmitted, returnChoiceRenderers, showCorrectness }) {
    super({ key: key });
    this.actions = actions;
    this.choicetexts = choicetexts;
    this.selectedindices = selectedindices;
    this.selectmultiple = selectmultiple;
    this.inline = inline;
    this.includeCheckWork = includeCheckWork;
    this.creditachieved = creditachieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.numbertimessubmitted = numbertimessubmitted;
    this.returnChoiceRenderers = returnChoiceRenderers;
    this.showCorrectness = showCorrectness;

    this.localNumberTimesSubmitted = this.numbertimessubmitted;

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.localSubmitAnswer = this.localSubmitAnswer.bind(this);
  }

  updateChoiceinputRenderer({
    choicetexts,
    selectedindices,
    creditachieved,
    valueHasBeenValidated,
    numbertimessubmitted,
    inline,
  }) {

    this.choicetexts = choicetexts;
    this.selectedindices = selectedindices;
    this.creditachieved = creditachieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.numbertimessubmitted = numbertimessubmitted;
    this.inline = inline;
  }



  updateValidationState() {
    if (this.localNumberTimesSubmitted !== this.numbertimessubmitted) {
      // if number of times submitted doesn't match,
      // it means that the answer has been submitted since last pass
      this.localNumberTimesSubmitted = this.numbertimessubmitted;
      this.lastSubmittedIndices = this.selectedindices;
      this.valueAsSubmitted = true;
    } else if (!this.valueHasBeenValidated) {
      this.valueAsSubmitted = false;
    } else if(this.valueAsSubmitted === undefined) {
      this.valueAsSubmitted = true;
    }

    this.validationState = "unvalidated";
    if (this.valueAsSubmitted) {
      if (this.creditachieved === 1) {
        this.validationState = "correct";
      } else if (this.creditachieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }


  localSubmitAnswer() {
    this.actions.submitAnswer();
  }

  onChangeHandler(e) {

    let newSelectedIndices = [];

    if (e.target.value) {
      newSelectedIndices = [Number(e.target.value)];
    }

    if (this.selectedindices.length !== newSelectedIndices.length ||
      this.selectedindices.some((v, i) => v != newSelectedIndices[i])) {
      this.selectedindices = newSelectedIndices
      this.actions.updateSelectedIndices({ selectedindices: this.selectedindices });
    }
  }

  jsxCode() {

    this.updateValidationState();

    if (this.inline) {

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
            <FontAwesomeIcon icon={faLevelDownAlt}  transform={{rotate:90}} />
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

              let percent = Math.round(this.creditachieved * 100);
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

      let optionsList = this.choicetexts.map(function (s, i) {
        return <option key={i} value={i + 1}>{s}</option>
      });
      return <React.Fragment>
        <a name={this._key} />
        <select
          id={this._key}
          onChange={this.onChangeHandler}
          value={this.selectedindices[0]}
        >
          <option></option>
          {optionsList}
        </select>
        {checkWorkButton}
      </React.Fragment>
    } else {


      let checkWorkStyle = {
        height: "23px",
        display: "inline-block",
        backgroundColor: "rgb(2, 117, 216)",
        padding: "1px 6px 1px 6px",
        color: "white",
        fontWeight: "bold",
      }

      let checkworkComponent = null;

      if (this.includeCheckWork) {

        if (this.validationState === "unvalidated") {

          let checkWorkText = "Check Work";
          if(!this.showCorrectness) {
            checkWorkText = "Submit Response";
          }

          checkworkComponent = (
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
         
        } else {
          if(this.showCorrectness) {
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
      }


      let inputKey = this._key;
      let listStyle = {
        listStyleType: "none"
      }

      let onChangeHandler = this.onChangeHandler;
      let selectedIndices = this.selectedindices;
      let keyBeginning = inputKey + '_choice'
      let choiceDoenetTags = this.returnChoiceRenderers().map(function (tag, i) {
        return <li key={inputKey + '_choice' + i}>
          <input
            type="radio"
            id={keyBeginning + i + "_input"}
            name={inputKey}
            value={i + 1}
            checked={selectedIndices.includes(i + 1)}
            onChange={onChangeHandler}
          />
          <label htmlFor={keyBeginning + i + "_input"}>
            <Doenet
              free={{
                componentDidUpdate: tag.componentDidUpdate,
                componentDidMount: tag.componentDidMount,
                componentWillUnmount: tag.componentWillUnmount,
                doenetState: tag.jsxCode()
              }}
            />
          </label>
        </li>
      });

      return <React.Fragment>
        <ol id={inputKey} style={listStyle}><a name={this._key} />{choiceDoenetTags}</ol>
        {checkworkComponent}
      </React.Fragment>

    }
  }

}

let AvailableRenderers = {
  choiceinput: ChoiceinputRenderer,
}

export default AvailableRenderers;
