import React, { useRef, useState } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { sizeToCSS } from './utils/css';
import { rendererState } from './useDoenetRenderer';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

export default function TextInput(props) {
  let { name, SVs, actions, sourceOfUpdate, ignoreUpdate, rendererName, callAction } = useDoenetRender(props);

  TextInput.baseStateVariable = "immediateValue";

  const [rendererValue, setRendererValue] = useState(SVs.immediateValue);

  const setRendererState = useSetRecoilState(rendererState(rendererName));

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

      setRendererState((was) => {
        let newObj = { ...was };
        newObj.ignoreUpdate = true;
        return newObj;
      })
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

  const TextArea = styled.textarea `
    width: sizeToCSS(width);
    // height: sizeToCSS(SVs.height),
    height: 24px;
    /* font-size: 14px; */
    /* border-width: 1px; */
    border: 2px solid black;
    /* border-color: ${surroundingBorderColor}; */
  `;

  const Input = styled.input `
    width: ${SVs.size * 10}px;
    height: 24px;
    /* font-size: 14px; */
    /* border-width: 1px; */
    border: 2px solid black;
    /* border-color: ${surroundingBorderColor}; */
  `;

  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {

    let checkWorkStyle = {
      cursor: 'pointer',
    }

    const Button = styled.button `
      position: relative;
      width: 24px;
      height: 24px;
      color: #ffffff;
      display: inline-block;
      text-align: center;
      padding: 2px;
      border: none;
      border-radius: var(--mainBorderRadius);
      margin: 0px 10px 12px 10px;

      &:hover {
        background-color: var(--lightBlue);
        color: black;
      };
    `;

    if (validationState === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        checkWorkStyle.cursor = 'not-allowed'
      } else {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainBlue");
      }
      checkWorkButton = 
        <Button
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
        </Button>
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
          checkWorkButton = 
            <Button
              id={name + '_correct'}
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
              id={name + '_partial'}
              style={checkWorkStyle}
            >
              {partialCreditContents}
            </Button>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
          checkWorkButton = 
            <Button
              id={name + '_incorrect'}
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
            id={name + '_saved'}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCloud} />
          </Button>
      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = 
        <>
          {checkWorkButton}
          <span>(no attempts remaining)</span>
        </>
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkWorkButton =
        <>
          {checkWorkButton}
          <span>(1 attempt remaining)</span>
        </>
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkWorkButton = 
        <>
          {checkWorkButton}
          <span>({SVs.numberOfAttemptsLeft} attempts remaining)</span>
        </>
    }
  }

  let input;
  if (SVs.expanded) {
    input = <TextArea
      key={inputKey}
      id={inputKey}
      value={rendererValue}
      disabled={disabled}
      onChange={onChangeHandler}
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  } else {
    input = <Input
      key={inputKey}
      id={inputKey}
      value={rendererValue}
      disabled={disabled}
      onChange={onChangeHandler}
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  }


  return <React.Fragment>
    <a name={name} />
    <span className="textInputSurroundingBox" id={name} style={{marginBottom: "12px"}}>
      {input}
      {checkWorkButton}
    </span>

  </React.Fragment>

}