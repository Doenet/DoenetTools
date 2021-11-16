import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class AreaBetweenCurveXAxis extends DoenetRenderer {
  constructor(props) {
    super(props);
    if (props.board) {
      this.createGraphicalObject();
    }
  }
  static initializeChildrenOnConstruction = false;
  createGraphicalObject() {
    if (!this.doenetSvData.haveFunction || this.doenetSvData.boundaryValues.length !== 2 || !this.doenetSvData.boundaryValues.every(Number.isFinite)) {
      return;
    }
    this.jsxAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: true,
      layer: 10 * this.doenetSvData.layer + 7,
      fillColor: this.doenetSvData.selectedStyle.lineColor,
      highlight: false,
      curveLeft: {visible: false},
      curveRight: {visible: false}
    };
    this.curveJXG = this.props.board.create("functiongraph", this.doenetSvData.function, {visible: false});
    this.integralJXG = this.props.board.create("integral", [this.doenetSvData.boundaryValues, this.curveJXG], this.jsxAttributes);
    return this.integralJXG;
  }
  deleteGraphicalObject() {
    this.props.board.removeObject(this.integralJXG);
    delete this.integralJXG;
    this.props.board.removeObject(this.curveJXG);
    delete this.curveJXG;
  }
  componentWillUnmount() {
    if (this.integralJXG) {
      this.deleteGraphicalObject();
    }
  }
  update() {
    if (!this.props.board) {
      this.forceUpdate();
      return;
    }
    if (!this.doenetSvData.haveFunction || this.doenetSvData.boundaryValues.length !== 2 || !this.doenetSvData.boundaryValues.every(Number.isFinite)) {
      if (this.integralJXG) {
        return this.deleteGraphicalObject();
      } else {
        return;
      }
    }
    if (this.integralJXG === void 0) {
      return this.createGraphicalObject();
    }
    this.curveJXG.Y = this.doenetSvData.function;
    this.integralJXG.visProp["visible"] = !this.doenetSvData.hidden;
    this.integralJXG.visPropCalc["visible"] = !this.doenetSvData.hidden;
    let [x1, x2] = this.doenetSvData.boundaryValues;
    let [y1, y2] = this.doenetSvData.boundaryValues.map(this.doenetSvData.function);
    this.integralJXG.curveLeft.coords.setCoordinates(JXG.COORDS_BY_USER, [x1, y1]);
    this.integralJXG.curveRight.coords.setCoordinates(JXG.COORDS_BY_USER, [x2, y2]);
    this.integralJXG.curveLeft.needsUpdate = true;
    this.integralJXG.curveLeft.update();
    this.integralJXG.curveRight.needsUpdate = true;
    this.integralJXG.curveRight.update();
    this.integralJXG.needsUpdate = true;
    this.integralJXG.update();
    this.props.board.updateRenderer();
  }
  render() {
    if (this.props.board) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }));
    }
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }));
  }
}
