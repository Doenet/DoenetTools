import React from "../../_snowpack/pkg/react.js";
import ReactDOM from "../../_snowpack/pkg/react-dom.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default class BooleanInput extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  static initializeChildrenOnConstruction = false;
  updateValidationState() {
    this.validationState = "unvalidated";
    if (this.doenetSvData.valueHasBeenValidated) {
      if (this.doenetSvData.creditAchieved === 1) {
        this.validationState = "correct";
      } else if (this.doenetSvData.creditAchieved === 0) {
        this.validationState = "incorrect";
      } else {
        this.validationState = "partialcorrect";
      }
    }
  }
  onChangeHandler(e) {
    this.actions.updateBoolean({
      boolean: e.target.checked
    });
    this.forceUpdate();
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    this.updateValidationState();
    const inputKey = this.componentName + "_input";
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
            let percent = Math.round(this.doenetSvData.creditAchieved * 100);
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
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", {
      type: "checkbox",
      key: inputKey,
      id: inputKey,
      checked: this.doenetSvData.value,
      onChange: this.onChangeHandler
    }), this.doenetSvData.label), checkWorkButton));
  }
}
