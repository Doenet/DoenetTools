import React, { useRef, useState, useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
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
import { getFromLatex, normalizeLatexString } from '../../Core/utils/math';

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
  let {name, SVs, actions} = useDoenetRender(props);
  const [latex, setLatex] = useState('');
  const [focused, setFocus] = useState(false);
  let mathExpression = me.fromAst(SVs.valueForDisplay);
  let latexValue = stripLatex(me.fromAst(SVs.valueForDisplay).toLatex());
  const [mathField, setMathField] = useState(null);
  let validationState = 'unvalidated';
  const setFocusedField = useSetRecoilState(focusedMathField);
  const setFocusedFieldReturn = useSetRecoilState(focusedMathFieldReturn);
  let valueToRevertTo = me.fromAst(SVs.value);
  let valueForDisplayToRevertTo = me.fromAst(SVs.valueForDisplay);
  const containerRef = useRecoilValue(palletRef);
  const toggleButtonRef = useRecoilValue(buttonRef);
  const functionTabRef = useRecoilValue(functionRef);

  if (latexValue === '\uFF3F') {
    latexValue = '';
  }

  let initializeChildrenOnConstruction = false;

  const calculateMathExpressionFromLatex = (text) => {
    let expression;

    text = normalizeLatexString(text, {
      unionFromU: SVs.unionFromU,
    });

    // replace ^25 with ^{2}5, since mathQuill uses standard latex conventions
    // unlike math-expression's latex parser
    text = text.replace(/\^(\w)/g, '^{$1}');

    let fromLatex = getFromLatex({
      functionSymbols: SVs.functionSymbols,
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
    let currentMathExpressionNormalized =
      calculateMathExpressionFromLatex(latexValue);

    latexValue = text;
    let newMathExpression = calculateMathExpressionFromLatex(text);
    if (!newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)) {
      mathExpression = newMathExpression;
      props.callAction({
        action:actions.updateImmediateValue,
        args:{mathExpression: newMathExpression.tree}
      });
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
    valueToRevertTo = me.fromAst(SVs.immediateValue);
    valueForDisplayToRevertTo = mathExpression;

    // this.latexValueToRevertTo = this.latexValue;
    if (!me.fromAst(SVs.value).equalsViaSyntax(me.fromAst(SVs.immediateValue))) {
      props.callAction({
        action:actions.updateValue,
      });
    }
    if (SVs.includeCheckWork && validationState === 'unvalidated') {
      props.callAction({
        action:actions.submitAnswer,
      });
    }
  };

  const handleFocus = (e) => {
    setFocus(true);
    console.log('>>> ', mathField);
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
      valueToRevertTo = me.fromAst(SVs.immediateValue);
      valueForDisplayToRevertTo = mathExpression;
      // this.latexValueToRevertTo = this.latexValue;
      if (!me.fromAst(SVs.value).equalsViaSyntax(me.fromAst(SVs.immediateValue))) {
        props.callAction({
          action:actions.updateValue,
        });
      }

      setFocus(false);
      //console.log(">>>", e.target, e.currentTarget, e.relatedTarget);
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
      setFocusedFieldReturn(() => handleDefaultVirtualKeyboardReturn);
    }
  };

  const onChangeHandler = (e) => {
    updateImmediateValueFromLatex(e);
  };

  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  // const inputKey = this.componentName + '_input';

  let surroundingBorderColor = '#efefef';
  if (focused) {
    surroundingBorderColor = '#82a5ff';
  }

  if (!valueForDisplayToRevertTo.equalsViaSyntax(me.fromAst(SVs.valueForDisplay))) {
    // The valueForDisplay coming from the mathInput component
    // is not the same as the renderer's value
    // so we change the renderer's value to match

    mathExpression = me.fromAst(SVs.valueForDisplay);
    latexValue = stripLatex(mathExpression.toLatex());
    if (latexValue === '\uFF3F') {
      latexValue = '';
    }
    valueToRevertTo = me.fromAst(SVs.value);
    valueForDisplayToRevertTo = me.fromAst(SVs.valueForDisplay);
    // this.latexValueToRevertTo = this.latexValue;
  }

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
  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
    if (validationState === 'unvalidated') {
      checkWorkStyle.backgroundColor = 'rgb(2, 117, 216)';
      checkWorkButton = (
        <button
          id={'_submit'}
          tabIndex="0"
          //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          style={checkWorkStyle}
          onClick={()=>props.callAction({
            action:actions.submitAnswer,
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.callAction({
                action:actions.submitAnswer,
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
              id={'_correct'}
              style={checkWorkStyle}
              //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
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
              id={'_partial'}
              style={checkWorkStyle}
              //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
            >
              {partialCreditContents}
            </span>
          );
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = 'rgb(187, 0, 0)';
          checkWorkButton = (
            <span
              id={'_incorrect'}
              style={checkWorkStyle}
              //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
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
            id={'_saved'}
            style={checkWorkStyle}
            //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          >
            <FontAwesomeIcon icon={faCloud} />
          </span>
        );
      }
    }
  }

  return (
    <React.Fragment>
      <a />

      <span className="textInputSurroundingBox">
        <span style={{ margin: '10px' }}>
          <EditableMathField
            latex={latexValue}
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
            onChange={(mathField) => {
              onChangeHandler(mathField.latex());
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

function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, '');

  return s;
}
