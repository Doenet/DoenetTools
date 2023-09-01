import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faComment as thoughtBubble} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const FeedbackStyling = styled.aside`
  background-color: white;
  margin: 0px 4px 12px 4px;
  padding: 1em;
  border: 2px solid black;
  border-top: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  //   &: focus {
  //   outline: 2px solid var(--canvastext);
  //   outline-offset: 2px;
  //  }
`;
const SpanStyling = styled.span`
  display: block;
  margin: 12px 4px 0px 4px;
  padding: 6px;
  border: 2px solid black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: var(--mainGray);
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;
export default React.memo(function Feedback(props) {
  let {name, id, SVs, children, actions, callAction} = useDoenetRender(props);
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
    };
  }, []);
  if (SVs.hidden) {
    return null;
  }
  let icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: thoughtBubble
  });
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SpanStyling, {
    tabIndex: "0"
  }, icon, " Feedback"), /* @__PURE__ */ React.createElement(FeedbackStyling, {
    id
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), SVs.feedbackText, children)));
});
