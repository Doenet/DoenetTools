import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

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
      cursor: 'pointer',
    }

    // Moved most of checkWorkStyle styling into Button
    const Button = styled.button `
      position: relative;
      height: 24px;
      display: inline-block;
      color: white;
      background-color: var(--mainBlue);
      /* padding: 2px; */
      /* border: var(--mainBorder); */
      border: none;
      border-radius: var(--mainBorderRadius);
      margin: 0px 10px 12px 10px;

      &:hover {
        background-color: var(--lightBlue);
        color: black;
      };
    `;

    if (disabled) {
      checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
    }

    let checkWorkText = "Check Work";
    if (!SVs.showCorrectness) {
      checkWorkText = "Submit Response";
    }
    let checkworkComponent = (
      <Button id={name + "_submit"}
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
        <FontAwesomeIcon style={{marginRight: "4px", paddingLeft: "2px"}} icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        &nbsp;
        {checkWorkText}
      </Button>);

    if (SVs.showCorrectness) {
      if (validationState === "correct") {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
        checkworkComponent = (
          <Button id={name + "_correct"}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCheck} />
            &nbsp;
            Correct
          </Button>);
      } else if (validationState === "incorrect") {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
        checkworkComponent = (
          <Button id={name + "_incorrect"}
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
          <Button id={name + "_partial"}
            style={checkWorkStyle}
          >
            {partialCreditContents}
          </Button>);
      }
    } else {
      // showCorrectness is false
      if (validationState !== "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkworkComponent = (
          <Button id={name + "_saved"}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCloud} />
            &nbsp;
            Response Saved
          </Button>);
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
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkworkComponent = <>
        {checkworkComponent}
        <span>
          ({SVs.numberOfAttemptsLeft} attempts remaining)
        </span>
      </>
    }

    return <span id={name} style={{display: "flex"}}>
      <a name={name} />
      {inputChildrenToRender}
      {checkworkComponent}
    </span>;
  } else {
    return <span id={name} style={{marginBottom: "12px"}}><a name={name} />{inputChildrenToRender}</span>;
  }

}