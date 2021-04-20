import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faPuzzlePiece as puzzle} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default class Solution extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let icon;
    let childrenToRender = null;
    let infoBlockStyle = {display: "none"};
    let onClickFunction;
    let cursorStyle;
    if (this.doenetSvData.open) {
      icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: puzzle
      });
      childrenToRender = this.children;
      infoBlockStyle = {display: "block", margin: "0px 4px 4px 4px", padding: "6px", border: "1px solid #ebebeb", backgroundColor: "#fcfcfc"};
      if (this.doenetSvData.canBeClosed) {
        cursorStyle = "pointer";
        onClickFunction = this.actions.closeSolution;
      } else {
        onClickFunction = null;
      }
    } else {
      icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: puzzle,
        rotation: 90
      });
      cursorStyle = "pointer";
      onClickFunction = this.actions.revealSolution;
    }
    return /* @__PURE__ */ React.createElement("aside", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("span", {
      style: {
        display: "block",
        margin: "4px 4px 0px 4px",
        padding: "6px",
        border: "1px solid #ebebeb",
        backgroundColor: "#ebebeb",
        cursor: cursorStyle
      },
      onClick: onClickFunction
    }, icon, " Solution ", this.doenetSvData.message), /* @__PURE__ */ React.createElement("span", {
      style: infoBlockStyle
    }, childrenToRender));
  }
}
