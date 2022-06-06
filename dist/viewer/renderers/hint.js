import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faLightbulb as lightOff} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faLightbulb as lightOn} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
import {faCaretRight as twirlIsClosed} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretDown as twirlIsOpen} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default React.memo(function Hint(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRender(props);
  if (!SVs.showHints) {
    return null;
  }
  let childrenToRender = children;
  let title = SVs.title;
  if (SVs.titleDefinedByChildren) {
    title = children[0];
    childrenToRender = children.slice(1);
  }
  let twirlIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: twirlIsClosed
  });
  let icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: lightOff
  });
  let info = null;
  let infoBlockStyle = {display: "none"};
  let onClickFunction = () => {
    callAction({
      action: actions.revealHint
    });
  };
  let openCloseText = "open";
  if (SVs.open) {
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
      margin: "0px 4px 12px 4px",
      padding: "6px",
      border: "2px solid black",
      borderTop: "0px",
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
      backgroundColor: "white"
    };
    onClickFunction = () => {
      callAction({
        action: actions.closeHint
      });
    };
  }
  return /* @__PURE__ */ React.createElement("aside", {
    id: name,
    key: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    style: {
      display: "block",
      margin: SVs.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
      padding: "6px",
      border: "2px solid black",
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
      borderBottomLeftRadius: SVs.open ? "0px" : "5px",
      borderBottomRightRadius: SVs.open ? "0px" : "5px",
      backgroundColor: "var(--mainGray)",
      cursor: "pointer"
    },
    onClick: onClickFunction
  }, twirlIcon, " ", icon, " ", title, " (click to ", openCloseText, ")"), /* @__PURE__ */ React.createElement("span", {
    style: infoBlockStyle
  }, info));
});
