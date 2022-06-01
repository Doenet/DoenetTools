import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Button = styled.button`
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
export default React.memo(function Answer(props) {
  let {name, SVs, actions, children, callAction} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let disabled = SVs.disabled;
  let submitAnswer = () => callAction({
    action: actions.submitAnswer
  });
  if (SVs.submitAllAnswersAtAncestor) {
    submitAnswer = () => callAction({
      action: actions.submitAllAnswers
    });
  }
  let inputChildrenToRender = null;
  if (SVs.inputChildren.length > 0) {
    let inputChildNames = SVs.inputChildren.map((x) => x.componentName);
    inputChildrenToRender = children.filter((child) => typeof child !== "string" && inputChildNames.includes(child.props.componentInstructions.componentName));
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
      cursor: "pointer"
    };
    if (disabled) {
      checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
    }
    let checkWorkText = "Check Work";
    if (!SVs.showCorrectness) {
      checkWorkText = "Submit Response";
    }
    let checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
      id: name + "_submit",
      tabIndex: "0",
      disabled,
      style: checkWorkStyle,
      onClick: submitAnswer,
      onKeyPress: (e) => {
        if (e.key === "Enter") {
          submitAnswer();
        }
      }
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      style: {marginRight: "4px", paddingLeft: "2px"},
      icon: faLevelDownAlt,
      transform: {rotate: 90}
    }), " ", checkWorkText);
    if (SVs.showCorrectness) {
      if (validationState === "correct") {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
        checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
          id: name + "_correct",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCheck
        }), "  Correct");
      } else if (validationState === "incorrect") {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
        checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
          id: name + "_incorrect",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faTimes
        }), "  Incorrect");
      } else if (validationState === "partialcorrect") {
        checkWorkStyle.backgroundColor = "#efab34";
        let percent = Math.round(SVs.creditAchieved * 100);
        let partialCreditContents = `${percent}% Correct`;
        checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
          id: name + "_partial",
          style: checkWorkStyle
        }, partialCreditContents);
      }
    } else {
      if (validationState !== "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkworkComponent = /* @__PURE__ */ React.createElement(Button, {
          id: name + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }), "  Response Saved");
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(1 attempt remaining)"));
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(", SVs.numberOfAttemptsLeft, " attempts remaining)"));
    }
    return /* @__PURE__ */ React.createElement("span", {
      id: name,
      style: {display: "flex"}
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), inputChildrenToRender, checkworkComponent);
  } else {
    return /* @__PURE__ */ React.createElement("span", {
      id: name,
      style: {marginBottom: "12px"}
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), inputChildrenToRender);
  }
});
