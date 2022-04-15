import React, { useRef, useState } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'

export default function ChoiceInput(props) {
  let { name, SVs, actions, children, sourceOfUpdate, ignoreUpdate, callAction } = useDoenetRender(props);

  ChoiceInput.baseStateVariable = "selectedIndices";

  const [rendererSelectedIndices, setRendererSelectedIndices] = useState(SVs.selectedIndices);

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

    //Assume we don't have a check work button
    let checkWorkButton = null;
    if (SVs.includeCheckWork) {

      if (validationState === "unvalidated") {
        if (disabled) {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        } else {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainBlue");
        }
        checkWorkButton = <button
          id={name + '_submit'}
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
          <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        </button>
      } else {
        if (SVs.showCorrectness) {
          if (validationState === "correct") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
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
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
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

    return <React.Fragment>
      <a name={name} />
      <select
        id={name}
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
      height: "23px",
      display: "inline-block",
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--mainBlue"),
      padding: "1px 6px 1px 6px",
      color: "white",
      fontWeight: "bold",
    }

    let checkworkComponent = null;

    if (SVs.includeCheckWork) {

      if (validationState === "unvalidated") {

        let checkWorkText = "Check Work";
        if (!SVs.showCorrectness) {
          checkWorkText = "Submit Response";
        }
        if (disabled) {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
        }
        checkworkComponent = (
          <button id={name + "_submit"}
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
            &nbsp;
            {checkWorkText}
          </button>);

      } else {
        if (SVs.showCorrectness) {
          if (validationState === "correct") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
            checkworkComponent = (
              <span id={name + "_correct"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faCheck} />
                &nbsp;
                Correct
              </span>);
          } else if (validationState === "incorrect") {
            checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
            checkworkComponent = (
              <span id={name + "_incorrect"}
                style={checkWorkStyle}
              >
                <FontAwesomeIcon icon={faTimes} />
                &nbsp;
                Incorrect
              </span>);
          } else if (validationState === "partialcorrect") {
            checkWorkStyle.backgroundColor = "#efab34";
            let percent = Math.round(SVs.creditAchieved * 100);
            let partialCreditContents = `${percent}% Correct`;

            checkworkComponent = (
              <span id={name + "_partial"}
                style={checkWorkStyle}
              >
                {partialCreditContents}
              </span>);
          }
        } else {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = (
            <span id={name + "_saved"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCloud} />
              &nbsp;
              Response Saved
            </span>);
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
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {

      checkworkComponent = <>
        {checkworkComponent}
        <span>
          (attempts remaining: {SVs.numberOfAttemptsLeft})
        </span>
      </>
    }

    let inputKey = name;
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
        return <li key={inputKey + '_choice' + (i + 1)}>
          <input
            type={inputType}
            id={keyBeginning + (i + 1) + "_input"}
            name={inputKey}
            value={i + 1}
            checked={rendererSelectedIndices.includes(i + 1)}
            onChange={onChangeHandler}
            disabled={disabled || svData.choicesDisabled[i]}
          />
          <label htmlFor={keyBeginning + (i + 1) + "_input"}>
            {child}
          </label>
        </li>
      });

    return <React.Fragment>
      <ol id={inputKey} style={listStyle}><a name={name} />{choiceDoenetTags}</ol>
      {checkworkComponent}
    </React.Fragment>

  }

}
