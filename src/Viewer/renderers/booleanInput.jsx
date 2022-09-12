import React, { useRef, useState } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { rendererState } from './useDoenetRenderer';
import { useSetRecoilState } from 'recoil';
import ToggleButton from '../../_reactComponents/PanelHeaderComponents/ToggleButton';
import styled from 'styled-components';
import './booleanInput.css';
import { MathJax } from 'better-react-mathjax';

// Moved most of checkWorkStyle styling into Button
const Button = styled.button `
  position: relative;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  /* text-align: center; */
  /* padding: 2px; */
  /* z-index: 0; */
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 12px 12px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  };
`;

export default React.memo(function BooleanInput(props) {
  let { name, id, SVs, actions, ignoreUpdate, rendererName, callAction } = useDoenetRender(props);

  BooleanInput.baseStateVariable = "value";

  const [rendererValue, setRendererValue] = useState(SVs.value);

  const setRendererState = useSetRecoilState(rendererState(rendererName));

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

    let newValue = !rendererValue;

    setRendererValue(newValue);
    valueWhenSetState.current = SVs.value;

    setRendererState((was) => {
      let newObj = { ...was };
      newObj.ignoreUpdate = true;
      return newObj;
    })

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
    cursor: 'pointer',
  }

  //Assume we don't have a check work button
  let checkWorkButton = null;
  let icon = props.icon;
  if (SVs.includeCheckWork) {

    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        checkWorkStyle.cursor = 'not-allowed';
      } else {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainBlue");
      }
      checkWorkButton = 
        <Button
          id={id + '_submit'}
          tabIndex="0"
          disabled={disabled}
          // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
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
        </Button>
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
          checkWorkButton = 
            <Button
              id={id + '_correct'}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCheck} />
            </Button>
        } else if (validationState === "partialcorrect") {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";

          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = 
            <Button
              id={id + '_partial'}
              style={checkWorkStyle}
            >
              {partialCreditContents}
            </Button>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
          checkWorkButton = 
            <Button
              id={id + '_incorrect'}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = 
          <Button
            id={id + '_saved'}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCloud} />
          </Button>
      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (no attempts remaining)
        </span>
      </>
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (1 attempt remaining)
        </span>
        </>
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {

      checkWorkButton = <>
        {checkWorkButton}
        <span>
          ({SVs.numberOfAttemptsLeft} attempts remaining)
        </span>
      </>
    }
  }

  let input;
  let label = SVs.label;
  if (SVs.labelHasLatex) {
    label = <MathJax hideUntilTypeset={"first"} inline dynamic >{label}</MathJax>
  }
  if (SVs.asToggleButton) {
    input =
      <ToggleButton
        id={inputKey}
        key={inputKey}
        isSelected={rendererValue}
        onClick={onChangeHandler}
        value={label}
        disabled={disabled}
      />;
  } else {
    input = 
    <label className="container">
      <input
        type="checkbox"
        key={inputKey}
        id={inputKey}
        checked={rendererValue}
        onChange={onChangeHandler}
        disabled={disabled}
      />
      <span className="checkmark"></span>
      {label != "" ? <span style={{marginLeft: "2px"}}>{label}</span> : <span>{label}</span>}
    </label>
    {checkWorkButton}
  }
  console.log(label);

  return <React.Fragment>
    <span id={id} className="button-container">
      <a name={id} />
      {input}
    </span>
    {checkWorkButton}
  </React.Fragment>
})