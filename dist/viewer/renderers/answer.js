import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Answer(props) {
  let {name, SVs, actions, children, sourceOfUpdate} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let disabled = SVs.disabled;
  let submitAnswer = () => props.callAction({
    action: actions.submitAnswer
  });
  if (SVs.submitAllAnswersAtAncestor) {
    submitAnswer = () => props.callAction({
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
      height: "23px",
      display: "inline-block",
      backgroundColor: "rgb(2, 117, 216)",
      padding: "1px 6px 1px 6px",
      color: "white",
      fontWeight: "bold"
    };
    if (disabled) {
      checkWorkStyle.backgroundColor = "rgb(200,200,200)";
    }
    let checkWorkText = "Check Work";
    if (!SVs.showCorrectness) {
      checkWorkText = "Submit Response";
    }
    let checkworkComponent = /* @__PURE__ */ React.createElement("button", {
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
      icon: faLevelDownAlt,
      transform: {rotate: 90}
    }), " ", checkWorkText);
    if (SVs.showCorrectness) {
      if (validationState === "correct") {
        checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_correct",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCheck
        }), "  Correct");
      } else if (validationState === "incorrect") {
        checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_incorrect",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faTimes
        }), "  Incorrect");
      } else if (validationState === "partialcorrect") {
        checkWorkStyle.backgroundColor = "#efab34";
        let percent = Math.round(SVs.creditAchieved * 100);
        let partialCreditContents = `${percent}% Correct`;
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_partial",
          style: checkWorkStyle
        }, partialCreditContents);
      }
    } else {
      if (validationState !== "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }), "  Response Saved");
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", SVs.numberOfAttemptsLeft, ")"));
    }
    return /* @__PURE__ */ React.createElement("span", {
      id: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), inputChildrenToRender, checkworkComponent);
  } else {
    return /* @__PURE__ */ React.createElement("span", {
      id: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), inputChildrenToRender);
  }
}
