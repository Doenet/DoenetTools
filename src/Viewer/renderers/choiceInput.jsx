import React, { useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'

export default function ChoiceInput(props) {
  let { name, SVs, actions, children, sourceOfUpdate } = useDoenetRender(props);

  let validationState = useRef(null);


  function updateValidationState() {

    validationState.current = "unvalidated";
    if (SVs.valueHasBeenValidated || SVs.numberOfAttemptsLeft < 1) {
      if (SVs.creditAchieved === 1) {
        validationState.current = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState.current = "incorrect";
      } else {
        validationState.current = "partialcorrect";
      }
    }
  }

  function onChangeHandler(e) {

    let newSelectedIndices = [];

    if (SVs.inline) {
      if (e.target.value) {
        newSelectedIndices = Array.from(e.target.selectedOptions, option => Number(option.value))
      }
    } else {
      if (SVs.selectMultiple) {
        newSelectedIndices = [...SVs.selectedIndices];
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

    if (SVs.selectedIndices.length !== newSelectedIndices.length ||
      SVs.selectedIndices.some((v, i) => v != newSelectedIndices[i])
    ) {
      props.callAction({
        actionName: "updateSelectedIndices",
        componentName: name,
        args: {
          selectedIndices: newSelectedIndices
        }
      })
    }
  }


  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  let disabled = SVs.disabled;

  if (SVs.inline) {

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
    if (SVs.includeCheckWork) {

      if (validationState.current === "unvalidated") {
        if (disabled) {
          checkWorkStyle.backgroundColor = "rgb(200,200,200)";
        } else {
          checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
        }
        checkWorkButton = <button
          id={name + '_submit'}
          disabled={disabled}
          tabIndex="0"
          // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
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
        if (SVs.showCorrectness) {
          if (validationState.current === "correct") {
            checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
            checkWorkButton = <span
              id={name + '_correct'}
              style={checkWorkStyle}
              // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </span>
          } else if (validationState.current === "partialcorrect") {
            //partial credit

            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent} %`;
            checkWorkStyle.width = "50px";

            checkWorkStyle.backgroundColor = "#efab34";
            checkWorkButton = <span
              id={name + '_partial'}
              style={checkWorkStyle}
              // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >{partialCreditContents}</span>
          } else {
            //incorrect
            checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
            checkWorkButton = <span
              id={name + '_incorrect'}
              style={checkWorkStyle}
              // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            ><FontAwesomeIcon icon={faTimes} /></span>

          }
        } else {
          // showCorrectness is false
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkWorkButton = <span
            id={name + '_saved'}
            style={checkWorkStyle}
            // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          ><FontAwesomeIcon icon={faCloud} /></span>

        }
      }

      if (SVs.numberOfAttemptsLeft < 0) {
        checkWorkButton = <>
          {checkWorkButton}
          <span>
            (no attempts remaining)
          </span>
        </>
      } else if (SVs.numberOfAttemptsLeft < Infinity) {

        checkWorkButton = <>
          {checkWorkButton}
          <span>
            (attempts remaining: {SVs.numberOfAttemptsLeft})
          </span>
        </>
      }

    }

    let svData = SVs;
    let optionsList = SVs.choiceTexts.map(function (s, i) {
      if (svData.choicesHidden[i]) {
        return null;
      }
      return <option key={i + 1} value={i + 1} disabled={svData.choicesDisabled[i]} >{s}</option>
    });


    let value = SVs.selectedIndices;
    if (value === undefined) {
      value = "";
    } else if (!SVs.selectMultiple) {
      value = value[0];
      if (value === undefined) {
        value = "";
      }
    }

    return <React.Fragment>
      <a name={name} />
      <select
        id={name}
        onChange={onChangeHandler}
        value={value}
        disabled={disabled}
        multiple={SVs.selectMultiple}
      >
        <option hidden={true} value="">{SVs.placeHolder}</option>
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

    if (SVs.includeCheckWork) {

      if (validationState.current === "unvalidated") {

        let checkWorkText = "Check Work";
        if (!SVs.showCorrectness) {
          checkWorkText = "Submit Response";
        }
        if (disabled) {
          checkWorkStyle.backgroundColor = "rgb(200,200,200)";
        }
        checkworkComponent = (
          <button id={name + "_submit"}
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
        if (SVs.showCorrectness) {
          if (validationState.current === "correct") {
            checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
            checkworkComponent = (
              <span id={name + "_correct"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faCheck} />
                &nbsp;
                Correct
              </span>);
          } else if (validationState.current === "incorrect") {
            checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
            checkworkComponent = (
              <span id={name + "_incorrect"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faTimes} />
                &nbsp;
                Incorrect
              </span>);
          } else if (validationState.current === "partialcorrect") {
            checkWorkStyle.backgroundColor = "#efab34";
            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent}% Correct`;

            checkworkComponent = (
              <span id={name + "_partial"}
                style={checkWorkStyle}
              >
                {partialCreditContents}
              </span>);
          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = (
            <span id={name + "_saved"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCloud} />
              &nbsp;
              Response Saved
            </span>);
        }
      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkworkComponent = <>
        {checkworkComponent}
        <span>
          (no attempts remaining)
        </span>
      </>
    } else if (SVs.numberOfAttemptsLeft < Infinity) {

      checkworkComponent = <>
        {checkworkComponent}
        <span>
          (attempts remaining: {SVs.numberOfAttemptsLeft})
        </span>
      </>
    }

    let inputKey = name;
    let listStyle = {
      listStyleType: "none"
    }

    let selectedIndices = SVs.selectedIndices;
    let keyBeginning = inputKey + '_choice';
    let inputType = 'radio';
    if (SVs.selectMultiple) {
      inputType = 'checkbox';
    }

    let svData = SVs;

    let choiceDoenetTags = SVs.choiceOrder
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
      <ol id={inputKey} style={listStyle}><a name={name} />{choiceDoenetTags}</ol>
      {checkworkComponent}
    </React.Fragment>

  }

}
