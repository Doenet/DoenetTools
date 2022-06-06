import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faComment as thoughtBubble} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
export default React.memo(function Feedback(props) {
  let {name, SVs, children} = useDoenetRender(props);
  if (SVs.hidden) {
    return null;
  }
  let icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: thoughtBubble
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
    style: {
      display: "block",
      margin: "12px 4px 0px 4px",
      padding: "6px",
      border: "2px solid black",
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
      backgroundColor: "var(--mainGray)"
    }
  }, icon, " Feedback"), /* @__PURE__ */ React.createElement("aside", {
    id: name,
    style: {
      backgroundColor: "white",
      margin: "0px 4px 12px 4px",
      padding: "1em",
      border: "2px solid black",
      borderTop: "0px",
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px"
    }
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), SVs.feedbackText, children));
});
