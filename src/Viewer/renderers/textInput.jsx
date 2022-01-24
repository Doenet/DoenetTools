import React, { useRef, useState } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { sizeToCSS } from './utils/css';

export default function TextInput(props) {
  let { name, SVs, actions, sourceOfUpdate, ignoreUpdate, callAction } = useDoenetRender(props);

  TextInput.baseStateVariable = "immediateValue";

  const [rendererValue, setRendererValue] = useState(SVs.immediateValue);

  let valueToRevertTo = useRef(SVs.immediateValue);
  let focused = useRef(null);

  let immediateValueWhenSetState = useRef(null);


  if (!ignoreUpdate && immediateValueWhenSetState.current !== SVs.immediateValue) {
    // console.log(`setting value to ${SVs.immediateValue}`)
    setRendererValue(SVs.immediateValue);
    immediateValueWhenSetState.current = SVs.immediateValue;
    valueToRevertTo.current = SVs.immediateValue;
  } else {
    immediateValueWhenSetState.current = null;
  }


  let validationState = 'unvalidated';
  if (SVs.valueHasBeenValidated) {
    if (SVs.creditAchieved === 1) {
      validationState = 'correct';
    } else if (SVs.creditAchieved === 0) {
      validationState = 'incorrect';
    } else {
      validationState = 'partialcorrect';
    }
  }


  function handleKeyPress(e) {
    if (e.key === "Enter") {
      valueToRevertTo.current = rendererValue;

      callAction({
        action: actions.updateValue,
        baseVariableValue: rendererValue,
      });

      if (SVs.includeCheckWork && validationState === "unvalidated") {
        callAction({
          action: actions.submitAnswer,
        })
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      let oldValue = valueToRevertTo.current;

      if (oldValue !== rendererValue) {

        setRendererValue(oldValue);
        immediateValueWhenSetState.current = SVs.immediateValue;

        callAction({
          action: actions.updateImmediateValue,
          args: {
            text: oldValue,
          },
          baseVariableValue: oldValue,
        })
      }
    }
  }

  function handleFocus(e) {
    focused.current = true;
  }

  function handleBlur(e) {
    focused.current = false;

    valueToRevertTo.current = rendererValue;

    callAction({
      action: actions.updateValue,
      baseVariableValue: rendererValue,
    });

  }

  function onChangeHandler(e) {

    let newValue = e.target.value;

    // console.log(`on change handler for ${name}, desired value: ${newValue}`)

    if (newValue !== rendererValue) {

      setRendererValue(newValue);
      immediateValueWhenSetState.current = SVs.immediateValue;

      callAction({
        action: actions.updateImmediateValue,
        args: {
          text: newValue,
        },
        baseVariableValue: newValue,
      })
    }
  }


  if (SVs.hidden) {
    return null;
  }



  let disabled = SVs.disabled;

  const inputKey = name + '_input';

  let surroundingBorderColor = "#efefef";
  if (focused.current) {
    surroundingBorderColor = "#82a5ff";
  }


  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {

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

    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = "rgb(200,200,200)";
      } else {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      }
      checkWorkButton = <button
        id={name + '_submit'}
        tabIndex="0"
        disabled={disabled}
        style={checkWorkStyle}
        onClick={() => callAction({
          action: actions.submitAnswer,
        })}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            callAction({
              action: actions.submitAnswer,
            });
          }
        }}
      >
        <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
      </button>
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkWorkButton = <span
            id={name + '_correct'}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
        } else if (validationState === "partialcorrect") {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";

          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = <span
            id={name + '_partial'}
            style={checkWorkStyle}
          >{partialCreditContents}</span>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = <span
            id={name + '_incorrect'}
            style={checkWorkStyle}
          ><FontAwesomeIcon icon={faTimes} /></span>

        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = <span
          id={name + '_saved'}
          style={checkWorkStyle}
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
      value={rendererValue}
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
      value={rendererValue}
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