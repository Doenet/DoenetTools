import React, { useRef, useState, useEffect } from 'react';
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
  let { name, SVs, actions } = useDoenetRender(props);

  // const [focused, setFocus] = useState(false);
  const focused = useRef(false);

  const [mathField, setMathField] = useState(null);

  const setFocusedField = useSetRecoilState(focusedMathField);
  const setFocusedFieldReturn = useSetRecoilState(focusedMathFieldReturn);
  const containerRef = useRecoilValue(palletRef);
  const toggleButtonRef = useRecoilValue(buttonRef);
  const functionTabRef = useRecoilValue(functionRef);

  let valueToRevertTo = useRef(me.fromAst(SVs.value));
  let valueForDisplayToRevertTo = useRef(me.fromAst(SVs.valueForDisplay));

  let validationState = 'unvalidated';


  let latexValueSetInRender = useRef(false);
  let latexValueSetFromValueForDisplay = useRef(false);

  let mathExpression = useRef(me.fromAst(SVs.valueForDisplay));

  let latexValue = useRef(SVs.rawRendererValue && SVs.rawRendererValue !== '\uFF3F' ? SVs.rawRendererValue : "");

  // create refs for value and immediate value
  // so that handlePressEnter can access their current value
  let immediateValue = useRef(null);
  immediateValue.current = SVs.immediateValue;
  let value = useRef(null);
  value.current = SVs.value;

  // create ref for unionFromU
  // so that calculateMathExpressionFromLatex can access its current value
  let unionFromU = useRef(null);
  unionFromU.current = SVs.unionFromU;

  console.log(`For ${name}, immediateValue`, SVs.immediateValue, 'rawRendererValue', SVs.rawRendererValue)

  const calculateMathExpressionFromLatex = (text) => {
    let expression;

    text = normalizeLatexString(text, {
      unionFromU: unionFromU.current,
    });

    // replace ^25 with ^{2}5, since mathQuill uses standard latex conventions
    // unlike math-expression's latex parser
    text = text.replace(/\^(\w)/g, '^{$1}');

    let fromLatex = getFromLatex({
      functionSymbols: SVs.functionSymbols,
      splitSymbols: SVs.splitSymbols,
    });

    try {
      expression = fromLatex(text);
    } catch (e) {
      // TODO: error on bad text
      expression = me.fromAst('\uFF3F');
    }
    return expression;
  };

  const updateImmediateValueFromLatex = (text) => {
    // The check whether or not to call the updateImmediateValue action is subtle.
    // We need to achieve two effects:
    // 1. Do not call the updateImmediateValue action
    // when mathQuill invokes onChange from render()
    // due to differences in latex format between it and math-expressions.
    // 2. Call the updateImmediateValue action
    // whenever the user types anything into the input
    // even if it does not change the underlying math expression

    let currentMathExpressionNormalized =
      calculateMathExpressionFromLatex(latexValue.current);

    let newMathExpression = calculateMathExpressionFromLatex(text);

    let rawValueChanged = text !== latexValue.current || latexValueSetFromValueForDisplay.current;
    let transientForRaw = !latexValueSetInRender.current;

    let actuallyUpdate = !newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)
      || (!latexValueSetInRender.current && text !== latexValue.current);


    // Note: must set latexValue.current before calling updateImmediateValue action

    latexValue.current = text;
    latexValueSetInRender.current = false;
    latexValueSetFromValueForDisplay.current = false;


    console.log(`For ${name}, setting rawRendererValue 1`, latexValue.current)

    if (actuallyUpdate) {
      mathExpression.current = newMathExpression;
      props.callAction({
        action: actions.updateImmediateValue,
        args: {
          mathExpression: newMathExpression.tree,
          rawRendererValue: latexValue.current,
          transient: true,
          skippable: true,
        }
      })
    } else if (rawValueChanged) {
      props.callAction({
        action: actions.updateRawValue,
        args: {
          rawRendererValue: latexValue.current,
          transient: transientForRaw,
          skippable: transientForRaw
        }
      })

    }

  };

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

    valueToRevertTo.current = me.fromAst(immediateValue.current);
    valueForDisplayToRevertTo.current = mathExpression.current;

    if (!me.fromAst(value.current).equalsViaSyntax(valueToRevertTo.current)) {
      props.callAction({
        action: actions.updateValue,
      });
    } else {
      console.log(`For ${name}, setting rawRendererValue 2`, latexValue.current)

      props.callAction({
        action: actions.updateRawValue,
        args: {
          rawRendererValue: latexValue.current,
          transient: false
        }
      })
    }
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
      containerRef &&
      containerRef.current &&
      containerRef.current.contains(e.relatedTarget)
    ) {
      console.log('>>> clicked inside the panel');
    } else if (
      toggleButtonRef &&
      toggleButtonRef.current &&
      toggleButtonRef.current.contains(e.relatedTarget)
    ) {
      console.log('>>> clicked inside the button');
    } else if (
      functionTabRef &&
      functionTabRef.current &&
      functionTabRef.current.contains(e.relatedTarget)
    ) {
      console.log('>>> clicked inside the panel functional panel');
    } else {


      valueToRevertTo.current = me.fromAst(SVs.immediateValue);
      valueForDisplayToRevertTo.current = mathExpression.current;

      if (!me.fromAst(SVs.value).equalsViaSyntax(me.fromAst(SVs.immediateValue))) {
        props.callAction({
          action: actions.updateValue,
        });
      } else {
        console.log(`For ${name}, setting rawRendererValue 3`, latexValue.current)

        props.callAction({
          action: actions.updateRawValue,
          args: {
            rawRendererValue: latexValue.current,
            transient: false
          }
        })
      }

      // setFocus(false);
      focus.current = false;
      //console.log(">>>", e.target, e.currentTarget, e.relatedTarget);
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
      setFocusedFieldReturn(() => handleDefaultVirtualKeyboardReturn);
    }
  };

  const onChangeHandler = (e) => {
    console.log(`For ${name}, on change handler`, e)
    updateImmediateValueFromLatex(e);
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

  if (!valueForDisplayToRevertTo.current.equalsViaSyntax(me.fromAst(SVs.valueForDisplay))) {
    // The valueForDisplay coming from the mathInput component
    // is not the same as the renderer's value
    // so we change the renderer's value to match

    mathExpression.current = me.fromAst(SVs.valueForDisplay);
    latexValue.current = stripLatex(mathExpression.current.toLatex());
    if (latexValue.current === '\uFF3F') {
      latexValue.current = '';
    }

    latexValueSetInRender.current = true;
    latexValueSetFromValueForDisplay.current = true;
    valueToRevertTo.current = me.fromAst(SVs.value);
    valueForDisplayToRevertTo.current = me.fromAst(SVs.valueForDisplay);
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
      <a />


      <span className="textInputSurroundingBox" id={name}>
        <span style={{ margin: '10px' }}>
          <EditableMathField
            latex={latexValue.current}
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
          {/* <p>{this.mathExpression.toLatex()}</p> */}
        </span>
        {checkWorkButton}
        {/* {this.textValue ? 
      <Prev style = {{top: this.state.previewTopOffset+"px", left: this.state.previewLeftOffset+"px"}} onMouseDown = {this.handleDragEnter} onMouseMove = {this.handleDragThrough} onMouseUp = {this.handleDragExit} onMouseLeave = {this.handleDragExit}>
        <div>
          <MathJax.Context input='tex'>
              <div>
                  <MathJax.Node inline>{this.textValue ? this.previewValue : ''}</MathJax.Node>
              </div>
          </MathJax.Context>
        </div>
      </Prev> : 
      null} */}
      </span>
    </React.Fragment>
  );
}

