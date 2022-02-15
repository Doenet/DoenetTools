import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'


export default function Answer(props) {
  let { name, SVs, actions, children, callAction } = useDoenetRender(props);


  if (SVs.hidden) {
    return null;
  }

  let disabled = SVs.disabled;

  let submitAnswer = () => callAction({
    action: actions.submitAnswer
  })
  if (SVs.submitAllAnswersAtAncestor) {
    submitAnswer = () => callAction({
      action: actions.submitAllAnswers
    })
  }

  // BADBADBAD: need to redo how getting the input child
  // without using the internal guts of componentInstructions
  // is just asking for trouble

  let inputChildrenToRender = null;
  if (SVs.inputChildren.length > 0) {
    let inputChildNames = SVs.inputChildren.map(x => x.componentName);
    inputChildrenToRender = children.filter(
      child => typeof child !== "string" && inputChildNames.includes(child.props.componentInstructions.componentName)
    )
  }


  if (!SVs.delegateCheckWork) {

    let validationState = "unvalidated";
    if (SVs.justSubmitted || SVs.numberOfAttemptsLeft < 1) {
      if (SVs.creditAchieved === 1) {
        validationState = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState = "incorrect";
      } else {
        validationState = "partialcorrect";
      }
    }

    let checkWorkStyle = {
      height: "23px",
      display: "inline-block",
      backgroundColor: "rgb(2, 117, 216)",
      padding: "1px 6px 1px 6px",
      color: "white",
      fontWeight: "bold",
      //marginBottom: "30px",  //Space after check work
    }

    if (disabled) {
      checkWorkStyle.backgroundColor = "rgb(200,200,200)";
    }

    let checkWorkText = "Check Work";
    if (!SVs.showCorrectness) {
      checkWorkText = "Submit Response";
    }
    let checkworkComponent = (
      <button id={name + "_submit"}
        tabIndex="0"
        disabled={disabled}
        style={checkWorkStyle}
        onClick={submitAnswer}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            submitAnswer();
          }
        }}
      >
        <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        &nbsp;
        {checkWorkText}
      </button>);

    if (SVs.showCorrectness) {
      if (validationState === "correct") {
        checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
        checkworkComponent = (
          <span id={name + "_correct"}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCheck} />
            &nbsp;
            Correct
          </span>);
      } else if (validationState === "incorrect") {
        checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
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
      // showCorrectness is false
      if (validationState !== "unvalidated") {
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

    return <span id={name}>
      <a name={name} />
      {inputChildrenToRender}
      {checkworkComponent}
    </span>;
  } else {
    return <span id={name}><a name={name} />{inputChildrenToRender}</span>;
  }

}