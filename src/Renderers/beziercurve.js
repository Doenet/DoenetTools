import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class BezierCurve extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.dragThroughPoint = this.dragThroughPoint.bind(this);
    this.dragControlPoint = this.dragControlPoint.bind(this);
    this.downThroughPoint = this.downThroughPoint.bind(this);
    this.upThroughPoint = this.upThroughPoint.bind(this);
    this.upBoard = this.upBoard.bind(this);
    this.downOther = this.downOther.bind(this);
    this.upOther = this.upOther.bind(this);

    if (props.board) {
      this.createGraphicalObject();

      this.doenetPropsForChildren = { board: this.props.board };
      this.initializeChildren();
    }
  }

  static initializeChildrenOnConstruction = false;

  createGraphicalObject() {

    if (this.doenetSvData.throughPointsNumeric.length < 2) {
      return;
    }

    //things to be passed to JSXGraph as attributes
    var curveAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hide,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: true,
      layer: 10 * this.doenetSvData.layer + 5,
      strokeColor: this.doenetSvData.selectedStyle.markerColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.markerColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
    };

    if (!this.doenetSvData.draggable) {
      curveAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }

    this.curveJXG = this.props.board.create('curve', [
      x => this.doenetSvData.f(x, 0),
      y => this.doenetSvData.f(y, 1),
      this.doenetSvData.parameterizationMin,
      this.doenetSvData.parameterizationMax
    ], curveAttributes);


    this.startClickOnPoint = [];
    this.positionStartClick = [];

    this.props.board.on('up', this.upBoard);
    this.curveJXG.on('down', this.downOther);
    this.curveJXG.on('up', this.upOther);

    this.segmentAttributes = {
      visible: false,
      withLabel: false,
      fixed: true,
      strokeColor: 'lightgray',
      highlightStrokeColor: 'lightgray',
      layer: 10 * this.doenetSvData.layer + 7,
      strokeWidth: 1,
      highlightStrokeWidth: 1,
    };
    this.throughPointAttributes = {
      visible: !this.doenetSvData.hide,
      withLabel: false,
      fixed: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightFillColor: 'lightgray',
      highlightStrokeColor: 'lightgray',
      strokeWidth: 1,
      highlightStrokeWidth: 1,
      layer: 10 * this.doenetSvData.layer + 7,
      size: 3,
    };
    this.throughPointAlwaysVisible = {
      fillcolor: 'lightgray',
      strokecolor: 'lightgray',
    }
    this.throughPointHoverVisible = {
      fillcolor: 'none',
      strokecolor: 'none',
    }

    this.controlPointAttributes = {
      visible: false,
      withLabel: false,
      fixed: false,
      fillColor: 'gray',
      strokeColor: 'gray',
      highlightFillColor: 'gray',
      highlightStrokeColor: 'gray',
      strokeWidth: 1,
      highlightStrokeWidth: 1,
      layer: 10 * this.doenetSvData.layer + 8,
      size: 2,
    };

    if (!this.doenetSvData.draggable) {
      return this.curveJXG;
    }


    this.createControls();

    this.props.board.updateRenderer();

    this.previousNumberOfPoints = this.doenetSvData.throughPointsNumeric.length;
    this.previousVectorControlDirections = [...this.doenetSvData.vectorControlDirections];

    return this.curveJXG;

  }

  createControls() {
    this.throughPointsJXG = [];
    this.controlPointsJXG = [];
    this.segmentsJXG = [];
    this.throughControlsVisible = [];
    // first through point has one control
    let tp = this.props.board.create('point', [...this.doenetSvData.throughPointsNumeric[0]], this.throughPointAttributes);
    this.throughPointsJXG.push(tp);
    let cp = this.props.board.create('point', [...this.doenetSvData.controlPointsNumeric[0][1]], this.controlPointAttributes);
    this.controlPointsJXG.push([null, cp]);
    let seg = this.props.board.create('segment', [tp, cp], this.segmentAttributes);
    this.segmentsJXG.push([null, seg]);
    this.throughControlsVisible.push(false);
    tp.on('drag', e => this.dragThroughPoint(0, e));
    tp.on('down', e => this.downThroughPoint(0, e));
    tp.on('up', e => this.upThroughPoint(0, e));
    cp.on('drag', e => this.dragControlPoint(0, 1, e));
    cp.on('down', this.downOther);
    seg.on('down', this.downOther);
    cp.on('up', this.upOther);
    seg.on('up', this.upOther);
    for (let i = 1; i < this.doenetSvData.throughPointsNumeric.length - 1; i++) {
      // middle through points have two controls
      tp = this.props.board.create('point', [...this.doenetSvData.throughPointsNumeric[i]], this.throughPointAttributes);
      this.throughPointsJXG.push(tp);
      let cp1 = this.props.board.create('point', [...this.doenetSvData.controlPointsNumeric[i][0]], this.controlPointAttributes);
      let cp2 = this.props.board.create('point', [...this.doenetSvData.controlPointsNumeric[i][1]], this.controlPointAttributes);
      this.controlPointsJXG.push([cp1, cp2]);
      let seg1 = this.props.board.create('segment', [tp, cp1], this.segmentAttributes);
      let seg2 = this.props.board.create('segment', [tp, cp2], this.segmentAttributes);
      this.segmentsJXG.push([seg1, seg2]);
      tp.on('drag', e => this.dragThroughPoint(i, e));
      tp.on('down', e => this.downThroughPoint(i, e));
      tp.on('up', e => this.upThroughPoint(i, e));
      cp1.on('drag', e => this.dragControlPoint(i, 0, e));
      cp2.on('drag', e => this.dragControlPoint(i, 1, e));
      cp1.on('down', this.downOther);
      cp2.on('down', this.downOther);
      seg1.on('down', this.downOther);
      seg1.on('down', this.downOther);
      cp1.on('up', this.upOther);
      cp2.on('up', this.upOther);
      seg1.on('up', this.upOther);
      seg1.on('up', this.upOther);
    }
    // last throughPoint has one control
    let n = this.doenetSvData.throughPointsNumeric.length - 1;
    tp = this.props.board.create('point', [...this.doenetSvData.throughPointsNumeric[n]], this.throughPointAttributes);
    this.throughPointsJXG.push(tp);
    cp = this.props.board.create('point', [...this.doenetSvData.controlPointsNumeric[n][0]], this.controlPointAttributes);
    this.controlPointsJXG.push([cp, null]);
    seg = this.props.board.create('segment', [tp, cp], this.segmentAttributes);
    this.segmentsJXG.push([seg, null]);
    tp.on('drag', e => this.dragThroughPoint(n, e));
    tp.on('down', e => this.downThroughPoint(n, e));
    tp.on('up', e => this.upThroughPoint(n, e));
    cp.on('drag', e => this.dragControlPoint(n, 0, e));
    cp.on('down', this.downOther);
    seg.on('down', this.downOther);
    cp.on('up', this.upOther);
    seg.on('up', this.upOther);
  }


  deleteControls() {
    if (this.segmentsJXG) {
      this.segmentsJXG.forEach(x => x.forEach(y => { if (y) { this.props.board.removeObject(y) } }));
      delete this.segmentsJXG;
      this.controlPointsJXG.forEach(x => x.forEach(y => { if (y) { this.props.board.removeObject(y) } }));
      delete this.controlPointsJXG;
      this.throughPointsJXG.forEach(x => this.props.board.removeObject(x));
      delete this.throughPointsJXG;
    }
  }

  deleteGraphicalObject() {
    this.props.board.removeObject(this.curveJXG);
    delete this.curveJXG;

    this.deleteControls();

  }

  componentWillUnmount() {
    if (this.curveJXG) {
      this.deleteGraphicalObject();
    }
  }


  dragThroughPoint(i) {
    let tpcoords = [this.throughPointsJXG[i].X(), this.throughPointsJXG[i].Y()];
    this.actions.moveThroughPoint({
      throughPoint: tpcoords,
      throughPointInd: i,
    });

  }

  dragControlPoint(point, i) {
    // console.log(`drag control point ${point}, ${i}`)
    this.actions.moveControlVector({
      controlVector: [this.controlPointsJXG[point][i].X() - this.throughPointsJXG[point].X(),
      this.controlPointsJXG[point][i].Y() - this.throughPointsJXG[point].Y()],
      controlVectorInds: [point, i],
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
  }

  upBoard() {
    if(!this.doenetSvData.draggable) {
      return;
    }
    if (this.hitObject !== true) {
      this.makeThroughPointsHoverVisible();
      this.hideAllControls();
      this.props.board.updateRenderer();
    }
    this.hitObject = false;
  }

  downThroughPoint(i, e) {
    // console.log(`down through point: ${i}`)
    this.hitObject = true;
    let recordClickStart = true;
    if (this.throughPointsJXG[i].getAttribute("fillcolor") !==
      this.throughPointAlwaysVisible.fillcolor) {
      recordClickStart = false;
    }
    // console.log(`recordClickStart ${recordClickStart}`)
    if (recordClickStart) {
      if (this.doenetSvData.vectorControlDirections[i] !== "none") {
        if (i === 0) {
          recordClickStart = this.controlPointsJXG[0][1].getAttribute("visible");
        } else {
          recordClickStart = this.controlPointsJXG[i][0].getAttribute("visible");
        }
      }
    }
    // console.log(`recordClickStart ${recordClickStart}`)

    if (recordClickStart) {
      this.startClickOnPoint[i] = Date.now();
    }
    // this.positionStartClick[i] = [this.throughPointsJXG[i].X(), this.throughPointsJXG[i].Y()];
    this.positionStartClick[i] = [e.clientX, e.clientY];
    this.makeThroughPointsAlwaysVisible();

    if (i > 0 && ["symmetric", "both", "previous"].includes(this.doenetSvData.vectorControlDirections[i])) {
      this.controlPointsJXG[i][0].visProp.visible = true;
      this.controlPointsJXG[i][0].needsUpdate = true;
      this.controlPointsJXG[i][0].update();
      this.segmentsJXG[i][0].visProp.visible = true;
      this.segmentsJXG[i][0].needsUpdate = true;
      this.segmentsJXG[i][0].update();
    }
    if (i < this.throughPointsJXG.length - 1 && ["symmetric", "both", "next"].includes(this.doenetSvData.vectorControlDirections[i])) {
      this.controlPointsJXG[i][1].visProp.visible = true;
      this.controlPointsJXG[i][1].needsUpdate = true;
      this.controlPointsJXG[i][1].update();
      this.segmentsJXG[i][1].visProp.visible = true;
      this.segmentsJXG[i][1].needsUpdate = true;
      this.segmentsJXG[i][1].update();
    }
    this.props.board.updateRenderer();
  }

  upThroughPoint(i, e) {
    if (this.startClickOnPoint[i] === undefined ||
      Date.now() - this.startClickOnPoint[i] > 1000 ||
      this.positionStartClick[i] === undefined ||
      this.positionStartClick[i][0] !== e.clientX ||
      this.positionStartClick[i][1] !== e.clientY) {
      return
    }

    this.startClickOnPoint[i] = undefined;


    // this.actions.togglePointControl(i);
  }

  downOther() {
    if(!this.doenetSvData.draggable) {
      return;
    }
    this.hitObject = true;
  }

  upOther() {
    if(!this.doenetSvData.draggable) {
      return;
    }
    this.makeThroughPointsAlwaysVisible();
    this.props.board.updateRenderer();
  }

  update({ sourceOfUpdate }) {

    // console.log('update beziercurve')
    // console.log(JSON.parse(JSON.stringify(this.doenetSvData)))

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    if (this.curveJXG === undefined) {
      return this.createGraphicalObject();
    }

    if (this.doenetSvData.throughPointsNumeric.length < 2) {
      this.deleteGraphicalObject();
      return;
    }

    if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
      this.props.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
    }


    let visible = !this.doenetSvData.hide;

    this.curveJXG.name = this.doenetSvData.label;

    this.curveJXG.visProp["visible"] = visible;
    this.curveJXG.visPropCalc["visible"] = visible;


    this.curveJXG.X = x => this.doenetSvData.f(x, 0);
    this.curveJXG.Y = y => this.doenetSvData.f(y, 1);
    this.curveJXG.minX = () => this.doenetSvData.parameterizationMin;
    this.curveJXG.maxX = () => this.doenetSvData.parameterizationMax;


    this.curveJXG.needsUpdate = true;
    this.curveJXG.updateCurve();
    if (this.curveJXG.hasLabel) {
      this.curveJXG.label.needsUpdate = true;
      this.curveJXG.label.visPropCalc.visible = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
      this.curveJXG.label.update();
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

      this.previousNumberOfPoints = this.doenetSvData.throughPointsNumeric.length;
      this.previousVectorControlDirections = [...this.doenetSvData.vectorControlDirections];

      this.props.board.updateRenderer();
      return;
    }


    // TODO: convert this for changing vectorControlDirections

    // for(let i in this.pointCurrentlyControlled) {
    //   if(this.pointCurrentlyControlled[i] !== originalPointCurrentlyControlled[i]) {
    //     let newVis = (this.pointCurrentlyControlled[i] === true);
    //     if(i>0) {
    //       this.controlPointsJXG[2*i-1].visProp.visible = newVis;
    //       this.controlPointsJXG[2*i-1].needsUpdate = true;
    //       this.controlPointsJXG[2*i-1].update();
    //       this.segmentsJXG[2*i-1].visProp.visible = newVis;
    //       this.segmentsJXG[2*i-1].needsUpdate = true;
    //       this.segmentsJXG[2*i-1].update();
    //     }
    //     if(i < this.throughPointsJXG.length-1) {
    //       this.controlPointsJXG[2*i].visProp.visible = newVis;
    //       this.controlPointsJXG[2*i].needsUpdate = true;
    //       this.controlPointsJXG[2*i].update();
    //       this.segmentsJXG[2*i].visProp.visible = newVis;
    //       this.segmentsJXG[2*i].needsUpdate = true;
    //       this.segmentsJXG[2*i].update();
    //     }

    //   }
    // }



    // add or delete segments and points if number changed
    if (this.doenetSvData.throughPointsNumeric.length > this.previousNumberOfPoints) {
      for (let i = this.previousNumberOfPoints; i < this.doenetSvData.throughPointsNumeric.length; i++) {

        // add second control point for previous point
        let cp2 = this.props.board.create('point', [...this.doenetSvData.controlPointsNumeric[i][1]], this.controlPointAttributes);
        this.controlPointsJXG[i - 1][1] = cp2;
        let prevtp = this.throughPointsJXG[i - 1];
        let seg2 = this.props.board.create('segment', [prevtp, cp2], this.segmentAttributes);
        this.segmentsJXG[i - 1][1] = seg2;

        // add point and its first control
        let tp = this.props.board.create('point', [...this.doenetSvData.throughPointsNumeric[i]], this.throughPointAttributes);
        this.throughPointsJXG.push(tp);
        let cp1 = this.props.board.create('point', [...this.doenetSvData.controlPointsNumeric[i][0]], this.controlPointAttributes);
        this.controlPointsJXG.push([cp1, null]);
        let seg1 = this.props.board.create('segment', [tp, cp1], this.segmentAttributes);
        this.segmentsJXG.push([seg1, null]);

        cp1.visProp.visible = false;
        seg1.visProp.visible = false;
        cp2.visProp.visible = false;
        seg2.visProp.visible = false;

        cp2.on('drag', e => this.dragControlPoint(i - 1, 1, e));
        tp.on('drag', e => this.dragThroughpoint(i, e));
        tp.on('down', e => this.downThroughpoint(i, e));
        tp.on('up', e => this.upThroughpoint(i, e));
        cp1.on('drag', e => this.dragControlPoint(i, 0, e));
        cp1.on('down', this.downOther);
        seg1.on('down', this.downOther);
        cp1.on('up', this.upOther);
        seg1.on('up', this.upOther);
        cp2.on('down', this.downOther);
        seg2.on('down', this.downOther);
        cp2.on('up', this.upOther);
        seg2.on('up', this.upOther);

      }
    } else if (this.doenetSvData.throughPointsNumeric.length < this.previousNumberOfPoints) {
      for (let i = this.previousNumberOfPoints - 1; i >= this.doenetSvData.throughPointsNumeric.length; i--) {

        this.props.board.removeObject(this.segmentsJXG[i][0])
        this.segmentsJXG.pop();
        this.props.board.removeObject(this.segmentsJXG[i-1][1]);
        this.segmentsJXG[i-1][1] = null;

        this.props.board.removeObject(this.controlPointsJXG[i][0])
        this.controlPointsJXG.pop();
        this.props.board.removeObject(this.controlPointsJXG[i-1][1]);
        this.controlPointsJXG[i-1][1] = null;

        this.props.board.removeObject(this.throughPointsJXG.pop());
      }
    }

    // move old points
    let nOld = Math.min(this.doenetSvData.throughPointsNumeric.length, this.previousNumberOfPoints);
    this.throughPointsJXG[0].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.throughPointsNumeric[0]]);
    this.throughPointsJXG[0].needsUpdate = true;
    this.throughPointsJXG[0].update();

    for (let i = 1; i < nOld; i++) {
      this.throughPointsJXG[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.throughPointsNumeric[i]]);
      this.throughPointsJXG[i].needsUpdate = true;
      this.throughPointsJXG[i].update();
      this.controlPointsJXG[i][0].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.controlPointsNumeric[i][0]]);
      this.controlPointsJXG[i][0].needsUpdate = true;
      this.controlPointsJXG[i][0].update();
      this.segmentsJXG[i][0].needsUpdate = true;
      this.segmentsJXG[i][0].update();
      this.controlPointsJXG[i-1][1].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.controlPointsNumeric[i-1][1]]);
      this.controlPointsJXG[i-1][1].needsUpdate = true;
      this.controlPointsJXG[i-1][1].update();
      this.segmentsJXG[i-1][1].needsUpdate = true;
      this.segmentsJXG[i-1][1].update();
    }

    for (let i = 0; i < this.doenetSvData.throughPointsNumeric.length; i++) {
      this.throughPointsJXG[i].visProp["visible"] = !this.doenetSvData.hide;
      this.throughPointsJXG[i].visPropCalc["visible"] = !this.doenetSvData.hide;
    }


    if (this.componentName in sourceOfUpdate.sourceInformation) {
      let ind = sourceOfUpdate.sourceInformation.throughPointMoved;
      if(ind !== undefined) {
        this.props.board.updateInfobox(this.throughPointsJXG[ind]);
      } else {
        ind = sourceOfUpdate.sourceInformation.controlVectorMoved;
        if (ind !== undefined) {
          this.props.board.updateInfobox(this.controlPointsJXG[ind[0]][ind[1]]);
        }
      }
    }

    this.previousNumberOfPoints = this.doenetSvData.throughPointsNumeric.length;
    this.previousVectorControlDirections = [...this.doenetSvData.vectorControlDirections];

    this.props.board.updateRenderer();

  }


  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    if (this.props.board) {
      return <><a name={this.componentName} /></>
    }


    // don't think we want to return anything if not in board
    return <><a name={this.componentName} /></>
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
