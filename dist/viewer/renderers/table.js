import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Table(props) {
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
  let heading = null;
  let childrenToRender = [...children];
  let title;
  if (SVs.titleChildName) {
    let titleChildInd;
    for (let [ind, child] of children.entries()) {
      if (typeof child !== "string" && child.props.componentInstructions.componentName === SVs.titleChildName) {
        titleChildInd = ind;
        break;
      }
    }
    title = children[titleChildInd];
    childrenToRender.splice(titleChildInd, 1);
  } else {
    title = SVs.title;
  }
  if (!SVs.suppressTableNameInTitle) {
    let tableName = /* @__PURE__ */ React.createElement("strong", null, SVs.tableName);
    if (title) {
      title = /* @__PURE__ */ React.createElement(React.Fragment, null, tableName, ": ", title);
    } else {
      title = tableName;
    }
  }
  heading = /* @__PURE__ */ React.createElement("div", {
    id: id + "_title"
  }, title);
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    id,
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), heading, childrenToRender));
});
