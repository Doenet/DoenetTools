import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Line extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.onDragHandler = this.onDragHandler.bind(this);
    if (props.board) {
      this.createGraphicalObject();
      this.doenetPropsForChildren = {board: this.props.board};
      this.initializeChildren();
    }
  }
  static initializeChildrenOnConstruction = false;
  createGraphicalObject() {
    if (this.doenetSvData.numericalVertices.length !== this.doenetSvData.nVertices || this.doenetSvData.numericalVertices.some((x2) => x2.length !== 2)) {
      return;
    }
    let validCoords = true;
    for (let coords of this.doenetSvData.numericalVertices) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }
    this.jsxPolylineAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden && validCoords,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: !this.doenetSvData.draggable || this.doenetSvData.fixed,
      layer: 10 * this.doenetSvData.layer + 7,
      strokeColor: this.doenetSvData.selectedStyle.lineColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.lineColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle)
    };
    if (!this.doenetSvData.draggable || this.doenetSvData.fixed) {
      this.jsxPolylineAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }
    this.jsxPointAttributes = Object.assign({}, this.jsxPolylineAttributes);
    Object.assign(this.jsxPointAttributes, {
      withLabel: false,
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: "lightgray",
      layer: 10 * this.doenetSvData.layer + 9
    });
    if (!this.doenetSvData.draggable || this.doenetSvData.fixed || this.doenetSvData.hidden || !validCoords) {
      this.jsxPointAttributes.visible = false;
    }
    this.pointsJXG = [];
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      this.pointsJXG.push(this.props.board.create("point", [...this.doenetSvData.numericalVertices[i]], this.jsxPointAttributes));
    }
    let x = [], y = [];
    this.doenetSvData.numericalVertices.forEach((z) => {
      x.push(z[0]);
      y.push(z[1]);
    });
    this.polylineJXG = this.props.board.create("curve", [x, y], this.jsxPolylineAttributes);
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      this.pointsJXG[i].on("drag", (x2) => this.onDragHandler(i, true));
      this.pointsJXG[i].on("up", (x2) => this.onDragHandler(i, false));
      this.pointsJXG[i].on("down", (x2) => this.draggedPoint = null);
    }
    this.polylineJXG.on("drag", (e) => this.onDragHandler(-1, true, e));
    this.polylineJXG.on("up", function(e) {
      if (this.draggedPoint === -1) {
        this.actions.finalizePolylinePosition();
      }
    }.bind(this));
    this.polylineJXG.on("down", function(e) {
      this.draggedPoint = null;
      this.pointerAtDown = [e.x, e.y];
      this.pointsAtDown = this.polylineJXG.points.map((x2) => [...x2.scrCoords]);
    }.bind(this));
    this.previousWithLabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    this.previousNVertices = this.doenetSvData.nVertices;
    return this.polylineJXG;
  }
  deleteGraphicalObject() {
    this.polylineJXG.off("drag");
    this.polylineJXG.off("down");
    this.polylineJXG.off("up");
    this.props.board.removeObject(this.polylineJXG);
    delete this.polylineJXG;
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      this.pointsJXG[i].off("drag");
      this.pointsJXG[i].off("down");
      this.pointsJXG[i].off("up");
      this.props.board.removeObject(this.pointsJXG[i]);
      delete this.pointsJXG[i];
    }
  }
  componentWillUnmount() {
    if (this.polylineJXG) {
      this.deleteGraphicalObject();
    }
  }
  update({sourceOfUpdate}) {
    if (!this.props.board) {
      this.forceUpdate();
      return;
    }
    if (this.polylineJXG === void 0) {
      return this.createGraphicalObject();
    }
    let validCoords = true;
    for (let coords of this.doenetSvData.numericalVertices) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }
    if (this.doenetSvData.nVertices > this.previousNVertices) {
      for (let i = this.previousNVertices; i < this.doenetSvData.nVertices; i++) {
        this.pointsJXG.push(this.props.board.create("point", [...this.doenetSvData.numericalVertices[i]], this.jsxPointAttributes));
        this.polylineJXG.dataX.length = this.doenetSvData.nVertices;
        this.pointsJXG[i].on("drag", (x) => this.onDragHandler(i, true));
        this.pointsJXG[i].on("up", (x) => this.onDragHandler(i, false));
        this.pointsJXG[i].on("down", (x) => this.draggedPoint = null);
      }
    } else if (this.doenetSvData.nVertices < this.previousNVertices) {
      for (let i = this.doenetSvData.nVertices; i < this.previousNVertices; i++) {
        let pt = this.pointsJXG.pop();
        pt.off("drag");
        pt.off("down");
        pt.off("up");
        this.props.board.removeObject(pt);
      }
      this.polylineJXG.dataX.length = this.doenetSvData.nVertices;
    }
    this.previousNVertices = this.doenetSvData.nVertices;
    this.polylineJXG.updateTransformMatrix();
    let shiftX = this.polylineJXG.transformMat[1][0];
    let shiftY = this.polylineJXG.transformMat[2][0];
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      this.pointsJXG[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.numericalVertices[i]]);
      this.polylineJXG.dataX[i] = this.doenetSvData.numericalVertices[i][0] - shiftX;
      this.polylineJXG.dataY[i] = this.doenetSvData.numericalVertices[i][1] - shiftY;
    }
    let visible = !this.doenetSvData.hidden;
    if (validCoords) {
      this.polylineJXG.visProp["visible"] = visible;
      this.polylineJXG.visPropCalc["visible"] = visible;
      let pointsVisible = visible && this.doenetSvData.draggable && !this.doenetSvData.fixed;
      for (let i = 0; i < this.doenetSvData.nVertices; i++) {
        this.pointsJXG[i].visProp["visible"] = pointsVisible;
        this.pointsJXG[i].visPropCalc["visible"] = pointsVisible;
      }
    } else {
      this.polylineJXG.visProp["visible"] = false;
      this.polylineJXG.visPropCalc["visible"] = false;
      for (let i = 0; i < this.doenetSvData.nVertices; i++) {
        this.pointsJXG[i].visProp["visible"] = false;
        this.pointsJXG[i].visPropCalc["visible"] = false;
      }
    }
    if (this.componentName in sourceOfUpdate.sourceInformation) {
      let vertexUpdated = sourceOfUpdate.sourceInformation[this.componentName].vertex;
      if (Number.isFinite(vertexUpdated)) {
        this.props.board.updateInfobox(this.pointsJXG[vertexUpdated]);
      }
    }
    this.polylineJXG.needsUpdate = true;
    this.polylineJXG.update().updateVisibility();
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      this.pointsJXG[i].needsUpdate = true;
      this.pointsJXG[i].update();
    }
    this.props.board.updateRenderer();
  }
  onDragHandler(i, transient, e) {
    if (transient) {
      this.draggedPoint = i;
    } else if (this.draggedPoint !== i) {
      return;
    }
    if (i === -1) {
      let pointCoords = this.calculatePointPositions(e);
      this.actions.movePolyline({pointCoords, transient, skippable: transient});
    } else {
      let pointCoords = {};
      pointCoords[i] = [this.pointsJXG[i].X(), this.pointsJXG[i].Y()];
      this.actions.movePolyline({
        pointCoords,
        transient,
        skippable: transient,
        sourceInformation: {vertex: i}
      });
    }
  }
  calculatePointPositions(e) {
    var o = this.props.board.origin.scrCoords;
    let pointCoords = [];
    for (let i = 0; i < this.polylineJXG.points.length; i++) {
      let calculatedX = (this.pointsAtDown[i][1] + e.x - this.pointerAtDown[0] - o[1]) / this.props.board.unitX;
      let calculatedY = (o[2] - (this.pointsAtDown[i][2] + e.y - this.pointerAtDown[1])) / this.props.board.unitY;
      pointCoords.push([calculatedX, calculatedY]);
    }
    return pointCoords;
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
