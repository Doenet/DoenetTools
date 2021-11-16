import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretRight as twirlIsClosed} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretDown as twirlIsOpen} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default class Section extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let heading = null;
    let id = this.componentName + "_title";
    let childrenToRender = [...this.children];
    let title;
    if (this.doenetSvData.titleChildName) {
      let titleChildInd;
      for (let [ind, child] of this.children.entries()) {
        if (child.props.componentInstructions.componentName === this.doenetSvData.titleChildName) {
          titleChildInd = ind;
          break;
        }
      }
      title = this.children[titleChildInd];
      childrenToRender.splice(titleChildInd, 1);
    } else {
      title = this.doenetSvData.title;
    }
    if (this.doenetSvData.collapsible) {
      if (this.doenetSvData.open) {
        title = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: twirlIsOpen
        }), " ", title, " (click to close)");
      } else {
        title = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: twirlIsClosed
        }), " ", title, " (click to open)");
      }
    }
    if (this.doenetSvData.level === 0) {
      heading = /* @__PURE__ */ React.createElement("h1", {
        id,
        style: {fontSize: "2em"}
      }, title);
    } else if (this.doenetSvData.level === 1) {
      heading = /* @__PURE__ */ React.createElement("h2", {
        id,
        style: {fontSize: "1.5em"}
      }, title);
    } else if (this.doenetSvData.level === 2) {
      heading = /* @__PURE__ */ React.createElement("h3", {
        id,
        style: {fontSize: "1.17em"}
      }, title);
    } else if (this.doenetSvData.level === 3) {
      heading = /* @__PURE__ */ React.createElement("h4", {
        id,
        style: {fontSize: "1em"}
      }, title);
    } else if (this.doenetSvData.level === 4) {
      heading = /* @__PURE__ */ React.createElement("h5", {
        id,
        style: {fontSize: ".83em"}
      }, title);
    } else if (this.doenetSvData.level === 5) {
      heading = /* @__PURE__ */ React.createElement("h6", {
        id,
        style: {fontSize: ".67em"}
      }, title);
    }
    let checkworkComponent = null;
    if (this.doenetSvData.createSubmitAllButton) {
      let validationState = "unvalidated";
      if (this.doenetSvData.justSubmitted) {
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
        fontWeight: "bold",
        marginBottom: "30px"
      };
      let checkWorkText = "Check Work";
      if (!this.doenetSvData.showCorrectness) {
        checkWorkText = "Submit nse";
      }
      checkworkComponent = /* @__PURE__ */ React.createElement("button", {
        id: this.componentName + "_submit",
        tabIndex: "0",
        style: checkWorkStyle,
        onClick: this.actions.submitAllAnswers,
        onKeyPress: (e) => {
          if (e.key === "Enter") {
            this.actions.submitAllAnswers();
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
      checkworkComponent = /* @__PURE__ */ React.createElement("div", null, checkworkComponent);
    }
    let content;
    if (this.doenetSvData.collapsible) {
      if (this.doenetSvData.open) {
        if (this.doenetSvData.boxed) {
          if (this.doenetSvData.level === 0) {
            heading = /* @__PURE__ */ React.createElement("h1", {
              id,
              style: {fontSize: "2em", marginBottom: "0px"}
            }, title);
          } else if (this.doenetSvData.level === 1) {
            heading = /* @__PURE__ */ React.createElement("h2", {
              id,
              style: {fontSize: "1.5em", marginBottom: "0px"}
            }, title);
          } else if (this.doenetSvData.level === 2) {
            heading = /* @__PURE__ */ React.createElement("h3", {
              id,
              style: {fontSize: "1.17em", marginBottom: "0px"}
            }, title);
          } else if (this.doenetSvData.level === 3) {
            heading = /* @__PURE__ */ React.createElement("h4", {
              id,
              style: {fontSize: "1em", marginBottom: "0px"}
            }, title);
          } else if (this.doenetSvData.level === 4) {
            heading = /* @__PURE__ */ React.createElement("h5", {
              id,
              style: {fontSize: ".83em", marginBottom: "0px"}
            }, title);
          } else if (this.doenetSvData.level === 5) {
            heading = /* @__PURE__ */ React.createElement("h6", {
              id,
              style: {fontSize: ".67em", marginBottom: "0px"}
            }, title);
          }
          content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
            name: this.componentName
          }), /* @__PURE__ */ React.createElement("span", {
            style: {
              display: "block",
              backgroundColor: "#ebebeb",
              cursor: "pointer"
            },
            onClick: this.actions.closeSection
          }, /* @__PURE__ */ React.createElement("a", {
            name: this.componentName
          }), heading), /* @__PURE__ */ React.createElement("span", {
            style: {
              display: "block",
              padding: "6px",
              border: "1px solid #C9C9C9",
              backgroundColor: "white"
            }
          }, childrenToRender, checkworkComponent));
        } else {
          content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
            name: this.componentName
          }), /* @__PURE__ */ React.createElement("span", {
            style: {
              display: "block",
              backgroundColor: "#ebebeb",
              cursor: "pointer"
            },
            onClick: this.actions.closeSection
          }, /* @__PURE__ */ React.createElement("a", {
            name: this.componentName
          }), heading), /* @__PURE__ */ React.createElement("span", {
            style: {
              display: "block",
              backgroundColor: "white"
            }
          }, childrenToRender, checkworkComponent));
        }
      } else {
        content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
          name: this.componentName
        }), /* @__PURE__ */ React.createElement("span", {
          style: {
            display: "block",
            backgroundColor: "#ebebeb",
            cursor: "pointer"
          },
          onClick: this.actions.revealSection
        }, heading));
      }
    } else if (this.doenetSvData.boxed) {
      content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
        style: {
          display: "block",
          margin: "4px 4px 0px 4px",
          padding: "6px",
          border: "1px solid #C9C9C9",
          backgroundColor: "#ebebeb"
        }
      }, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), heading), /* @__PURE__ */ React.createElement("span", {
        style: {
          display: "block",
          margin: "0px 4px 4px 4px",
          padding: "6px",
          border: "1px solid #C9C9C9",
          backgroundColor: "white"
        }
      }, childrenToRender, checkworkComponent));
    } else {
      content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), heading, childrenToRender, checkworkComponent);
    }
    if (this.doenetSvData.containerTag === "aside") {
      return /* @__PURE__ */ React.createElement("aside", {
        id: this.componentName
      }, content);
    } else if (this.doenetSvData.containerTag === "div") {
      return /* @__PURE__ */ React.createElement("div", {
        id: this.componentName
      }, content);
    } else if (this.doenetSvData.containerTag === "none") {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, content);
    } else {
      return /* @__PURE__ */ React.createElement("section", {
        id: this.componentName
      }, content);
    }
  }
}
