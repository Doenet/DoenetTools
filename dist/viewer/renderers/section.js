import React, {useRef} from "../../_snowpack/pkg/react.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretRight as twirlIsClosed} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretDown as twirlIsOpen} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Section(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let validationState = useRef(null);
  const updateValidationState = () => {
    validationState.current = "unvalidated";
    if (SVs.justSubmitted) {
      if (SVs.creditAchieved === 1) {
        validationState.current = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState.current = "incorrect";
      } else {
        validationState.current = "partialcorrect";
      }
    }
  };
  let submitAllAnswers = () => callAction({
    action: actions.submitAllAnswers
  });
  let title;
  if (SVs.titleChildName) {
    for (let [ind, child] of children.entries()) {
      if (child.props?.componentInstructions.componentName === SVs.titleChildName) {
        title = children[ind];
        children.splice(ind, 1);
        break;
      }
    }
  }
  if (!title) {
    title = SVs.title;
  }
  let heading = null;
  let headingId = name + "_title";
  if (SVs.collapsible) {
    if (SVs.open) {
      title = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: twirlIsOpen
      }), " ", title, " (click to close)");
    } else {
      title = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: twirlIsClosed
      }), " ", title, " (click to open)");
    }
  }
  switch (SVs.level) {
    case 0:
      heading = /* @__PURE__ */ React.createElement("span", {
        id: headingId,
        style: {fontSize: "2em"}
      }, title);
      break;
    case 1:
      heading = /* @__PURE__ */ React.createElement("span", {
        id: headingId,
        style: {fontSize: "1.5em"}
      }, title);
      break;
    case 2:
      heading = /* @__PURE__ */ React.createElement("span", {
        id: headingId,
        style: {fontSize: "1.17em"}
      }, title);
      break;
    case 3:
      heading = /* @__PURE__ */ React.createElement("span", {
        id: headingId,
        style: {fontSize: "1em"}
      }, title);
      break;
    case 4:
      heading = /* @__PURE__ */ React.createElement("span", {
        id: headingId,
        style: {fontSize: ".83em"}
      }, title);
      break;
    case 5:
      heading = /* @__PURE__ */ React.createElement("span", {
        id: headingId,
        style: {fontSize: ".67em"}
      }, title);
      break;
  }
  let checkworkComponent = null;
  if (SVs.createSubmitAllButton) {
    updateValidationState();
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
    if (!SVs.showCorrectness) {
      checkWorkText = "Submit Response";
    }
    checkworkComponent = /* @__PURE__ */ React.createElement("button", {
      id: name + "_submit",
      tabIndex: "0",
      style: checkWorkStyle,
      onClick: submitAllAnswers,
      onKeyPress: (e) => {
        if (e.key === "Enter") {
          submitAllAnswers();
        }
      }
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faLevelDownAlt,
      transform: {rotate: 90}
    }), " ", checkWorkText);
    if (SVs.showCorrectness) {
      if (validationState.current === "correct") {
        checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_correct",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCheck
        }), "  Correct");
      } else if (validationState.current === "incorrect") {
        checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_incorrect",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faTimes
        }), "  Incorrect");
      } else if (validationState.current === "partialcorrect") {
        checkWorkStyle.backgroundColor = "#efab34";
        let percent = Math.round(SVs.creditAchieved * 100);
        let partialCreditContents = `${percent}% Correct`;
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_partial",
          style: checkWorkStyle
        }, partialCreditContents);
      }
    } else {
      if (validationState.current !== "unvalidated") {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkworkComponent = /* @__PURE__ */ React.createElement("span", {
          id: name + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }), "  Response Saved");
      }
    }
    checkworkComponent = /* @__PURE__ */ React.createElement("div", null, checkworkComponent);
  }
  let content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), heading, " ", /* @__PURE__ */ React.createElement("br", null), children, checkworkComponent);
  if (SVs.collapsible) {
    content = /* @__PURE__ */ React.createElement("div", {
      style: {border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)"}
    }, /* @__PURE__ */ React.createElement("div", {
      style: {backgroundColor: "var(--mainGray)", cursor: "pointer", padding: "6px", borderBottom: "var(--mainBorder)", borderTopLeftRadius: "var(--mainBorderRadius)", borderTopRightRadius: "var(--mainBorderRadius)"},
      onClick: () => callAction({action: SVs.open ? actions.closeSection : actions.revealSection})
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), heading), /* @__PURE__ */ React.createElement("div", {
      style: {display: SVs.open ? "block" : "none", padding: SVs.boxed && "6px"}
    }, children, checkworkComponent));
  } else if (SVs.boxed) {
    content = /* @__PURE__ */ React.createElement("div", {
      style: {border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)"}
    }, /* @__PURE__ */ React.createElement("div", {
      style: {padding: "6px", borderBottom: "var(--mainBorder)", backgroundColor: "var(--mainGray)", borderTopLeftRadius: "var(--mainBorderRadius)", borderTopRightRadius: "var(--mainBorderRadius)"}
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), heading, /* @__PURE__ */ React.createElement("br", null)), /* @__PURE__ */ React.createElement("div", {
      style: {display: "block", padding: "6px"}
    }, children, checkworkComponent));
  }
  switch (SVs.containerTag) {
    case "aside":
      return /* @__PURE__ */ React.createElement("aside", {
        id: name,
        style: {margin: "12px 0"}
      }, " ", content, " ");
    case "div":
      return /* @__PURE__ */ React.createElement("div", {
        id: name,
        style: {margin: "12px 0"}
      }, " ", content, " ");
    case "none":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, content);
    default:
      return /* @__PURE__ */ React.createElement("section", {
        id: name,
        style: {margin: "12px 0"}
      }, " ", content, " ");
  }
});
