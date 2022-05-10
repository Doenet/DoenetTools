import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
export default function Tabular(props) {
  let {name, SVs, children} = useDoenetRender(props);
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
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("table", {
    id: name,
    style: tableStyle
  }, /* @__PURE__ */ React.createElement("tbody", null, children)));
}
