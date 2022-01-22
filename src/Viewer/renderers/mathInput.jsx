import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import useDoenetRender from './useDoenetRenderer';
import me from 'math-expressions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud,
  faPercentage,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import mathquill from 'react-mathquill';
mathquill.addStyles(); //Styling for react-mathquill input field
let EditableMathField = mathquill.EditableMathField;
import {
  focusedMathField,
  focusedMathFieldReturn,
  palletRef,
  buttonRef,
  functionRef,
} from '../../Tools/_framework/Footers/MathInputSelector';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getFromLatex, normalizeLatexString, stripLatex } from '../../Core/utils/math';

// const Prev = styled.div`
//   font-size: 23px;
//   // min-height: 30px;
//   background: rgba(0, 0, 0, 0.8);
//   width: auto;
//   display: inline-block;
//   border-radius: 5px;
//   color: white;
//   // line-height: 0px;
//   z-index: 10;
//   padding: 3px;
//   // position: absolute;
//   user-select: none;
//   // left: ${props => `${props.left}px`};
//   // top: ${props => `${props.top}px`};
// `;

export default function MathInput(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  // const [focused, setFocus] = useState(false);
  const focused = useRef(false);

  const [mathField, setMathField] = useState(null);

  const setFocusedField = useSetRecoilState(focusedMathField);
  const setFocusedFieldReturn = useSetRecoilState(focusedMathFieldReturn);
  const containerRef = useRecoilValue(palletRef);
  const toggleButtonRef = useRecoilValue(buttonRef);
  const functionTabRef = useRecoilValue(functionRef);

  const updatesToIgnore = useRef({});


  let validationState = 'unvalidated';


  let rawRendererValue = useRef(SVs.rawRendererValue);

  let sourceActionId = sourceOfUpdate.sourceInformation?.[name]?.actionId;

  // only apply the update if it isn't marked to be ignored
  // TODO: skip this earlier (in DoenetViewer?) so we don't even have to rerender
  if (updatesToIgnore.current[sourceActionId] !== SVs.rawRendererValue) {
    rawRendererValue.current = SVs.rawRendererValue;

    // since value was changed, don't ignore any pending changes
    // as we changed the state used to when determining that they could be ignored
    updatesToIgnore.current = {};
  } else {
    delete updatesToIgnore.current[sourceActionId];
  }


  const updateValidationState = () => {
    validationState = 'unvalidated';
    if (SVs.valueHasBeenValidated) {
      if (SVs.creditAchieved === 1) {
        validationState = 'correct';
      } else if (SVs.creditAchieved === 0) {
        validationState = 'incorrect';
      } else {
        validationState = 'partialcorrect';
      }
    }
  };
  const handleVirtualKeyboardClick = (text) => {
    mathField.focus();
    if (!text) {
      console.log('Empty value');

      return;
    }
    if (text.split(' ')[0] == 'cmd') {
      mathField.cmd(text.split(' ')[1]);
    } else if (text.split(' ')[0] == 'write') {
      mathField.write(text.split(' ')[1]);
    } else if (text.split(' ')[0] == 'keystroke') {
      mathField.keystroke(text.split(' ')[1]);
    } else if (text.split(' ')[0] == 'type') {
      mathField.typedText(text.split(' ')[1]);
    }
  };

  const handleDefaultVirtualKeyboardClick = (text) => {
    console.log('no mathinput field focused');
  };

  const handleDefaultVirtualKeyboardReturn = (text) => {
    console.log('no mathinput field focused');
  };

  const handlePressEnter = (e) => {

    let actionId = nanoid();

    // add to updates to ignore so don't apply change again
    // if it comes back from core without any changes
    // (possibly after a delay)
    updatesToIgnore.current[actionId] = rawRendererValue.current;

    props.callAction({
      action: actions.updateValue,
      args: { actionId }
    });

    if (SVs.includeCheckWork && validationState === 'unvalidated') {
      props.callAction({
        action: actions.submitAnswer,
      });
    }
  };

  const handleFocus = (e) => {
    focus.current = true; //setFocus(true);
    setFocusedField(() => handleVirtualKeyboardClick);
    setFocusedFieldReturn(() => handlePressEnter);
  };

  const handleBlur = (e) => {
    if (
      containerRef?.current?.contains(e.relatedTarget)
    ) {
      console.log('>>> clicked inside the panel');
    } else if (
      toggleButtonRef?.current?.contains(e.relatedTarget)
    ) {
      console.log('>>> clicked inside the button');
    } else if (
      functionTabRef?.current?.contains(e.relatedTarget)
    ) {
      console.log('>>> clicked inside the panel functional panel');
    } else {

      let actionId = nanoid();

      // add to updates to ignore so don't apply change again
      // if it comes back from core without any changes
      // (possibly after a delay)
      updatesToIgnore.current[actionId] = rawRendererValue.current;

      props.callAction({
        action: actions.updateValue,
        args: { actionId }
      });

      // setFocus(false);
      focus.current = false;
      //console.log(">>>", e.target, e.currentTarget, e.relatedTarget);
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
      setFocusedFieldReturn(() => handleDefaultVirtualKeyboardReturn);
    }
  };

  const onChangeHandler = (e) => {

    if (e !== rawRendererValue.current) {
      let actionId = nanoid();

      // add to updates to ignore so don't apply change again
      // if it comes back from core without any changes
      // (possibly after a delay)
      updatesToIgnore.current[actionId] = e;

      rawRendererValue.current = e;

      props.callAction({
        action: actions.updateRawValue,
        args: {
          rawRendererValue: e,
          actionId,
        }
      })
    }
  };

  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  // const inputKey = this.componentName + '_input';

  let surroundingBorderColor = '#efefef';
  if (focused.current) {
    surroundingBorderColor = '#82a5ff';
  }


  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {

    let checkWorkStyle = {
      position: 'relative',
      width: '30px',
      height: '24px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'inline-block',
      textAlign: 'center',
      top: '3px',
      padding: '2px',
      zIndex: '0',
    };

    if (validationState === 'unvalidated') {
      if (SVs.disabled) {
        checkWorkStyle.backgroundColor = "rgb(200,200,200)";
      } else {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      }
      checkWorkButton = (
        <button
          id={name + '_submit'}
          tabIndex="0"
          disabled={SVs.disabled}
          style={checkWorkStyle}
          onClick={() => props.callAction({
            action: actions.submitAnswer,
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.callAction({
                action: actions.submitAnswer,
              });
            }
          }}
        >
          <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        </button>
      );
    } else {
      if (SVs.showCorrectness) {
        if (validationState === 'correct') {
          checkWorkStyle.backgroundColor = 'rgb(92, 184, 92)';
          checkWorkButton = (
            <span
              id={name + '_correct'}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCheck} />
            </span>
          );
        } else if (validationState === 'partialcorrect') {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = '50px';

          checkWorkStyle.backgroundColor = '#efab34';
          checkWorkButton = (
            <span
              id={name + '_partial'}
              style={checkWorkStyle}
            >
              {partialCreditContents}
            </span>
          );
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = 'rgb(187, 0, 0)';
          checkWorkButton = (
            <span
              id={name + '_incorrect'}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          );
        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = 'rgb(74, 3, 217)';
        checkWorkButton = (
          <span
            id={name + '_saved'}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCloud} />
          </span>
        );
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

  return (
    <React.Fragment>
      <a name={name} />

      <span className="textInputSurroundingBox" id={name}>
        <span style={{ margin: '10px' }}>
          <EditableMathField
            latex={rawRendererValue.current}
            config={{
              autoCommands:
                'alpha beta gamma delta epsilon zeta eta mu nu xi omega rho sigma tau phi chi psi omega iota kappa lambda Gamma Delta Xi Omega Sigma Phi Psi Omega Lambda sqrt pi Pi theta Theta integral infinity',
              autoOperatorNames:
                'arg deg det dim exp gcd hom ker lg lim ln log max min' +
                ' Pr' +
                ' sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth' +
                ' sin cos tan sec cosec csc cotan cot ctg' +
                ' arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg' +
                ' sinh cosh tanh sech cosech csch cotanh coth ctgh' +
                ' arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh' +
                ' arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh',
              handlers: {
                enter: handlePressEnter,
              },
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
        </span>
        {checkWorkButton}
      </span>
    </React.Fragment>
  );
}

