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
    borderColor: "black",
    borderRadius: "var(--mainBorderRadius)"
  };
  let options = ["mean", "stdev", "variance", "stderr", "count", "minimum", "quartile1", "median", "quartile3", "maximum", "range", "sum"];
  let columns = options.filter((x) => x in SVs.summaryStatistics);
  let heading = /* @__PURE__ */ React.createElement("tr", null, columns.map((x, i) => /* @__PURE__ */ React.createElement("th", {
    key: i
  }, x)));
  let data = /* @__PURE__ */ React.createElement("tr", null, columns.map((x, i) => /* @__PURE__ */ React.createElement("td", {
    key: i
  }, SVs.summaryStatistics[x])));
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("p", null, "Summary statistics of ", SVs.columnName), /* @__PURE__ */ React.createElement("table", {
    id: name,
    style: tableStyle
  }, /* @__PURE__ */ React.createElement("tbody", null, heading, data))));
});
