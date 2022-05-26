import React, { useRef, useState } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { rendererState } from './useDoenetRenderer';
import { useSetRecoilState } from 'recoil';
import ToggleButton from '../../_reactComponents/PanelHeaderComponents/ToggleButton';

export default React.memo(function BooleanInput(props) {
  let { name, SVs, actions, ignoreUpdate, rendererName, callAction } = useDoenetRender(props);

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
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {

      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (attempts remaining: {SVs.numberOfAttemptsLeft})
        </span>
      </>
    }
  }


  let input;
  if (SVs.asToggleButton) {
    input =
      <ToggleButton
        id={inputKey}
        key={inputKey}
        isSelected={rendererValue}
        onClick={onChangeHandler}
        value={SVs.label}
        disabled={disabled}
      />;
  } else {
    input = <label>
      <input
        type="checkbox"
        key={inputKey}
        id={inputKey}
        checked={rendererValue}
        onChange={onChangeHandler}
        disabled={disabled}
      />
      {SVs.label}
    </label>;
  }

  return <React.Fragment>
    <span id={name}>
      <a name={name} />
      {input}
      {checkWorkButton}
    </span>
  </React.Fragment>

})