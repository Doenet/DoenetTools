import React, { useRef, useState } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'
import { rendererState } from '../useDoenetRenderer';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import './choiceInput.css';

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
  position: relative;
  /* width: 24px; */
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

export default React.memo(function ChoiceInput(props) {
  let { name, id, SVs, actions, children, sourceOfUpdate, ignoreUpdate, rendererName, callAction } = useDoenetRender(props);

  ChoiceInput.baseStateVariable = "selectedIndices";

  const [rendererSelectedIndices, setRendererSelectedIndices] = useState(SVs.selectedIndices);

  const setRendererState = useSetRecoilState(rendererState(rendererName));

  let selectedIndicesWhenSetState = useRef(null);

  if (!ignoreUpdate && selectedIndicesWhenSetState.current !== SVs.selectedIndices) {
    // console.log(`setting value to ${SVs.immediateValue}`)
    setRendererSelectedIndices(SVs.selectedIndices);
    selectedIndicesWhenSetState.current = SVs.selectedIndices;
  } else {
    selectedIndicesWhenSetState.current = null;
  }


  let validationState = "unvalidated";
  if (SVs.valueHasBeenValidated || SVs.numberOfAttemptsLeft < 1) {
    if (SVs.creditAchieved === 1) {
      validationState = "correct";
    } else if (SVs.creditAchieved === 0) {
      validationState = "incorrect";
    } else {
      validationState = "partialcorrect";
    }
  }

  function onChangeHandler(e) {

    let newSelectedIndices = [];

    if (SVs.inline) {
      if (e.target.value) {
        newSelectedIndices = Array.from(e.target.selectedOptions, option => Number(option.value))
      }
    } else {
      if (SVs.selectMultiple) {
        newSelectedIndices = [...rendererSelectedIndices];
        let index = Number(e.target.value);
        if (e.target.checked) {
          if (!newSelectedIndices.includes(index)) {
            newSelectedIndices.push(index);
            newSelectedIndices.sort((a, b) => a - b);
          }
        } else {
          let i = newSelectedIndices.indexOf(index);
          if (i !== -1) {
            newSelectedIndices.splice(i, 1);
          }

        }
      } else {
        newSelectedIndices = [Number(e.target.value)];
      }
    }

    if (rendererSelectedIndices.length !== newSelectedIndices.length ||
      rendererSelectedIndices.some((v, i) => v != newSelectedIndices[i])
    ) {


      setRendererSelectedIndices(newSelectedIndices);
      selectedIndicesWhenSetState.current = SVs.selectedIndices;

      setRendererState((was) => {
        let newObj = { ...was };
        newObj.ignoreUpdate = true;
        return newObj;
      })

      callAction({
        action: actions.updateSelectedIndices,
        args: {
          selectedIndices: newSelectedIndices,
        },
        baseVariableValue: newSelectedIndices,
      })
    }
  }


  if (SVs.hidden) {
    return null;
  }


  let disabled = SVs.disabled;

  if (SVs.inline) {

    let checkWorkStyle = {
      cursor: 'pointer',
      padding: "1px 6px 1px 6px",
      width: "24px"
    }

    //Assume we don't have a check work button
    let checkWorkButton = null;
    if (SVs.includeCheckWork && !SVs.suppressCheckwork) {

      if (validationState === "unvalidated") {
        if (disabled) {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        }
        checkWorkButton = <Button
          id={id + '_submit'}
          disabled={disabled}
          tabIndex="0"
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
          <FontAwesomeIcon style={{ /*marginRight: "4px", paddingLeft: "2px"*/ }} icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        </Button>
      } else {
        if (SVs.showCorrectness) {
          if (validationState === "correct") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
            checkWorkButton = <Button
              id={id + '_correct'}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          } else if (validationState === "partialcorrect") {
            //partial credit

            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent} %`;
            checkWorkStyle.width = '44px';

            checkWorkStyle.backgroundColor = "#efab34";
            checkWorkButton = <Button
              id={id + '_partial'}
              style={checkWorkStyle}
            >{partialCreditContents}</Button>
          } else {
            //incorrect
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
            checkWorkButton = <Button
              id={id + '_incorrect'}
              style={checkWorkStyle}
            ><FontAwesomeIcon icon={faTimes} /></Button>

          }
        } else {
          // showCorrectness is false
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkWorkStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
          checkWorkButton = <Button
            id={id + '_saved'}
            style={checkWorkStyle}
          ><FontAwesomeIcon icon={faCloud} /></Button>

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
      }
      else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
        checkWorkButton = <>
          {checkWorkButton}
          <span>
            ({SVs.numberOfAttemptsLeft} attempts remaining)
          </span>
        </>
      }
    }

    let svData = SVs;
    let optionsList = SVs.choiceTexts.map(function (s, i) {
      if (svData.choicesHidden[i]) {
        return null;
      }
      return <option key={i + 1} value={i + 1} disabled={svData.choicesDisabled[i]} >{s}</option>
    });


    let value = rendererSelectedIndices;
    if (value === undefined) {
      value = "";
    } else if (!SVs.selectMultiple) {
      value = value[0];
      if (value === undefined) {
        value = "";
      }
    }

    // inline="true"
    return <React.Fragment>
      <a name={id} />
      <select className="custom-select"
        id={id}
        onChange={onChangeHandler}
        value={value}
        disabled={disabled}
        multiple={SVs.selectMultiple}
      >
        <option hidden={true} value="">{SVs.placeHolder}</option>
        {optionsList}
      </select>
      {checkWorkButton}
    </React.Fragment>
  } else {


    let checkWorkStyle = {
      height: "24px",
      display: "inline-block",
      padding: "1px 6px 1px 6px",
      cursor: 'pointer',
      // fontWeight: "bold",
    }

    let checkworkComponent = null;

    if (SVs.includeCheckWork && !SVs.suppressCheckwork) {

      if (validationState === "unvalidated") {

        let checkWorkText = SVs.submitLabel;
        if (!SVs.showCorrectness) {
          checkWorkText = SVs.submitLabelNoCorrectness;
        }
        if (disabled) {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        }
        checkworkComponent = (
          <Button id={id + "_submit"}
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
            <FontAwesomeIcon style={{ /*marginRight: "4px", paddingLeft: "2px"*/ }} icon={faLevelDownAlt} transform={{ rotate: 90 }} />
            &nbsp;
            {checkWorkText}
          </Button>);

      } else {
        if (SVs.showCorrectness) {
          if (validationState === "correct") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
            checkworkComponent = (
              <Button id={id + "_correct"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faCheck} />
                &nbsp;
                Correct
              </Button>);
          } else if (validationState === "incorrect") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
            checkworkComponent = (
              <Button id={id + "_incorrect"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faTimes} />
                &nbsp;
                Incorrect
              </Button>);
          } else if (validationState === "partialcorrect") {
            checkWorkStyle.backgroundColor = "#efab34";
            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent}% Correct`;

            checkworkComponent = (
              <Button id={id + "_partial"}
                style={checkWorkStyle}
              >
                {partialCreditContents}
              </Button>);
          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = (
            <Button id={id + "_saved"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCloud} />
              &nbsp;
              Response Saved
            </Button>);
        }
      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkworkComponent = <>
        {checkworkComponent}
        <span>
          (no attempts remaining)
        </span>
      </>
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkworkComponent = <>
        {checkworkComponent}
        <span>
          (1 attempt remaining)
        </span>
      </>
    }
    else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkworkComponent = <>
        {checkworkComponent}
        <span>
          ({SVs.numberOfAttemptsLeft} attempts remaining)
        </span>
      </>
    }

    let inputKey = id;
    let listStyle = {
      listStyleType: "none"
    }

    let keyBeginning = inputKey + '_choice';
    let inputType = 'radio';
    if (SVs.selectMultiple) {
      inputType = 'checkbox';
    }

    let svData = SVs;

    let choiceDoenetTags = SVs.choiceOrder
      .map(v => children[v - 1])
      .map(function (child, i) {
        if (svData.choicesHidden[i]) {
          return null;
        }
        if (inputType == 'radio') { // selectMultiple="false"
          let radioDisabled = disabled || svData.choicesDisabled[i]
          let radioClassName = "radio-checkmark";
          if (radioDisabled) {
            radioClassName += " radio-checkmark-disabled"
          }
          return <label className="radio-container" key={inputKey + '_choice' + (i + 1)}>
            <input
              type="radio"
              id={keyBeginning + (i + 1) + "_input"}
              name={inputKey}
              value={i + 1}
              checked={rendererSelectedIndices.includes(i + 1)}
              onChange={onChangeHandler}
              disabled={radioDisabled}
            />
            <span className={radioClassName} />
            <label htmlFor={keyBeginning + (i + 1) + "_input"} style={{ marginLeft: "2px" }}>
              {child}
            </label>
          </label>

        } else if (inputType == 'checkbox') { // selectMultiple="true"
          let checkboxDisabled = disabled || svData.choicesDisabled[i]
          let checkboxClassName = "checkbox-checkmark";
          if (checkboxDisabled) {
            checkboxClassName += " checkbox-checkmark-disabled"
          }
          return <label className="checkbox-container" key={inputKey + '_choice' + (i + 1)}>
            <input
              type="checkbox"
              id={keyBeginning + (i + 1) + "_input"}
              name={inputKey}
              value={i + 1}
              checked={rendererSelectedIndices.includes(i + 1)}
              onChange={onChangeHandler}
              disabled={disabled || svData.choicesDisabled[i]}
            />
            <span className={checkboxClassName} />
            <label htmlFor={keyBeginning + (i + 1) + "_input"} style={{ marginLeft: "2px" }}>
              {child}
            </label>
          </label>
        }
      });

    return <React.Fragment>
      <ol id={inputKey} style={listStyle}><a name={id} />{choiceDoenetTags}</ol>
      {checkworkComponent}
    </React.Fragment>

  }

})
