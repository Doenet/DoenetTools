import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Container extends DoenetRenderer {
  constructor(props) {
    super(props);
    if (this.props.board) {
      this.doenetPropsForChildren = {board: this.props.board};
    }
    this.initializeChildren();
  }
  static initializeChildrenOnConstruction = false;
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), this.children);
  }
}
