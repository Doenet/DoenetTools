import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { ActivityViewer } from "../ActivityViewer";

export default React.memo(function Container(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

  let onChangeVisibility = (isVisible) => {
    if (actions.recordVisibilityChange) {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible },
      });
    }
  };

  useEffect(() => {
    return () => {
      if (actions.recordVisibilityChange) {
        callAction({
          action: actions.recordVisibilityChange,
          args: { isVisible: false },
        });
      }
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <ActivityViewer
        doenetML={SVs.doenetML}
        flags={{
          showCorrectness: true,
          solutionDisplayMode: "button",
          showFeedback: true,
          showHints: true,
          autoSubmit: false,
          allowLoadState: false,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false,
        }}
        prefixForIds={id}
      />
    </VisibilitySensor>
  );
});
