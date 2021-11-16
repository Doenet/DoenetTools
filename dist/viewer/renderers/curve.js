import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class FunctionCurve extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.dragThroughPoint = this.dragThroughPoint.bind(this);
    this.dragControlPoint = this.dragControlPoint.bind(this);
    this.downThroughPoint = this.downThroughPoint.bind(this);
    this.upBoard = this.upBoard.bind(this);
    this.downOther = this.downOther.bind(this);
    if (props.board) {
      this.createGraphicalObject();
      this.doenetPropsForChildren = {board: this.props.board};
      this.initializeChildren();
    }
  }
  static initializeChildrenOnConstruction = false;
  createGraphicalObject() {
    if (this.doenetSvData.curveType === "bezier" && this.doenetSvData.numericalThroughPoints.length < 2) {
      return;
    }
    var curveAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: true,
      layer: 10 * this.doenetSvData.layer + 5,
      strokeColor: this.doenetSvData.selectedStyle.lineColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.lineColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle)
    };
    if (this.doenetSvData.showLabel && this.doenetSvData.label !== "") {
      let anchorx, offset, position;
      console.log(`labelPosition: ${this.doenetSvData.labelPosition}`);
      if (this.doenetSvData.labelPosition === "upperright") {
        position = "urt";
        offset = [-5, -10];
        anchorx = "right";
      } else if (this.doenetSvData.labelPosition === "upperleft") {
        position = "ulft";
        offset = [5, -10];
        anchorx = "left";
      } else if (this.doenetSvData.labelPosition === "lowerright") {
        position = "lrt";
        offset = [-5, 10];
        anchorx = "right";
      } else if (this.doenetSvData.labelPosition === "lowerleft") {
        position = "llft";
        offset = [5, 10];
        anchorx = "left";
      } else if (this.doenetSvData.labelPosition === "top") {
        position = "top";
        offset = [0, -10];
        anchorx = "left";
      } else if (this.doenetSvData.labelPosition === "bottom") {
        position = "bot";
        offset = [0, 10];
        anchorx = "left";
      } else if (this.doenetSvData.labelPosition === "left") {
        position = "lft";
        offset = [10, 0];
        anchorx = "left";
      } else {
        position = "rt";
        offset = [-10, 0];
        anchorx = "right";
      }
      curveAttributes.label = {
        offset,
        position,
        anchorx
      };
    }
    if (!this.doenetSvData.draggable) {
      curveAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }
    if (["parameterization", "bezier"].includes(this.doenetSvData.curveType)) {
      this.curveJXG = this.props.board.create("curve", [
        this.doenetSvData.fs[0],
        this.doenetSvData.fs[1],
        this.doenetSvData.parMin,
        this.doenetSvData.parMax
      ], curveAttributes);
    } else {
      if (this.doenetSvData.flipFunction) {
        let ymin = this.doenetSvData.graphYmin;
        let ymax = this.doenetSvData.graphYmax;
        let minForF = Math.max(ymin - (ymax - ymin) * 0.1, this.doenetSvData.parMin);
        let maxForF = Math.min(ymax + (ymax - ymin) * 0.1, this.doenetSvData.parMax);
        this.originalCurveJXG = this.props.board.create("functiongraph", [this.doenetSvData.fs[0], minForF, maxForF], {visible: false});
        this.reflectLine = this.props.board.create("line", [0, 1, -1], {visible: false});
        this.curveJXG = this.props.board.create("reflection", [this.originalCurveJXG, this.reflectLine], curveAttributes);
      } else {
        let xmin = this.doenetSvData.graphXmin;
        let xmax = this.doenetSvData.graphXmax;
        let minForF = Math.max(xmin - (xmax - xmin) * 0.1, this.doenetSvData.parMin);
        let maxForF = Math.min(xmax + (xmax - xmin) * 0.1, this.doenetSvData.parMax);
        this.curveJXG = this.props.board.create("functiongraph", [this.doenetSvData.fs[0], minForF, maxForF], curveAttributes);
      }
      this.previousFlipFunction = this.doenetSvData.flipFunction;
    }
    this.previousCurveType = this.doenetSvData.curveType;
    if (this.doenetSvData.curveType === "bezier") {
      this.props.board.on("up", this.upBoard);
      this.curveJXG.on("down", this.downOther);
      this.segmentAttributes = {
        visible: false,
        withLabel: false,
        fixed: true,
        strokeColor: "lightgray",
        highlightStrokeColor: "lightgray",
        layer: 10 * this.doenetSvData.layer + 7,
        strokeWidth: 1,
        highlightStrokeWidth: 1
      };
      this.throughPointAttributes = {
        visible: !this.doenetSvData.hidden,
        withLabel: false,
        fixed: false,
        fillColor: "none",
        strokeColor: "none",
        highlightFillColor: "lightgray",
        highlightStrokeColor: "lightgray",
        strokeWidth: 1,
        highlightStrokeWidth: 1,
        layer: 10 * this.doenetSvData.layer + 7,
        size: 3
      };
      this.throughPointAlwaysVisible = {
        fillcolor: "lightgray",
        strokecolor: "lightgray"
      };
      this.throughPointHoverVisible = {
        fillcolor: "none",
        strokecolor: "none"
      };
      this.controlPointAttributes = {
        visible: false,
        withLabel: false,
        fixed: false,
        fillColor: "gray",
        strokeColor: "gray",
        highlightFillColor: "gray",
        highlightStrokeColor: "gray",
        strokeWidth: 1,
        highlightStrokeWidth: 1,
        layer: 10 * this.doenetSvData.layer + 8,
        size: 2
      };
      if (!this.doenetSvData.draggable) {
        return this.curveJXG;
      }
      this.createControls();
      if (this.doenetSvData.bezierControlsAlwaysVisible) {
        this.makeThroughPointsAlwaysVisible();
        this.showAllControls();
      }
      this.props.board.updateRenderer();
      this.previousNumberOfPoints = this.doenetSvData.numericalThroughPoints.length;
      this.previousVectorControlDirections = [...this.doenetSvData.vectorControlDirections];
    }
    return this.curveJXG;
  }
  createControls() {
    this.throughPointsJXG = [];
    this.controlPointsJXG = [];
    this.segmentsJXG = [];
    let downTP = this.downThroughPoint;
    let dragTP = this.dragThroughPoint;
    let dragCP = this.dragControlPoint;
    let downO = this.downOther;
    for (let i = 0; i < this.doenetSvData.numericalThroughPoints.length; i++) {
      let tp = this.props.board.create("point", [...this.doenetSvData.numericalThroughPoints[i]], this.throughPointAttributes);
      this.throughPointsJXG.push(tp);
      let cp1 = this.props.board.create("point", [...this.doenetSvData.numericalControlPoints[i][0]], this.controlPointAttributes);
      let cp2 = this.props.board.create("point", [...this.doenetSvData.numericalControlPoints[i][1]], this.controlPointAttributes);
      this.controlPointsJXG.push([cp1, cp2]);
      let seg1 = this.props.board.create("segment", [tp, cp1], this.segmentAttributes);
      let seg2 = this.props.board.create("segment", [tp, cp2], this.segmentAttributes);
      this.segmentsJXG.push([seg1, seg2]);
      tp.on("drag", (e) => dragTP(i, true, e));
      tp.on("down", (e) => downTP(i, e));
      tp.on("up", (e) => dragTP(i, false, e));
      cp1.on("drag", (e) => dragCP(i, 0, true, e));
      cp2.on("drag", (e) => dragCP(i, 1, true, e));
      cp1.on("down", downO);
      cp2.on("down", downO);
      seg1.on("down", downO);
      seg1.on("down", downO);
      cp1.on("up", (e) => dragCP(i, 0, false, e));
      cp2.on("up", (e) => dragCP(i, 1, false, e));
    }
    this.vectorControlsVisible = [];
  }
  deleteControls() {
    if (this.segmentsJXG) {
      this.segmentsJXG.forEach((x) => x.forEach((y) => {
        if (y) {
          y.off("down");
          this.props.board.removeObject(y);
        }
      }));
      this.segmentsJXG = [];
      this.controlPointsJXG.forEach((x) => x.forEach((y) => {
        if (y) {
          y.off("drag");
          y.off("down");
          y.off("up");
          this.props.board.removeObject(y);
        }
      }));
      this.controlPointsJXG = [];
      this.throughPointsJXG.forEach((x) => {
        x.off("drag");
        x.off("down");
        x.off("up");
        this.props.board.removeObject(x);
      });
      this.throughPointsJXG = [];
    }
  }
  deleteGraphicalObject() {
    this.props.board.off("up", this.upBoard);
    this.curveJXG.off("down");
    this.props.board.removeObject(this.curveJXG);
    delete this.curveJXG;
    if (this.reflectLine !== void 0) {
      this.props.board.removeObject(this.reflectLine);
      delete this.reflectLine;
      this.props.board.removeObject(this.originalCurveJXG);
      delete this.originalCurveJXG;
    }
    this.deleteControls();
  }
  componentWillUnmount() {
    if (this.curveJXG) {
      this.deleteGraphicalObject();
    }
  }
  dragThroughPoint(i, transient) {
    if (transient) {
      this.draggedThroughPoint = i;
    } else if (this.draggedThroughPoint !== i) {
      return;
    }
    let tpcoords = [this.throughPointsJXG[i].X(), this.throughPointsJXG[i].Y()];
    this.actions.moveThroughPoint({
      throughPoint: tpcoords,
      throughPointInd: i,
      transient,
      skippable: transient
    });
  }
  dragControlPoint(point, i, transient) {
    if (transient) {
      this.draggedControlPoint = point + "_" + i;
    } else if (this.draggedControlPoint !== point + "_" + i) {
      return;
    }
    this.actions.moveControlVector({
      controlVector: [
        this.controlPointsJXG[point][i].X() - this.throughPointsJXG[point].X(),
        this.controlPointsJXG[point][i].Y() - this.throughPointsJXG[point].Y()
      ],
      controlVectorInds: [point, i],
      transient,
      skippable: transient
    });
  }
  makeThroughPointsAlwaysVisible() {
    for (let point of this.throughPointsJXG) {
      for (let attribute in this.throughPointAlwaysVisible) {
        point.visProp[attribute] = this.throughPointAlwaysVisible[attribute];
      }
      point.needsUpdate = true;
      point.update();
    }
  }
  makeThroughPointsHoverVisible() {
    for (let point of this.throughPointsJXG) {
      for (let attribute in this.throughPointHoverVisible) {
        point.visProp[attribute] = this.throughPointHoverVisible[attribute];
      }
      point.needsUpdate = true;
      point.update();
    }
  }
  hideAllControls() {
    for (let controlPair of this.controlPointsJXG) {
      for (let cp of controlPair) {
        if (cp) {
          cp.visProp.visible = false;
          cp.needsUpdate = true;
          cp.update();
        }
      }
    }
    for (let segmentPair of this.segmentsJXG) {
      for (let seg of segmentPair) {
        if (seg) {
          seg.visProp.visible = false;
          seg.needsUpdate = true;
          seg.update();
        }
      }
    }
    this.vectorControlsVisible = [];
  }
  showAllControls() {
    for (let ind in this.controlPointsJXG) {
      this.makeVectorControlVisible(ind);
    }
  }
  upBoard() {
    if (!this.doenetSvData.draggable) {
      return;
    }
    if (this.hitObject !== true && !this.doenetSvData.bezierControlsAlwaysVisible) {
      this.makeThroughPointsHoverVisible();
      this.hideAllControls();
      this.props.board.updateRenderer();
    }
    this.hitObject = false;
  }
  downThroughPoint(i, e) {
    if (!this.doenetSvData.draggable) {
      return;
    }
    this.draggedThroughPoint = null;
    this.draggedControlPoint = null;
    this.hitObject = true;
    this.makeThroughPointsAlwaysVisible();
    this.makeVectorControlVisible(i);
    this.props.board.updateRenderer();
  }
  makeVectorControlVisible(i) {
    if (!this.doenetSvData.hiddenControls[i]) {
      if (this.controlPointsJXG[i][0]) {
        let isVisible = (i > 0 || this.doenetSvData.extrapolateBackward) && ["symmetric", "both", "previous"].includes(this.doenetSvData.vectorControlDirections[i]);
        this.controlPointsJXG[i][0].visProp.visible = isVisible;
        this.controlPointsJXG[i][0].visPropCalc.visible = isVisible;
        this.controlPointsJXG[i][0].needsUpdate = true;
        this.controlPointsJXG[i][0].update();
        this.segmentsJXG[i][0].visProp.visible = isVisible;
        this.segmentsJXG[i][0].visPropCalc.visible = isVisible;
        this.segmentsJXG[i][0].needsUpdate = true;
        this.segmentsJXG[i][0].update();
      }
      if (this.controlPointsJXG[i][1]) {
        let isVisible = (i < this.throughPointsJXG.length - 1 || this.doenetSvData.extrapolateForward) && ["symmetric", "both", "next"].includes(this.doenetSvData.vectorControlDirections[i]);
        this.controlPointsJXG[i][1].visProp.visible = isVisible;
        this.controlPointsJXG[i][1].visPropCalc.visible = isVisible;
        this.controlPointsJXG[i][1].needsUpdate = true;
        this.controlPointsJXG[i][1].update();
        this.segmentsJXG[i][1].visProp.visible = isVisible;
        this.segmentsJXG[i][1].visPropCalc.visible = isVisible;
        this.segmentsJXG[i][1].needsUpdate = true;
        this.segmentsJXG[i][1].update();
      }
      this.vectorControlsVisible[i] = true;
    }
  }
  downOther() {
    if (!this.doenetSvData.draggable) {
      return;
    }
    this.draggedThroughPoint = null;
    this.draggedControlPoint = null;
    this.hitObject = true;
    this.makeThroughPointsAlwaysVisible();
    this.props.board.updateRenderer();
  }
  update({sourceOfUpdate}) {
    if (!this.props.board) {
      this.forceUpdate();
      return;
    }
    if (this.curveJXG === void 0) {
      return this.createGraphicalObject();
    }
    if (this.doenetSvData.curveType === "bezier" && this.doenetSvData.numericalThroughPoints.length < 2) {
      this.deleteGraphicalObject();
      return;
    }
    if (this.previousCurveType !== this.doenetSvData.curveType || this.previousCurveType === "function" && this.previousFlipFunction !== this.doenetSvData.flipFunction) {
      this.deleteGraphicalObject();
      let result = this.createGraphicalObject();
      if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
        if (this.doenetSvData.curveType === "function" && this.doenetSvData.flipFunction) {
          this.props.board.itemsRenderedLowQuality[this._key] = this.originalCurveJXG;
        } else {
          this.props.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
        }
      }
      return result;
    }
    if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
      this.props.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
    }
    let visible = !this.doenetSvData.hidden;
    this.curveJXG.name = this.doenetSvData.label;
    this.curveJXG.visProp["visible"] = visible;
    this.curveJXG.visPropCalc["visible"] = visible;
    if (["parameterization", "bezier"].includes(this.doenetSvData.curveType)) {
      this.curveJXG.X = this.doenetSvData.fs[0];
      this.curveJXG.Y = this.doenetSvData.fs[1];
      this.curveJXG.minX = () => this.doenetSvData.parMin;
      this.curveJXG.maxX = () => this.doenetSvData.parMax;
    } else {
      if (this.doenetSvData.flipFunction) {
        this.originalCurveJXG.Y = this.doenetSvData.fs[0];
        let ymin = this.doenetSvData.graphYmin;
        let ymax = this.doenetSvData.graphYmax;
        let minForF = Math.max(ymin - (ymax - ymin) * 0.1, this.doenetSvData.parMin);
        let maxForF = Math.min(ymax + (ymax - ymin) * 0.1, this.doenetSvData.parMax);
        this.originalCurveJXG.minX = () => minForF;
        this.originalCurveJXG.maxX = () => maxForF;
        this.originalCurveJXG.needsUpdate = true;
        this.originalCurveJXG.updateCurve();
        if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
          this.props.board.itemsRenderedLowQuality[this._key] = this.originalCurveJXG;
        }
      } else {
        this.curveJXG.Y = this.doenetSvData.fs[0];
        let xmin = this.doenetSvData.graphXmin;
        let xmax = this.doenetSvData.graphXmax;
        let minForF = Math.max(xmin - (xmax - xmin) * 0.1, this.doenetSvData.parMin);
        let maxForF = Math.min(xmax + (xmax - xmin) * 0.1, this.doenetSvData.parMax);
        this.curveJXG.minX = () => minForF;
        this.curveJXG.maxX = () => maxForF;
      }
    }
    this.curveJXG.needsUpdate = true;
    this.curveJXG.updateCurve();
    if (this.curveJXG.hasLabel) {
      this.curveJXG.label.needsUpdate = true;
      this.curveJXG.label.visPropCalc.visible = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
      this.curveJXG.label.update();
    }
    if (this.doenetSvData.curveType !== "bezier") {
      this.props.board.updateRenderer();
      return;
    }
    if (!this.doenetSvData.draggable) {
      if (this.segmentsJXG) {
        this.deleteControls();
      }
      this.props.board.updateRenderer();
      return;
    }
    if (!this.segmentsJXG) {
      this.createControls();
      this.previousNumberOfPoints = this.doenetSvData.numericalThroughPoints.length;
      this.previousVectorControlDirections = [...this.doenetSvData.vectorControlDirections];
      this.props.board.updateRenderer();
      return;
    }
    let downTP = this.downThroughPoint;
    let dragTP = this.dragThroughPoint;
    let dragCP = this.dragControlPoint;
    let downO = this.downOther;
    if (this.doenetSvData.numericalThroughPoints.length > this.previousNumberOfPoints) {
      let iPreviousLast = this.previousNumberOfPoints - 1;
      let attributesForNewThroughPoints = Object.assign({}, this.throughPointAttributes);
      if (this.throughPointsJXG[iPreviousLast].visProp.fillcolor === this.throughPointAlwaysVisible.fillcolor) {
        Object.assign(attributesForNewThroughPoints, this.throughPointAlwaysVisible);
      }
      for (let i = this.previousNumberOfPoints; i < this.doenetSvData.numericalThroughPoints.length; i++) {
        let tp = this.props.board.create("point", [...this.doenetSvData.numericalThroughPoints[i]], attributesForNewThroughPoints);
        this.throughPointsJXG.push(tp);
        let cp1 = this.props.board.create("point", [...this.doenetSvData.numericalControlPoints[i][0]], this.controlPointAttributes);
        let cp2 = this.props.board.create("point", [...this.doenetSvData.numericalControlPoints[i][1]], this.controlPointAttributes);
        this.controlPointsJXG.push([cp1, cp2]);
        let seg1 = this.props.board.create("segment", [tp, cp1], this.segmentAttributes);
        let seg2 = this.props.board.create("segment", [tp, cp2], this.segmentAttributes);
        this.segmentsJXG.push([seg1, seg2]);
        cp1.visProp.visible = false;
        seg1.visProp.visible = false;
        cp2.visProp.visible = false;
        seg2.visProp.visible = false;
        tp.on("drag", (e) => dragTP(i, true, e));
        tp.on("down", (e) => downTP(i, e));
        tp.on("up", (e) => dragTP(i, false, e));
        cp1.on("drag", (e) => dragCP(i, 0, true, e));
        cp1.on("down", downO);
        cp1.on("up", (e) => dragCP(i, 0, false, e));
        cp2.on("drag", (e) => dragCP(i, 1, true, e));
        cp2.on("down", downO);
        cp2.on("up", (e) => dragCP(i, 1, false, e));
        seg1.on("down", downO);
        seg2.on("down", downO);
      }
      if (this.vectorControlsVisible[iPreviousLast]) {
        this.makeVectorControlVisible(iPreviousLast);
      }
    } else if (this.doenetSvData.numericalThroughPoints.length < this.previousNumberOfPoints) {
      for (let i = this.previousNumberOfPoints - 1; i >= this.doenetSvData.numericalThroughPoints.length; i--) {
        this.segmentsJXG[i][0].off("down");
        this.segmentsJXG[i][1].off("down");
        this.props.board.removeObject(this.segmentsJXG[i][0]);
        this.props.board.removeObject(this.segmentsJXG[i][1]);
        this.segmentsJXG.pop();
        this.controlPointsJXG[i][0].off("drag");
        this.controlPointsJXG[i][0].off("down");
        this.controlPointsJXG[i][0].off("up");
        this.controlPointsJXG[i][1].off("drag");
        this.controlPointsJXG[i][1].off("down");
        this.controlPointsJXG[i][1].off("up");
        this.props.board.removeObject(this.controlPointsJXG[i][0]);
        this.props.board.removeObject(this.controlPointsJXG[i][1]);
        this.controlPointsJXG.pop();
        let tp = this.throughPointsJXG.pop();
        tp.off("drag");
        tp.off("down");
        tp.off("up");
        this.props.board.removeObject(tp);
      }
      let iNewLast = this.doenetSvData.numericalThroughPoints.length - 1;
      if (this.vectorControlsVisible[iNewLast]) {
        this.makeVectorControlVisible(iNewLast);
      }
    }
    let nOld = Math.min(this.doenetSvData.numericalThroughPoints.length, this.previousNumberOfPoints);
    for (let i = 0; i < nOld; i++) {
      if (this.previousVectorControlDirections[i] !== this.doenetSvData.vectorControlDirections[i] && this.vectorControlsVisible[i]) {
        this.makeVectorControlVisible(i);
      }
      this.throughPointsJXG[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.numericalThroughPoints[i]]);
      this.throughPointsJXG[i].needsUpdate = true;
      this.throughPointsJXG[i].update();
      this.controlPointsJXG[i][0].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.numericalControlPoints[i][0]]);
      this.controlPointsJXG[i][0].needsUpdate = true;
      this.controlPointsJXG[i][0].update();
      this.segmentsJXG[i][0].needsUpdate = true;
      this.segmentsJXG[i][0].update();
      this.controlPointsJXG[i][1].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.numericalControlPoints[i][1]]);
      this.controlPointsJXG[i][1].needsUpdate = true;
      this.controlPointsJXG[i][1].update();
      this.segmentsJXG[i][1].needsUpdate = true;
      this.segmentsJXG[i][1].update();
    }
    for (let i = 0; i < this.doenetSvData.numericalThroughPoints.length; i++) {
      this.throughPointsJXG[i].visProp["visible"] = !this.doenetSvData.hidden;
      this.throughPointsJXG[i].visPropCalc["visible"] = !this.doenetSvData.hidden;
    }
    if (this.componentName in sourceOfUpdate.sourceInformation) {
      let ind = sourceOfUpdate.sourceInformation.throughPointMoved;
      if (ind !== void 0) {
        this.props.board.updateInfobox(this.throughPointsJXG[ind]);
      } else {
        ind = sourceOfUpdate.sourceInformation.controlVectorMoved;
        if (ind !== void 0) {
          this.props.board.updateInfobox(this.controlPointsJXG[ind[0]][ind[1]]);
        }
      }
    }
    this.previousNumberOfPoints = this.doenetSvData.numericalThroughPoints.length;
    this.previousVectorControlDirections = [...this.doenetSvData.vectorControlDirections];
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
