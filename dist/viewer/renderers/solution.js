import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faPuzzlePiece as puzzle} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Solution(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let icon;
  let childrenToRender = null;
  let infoBlockStyle = {display: "none"};
  let onClickFunction;
  let cursorStyle;
  if (SVs.open) {
    icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: puzzle
    });
    childrenToRender = children;
    infoBlockStyle = {
      display: "block",
      margin: "0px 4px 4px 4px",
      padding: "6px",
      border: "1px solid #ebebeb",
      backgroundColor: "#fcfcfc"
    };
    if (SVs.canBeClosed) {
      cursorStyle = "pointer";
      onClickFunction = () => {
        callAction({
          action: actions.closeSolution
        });
      };
    } else {
      onClickFunction = () => {
      };
    }
  } else {
    icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: puzzle,
      rotation: 90
    });
    cursorStyle = "pointer";
    onClickFunction = () => {
      callAction({
        action: actions.revealSolution
      });
    };
  }
  return /* @__PURE__ */ React.createElement("aside", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    id: name + "_button",
    style: {
      display: "block",
      margin: "4px 4px 0px 4px",
      padding: "6px",
      border: "1px solid #ebebeb",
      backgroundColor: "#ebebeb",
      cursor: cursorStyle
    },
    onClick: onClickFunction
  }, icon, " Solution ", SVs.message), /* @__PURE__ */ React.createElement("span", {
    style: infoBlockStyle
  }, childrenToRender));
}
