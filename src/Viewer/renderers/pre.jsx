import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";

export default React.memo(function Pre(props) {
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

  if (SVs.hidden) return null;

  for (let ind of SVs.displayDoenetMLIndices) {
    let prevChild = children[ind - 1];

    if (typeof prevChild === "string") {
      // if the last \n is followed by just spacing
      // (or beginning of string is just spacing, if no \n)
      // remove those spaces
      // so that the first line of the displayed DoenetML will not be indented,
      // consistent with the remaining lines of the DoenetML

      let lastLineBreak = prevChild.lastIndexOf("\n");
      if (/^\s*$/.test(prevChild.slice(lastLineBreak + 1))) {
        prevChild = prevChild.slice(0, lastLineBreak + 1);
        children[ind - 1] = prevChild;
      }
    }
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <pre id={id} style={{ margin: "12px 0" }}>
        <a name={id} />
        {children}
      </pre>
    </VisibilitySensor>
  );
});
