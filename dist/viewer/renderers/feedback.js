import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment as thoughtBubble} from "@fortawesome/free-regular-svg-icons";
export default class Feedback extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: thoughtBubble
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
      style: {display: "block", margin: "0px 4px 0px 4px", padding: "6px", border: "1px solid #C9C9C9", backgroundColor: "#ebebeb"}
    }, icon, " Feedback"), /* @__PURE__ */ React.createElement("aside", {
      id: this.componentName,
      style: {backgroundColor: "white", margin: "0px 4px 0px 4px", padding: "1em", border: "1px solid #C9C9C9"}
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), this.doenetSvData.feedbackText, this.children));
  }
}
