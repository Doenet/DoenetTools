class CurveRenderer {
  constructor({key, label, curveType, fx, fy, parmin, parmax, flipFunction, 
      draggable, layer=0, throughpoints, controlpoints, pointCurrentlyControlled,
      actions, visible,
      color, width, style}){
    this._key = key;
    this.label = label;
    this.curveType = curveType;
    this.fx = fx;
    this.fy = fy;
    this.parmin = parmin;
    this.parmax = parmax;
    this.flipFunction = flipFunction;
    this.draggable = draggable;
    this.layer = 10*layer + 5;
    this.throughpoints = throughpoints;
    this.controlpoints = controlpoints;
    this.pointCurrentlyControlled = pointCurrentlyControlled;
    this.actions = actions;
    this.color = color;
    this.width = width;
    if(style === "solid") {
      this.dash = 0;
    } else if(style === "dashed") {
      this.dash = 2;
    } else if(style === "dotted") {
      this.dash = 1;
    } else {
      this.dash = 0;
    }
    this.visible = visible;

    this.dragThroughpoint = this.dragThroughpoint.bind(this);
    this.dragControlpoint = this.dragControlpoint.bind(this);
    this.downThroughpoint = this.downThroughpoint.bind(this);
    this.upThroughpoint = this.upThroughpoint.bind(this);
    this.upBoard = this.upBoard.bind(this);
    this.downOther = this.downOther.bind(this);
    this.upOther = this.upOther.bind(this);

  }

  createGraphicalObject(board) {
    this.board = board;

    //things to be passed to JSXGraph as attributes
    var curveAttributes = {
      name: this.label,
      //size: this.size,
      visible: this.visible,
      withLabel: this.label !== "",
      layer: this.layer,
      strokeColor: this.color,
      highlightStrokeColor: this.color,
      strokeWidth: this.width,
      highlightStrokeWidth: this.width,
      dash: this.dash,
    };
    
    if(this.curveType === "function") {
      if(this.flipFunction === true) {
        this.originalCurveJXG = this.board.create('functiongraph', [this.fx], {visible:false});
        this.reflectLine = this.board.create('line', [0,1,-1], {visible: false});
        this.curveJXG = board.create('reflection', [this.originalCurveJXG, this.reflectLine],curveAttributes);
      }else {
        this.curveJXG = this.board.create('functiongraph', [this.fy], curveAttributes);
      }
    }else {
      this.curveJXG = this.board.create('curve', [this.fx, this.fy, this.parmin, this.parmax], curveAttributes);
    }
    // this.curveJXG.visProp.recursiondepthlow=6;

    if(this.throughpoints === undefined || this.throughpoints.length < 2) {
      return this.curveJXG;
    }
    if(this.draggable !== true) {
      return this.curveJXG;
    }

    this.startClickOnPoint = [];
    this.positionStartClick = [];

    this.board.on('up', this.upBoard);
    this.curveJXG.on('down', this.downOther);
    this.curveJXG.on('up', this.upOther);

    this.segmentAttributes = {
      visible: false,
      withLabel: false,
      fixed: true,
      strokeColor: 'lightgray',
      highlightStrokeColor: 'lightgray',
      layer: this.layer+2,
      strokeWidth: 1,
      highlightStrokeWidth: 1,
    };
    this.throughpointAttributes = {
      visible: this.visible,
      withLabel: false,
      fixed: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightFillColor: 'lightgray',
      highlightStrokeColor: 'lightgray',
      strokeWidth: 1,
      highlightStrokeWidth: 1,
      layer: this.layer+2,
      size: 3,
    };
    this.throughpointAlwaysVisible = {
      fillcolor: 'lightgray',
      strokecolor: 'lightgray',
    }
    this.throughpointHoverVisible = {
      fillcolor: 'none',
      strokecolor: 'none',
    }

    this.controlpointAttributes = {
      visible: false,
      withLabel: false,
      fixed: false,
      fillColor: 'gray',
      strokeColor: 'gray',
      highlightFillColor: 'gray',
      highlightStrokeColor: 'gray',
      strokeWidth: 1,
      highlightStrokeWidth: 1,
      layer: this.layer+3,
      size: 2,
    };

    this.throughpointsJXG = [];
    this.controlpointsJXG = [];
    this.segmentsJXG = [];
    this.throughControlsVisible = [];

    // first through point has one control
    let tp = this.board.create('point', this.throughpoints[0], this.throughpointAttributes);
    this.throughpointsJXG.push(tp);
    let cp = this.board.create('point', this.controlpoints[0], this.controlpointAttributes);
    this.controlpointsJXG.push(cp);
    let seg = this.board.create('segment', [tp,cp], this.segmentAttributes);
    this.segmentsJXG.push(seg);
    this.throughControlsVisible.push(false);

    tp.on('drag', e=> this.dragThroughpoint(0,e));
    tp.on('down', e=> this.downThroughpoint(0,e));
    tp.on('up', e=> this.upThroughpoint(0,e));
    cp.on('drag', e=> this.dragControlpoint(0,e));
    cp.on('down', this.downOther);
    seg.on('down', this.downOther);
    cp.on('up', this.upOther);
    seg.on('up', this.upOther);

    for(let i=1; i < this.throughpoints.length-1; i++) {
      // middle through points have two controls
      tp = this.board.create('point', this.throughpoints[i], this.throughpointAttributes);
      this.throughpointsJXG.push(tp);
      let cp1 = this.board.create('point', this.controlpoints[2*i-1], this.controlpointAttributes);
      this.controlpointsJXG.push(cp1);
      let cp2 = this.board.create('point', this.controlpoints[2*i], this.controlpointAttributes);
      this.controlpointsJXG.push(cp2);
      let seg1 = this.board.create('segment', [tp,cp1], this.segmentAttributes);
      this.segmentsJXG.push(seg1);
      let seg2 = this.board.create('segment', [tp,cp2], this.segmentAttributes);
      this.segmentsJXG.push(seg2);

      tp.on('drag', e=> this.dragThroughpoint(i,e));
      tp.on('down', e=> this.downThroughpoint(i,e));
      tp.on('up', e=> this.upThroughpoint(i,e));
      cp1.on('drag', e=> this.dragControlpoint(2*i-1,e));
      cp2.on('drag', e=> this.dragControlpoint(2*i,e));
      cp1.on('down', this.downOther);
      cp2.on('down', this.downOther);
      seg1.on('down', this.downOther);
      seg1.on('down', this.downOther);
      cp1.on('up', this.upOther);
      cp2.on('up', this.upOther);
      seg1.on('up', this.upOther);
      seg1.on('up', this.upOther);
  
    }
    
    // last throughpoint has one control
    let n = this.throughpoints.length-1;
    tp = this.board.create('point', this.throughpoints[n], this.throughpointAttributes);
    this.throughpointsJXG.push(tp);
    cp = this.board.create('point', this.controlpoints[2*n-1], this.controlpointAttributes);
    this.controlpointsJXG.push(cp);
    seg = this.board.create('segment', [tp,cp], this.segmentAttributes);
    this.segmentsJXG.push(seg);

    tp.on('drag', e=> this.dragThroughpoint(n,e));
    tp.on('down', e=> this.downThroughpoint(n,e));
    tp.on('up', e=> this.upThroughpoint(n,e));
    cp.on('drag', e=> this.dragControlpoint(2*n-1,e));
    cp.on('down', this.downOther);
    seg.on('down', this.downOther);
    cp.on('up', this.upOther);
    seg.on('up', this.upOther);

    this.board.updateRenderer();

    return this.curveJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.curveJXG);
    delete this.curveJXG;
    if(this.reflectLine !== undefined) {
      this.board.removeObject(this.reflectLine);
      delete this.reflectLine;  
      this.board.removeObject(this.originalCurveJXG);
      delete this.originalCurveJXG;  
    }
    if(this.segmentsJXG !== undefined) {
      this.segmentsJXG.forEach(x => this.board.removeObject(x));
      delete this.segmentsJXG;
      this.controlpointsJXG.forEach(x => this.board.removeObject(x));
      delete this.controlpointsJXG;
      this.throughpointsJXG.forEach(x => this.board.removeObject(x));
      delete this.throughpointsJXG;
    }
  }

  dragThroughpoint(i) {
    let tpcoords = [this.throughpointsJXG[i].X(), this.throughpointsJXG[i].Y()];
    this.actions.moveThroughpoint({
      throughpoint: tpcoords,
      throughpointInd: i,
    });

  }

  dragControlpoint(i) {
    let throughInd = Math.ceil(i/2);
    this.actions.moveControlvector({
      controlvector: [this.controlpointsJXG[i].X()-this.throughpointsJXG[throughInd].X(),
      this.controlpointsJXG[i].Y()-this.throughpointsJXG[throughInd].Y()],
      controlvectorInd: i,
    });

  }

  makeThroughpointsAlwaysVisible() {
    for(let point of this.throughpointsJXG) {
      for(let attribute in this.throughpointAlwaysVisible) {
        point.visProp[attribute] = this.throughpointAlwaysVisible[attribute];
      }
      point.needsUpdate = true;
      point.update();
    }
  }

  makeThroughpointsHoverVisible() {
    for(let point of this.throughpointsJXG) {
      for(let attribute in this.throughpointHoverVisible) {
        point.visProp[attribute] = this.throughpointHoverVisible[attribute];
      }
      point.needsUpdate = true;
      point.update();
    }
  }

  hideAllControls() {
    this.controlpointsJXG.forEach(function(x) {
      x.visProp.visible = false;
      x.needsUpdate=true;
      x.update();
    });
    this.segmentsJXG.forEach(function(x) {
      x.visProp.visible = false;
      x.needsUpdate = true;
      x.update();
    });
  }

  upBoard() {
    if(this.hitObject !== true) {
      this.makeThroughpointsHoverVisible();
      this.hideAllControls();
      this.board.updateRenderer();
    }
    this.hitObject = false;
  }

  downThroughpoint(i, e) {
    this.hitObject = true;
    let recordClickStart = true;
    if(this.throughpointsJXG[i].getAttribute("fillcolor") !== 
      this.throughpointAlwaysVisible.fillcolor) {
        recordClickStart = false;
    }
    if(recordClickStart) {
      if(this.pointCurrentlyControlled[i] === true) {
        if(i === 0) {
          recordClickStart = this.controlpointsJXG[0].getAttribute("visible");
        }else {
          recordClickStart = this.controlpointsJXG[2*i-1].getAttribute("visible");
        }
      }
    }
    if(recordClickStart) {
      this.startClickOnPoint[i] = Date.now();
    }
    // this.positionStartClick[i] = [this.throughpointsJXG[i].X(), this.throughpointsJXG[i].Y()];
    this.positionStartClick[i] = [e.clientX, e.clientY];
    this.makeThroughpointsAlwaysVisible();
    if(this.pointCurrentlyControlled[i] === true) {
      if(i>0) {
        this.controlpointsJXG[2*i-1].visProp.visible = true;
        this.controlpointsJXG[2*i-1].needsUpdate = true;
        this.controlpointsJXG[2*i-1].update();
        this.segmentsJXG[2*i-1].visProp.visible = true;
        this.segmentsJXG[2*i-1].needsUpdate = true;
        this.segmentsJXG[2*i-1].update();
      }
      if(i < this.throughpointsJXG.length-1) {
        this.controlpointsJXG[2*i].visProp.visible = true;
        this.controlpointsJXG[2*i].needsUpdate = true;
        this.controlpointsJXG[2*i].update();
        this.segmentsJXG[2*i].visProp.visible = true;
        this.segmentsJXG[2*i].needsUpdate = true;
        this.segmentsJXG[2*i].update();
      }
    }
    this.board.updateRenderer();
  }

  upThroughpoint(i,e) {
    if(this.startClickOnPoint[i] === undefined ||
      Date.now() - this.startClickOnPoint[i] > 1000 ||
      this.positionStartClick[i] === undefined || 
      this.positionStartClick[i][0] !== e.clientX ||
      this.positionStartClick[i][1] !== e.clientY) {
        return
    }

    this.startClickOnPoint[i] = undefined;

    this.actions.togglePointControl(i);
  }

  downOther() {
    this.hitObject = true;
  }

  upOther() {
    this.makeThroughpointsAlwaysVisible();
    this.board.updateRenderer();
  }

  updateCurve({curveType, fx, fy, parmin, parmax, flipFunction,
    throughpoints, controlpoints, changeInitiatedWith,
    pointCurrentlyControlled, visible}) {

    let originalThroughpoints = this.throughpoints;
    let originalCurvetype = this.curveType;
    let originalInvertFunction = this.flipFunction;
    let originalPointCurrentlyControlled = this.pointCurrentlyControlled;
    this.curveType = curveType;
    this.fx = fx;
    this.fy= fy;
    this.parmin = parmin;
    this.parmax = parmax;
    this.flipFunction = flipFunction;
    this.throughpoints = throughpoints;
    this.controlpoints = controlpoints;
    this.pointCurrentlyControlled = pointCurrentlyControlled;
    this.visible = visible;

    // even objects that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for objects that don't have a board
    if(this.board === undefined) {
      return;
    }

    if(originalCurvetype !== this.curveType ||
        originalInvertFunction !== this.flipFunction) {
      // redraw entire curve if too much has changed
      this.deleteGraphicalObject();
      let result = this.createGraphicalObject(this.board);

      if(this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
        if(this.curveType === "function" && this.flipFunction === true) {
          this.board.itemsRenderedLowQuality[this._key] = this.originalCurveJXG;
        }else {
          this.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
        }
      }

      return result;
    }

    if(this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
      this.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
    }

    this.curveJXG.visProp["visible"] = this.visible;
    this.curveJXG.visPropCalc["visible"] = this.visible;
    
    if(this.curveType === "function") {
      if(this.flipFunction === true) {
        this.originalCurveJXG.visProp["visible"] = this.visible;
        this.originalCurveJXG.visPropCalc["visible"] = this.visible;
        
        this.originalCurveJXG.Y = this.fx;
        this.originalCurveJXG.needsUpdate = true;
        this.originalCurveJXG.updateCurve();

        if(this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
          this.board.itemsRenderedLowQuality[this._key] = this.originalCurveJXG;
        }
      }else {
        this.curveJXG.Y = this.fy;
        this.curveJXG.needsUpdate = true;
        this.curveJXG.updateCurve();
        if(this.curveJXG.hasLabel) {
          this.curveJXG.label.needsUpdate = true;
          this.curveJXG.label.update();
        }
      }
      this.board.updateRenderer();
      return;
    }else if(this.throughpoints === undefined) {
      this.curveJXG.X = this.fx;
      this.curveJXG.Y = this.fy;
      this.curveJXG.minX = x => this.parmin;
      this.curveJXG.maxX = x => this.parmax;

      this.curveJXG.needsUpdate = true;
      this.curveJXG.updateCurve();
      if(this.curveJXG.hasLabel) {
        this.curveJXG.label.needsUpdate = true;
        this.curveJXG.label.update();
      }
      this.board.updateRenderer();
      return;
    }


    if(originalThroughpoints.length < 2) {
      if(this.throughpoints.length < 2) {
        return
      }else {
        return this.createGraphicalObject(this.board);
      }
    } else if(this.throughpoints.length < 2) {
      this.deleteGraphicalObject();
      return;
    }

    this.curveJXG.X = this.fx;
    this.curveJXG.Y = this.fy;
    this.curveJXG.minX = x => this.parmin;
    this.curveJXG.maxX = x => this.parmax;

    this.curveJXG.needsUpdate = true;
    this.curveJXG.updateCurve();
    if(this.curveJXG.hasLabel) {
      this.curveJXG.label.needsUpdate = true;
      this.curveJXG.label.update();
    }

    if(this.draggable !== true) {
      this.board.updateRenderer();
      return;
    }

    for(let i in this.pointCurrentlyControlled) {
      if(this.pointCurrentlyControlled[i] !== originalPointCurrentlyControlled[i]) {
        let newVis = (this.pointCurrentlyControlled[i] === true);
        if(i>0) {
          this.controlpointsJXG[2*i-1].visProp.visible = newVis;
          this.controlpointsJXG[2*i-1].needsUpdate = true;
          this.controlpointsJXG[2*i-1].update();
          this.segmentsJXG[2*i-1].visProp.visible = newVis;
          this.segmentsJXG[2*i-1].needsUpdate = true;
          this.segmentsJXG[2*i-1].update();
        }
        if(i < this.throughpointsJXG.length-1) {
          this.controlpointsJXG[2*i].visProp.visible = newVis;
          this.controlpointsJXG[2*i].needsUpdate = true;
          this.controlpointsJXG[2*i].update();
          this.segmentsJXG[2*i].visProp.visible = newVis;
          this.segmentsJXG[2*i].needsUpdate = true;
          this.segmentsJXG[2*i].update();
        }
  
      }
    }

    // add or delete segments and points if number changed
    if(this.throughpoints.length > originalThroughpoints.length) {
      for(let i=originalThroughpoints.length; i < this.throughpoints.length; i++) {

        // add second control point for previous point
        let cp2 = this.board.create('point', this.controlpoints[2*i-2], this.controlpointAttributes);
        this.controlpointsJXG.push(cp2);
        let prevtp = this.throughpointsJXG[i-1];
        let seg2 = this.board.create('segment', [prevtp,cp2], this.segmentAttributes);
        this.segmentsJXG.push(seg2);
    
        // add point and its first control
        let tp = this.board.create('point', this.throughpoints[i], this.throughpointAttributes);
        this.throughpointsJXG.push(tp);
        let cp1 = this.board.create('point', this.controlpoints[2*i-1], this.controlpointAttributes);
        this.controlpointsJXG.push(cp1);
        let seg1 = this.board.create('segment', [tp,cp1], this.segmentAttributes);
        this.segmentsJXG.push(seg1);

        cp1.visProp.visible = false;
        seg1.visProp.visible = false;
        cp2.visProp.visible = false;
        seg2.visProp.visible = false;

        cp2.on('drag', e=> this.dragControlpoint(2*i-2,e));
        tp.on('drag', e=> this.dragThroughpoint(i,e));
        tp.on('down', e=> this.downThroughpoint(i,e));
        tp.on('up', e=> this.upThroughpoint(i,e));
        cp1.on('drag', e=> this.dragControlpoint(2*i-1,e));
        cp1.on('down', this.downOther);
        seg1.on('down', this.downOther);
        cp1.on('up', this.upOther);
        seg1.on('up', this.upOther);
        cp2.on('down', this.downOther);
        seg2.on('down', this.downOther);
        cp2.on('up', this.upOther);
        seg2.on('up', this.upOther);

      }  
    } else if(this.throughpoints.length < originalThroughpoints.length) {
      for(let i = this.throughpoints.length; i < originalThroughpoints.length; i++) {
        this.board.removeObject(this.segmentsJXG.pop());
        this.board.removeObject(this.segmentsJXG.pop());
        this.board.removeObject(this.controlpointsJXG.pop());
        this.board.removeObject(this.controlpointsJXG.pop());
        this.board.removeObject(this.throughpointsJXG.pop());
      }
    }

    // move old points
    let nOld = Math.min(this.throughpoints.length, originalThroughpoints.length);
    this.throughpointsJXG[0].coords.setCoordinates(JXG.COORDS_BY_USER, this.throughpoints[0]);
    this.throughpointsJXG[0].needsUpdate = true;
    this.throughpointsJXG[0].update();

    for(let i=1; i<nOld; i++) {
      this.throughpointsJXG[i].coords.setCoordinates(JXG.COORDS_BY_USER, this.throughpoints[i]);
      this.throughpointsJXG[i].needsUpdate = true;
      this.throughpointsJXG[i].update();
      this.controlpointsJXG[2*i-1].coords.setCoordinates(JXG.COORDS_BY_USER, this.controlpoints[2*i-1]);
      this.controlpointsJXG[2*i-1].needsUpdate = true;
      this.controlpointsJXG[2*i-1].update();
      this.segmentsJXG[2*i-1].needsUpdate = true;
      this.segmentsJXG[2*i-1].update();
      this.controlpointsJXG[2*i-2].coords.setCoordinates(JXG.COORDS_BY_USER, this.controlpoints[2*i-2]);
      this.controlpointsJXG[2*i-2].needsUpdate = true;
      this.controlpointsJXG[2*i-2].update();
      this.segmentsJXG[2*i-2].needsUpdate = true;
      this.segmentsJXG[2*i-2].update();
    }

    for(let i=1; i<this.throughpoints.length; i++) {
      this.throughpointsJXG[i].visProp["visible"] = this.visible;
      this.throughpointsJXG[i].visPropCalc["visible"] = this.visible;
    }
    

    let ind = changeInitiatedWith.throughpointInd;
    if(ind !== undefined) {
      this.board.updateInfobox(this.throughpointsJXG[ind]);
    }else {
      ind = changeInitiatedWith.controlvectorInd;
      if(ind !== undefined) {
        this.board.updateInfobox(this.controlpointsJXG[ind]);
      }
    }

    this.board.updateRenderer();
  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  curve2d: CurveRenderer,
}

export default AvailableRenderers;
