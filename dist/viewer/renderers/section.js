import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretRight as twirlIsClosed} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faCaretDown as twirlIsOpen} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function Section(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  if (SVs.titleChildName) {
    let titleChildInd;
    for (let [ind, child] of children.entries()) {
      if (child.props?.componentInstructions.componentName === SVs.titleChildName) {
        titleChildInd = ind;
        children.splice(titleChildInd, 1);
        break;
      }
    }
  }
  let title = SVs.title;
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
  if (SVs.level === 0) {
    heading = /* @__PURE__ */ React.createElement("h1", {
      id: headingId,
      style: {fontSize: "2em"}
    }, title);
  } else if (SVs.level === 1) {
    heading = /* @__PURE__ */ React.createElement("h2", {
      id: headingId,
      style: {fontSize: "1.5em"}
    }, title);
  } else if (SVs.level === 2) {
    heading = /* @__PURE__ */ React.createElement("h3", {
      id: headingId,
      style: {fontSize: "1.17em"}
    }, title);
  } else if (SVs.level === 3) {
    heading = /* @__PURE__ */ React.createElement("h4", {
      id: headingId,
      style: {fontSize: "1em"}
    }, title);
  } else if (SVs.level === 4) {
    heading = /* @__PURE__ */ React.createElement("h5", {
      id: headingId,
      style: {fontSize: ".83em"}
    }, title);
  } else if (SVs.level === 5) {
    heading = /* @__PURE__ */ React.createElement("h6", {
      id: headingId,
      style: {fontSize: ".67em"}
    }, title);
  }
  let checkworkComponent = null;
  let content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), heading, children, checkworkComponent);
  if (SVs.collapsible) {
    if (SVs.open) {
      if (SVs.boxed) {
        content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
          name
        }), /* @__PURE__ */ React.createElement("span", {
          style: {
            display: "block",
            backgroundColor: "#ebebeb",
            cursor: "pointer"
          },
          onClick: () => callAction({action: actions.closeSection})
        }, /* @__PURE__ */ React.createElement("a", {
          name
        }), heading), /* @__PURE__ */ React.createElement("span", {
          style: {
            display: "block",
            padding: "6px",
            border: "1px solid #C9C9C9",
            backgroundColor: "white"
          }
        }, children, checkworkComponent));
      } else {
        content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
          name
        }), /* @__PURE__ */ React.createElement("span", {
          style: {
            display: "block",
            backgroundColor: "#ebebeb",
            cursor: "pointer"
          },
          onClick: () => callAction({action: actions.closeSection})
        }, /* @__PURE__ */ React.createElement("a", {
          name
        }), heading), /* @__PURE__ */ React.createElement("span", {
          style: {
            display: "block",
            backgroundColor: "white"
          }
        }, children, checkworkComponent));
      }
    } else {
      content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name
      }), /* @__PURE__ */ React.createElement("span", {
        style: {
          display: "block",
          backgroundColor: "#ebebeb",
          cursor: "pointer"
        },
        onClick: () => callAction({action: actions.revealSection})
      }, heading));
    }
  } else if (SVs.boxed) {
    content = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
      style: {
        display: "block",
        margin: "4px 4px 0px 4px",
        padding: "6px",
        border: "1px solid #C9C9C9",
        backgroundColor: "#ebebeb"
      }
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), heading), /* @__PURE__ */ React.createElement("span", {
      style: {
        display: "block",
        margin: "0px 4px 4px 4px",
        padding: "6px",
        border: "1px solid #C9C9C9",
        backgroundColor: "white"
      }
    }, children, checkworkComponent));
  }
  if (SVs.containerTag === "aside") {
    return /* @__PURE__ */ React.createElement("aside", {
      id: name
    }, content);
  } else if (SVs.containerTag === "div") {
    return /* @__PURE__ */ React.createElement("div", {
      id: name
    }, content);
  } else if (SVs.containerTag === "none") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, content);
  } else {
    return /* @__PURE__ */ React.createElement("section", {
      id: name
    }, content);
  }
}
