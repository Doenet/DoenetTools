import React, { useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'

export default function BooleanInput(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

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
    props.callAction({
      action: actions.updateBoolean,
      args: {
        boolean: e.target.checked
      }
    })
  }


  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  let disabled = SVs.disabled;

  const inputKey = name + '_input';

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
        tabIndex="0"
        disabled={disabled}
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

  return <React.Fragment>
    <span id={name}>
      <a name={name} />
      <label>
        <input
          type="checkbox"
          key={inputKey}
          id={inputKey}
          checked={SVs.value}
          onChange={onChangeHandler}
          disabled={disabled}
        />
        {SVs.label}
      </label>
      {checkWorkButton}
    </span>
  </React.Fragment>

}