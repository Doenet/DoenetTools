import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faLightbulb as lightOff} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faLightbulb as lightOn} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
import {faCaretRight as twirlIsClosed} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretDown as twirlIsOpen} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default class Hint extends DoenetRenderer {
  render() {
    if (!this.doenetSvData.showHints) {
      return null;
    }
    let childrenToRender = this.children;
    let title;
    if (this.doenetSvData.titleDefinedByChildren) {
      title = this.children[0];
      childrenToRender = this.children.slice(1);
    } else {
      title = this.doenetSvData.title;
    }
    let twirlIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: twirlIsClosed
    });
    let icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: lightOff
    });
    let info = null;
    let infoBlockStyle = {display: "none"};
    let onClickFunction;
    let openCloseText = "open";
    if (this.doenetSvData.open) {
      twirlIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: twirlIsOpen
      });
      openCloseText = "close";
      icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: lightOn
      });
      info = childrenToRender;
      infoBlockStyle = {
        display: "block",
        margin: "0px 4px 4px 4px",
        padding: "6px",
        border: "1px solid #C9C9C9",
        backgroundColor: "#fcfcfc"
      };
      onClickFunction = this.actions.closeHint;
    } else {
      onClickFunction = this.actions.revealHint;
    }
    return /* @__PURE__ */ React.createElement("aside", {
      id: this.componentName,
      key: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("span", {
      style: {display: "block", margin: "4px 4px 0px 4px", padding: "6px", border: "1px solid #C9C9C9", backgroundColor: "#ebebeb", cursor: "pointer"},
      onClick: onClickFunction
    }, twirlIcon, " ", icon, " ", title, " (click to ", openCloseText, ")"), /* @__PURE__ */ React.createElement("span", {
      style: infoBlockStyle
    }, info));
  }
}
