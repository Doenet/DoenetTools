import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Tabular(props) {
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
  const tableStyle = {
    width: sizeToCSS(SVs.width),
    height: sizeToCSS(SVs.height),
    borderCollapse: "collapse",
    borderColor: "var(--canvastext)",
    borderRadius: "var(--mainBorderRadius)",
    tableLayout: "fixed"
  };
  if (SVs.top !== "none") {
    tableStyle.borderTopStyle = "solid";
    if (SVs.top === "minor") {
      tableStyle.borderTopWidth = "thin";
    } else if (SVs.top === "medium") {
      tableStyle.borderTopWidth = "medium";
    } else {
      tableStyle.borderTopWidth = "thick";
    }
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("table", {
    id: name,
    style: tableStyle
  }, /* @__PURE__ */ React.createElement("tbody", null, children))));
});
