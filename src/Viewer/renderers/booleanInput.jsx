import React, { useRef, useState } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
// import Checkbox from '../../_reactComponents/PanelHeaderComponents/Checkbox';
// import styled from 'styled-components';
import "./booleanInput.css";

export default function BooleanInput(props) {
  let { name, SVs, actions, ignoreUpdate, callAction } = useDoenetRender(props);

  BooleanInput.baseStateVariable = "value";

  const [rendererValue, setRendererValue] = useState(SVs.value);

  let valueWhenSetState = useRef(null);


  if (!ignoreUpdate && valueWhenSetState.current !== SVs.value) {
    // console.log(`setting value to ${SVs.value}`)
    setRendererValue(SVs.value);
    valueWhenSetState.current = SVs.value;
  } else {
    valueWhenSetState.current = null;
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


  function onChangeHandler(e) {

    let newValue = e.target.checked;

    setRendererValue(newValue);
    valueWhenSetState.current = SVs.value;

    callAction({
      action: actions.updateBoolean,
      args: {
        boolean: newValue,
      },
      baseVariableValue: newValue,
    })

  }


  if (SVs.hidden) {
    return null;
  }

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
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--mainBlue")
  }

  // const Button = styled.input `
  //   position: relative;
  //   width: 30px;
  //   height: 24px;
  //   font-size: 20px;
  //   font-weight: bold;
  //   color: #ffffff;
  //   display: inline-block;
  //   text-align: center;
  //   top: 3px;
  //   padding: 2px;
  //   /* background-color: var(--mainBlue); */
  //   border: var(--mainBorder);
  //   border-radius: var(--mainBorderRadius);
    

  //   &:checked {
  //     background-color: var(--mainBlue);
  //   }
  // `

  //Assume we don't have a check work button
  let checkWorkButton = null;
  let icon = props.icon;
  if (SVs.includeCheckWork) {

    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
      } else {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainBlue");
      }
      checkWorkButton = <span
        className="checkmark"
        id={name + '_submit'}
        tabIndex="0"
        disabled={disabled}
        // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
        // style={checkWorkStyle} 
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
      </span>
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
          checkWorkButton = <span
            className="checkmark"
            id={name + '_correct'}
            // style={checkWorkStyle}
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
            className="checkmark"
            id={name + '_partial'}
            // style={checkWorkStyle}
          >{partialCreditContents}</span>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
          checkWorkButton = <span
            className="checkmark"
            id={name + '_incorrect'}
            // style={checkWorkStyle}
          ><FontAwesomeIcon icon={faTimes} /></span>

        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = <span
          className="checkmark"
          id={name + '_saved'}
          // style={checkWorkStyle}
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
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {

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
      <label className="container">
        <input
          type="checkbox"
          // style={checkWorkStyle}
          key={inputKey}
          id={inputKey}
          checked={rendererValue}
          onChange={onChangeHandler}
          disabled={disabled}
        />
        {checkWorkButton}
        {SVs.label}
        {/* {checkWorkButton} */}
      </label>
      {/* {checkWorkButton} */}
    </span>
  </React.Fragment>

}