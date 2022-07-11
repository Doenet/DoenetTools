import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Container(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRenderer(props);
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
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), children));
});
