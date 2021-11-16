import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Circle extends DoenetRenderer {
  constructor(props) {
    super(props);
    if (props.board) {
      this.createGraphicalObject();
      this.doenetPropsForChildren = {board: this.props.board};
      this.initializeChildren();
    }
  }
  static initializeChildrenOnConstruction = false;
  createGraphicalObject() {
    if (!(Number.isFinite(this.doenetSvData.numericalCenter[0]) && Number.isFinite(this.doenetSvData.numericalCenter[1]) && this.doenetSvData.numericalRadius > 0)) {
      return;
    }
    var jsxCircleAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: !this.doenetSvData.draggable || this.doenetSvData.fixed,
      layer: 10 * this.doenetSvData.layer + 5,
      strokeColor: this.doenetSvData.selectedStyle.lineColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.lineColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle)
    };
    if (!this.doenetSvData.draggable || this.doenetSvData.fixed) {
      jsxCircleAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }
    this.circleJXG = this.props.board.create("circle", [[...this.doenetSvData.numericalCenter], this.doenetSvData.numericalRadius], jsxCircleAttributes);
    this.circleJXG.on("drag", function(e) {
      this.dragged = true;
      this.onDragHandler(e);
    }.bind(this));
    this.circleJXG.on("up", function(e) {
      if (this.dragged) {
        this.actions.finalizeCirclePosition();
      }
    }.bind(this));
    this.circleJXG.on("down", function(e) {
      this.dragged = false;
      this.pointerAtDown = [e.x, e.y];
      this.centerAtDown = [...this.circleJXG.center.coords.scrCoords];
      this.radiusAtDown = this.circleJXG.radius;
      this.throughAnglesAtDown = [...this.doenetSvData.throughAngles];
    }.bind(this));
    this.previousWithLabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    return this.circleJXG;
  }
  deleteGraphicalObject() {
    this.circleJXG.off("drag");
    this.circleJXG.off("up");
    this.circleJXG.off("down");
    this.props.board.removeObject(this.circleJXG);
    delete this.circleJXG;
  }
  componentWillUnmount() {
    if (this.circleJXG) {
      this.deleteGraphicalObject();
    }
  }
  update({sourceOfUpdate}) {
    if (!this.props.board) {
      this.forceUpdate();
      return;
    }
    if (this.circleJXG === void 0) {
      return this.createGraphicalObject();
    }
    if (!(Number.isFinite(this.doenetSvData.numericalCenter[0]) && Number.isFinite(this.doenetSvData.numericalCenter[1]) && this.doenetSvData.numericalRadius > 0)) {
      return this.deleteGraphicalObject();
    }
    if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
      this.props.board.itemsRenderedLowQuality[this.componentName] = this.circleJXG;
    }
    let validCoords = this.doenetSvData.numericalCenter.every((x) => Number.isFinite(x));
    this.circleJXG.center.coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.numericalCenter]);
    this.circleJXG.setRadius(this.doenetSvData.numericalRadius);
    let visible = !this.doenetSvData.hidden;
    if (validCoords) {
      this.circleJXG.visProp["visible"] = visible;
      this.circleJXG.visPropCalc["visible"] = visible;
    } else {
      this.circleJXG.visProp["visible"] = false;
      this.circleJXG.visPropCalc["visible"] = false;
    }
    this.circleJXG.name = this.doenetSvData.label;
    let withlabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    if (withlabel != this.previousWithLabel) {
      this.circleJXG.setAttribute({withlabel});
      this.previousWithLabel = withlabel;
    }
    this.circleJXG.needsUpdate = true;
    this.circleJXG.update();
    if (this.circleJXG.hasLabel) {
      this.circleJXG.label.needsUpdate = true;
      this.circleJXG.label.update();
    }
    this.props.board.updateRenderer();
  }
  onDragHandler(e) {
    if (this.dragged) {
      let centerCoords = this.calculateCenterPosition(e);
      this.actions.moveCircle({
        center: centerCoords,
        radius: this.radiusAtDown,
        throughAngles: this.throughAnglesAtDown,
        transient: true
      });
    }
  }
  calculateCenterPosition(e) {
    var o = this.props.board.origin.scrCoords;
    let calculatedX = (this.centerAtDown[1] + e.x - this.pointerAtDown[0] - o[1]) / this.props.board.unitX;
    let calculatedY = (o[2] - (this.centerAtDown[2] + e.y - this.pointerAtDown[1])) / this.props.board.unitY;
    return [calculatedX, calculatedY];
  }
  render() {
    if (this.props.board) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), this.children);
    }
    if (this.doenetSvData.hidden) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }));
  }
}
function styleToDash(style) {
  if (style === "solid") {
    return 0;
  } else if (style === "dashed") {
    return 2;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}
