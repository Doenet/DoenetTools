import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useEffect } from "react";
import { addCommasForCompositeRanges } from "./utils/composites";

export default React.memo(function P(props) {
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
      <p id={id}>
        <a name={id} />
        {children}
      </p>
    </VisibilitySensor>
  );
});
