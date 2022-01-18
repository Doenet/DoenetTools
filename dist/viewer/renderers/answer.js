import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default class Answer extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let disabled = this.doenetSvData.disabled;
    let submitAnswer = this.actions.submitAnswer;
    if (this.doenetSvData.submitAllAnswersAtAncestor) {
      submitAnswer = this.actions.submitAllAnswers;
    }
    let inputChildrenToRender = null;
    if (this.doenetSvData.inputChildren.length > 0) {
      let inputChildNames = this.doenetSvData.inputChildren.map((x) => x.componentName);
      inputChildrenToRender = this.children.filter((child) => typeof child !== "string" && inputChildNames.includes(child.props.componentInstructions.componentName));
    }
    if (!this.doenetSvData.delegateCheckWork) {
      let validationState = "unvalidated";
      if (this.doenetSvData.justSubmitted || this.doenetSvData.numberOfAttemptsLeft < 1) {
        if (this.doenetSvData.creditAchieved === 1) {
          validationState = "correct";
        } else if (this.doenetSvData.creditAchieved === 0) {
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
      if (!this.doenetSvData.showCorrectness) {
        checkWorkText = "Submit Response";
      }
      let checkworkComponent = /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_submit",
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
      if (this.doenetSvData.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkworkComponent = /* @__PURE__ */ React.createElement("span", {
            id: this.componentName + "_correct",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCheck
          }), "  Correct");
        } else if (validationState === "incorrect") {
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkworkComponent = /* @__PURE__ */ React.createElement("span", {
            id: this.componentName + "_incorrect",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faTimes
          }), "  Incorrect");
        } else if (validationState === "partialcorrect") {
          checkWorkStyle.backgroundColor = "#efab34";
          let percent = Math.round(this.doenetSvData.creditAchieved * 100);
          let partialCreditContents = `${percent}% Correct`;
          checkworkComponent = /* @__PURE__ */ React.createElement("span", {
            id: this.componentName + "_partial",
            style: checkWorkStyle
          }, partialCreditContents);
        }
      } else {
        if (validationState !== "unvalidated") {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = /* @__PURE__ */ React.createElement("span", {
            id: this.componentName + "_saved",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCloud
          }), "  Response Saved");
        }
      }
      if (this.doenetSvData.numberOfAttemptsLeft < 0) {
        checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
      } else if (this.doenetSvData.numberOfAttemptsLeft < Infinity) {
        checkworkComponent = /* @__PURE__ */ React.createElement(React.Fragment, null, checkworkComponent, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", this.doenetSvData.numberOfAttemptsLeft, ")"));
      }
      return /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), inputChildrenToRender, checkworkComponent);
    } else {
      return /* @__PURE__ */ React.createElement("span", {
        id: this.componentName
      }, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), inputChildrenToRender);
    }
  }
}
