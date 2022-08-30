import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Figure(props) {
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
  if (SVs.hidden || !children) {
    return null;
  }
  let childrenToRender = children;
  let caption;
  if (SVs.captionChildName) {
    let captionChildInd;
    for (let [ind, child] of children.entries()) {
      if (typeof child !== "string" && child.props.componentInstructions.componentName === SVs.captionChildName) {
        captionChildInd = ind;
        break;
      }
    }
    caption = children[captionChildInd];
    childrenToRender.splice(captionChildInd, 1);
  } else {
    caption = SVs.caption;
  }
  if (!SVs.suppressFigureNameInCaption) {
    let figureName = /* @__PURE__ */ React.createElement("strong", null, SVs.figureName);
    if (caption) {
      caption = /* @__PURE__ */ React.createElement(React.Fragment, null, figureName, ": ", caption);
    } else {
      caption = figureName;
    }
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("figure", {
    id,
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), childrenToRender, /* @__PURE__ */ React.createElement("figcaption", {
    id: id + "_caption"
  }, caption)));
});
