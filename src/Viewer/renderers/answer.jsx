import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
// import Button from '../../_reactComponents/PanelHeaderComponents/Button.jsx';
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
      // height: "23px",
      // display: "inline-block",
      cursor: 'pointer',
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--mainBlue"),
      // padding: "1px 6px 1px 6px",
      // color: "white",
      // fontWeight: "bold",
      //marginBottom: "30px",  //Space after check work
    }

    const Button = styled.button `
      height: 24px;
      display: inline-block;
      padding: 1px 6px 1px 6px;
      color: white;
      font-size: 14px;
      /* font-weight: bold; */
      padding: 2px;
      margin-right: 4px;
      border: var(--mainBorder);
      border-radius: var(--mainBorderRadius);
    `

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
        // backgroundColor={props.backgroundColor}
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