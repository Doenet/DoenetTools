import React, { useRef, useState, useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud,
} from '@fortawesome/free-solid-svg-icons';
import mathquill from 'react-mathquill';
mathquill.addStyles(); // Styling for react-mathquill input field
let EditableMathField = mathquill.EditableMathField;
import {
  focusedMathField,
  focusedMathFieldReturn,
  palletRef,
  handleRef,
} from '../../Tools/_framework/Footers/MathInputSelector';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { rendererState } from './useDoenetRenderer';
import './mathInput.css';

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
  position: relative;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  text-align: center;
  padding: 2px;
  z-index: 0;
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  };
`;

export default function MathInput(props) {
  let { name, id, SVs, actions, sourceOfUpdate, ignoreUpdate, rendererName, callAction } =
    useDoenetRender(props);

  MathInput.baseStateVariable = 'rawRendererValue';

  const [mathField, setMathField] = useState(null);
  const [focused, setFocused] = useState(null);
  const textareaRef = useRef(null); // Ref to keep track of the mathInput's disabled state

  const setRendererState = useSetRecoilState(rendererState(rendererName));

  let rendererValue = useRef(SVs.rawRendererValue);

  // Need to use ref for includeCheckWork
  // or handlePressEnter doesn't get the new value when the SV changes
  let includeCheckWork = useRef(SVs.includeCheckWork && !SVs.suppressCheckwork);
  includeCheckWork.current = SVs.includeCheckWork && !SVs.suppressCheckwork;

  if (!ignoreUpdate) {
    rendererValue.current = SVs.rawRendererValue;
  }

  // need to use a ref for validation state as handlePressEnter
  // does not update to current values
  let validationState = useRef(null);

  const setFocusedField = useSetRecoilState(focusedMathField);
  const setFocusedFieldReturn = useSetRecoilState(focusedMathFieldReturn);
  const containerRef = useRecoilValue(palletRef);
  const dragHandleRef = useRecoilValue(handleRef);

  const updateValidationState = () => {
    validationState.current = 'unvalidated';
    if (SVs.valueHasBeenValidated) {
      if (SVs.creditAchieved === 1) {
        validationState.current = 'correct';
      } else if (SVs.creditAchieved === 0) {
        validationState.current = 'incorrect';
      } else {
        validationState.current = 'partialcorrect';
      }
    }
  };

  const handleVirtualKeyboardClick = (text) => {
    mathField.focus();
    if (!text) {
      console.log('Empty value');

      return;
    }
    const splitCommand = text.split(' ');
    const command = splitCommand[0];
    const input = text.substring(command.length + 1);

    if (command == 'cmd') {
      mathField.cmd(input);
    } else if (command == 'write') {
      mathField.write(input);
    } else if (command == 'keystroke') {
      mathField.keystroke(input);
    } else if (command == 'type') {
      mathField.typedText(input);
    }
  };

  const handleDefaultVirtualKeyboardClick = (text) => {
    console.log('no mathinput field focused');
  };

  const handleDefaultVirtualKeyboardReturn = (text) => {
    console.log('no mathinput field focused');
  };

  const handlePressEnter = (e) => {
    callAction({
      action: actions.updateValue,
      baseVariableValue: rendererValue.current,
    });

    if (includeCheckWork.current && validationState.current === 'unvalidated') {
      callAction({
        action: actions.submitAnswer,
      });
    }
  };

  const handleFocus = (e) => {
    setFocusedField(() => handleVirtualKeyboardClick);
    setFocusedFieldReturn(() => handlePressEnter);
    setFocused(true);
  };

  const handleBlur = (e) => {
    if (containerRef?.current?.contains(e.relatedTarget)) {
      setTimeout(() => {
        mathField.focus();
      }, 100);
    } else if (dragHandleRef?.current?.contains(e.relatedTarget)) {
      setTimeout(() => {
        mathField.focus();
      }, 100);
    } else {
      callAction({
        action: actions.updateValue,
        baseVariableValue: rendererValue.current,
      });
      // console.log(">>>", e.relatedTarget.id, checkWorkButton.props.id);
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
      setFocusedFieldReturn(() => handleDefaultVirtualKeyboardReturn);
    }
    setFocused(false);
  };

  const onChangeHandler = (text) => {
    // whitespace differences and whether or not a single character exponent has braces
    // do not count as a difference for changing raw renderer value
    if (text.replace(/\s/g, '').replace(/\^{(\w)}/g, '^$1') !== rendererValue.current?.replace(/\s/g, '').replace(/\^{(\w)}/g, '^$1')) {
      rendererValue.current = text;

      setRendererState((was) => {
        let newObj = { ...was };
        newObj.ignoreUpdate = true;
        return newObj;
      })

      callAction({
        action: actions.updateRawValue,
        args: {
          rawRendererValue: text,
        },
        baseVariableValue: text,
      });
    }
  };

  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  // const inputKey = this.componentName + '_input';

  let checkWorkStyle = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px",
  }

  let mathInputStyle = {
    /* Set each border attribute separately since the borderColor is updated during rerender (checking mathInput's disabled state)
    Currently does not work with border: "var(--mainBorder)" */
    borderColor: "var(--canvastext)",
    borderStyle: "solid",
    borderWidth: "2px",
    margin: "0px",
    boxShadow: "none",
    outlineOffset: "2px",
    outlineColor: "var(--canvastext)",
    outlineWidth: "2px",
  }

  if (focused) {
    mathInputStyle.outlineStyle = "solid";
  }

  let mathInputWrapperCursor = 'allowed';
  if (SVs.disabled) {
    // Disable the checkWorkButton
    checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
    checkWorkStyle.color = 'black';
    checkWorkStyle.cursor = 'not-allowed';

    // Disable the mathInput
    mathInputStyle.borderColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
    mathInputStyle.backgroundColor = 'rgba(239, 239, 239, 0.3)';
    mathInputStyle.pointerEvents = 'none';
    mathInputWrapperCursor = 'not-allowed';
  }

  if (textareaRef.current && textareaRef.current.disabled !== SVs.disabled) { // Update the mathInput ref's disabled state
    textareaRef.current.disabled = SVs.disabled;
  }

  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
    if (validationState.current === 'unvalidated') {
      checkWorkButton = (
        <Button
          id={id + '_submit'}
          tabIndex="0"
          disabled={SVs.disabled}
          style={checkWorkStyle}
          onClick={() =>
            callAction({
              action: actions.submitAnswer,
            })
          }
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
      );
    } else {
      if (SVs.showCorrectness) {
        if (validationState.current === 'correct') {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
          checkWorkButton = (
            <Button id={id + '_correct'} style={checkWorkStyle}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          );
        } else if (validationState.current === 'partialcorrect') {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = '44px';

          checkWorkStyle.backgroundColor = '#efab34';
          checkWorkButton = (
            <Button id={id + '_partial'} style={checkWorkStyle}>
              {partialCreditContents}
            </Button>
          );
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
          checkWorkButton = (
            <Button id={id + '_incorrect'} style={checkWorkStyle}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          );
        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = 'rgb(74, 3, 217)';
        checkWorkStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
        checkWorkButton = (
          <Button id={id + '_saved'} style={checkWorkStyle}>
            <FontAwesomeIcon icon={faCloud} />
          </Button>
        );
      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(no attempts remaining)</span>
        </>
      );
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>(1 attempt remaining)</span>
        </>
      );
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkWorkButton = (
        <>
          {checkWorkButton}
          <span>({SVs.numberOfAttemptsLeft} attempts remaining)</span>
        </>
      );
    }
  }

  return (
    <React.Fragment>
      <a name={id} />

      <span id={id}>
        <div className="mathInputWrapper" style={{ cursor: mathInputWrapperCursor }}>
          <EditableMathField
            style={mathInputStyle}
            latex={rendererValue.current}
            config={{
              autoCommands:
                'alpha beta gamma delta epsilon zeta eta mu nu xi omega rho sigma tau phi chi psi omega iota kappa lambda Gamma Delta Xi Omega Sigma Phi Psi Omega Lambda sqrt pi Pi theta Theta integral infinity forall exists',
              autoOperatorNames:
                'arg deg det dim exp gcd hom ker lg lim ln log max min' +
                ' Pr' +
                ' cos cosh acos acosh arccos arccosh' +
                ' cot coth acot acoth arccot arccoth' +
                ' csc csch acsc acsch arccsc arccsch' +
                ' sec sech asec asech arcsec arcsech' +
                ' sin sinh asin asinh arcsin arcsinh' +
                ' tan tanh atan atanh arctan arctanh' +
                ' nPr nCr',
              handlers: {
                enter: handlePressEnter,
              },
              substituteTextarea: function () {
                textareaRef.current = document.createElement('textarea');
                textareaRef.current.disabled = SVs.disabled;
                textareaRef.current.addEventListener("focusout", (e) => {
                  let keyboard = document.getElementById("keyboard");
                  if (keyboard.contains(e.relatedTarget)) {
                    e.target.focus();
                  } else {
                    // remove focus
                  }
                }, false);
                return textareaRef.current;
              }
            }} //more commands go here
            onChange={(mField) => {
              onChangeHandler(mField.latex());
            }}
            onBlur={handleBlur}
            onFocus={handleFocus}
            mathquillDidMount={(mf) => {
              //console.log(">>> MathQuilMounted")
              setMathField(mf);
            }}
          />
        </div>
        {checkWorkButton}
      </span>
    </React.Fragment>
  );
}
