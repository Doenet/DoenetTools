import React, { useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { sizeToCSS } from './utils/css';

export default function MathInput(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  let currentValue = useRef(null);
  let valueToRevertTo = useRef(null);
  let validationState = useRef(null);
  let focused = useRef(null);

  currentValue.current = SVs.value;
  valueToRevertTo.current = SVs.value;



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

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      valueToRevertTo.current = SVs.value;
      props.callAction({
        actionName: "updateValue",
        componentName: name
      })
      // await this.actions.updateValue();

      if (SVs.includeCheckWork && validationState.current === "unvalidated") {
        // await this.actions.submitAnswer();
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      props.callAction({
        componentName: name,
        actionName: "updateImmediateValue",
        args: {
          text: valueToRevertTo.current
        }
      })

    }
  }

  function handleFocus(e) {
    focused.current = true;
  }

  function handleBlur(e) {
    focused.current = false;
    props.callAction({
      actionName: "updateValue",
      componentName: name
    })
  }

  function onChangeHandler(e) {
    currentValue.current = e.target.value;
    props.callAction({
      componentName: name,
      actionName: "updateImmediateValue",
      args: {
        text: e.target.value
      }
    })
    // await this.actions.updateImmediateValue({
    //   text: e.target.value
    // });
  }


  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  let disabled = SVs.disabled;

  const inputKey = name + '_input';

  let surroundingBorderColor = "#efefef";
  if (focused.current) {
    surroundingBorderColor = "#82a5ff";
  }


  if (SVs.immediateValue !== currentValue.current) {
    currentValue.current = SVs.immediateValue;
    valueToRevertTo.current = SVs.immediateValue;
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
        // onClick={this.actions.submitAnswer}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            // this.actions.submitAnswer();
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

  let input;
  if (SVs.expanded) {
    input = <textarea
      key={inputKey}
      id={inputKey}
      value={currentValue.current}
      disabled={disabled}
      onChange={onChangeHandler}
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={{
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
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
      value={currentValue.current}
      disabled={disabled}
      onChange={onChangeHandler}
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={{
        width: `${SVs.size * 10}px`,
        height: "22px",
        fontSize: "14px",
        borderWidth: "1px",
        borderColor: surroundingBorderColor,
        padding: "4px",
      }}
    />
  }


  return <React.Fragment>
    <a name={name} />
    <span className="textInputSurroundingBox" id={name}>
      {input}
      {checkWorkButton}
    </span>

  </React.Fragment>

}