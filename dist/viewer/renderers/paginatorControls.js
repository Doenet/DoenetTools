import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class PaginatorControls extends DoenetRenderer {
  static initializeChildrenOnConstruction = false;
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("p", {
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("button", {
      id: this.componentName + "_previous",
      onClick: () => this.actions.setPage({number: this.doenetSvData.currentPage - 1}),
      disabled: this.doenetSvData.disabled || !(this.doenetSvData.currentPage > 1)
    }, this.doenetSvData.previousLabel), " " + this.doenetSvData.pageLabel, " ", this.doenetSvData.currentPage, " of ", this.doenetSvData.nPages + " ", /* @__PURE__ */ React.createElement("button", {
      id: this.componentName + "_next",
      onClick: () => this.actions.setPage({number: this.doenetSvData.currentPage + 1}),
      disabled: this.doenetSvData.disabled || !(this.doenetSvData.currentPage < this.doenetSvData.nPages)
    }, this.doenetSvData.nextLabel));
  }
}
