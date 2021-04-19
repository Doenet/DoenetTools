import React from "react";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Table extends DoenetRenderer {
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    let table = [];
    for (let [rowNum, rowData] of this.doenetSvData.renderedChildNumberByRowCol.entries()) {
      let row = rowData.map((childInd, colInd) => /* @__PURE__ */ React.createElement("td", {
        key: "col" + colInd
      }, this.children[childInd]));
      table.push(/* @__PURE__ */ React.createElement("tr", {
        key: "row" + rowNum
      }, row));
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("table", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("tbody", null, table)));
  }
}
