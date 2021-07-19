import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
export default class Table extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    const tableStyle = {
      width: sizeToCSS(this.doenetSvData.width),
      height: sizeToCSS(this.doenetSvData.height),
      borderCollapse: "collapse",
      borderColor: "black"
    };
    if (this.doenetSvData.top !== "none") {
      tableStyle.borderTopStyle = "solid";
      if (this.doenetSvData.top === "minor") {
        tableStyle.borderTopWidth = "thin";
      } else if (this.doenetSvData.top === "medium") {
        tableStyle.borderTopWidth = "medium";
      } else {
        tableStyle.borderTopWidth = "thick";
      }
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("table", {
      id: this.componentName,
      style: tableStyle
    }, /* @__PURE__ */ React.createElement("tbody", null, this.children)));
  }
}
