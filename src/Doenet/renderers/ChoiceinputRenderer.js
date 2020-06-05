import React from 'react';
import ReactDOM from 'react-dom';
import Doenet from '../../React/Doenet';
import BaseRenderer from './BaseRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'

class ChoiceinputRenderer extends BaseRenderer {
  constructor({ key, actions, choiceTexts,
    selectedIndices, selectMultiple, inline,
    includeCheckWork, creditAchieved, valueHasBeenValidated,
    returnChoiceRenderers, showCorrectness, disabled }) {
    super({ key: key });
    this.actions = actions;
    this.choiceTexts = choiceTexts;
    this.selectedIndices = selectedIndices;
    this.selectMultiple = selectMultiple;
    this.inline = inline;
    this.includeCheckWork = includeCheckWork;
    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.returnChoiceRenderers = returnChoiceRenderers;
    this.showCorrectness = showCorrectness;
    this.disabled = disabled;

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  updateChoiceinputRenderer({
    choiceTexts,
    selectedIndices,
    creditAchieved,
    valueHasBeenValidated,
    inline, disabled
  }) {

    this.choiceTexts = choiceTexts;
    this.selectedIndices = selectedIndices;
    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.inline = inline;
    this.disabled = disabled;
  }



  updateValidationState() {

    this.validationState = "unvalidated";
    if (this.valueHasBeenValidated) {
      if (this.creditAchieved === 1) {
        this.validationState = "correct";
      } else if (this.creditAchieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }

  onChangeHandler(e) {

    let newSelectedIndices = [];

    if (e.target.value) {
      newSelectedIndices = [Number(e.target.value)];
    }

    if (this.selectedIndices.length !== newSelectedIndices.length ||
      this.selectedIndices.some((v, i) => v != newSelectedIndices[i])) {
      this.selectedIndices = newSelectedIndices
      this.actions.updateSelectedIndices({ selectedIndices: this.selectedIndices });
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
          checkWorkButton = <button
            id={this._key + '_submit'}
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
            <FontAwesomeIcon icon={faLevelDownAlt}  transform={{rotate:90}} />
          </button>
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

      let optionsList = this.choiceTexts.map(function (s, i) {
        return <option key={i} value={i + 1}>{s}</option>
      });
      return <React.Fragment>
        <a name={this._key} />
        <select
          id={this._key}
          onChange={this.onChangeHandler}
          value={this.selectedIndices[0]}
          disabled={this.disabled}
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
            <button id={this._key + "_submit"}
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
          </button>);
         
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
              let percent = Math.round(this.creditAchieved * 100);
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
      let selectedIndices = this.selectedIndices;
      let disabled = this.disabled;
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
            disabled={disabled}
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
