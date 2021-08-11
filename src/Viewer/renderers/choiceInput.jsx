import React from 'react';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'

export default class ChoiceinputRenderer extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this);

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

  onChangeHandler(e) {

    let newSelectedIndices = [];

    if (this.doenetSvData.inline) {
      if (e.target.value) {
        newSelectedIndices = Array.from(e.target.selectedOptions, option => Number(option.value))
      }
    } else {
      if (this.doenetSvData.selectMultiple) {
        newSelectedIndices = [...this.doenetSvData.selectedIndices];
        let index = Number(e.target.value);
        if (e.target.checked) {
          if (!newSelectedIndices.includes(index)) {
            newSelectedIndices.push(index);
            newSelectedIndices.sort((a, b) => a - b);
          }
        } else {
          let i = newSelectedIndices.indexOf(index);
          if (i !== -1) {
            newSelectedIndices.splice(i, 1);
          }

        }
      } else {
        newSelectedIndices = [Number(e.target.value)];
      }
    }

    if (this.doenetSvData.selectedIndices.length !== newSelectedIndices.length ||
      this.doenetSvData.selectedIndices.some((v, i) => v != newSelectedIndices[i])) {
      this.actions.updateSelectedIndices({ selectedIndices: newSelectedIndices });
    }
  }

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    this.updateValidationState();

    let disabled = this.doenetSvData.disabled;

    if (this.doenetSvData.inline) {

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
            disabled={disabled}
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

      let svData = this.doenetSvData;
      let optionsList = this.doenetSvData.choiceTexts.map(function (s, i) {
        if (svData.choicesHidden[i]) {
          return null;
        }
        return <option key={i + 1} value={i + 1} disabled={svData.choicesDisabled[i]} >{s}</option>
      });


      let value = this.doenetSvData.selectedIndices;
      if (value === undefined) {
        value = "";
      } else if (!this.doenetSvData.selectMultiple) {
        value = value[0];
        if (value === undefined) {
          value = "";
        }
      }

      return <React.Fragment>
        <a name={this.componentName} />
        <select
          id={this.componentName}
          onChange={this.onChangeHandler}
          value={value}
          disabled={disabled}
          multiple={this.doenetSvData.selectMultiple}
        >
          <option hidden={true} value="">{this.doenetSvData.placeHolder}</option>
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

      if (this.doenetSvData.includeCheckWork) {

        if (this.validationState === "unvalidated") {

          let checkWorkText = "Check Work";
          if (!this.doenetSvData.showCorrectness) {
            checkWorkText = "Submit Response";
          }
          if (disabled) {
            checkWorkStyle.backgroundColor = "rgb(200,200,200)";
          }
          checkworkComponent = (
            <button id={this.componentName + "_submit"}
              tabIndex="0"
              disabled={disabled}
              style={checkWorkStyle}
              onClick={this.actions.submitAnswer}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.actions.submitAnswer();
                }
              }}
            >
              <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
              &nbsp;
              {checkWorkText}
            </button>);

        } else {
          if (this.doenetSvData.showCorrectness) {
            if (this.validationState === "correct") {
              checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
              checkworkComponent = (
                <span id={this.componentName + "_correct"}
                  style={checkWorkStyle}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;
                  Correct
                </span>);
            } else if (this.validationState === "incorrect") {
              checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
              checkworkComponent = (
                <span id={this.componentName + "_incorrect"}
                  style={checkWorkStyle}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  &nbsp;
                  Incorrect
                </span>);
            } else if (this.validationState === "partialcorrect") {
              checkWorkStyle.backgroundColor = "#efab34";
              let percent = Math.round(this.doenetSvData.creditAchieved * 100);
              let partialCreditContents = `${percent}% Correct`;

              checkworkComponent = (
                <span id={this.componentName + "_partial"}
                  style={checkWorkStyle}
                >
                  {partialCreditContents}
                </span>);
            }
          } else {
            checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
            checkworkComponent = (
              <span id={this.componentName + "_saved"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faCloud} />
                &nbsp;
                Response Saved
              </span>);
          }
        }
      }

      if (this.doenetSvData.numberOfAttemptsLeft < 0) {
        checkworkComponent = <>
          {checkworkComponent}
          <span>
            (no attempts remaining)
          </span>
        </>
      } else if (this.doenetSvData.numberOfAttemptsLeft < Infinity) {

        checkworkComponent = <>
          {checkworkComponent}
          <span>
            (attempts remaining: {this.doenetSvData.numberOfAttemptsLeft})
          </span>
        </>
      }

      let inputKey = this.componentName;
      let listStyle = {
        listStyleType: "none"
      }

      let onChangeHandler = this.onChangeHandler;
      let selectedIndices = this.doenetSvData.selectedIndices;
      let keyBeginning = inputKey + '_choice';
      let children = this.children;
      let inputType = 'radio';
      if (this.doenetSvData.selectMultiple) {
        inputType = 'checkbox';
      }

      let svData = this.doenetSvData;

      let choiceDoenetTags = this.doenetSvData.choiceOrder
        .map(v => children[v - 1])
        .map(function (child, i) {
          if (svData.choicesHidden[i]) {
            return null;
          }
          return <li key={inputKey + '_choice' + (i + 1)}>
            <input
              type={inputType}
              id={keyBeginning + (i + 1) + "_input"}
              name={inputKey}
              value={i + 1}
              checked={selectedIndices.includes(i + 1)}
              onChange={onChangeHandler}
              disabled={disabled || svData.choicesDisabled[i]}
            />
            <label htmlFor={keyBeginning + (i + 1) + "_input"}>
              {child}
            </label>
          </li>
        });

      return <React.Fragment>
        <ol id={inputKey} style={listStyle}><a name={this.componentName} />{choiceDoenetTags}</ol>
        {checkworkComponent}
      </React.Fragment>

    }
  }

}
