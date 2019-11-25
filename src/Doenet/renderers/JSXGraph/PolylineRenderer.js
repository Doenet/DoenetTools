class PolylineRenderer {
  constructor({key, label, draggable, layer, pointcoords, actions, visible,
    color, width, style,
    pointColor, pointSize, pointStyle,
  }){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 5;
    this.pointcoords = pointcoords;
    this.nPoints = pointcoords.length;
    this.actions = actions;
    this.visible = visible;
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
    this.pointSize = pointSize;
    this.pointColor = pointColor;
    this.pointStyle = pointStyle;

    if(this.pointStyle === "triangle") {
      this.pointStyle = "triangleup";
    }

    this.onDragHandler = this.onDragHandler.bind(this);

  }


  createGraphicalObject(board) {
    this.board = board;


    this.jsxPolylineAttributes = {
      name: this.label,
      //size: this.size,
      visible: this.visible,
      withLabel: this.label !== "",
      layer: this.layer,
      fixed: this.draggable !== true,
      strokeColor: this.color,
      highlightStrokeColor: this.color,
      strokeWidth: this.width,
      highlightStrokeWidth: this.width,
      dash: this.dash,
    };

    for(let coords of this.pointcoords) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    this.jsxPointAttributes = Object.assign({}, this.jsxPolylineAttributes);
    Object.assign(this.jsxPointAttributes, {
      withLabel: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: 'lightgray',
      layer: this.layer+2,
    });
    if(this.draggable !== true) {
      this.jsxPointAttributes.visible = false;
    }

    // create invisible points at endpoints
    this.pointsJXG = [];
    for(let i=0; i < this.nPoints; i++) {
      this.pointsJXG.push(
        this.board.create('point', this.pointcoords[i], this.jsxPointAttributes)
      );
    }

    let x = [], y=[];
    this.pointcoords.forEach(z => {x.push(z[0]); y.push(z[1])});

    this.polylineJXG = this.board.create('curve', [x,y], this.jsxPolylineAttributes);

    for(let i=0; i<this.nPoints; i++) {
      this.pointsJXG[i].on('drag', x=>this.onDragHandler(i));
    }

    this.polylineJXG.on('drag', x=>this.onDragHandler(-1));

    return this.polylineJXG;

  }

  deleteGraphicalObject() {

    this.board.removeObject(this.polylineJXG);
    delete this.polylineJXG;

    for(let i=0; i<this.nPoints; i++) {

      this.board.removeObject(this.pointsJXG[i]);
      delete this.pointsJXG[i];
    }
  }

  updatePolyline({pointcoords, visible}) {

    let nPointsOld = this.nPoints;
    this.pointcoords = pointcoords;
    this.nPoints = pointcoords.length;
    this.visible = visible;

    let validCoords = true;
    for(let coords of this.pointcoords) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
        validCoords = false;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
        validCoords = false;
      }
    }

    // even line that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for lines that don't have a JXG line created
    if(this.polylineJXG === undefined) {
 
      return;
    }

    // add or delete points as required and change data array size
    if(this.nPoints > nPointsOld) {
      for(let i=nPointsOld; i < this.nPoints; i++) {
        this.pointsJXG.push(
          this.board.create('point', this.pointcoords[i], this.jsxPointAttributes)
        );
        this.polylineJXG.dataX.length = this.nPoints;

        this.pointsJXG[i].on('drag', x=>this.onDragHandler(i));
      }  
    }else if(this.nPoints < nPointsOld) {
      for(let i=this.nPoints; i < nPointsOld; i++) {
        this.board.removeObject(this.pointsJXG.pop());
      }
      this.polylineJXG.dataX.length = this.nPoints;
    }

    let shiftX = this.polylineJXG.transformMat[1][0];
    let shiftY = this.polylineJXG.transformMat[2][0];
    

    for(let i=0; i < this.nPoints; i++) {
      this.pointsJXG[i].coords.setCoordinates(JXG.COORDS_BY_USER, this.pointcoords[i]);
      // this.polylineJXG.points[i].settCoordinates(JXG.COORDS_BY_USER, this.pointcoords[i]);
      this.polylineJXG.dataX[i] = this.pointcoords[i][0] - shiftX;
      this.polylineJXG.dataY[i] = this.pointcoords[i][1] - shiftY;
    }

    if(validCoords) {
      this.polylineJXG.visProp["visible"] = this.visible;
      this.polylineJXG.visPropCalc["visible"] = this.visible;
      // this.polylineJXG.setAttribute({visible: this.visible})

      for(let i=0; i < this.nPoints; i++) {
        this.pointsJXG[i].visProp["visible"] = this.visible;
        this.pointsJXG[i].visPropCalc["visible"] = this.visible;
      }
    }
    else {
      this.polylineJXG.visProp["visible"] = false;
      this.polylineJXG.visPropCalc["visible"] = false;
      // this.polylineJXG.setAttribute({visible: false})

      for(let i=0; i < this.nPoints; i++) {
        this.pointsJXG[i].visProp["visible"] = false;
        this.pointsJXG[i].visPropCalc["visible"] = false;
      }
    }


    this.polylineJXG.needsUpdate = true;
    this.polylineJXG.update().updateVisibility();
    for(let i=0; i<this.nPoints; i++) {
      this.pointsJXG[i].needsUpdate = true;
      this.pointsJXG[i].update();
    }
    this.board.updateRenderer();

  }

  onDragHandler(i) {
    if(i === -1) {
      let newPointcoords = this.polylineJXG.points.map(z=>[z.usrCoords[1],z.usrCoords[2]]);
      this.actions.movePolyline(newPointcoords);
    }else {
      let newCoords = {};
      newCoords[i] = [this.pointsJXG[i].X(), this.pointsJXG[i].Y()];
      this.actions.movePolyline(newCoords);
    }

  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  polyline2d: PolylineRenderer,
}

export default AvailableRenderers;
