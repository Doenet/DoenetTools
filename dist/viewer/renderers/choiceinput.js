import React from "../../_snowpack/pkg/react.js";
import ReactDOM from "../../_snowpack/pkg/react-dom.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default class ChoiceinputRenderer extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  updateValidationState() {
    this.validationState = "unvalidated";
    if (this.doenetSvData.valueHasBeenValidated) {
      if (this.doenetSvData.creditAchievedForSubmitButton === 1) {
        this.validationState = "correct";
      } else if (this.doenetSvData.creditAchievedForSubmitButton === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }
  onChangeHandler(e) {
    let newSelectedIndices = [];
    if (e.target.value) {
      newSelectedIndices = [Number(e.target.value)];
    }
    if (this.doenetSvData.selectedIndices.length !== newSelectedIndices.length || this.doenetSvData.selectedIndices.some((v, i) => v != newSelectedIndices[i])) {
      this.actions.updateSelectedIndices({selectedIndices: newSelectedIndices});
    }
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    this.updateValidationState();
    if (this.doenetSvData.inline) {
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
        padding: "2px"
      };
      let checkWorkButton = null;
      if (this.doenetSvData.includeCheckWork) {
        if (this.validationState === "unvalidated") {
          checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
          checkWorkButton = /* @__PURE__ */ React.createElement("button", {
            id: this.componentName + "_submit",
            tabIndex: "0",
            ref: (c) => {
              this.target = c && ReactDOM.findDOMNode(c);
            },
            style: checkWorkStyle,
            onClick: this.actions.submitAnswer,
            onKeyPress: (e) => {
              if (e.key === "Enter") {
                this.actions.submitAnswer();
              }
            }
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faLevelDownAlt,
            transform: {rotate: 90}
          }));
        } else {
          if (this.doenetSvData.showCorrectness) {
            if (this.validationState === "correct") {
              checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
              checkWorkButton = /* @__PURE__ */ React.createElement("span", {
                id: this.componentName + "_correct",
                style: checkWorkStyle,
                ref: (c) => {
                  this.target = c && ReactDOM.findDOMNode(c);
                }
              }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
                icon: faCheck
              }));
            } else if (this.validationState === "partialcorrect") {
              let percent = Math.round(this.doenetSvData.creditAchievedForSubmitButton * 100);
              let partialCreditContents = `${percent} %`;
              checkWorkStyle.width = "50px";
              checkWorkStyle.backgroundColor = "#efab34";
              checkWorkButton = /* @__PURE__ */ React.createElement("span", {
                id: this.componentName + "_partial",
                style: checkWorkStyle,
                ref: (c) => {
                  this.target = c && ReactDOM.findDOMNode(c);
                }
              }, partialCreditContents);
            } else {
              checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
              checkWorkButton = /* @__PURE__ */ React.createElement("span", {
                id: this.componentName + "_incorrect",
                style: checkWorkStyle,
                ref: (c) => {
                  this.target = c && ReactDOM.findDOMNode(c);
                }
              }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
                icon: faTimes
              }));
            }
          } else {
            checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
            checkWorkButton = /* @__PURE__ */ React.createElement("span", {
              id: this.componentName + "_saved",
              style: checkWorkStyle,
              ref: (c) => {
                this.target = c && ReactDOM.findDOMNode(c);
              }
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faCloud
            }));
          }
        }
      }
      let optionsList = this.doenetSvData.choiceTexts.map(function(s, i) {
        return /* @__PURE__ */ React.createElement("option", {
          key: i + 1,
          value: i + 1
        }, s);
      });
      let value = this.doenetSvData.selectedIndices[0];
      if (value === void 0) {
        value = "";
      }
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), /* @__PURE__ */ React.createElement("select", {
        id: this.componentName,
        onChange: this.onChangeHandler,
        value,
        disabled: this.doenetSvData.disabled
      }, /* @__PURE__ */ React.createElement("option", null), optionsList), checkWorkButton);
    } else {
      let checkWorkStyle = {
        height: "23px",
        display: "inline-block",
        backgroundColor: "rgb(2, 117, 216)",
        padding: "1px 6px 1px 6px",
        color: "white",
        fontWeight: "bold"
      };
      let checkworkComponent = null;
      if (this.doenetSvData.includeCheckWork) {
        if (this.validationState === "unvalidated") {
          let checkWorkText = "Check Work";
          if (!this.doenetSvData.showCorrectness) {
            checkWorkText = "Submit Response";
          }
          checkworkComponent = /* @__PURE__ */ React.createElement("button", {
            id: this.componentName + "_submit",
            tabIndex: "0",
            style: checkWorkStyle,
            onClick: this.actions.submitAnswer,
            onKeyPress: (e) => {
              if (e.key === "Enter") {
                this.actions.submitAnswer();
              }
            }
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faLevelDownAlt,
            transform: {rotate: 90}
          }), " ", checkWorkText);
        } else {
          if (this.doenetSvData.showCorrectness) {
            if (this.validationState === "correct") {
              checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
              checkworkComponent = /* @__PURE__ */ React.createElement("span", {
                id: this.componentName + "_correct",
                style: checkWorkStyle
              }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
                icon: faCheck
              }), "  Correct");
            } else if (this.validationState === "incorrect") {
              checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
              checkworkComponent = /* @__PURE__ */ React.createElement("span", {
                id: this.componentName + "_incorrect",
                style: checkWorkStyle
              }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
                icon: faTimes
              }), "  Incorrect");
            } else if (this.validationState === "partialcorrect") {
              checkWorkStyle.backgroundColor = "#efab34";
              let percent = Math.round(this.doenetSvData.creditAchievedForSubmitButton * 100);
              let partialCreditContents = `${percent}% Correct`;
              checkworkComponent = /* @__PURE__ */ React.createElement("span", {
                id: this.componentName + "_partial",
                style: checkWorkStyle
              }, partialCreditContents);
            }
          } else {
            checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
            checkworkComponent = /* @__PURE__ */ React.createElement("span", {
              id: this.componentName + "_saved",
              style: checkWorkStyle
            }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
              icon: faCloud
            }), "  Response Saved");
          }
        }
      }
      let inputKey = this.componentName;
      let listStyle = {
        listStyleType: "none"
      };
      let onChangeHandler = this.onChangeHandler;
      let selectedIndices = this.doenetSvData.selectedIndices;
      let disabled = this.doenetSvData.disabled;
      let keyBeginning = inputKey + "_choice";
      let children = this.children;
      let choiceDoenetTags = this.doenetSvData.choiceOrder.map((v) => children[v]).map(function(child, i) {
        return /* @__PURE__ */ React.createElement("li", {
          key: inputKey + "_choice" + (i + 1)
        }, /* @__PURE__ */ React.createElement("input", {
          type: "radio",
          id: keyBeginning + (i + 1) + "_input",
          name: inputKey,
          value: i + 1,
          checked: selectedIndices.includes(i + 1),
          onChange: onChangeHandler,
          disabled
        }), /* @__PURE__ */ React.createElement("label", {
          htmlFor: keyBeginning + (i + 1) + "_input"
        }, child));
      });
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ol", {
        id: inputKey,
        style: listStyle
      }, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), choiceDoenetTags), checkworkComponent);
    }
  }
}
