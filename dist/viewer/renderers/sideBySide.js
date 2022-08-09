import React, {useRef, useState, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function sideBySide(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRender(props);
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
  let styledChildren = [];
  const marginLeft = SVs.margins[0];
  const marginRight = SVs.margins[1];
  const nCols = children.length;
  for (let [i, child] of children.entries()) {
    let width = SVs.widths[i];
    let thisMarginLeft = marginLeft;
    let thisMarginRight = marginRight;
    if (i > 0) {
      thisMarginLeft += SVs.gapWidth / 2;
    }
    if (i < nCols - 1) {
      thisMarginRight += SVs.gapWidth / 2;
    }
    styledChildren.push(/* @__PURE__ */ React.createElement("span", {
      style: {
        marginLeft: `${thisMarginLeft}%`,
        marginRight: `${thisMarginRight}%`,
        width: `${width}%`
      },
      key: child.key
    }, child));
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    id: name,
    style: {display: "flex", maxWidth: "850px", margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), styledChildren));
});
