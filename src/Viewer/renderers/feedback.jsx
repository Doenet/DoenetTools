import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment as thoughtBubble } from "@fortawesome/free-regular-svg-icons";
import VisibilitySensor from "react-visibility-sensor-v2";
import styled from "styled-components";
import { addCommasForCompositeRanges } from "./utils/composites";
const FeedbackStyling = styled.aside`
  background-color: var(--canvas);
  margin: 0px 4px 12px 4px;
  padding: 1em;
  border: 2px solid var(--canvastext);
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
  border: 2px solid var(--canvastext);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: var(--mainGray);
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;
export default React.memo(function Feedback(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
      });
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  let icon = <FontAwesomeIcon icon={thoughtBubble} />;

  if (SVs._compositeReplacementActiveRange) {
    children = addCommasForCompositeRanges({
      children,
      compositeReplacementActiveRange: SVs._compositeReplacementActiveRange,
      startInd: 0,
      endInd: children.length - 1,
    });
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <>
        <SpanStyling tabIndex="0">{icon} Feedback</SpanStyling>
        <FeedbackStyling
          id={id}
          // tabIndex="0"
        >
          <a name={id} />

          {SVs.feedbackText}
          {children}
        </FeedbackStyling>
      </>
    </VisibilitySensor>
  );
});
