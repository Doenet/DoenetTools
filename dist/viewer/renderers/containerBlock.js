import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Container(props) {
  let {name, id, SVs, children, actions, callAction} = useDoenetRenderer(props);
  let onChangeVisibility = (isVisible) => {
    if (actions.recordVisibilityChange) {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible}
      });
    }
  };
  useEffect(() => {
    return () => {
      if (actions.recordVisibilityChange) {
        callAction({
          action: actions.recordVisibilityChange,
          args: {isVisible: false}
        });
      }
    };
  }, []);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    id
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), children));
});
