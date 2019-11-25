class PolygonRenderer {
  constructor({key, label, draggable, layer, pointcoords, actions, visible}){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 4,
    this.pointcoords = pointcoords;
    this.nPoints = pointcoords.length;
    this.actions = actions;
    this.visible = visible;

    this.onDragHandler = this.onDragHandler.bind(this);
  }


  createGraphicalObject(board) {
    this.board = board;

    if(!(this.nPoints >=2)){
      return;
    }

    for(let coords of this.pointcoords) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    this.jsxPointAttributes = {
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: 'lightgray',
      visible: this.draggable === true,
      withLabel: false,
      layer: this.layer+2,
    };

    this.jsxBorderAttributes = {
      strokeWidth: 2,
      highlight: false,
      visible: true,
      layer: this.layer+1,
    };
    
    this.jsxPolygonAttributes = {
      name: this.label,
      visible: this.visible,
      withLabel: this.label !== "",
      fixed: this.draggable !== true,
      layer: this.layer,

      //specific to polygon
      fillColor: 'none',
      highlight: false,
      vertices: this.jsxPointAttributes,
      borders: this.jsxBorderAttributes,
    };

    let pts = [];
    this.pointcoords.forEach(z => {pts.push([z[0],z[1]])});

    this.board.suspendUpdate();

    this.polygonJXG = this.board.create('polygon', pts, this.jsxPolygonAttributes);

    this.initializePoints();

    this.initializeBorders();
    
    this.board.unsuspendUpdate();

    return this.polygonJXG;

  }

  initializePoints() {
    for (let i = 0; i < this.nPoints; i++) {
      let vertex = this.polygonJXG.vertices[i];
      vertex.on('drag', x => this.onDragHandler(i));
    }
  }

  initializeBorders() {
    let offsets = [];
    let renderer = this;
    // create listeners for border so that when drag border,
    // the whole polygon translates
    // To accomplish this, set offset for all vertices on mousedown
    // and change coordinates for all vertices on drag
    for (let i = 0; i < this.polygonJXG.borders.length; i++) {
      let border = this.polygonJXG.borders[i];
      let polygonJXG = this.polygonJXG;

      border.on('drag', function () {
        // create update instructions for moving entire polygon
        let newPointcoords = [];
        for (let j = 0; j < renderer.nPoints; j++) {
          let point = polygonJXG.vertices[j];
          let item = offsets.find(x => x.id === point.id);
          if (item === undefined) {
            // vertex is on border segment dragged, so records its position
            newPointcoords.push([point.X(), point.Y()]);
          }
          else {
            // for remaining vertices, set to offset from
            // first point of segment dragged
            newPointcoords.push([
              this.point1.X() + item.offset[0],
              this.point1.Y() + item.offset[1]
            ]);
          }
        }
        renderer.actions.movePolygon(newPointcoords);
      });

      border.on('mousedown', function () {
        offsets = [];
        // calculate offsets for all vertices not on given border segment
        for (let j = 0; j < renderer.nPoints; j++) {
          let vertex = polygonJXG.vertices[j];
          if (vertex !== this.point1 && vertex !== this.point2) {
            // found a vertex not on given border segment
            // record offset from first point on border segment
            let pointInfo = {
              id: vertex.id,
              offset: [vertex.X() - this.point1.X(),
              vertex.Y() - this.point1.Y()],
            };
            offsets.push(pointInfo);
          }
        }
      });
    }
  }

  onDragHandler(i) {

    let newCoords = {};
    newCoords[i] = [this.polygonJXG.vertices[i].X(), this.polygonJXG.vertices[i].Y()];
    this.actions.movePolygon(newCoords);

  }

  deleteGraphicalObject() {

    this.board.removeObject(this.polygonJXG);
    delete this.polygonJXG;
  }

  updatePolygon({pointcoords, visible}) {

    let nPointsOld = this.nPoints;
    this.pointcoords = pointcoords;
    this.nPoints = pointcoords.length;
    this.visible = visible;

    // even line that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for lines that don't have a JXG line created
    if(this.board === undefined) {
      return;
    }

    if(this.nPoints >=2) {
      if(!(nPointsOld >= 2)) {
        return this.createGraphicalObject(this.board);
      }
      // if reach here, will continue below to update polygon 
      // that already is rendered

    }else {
      if(nPointsOld >=2) {
        return this.deleteGraphicalObject();
      }else{
        return;
      }
    }

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

    // add or delete points as required and change data array size
    if(this.nPoints > nPointsOld) {
      for(let i=nPointsOld; i < this.nPoints; i++) {
        let newPoint = this.board.create('point', this.pointcoords[i], this.jsxPointAttributes)
        this.polygonJXG.addPoints(newPoint);
      }
      this.initializePoints();
      this.initializeBorders();

    }else if(this.nPoints < nPointsOld) {
      for(let i=nPointsOld-1; i >= this.nPoints; i--) {
        this.polygonJXG.removePoints(this.polygonJXG.vertices[i]);
      }
      this.initializePoints();
      this.initializeBorders();
    }

    for(let i=0; i < this.nPoints; i++) {
      this.polygonJXG.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, this.pointcoords[i]);
    }


    let visibleNow = this.visible;
    if(!validCoords) {
      visibleNow = false;
    }

    this.polygonJXG.visProp.borders["visible"] = visibleNow;
    this.polygonJXG.visProp["visible"] = visibleNow;
    this.polygonJXG.visPropCalc["visible"] = visibleNow;
    // this.polygonJXG.setAttribute({visible: visibleNow})

    this.polygonJXG.needsUpdate = true;

    this.polygonJXG.update().updateVisibility();
    for (let i = 0; i < this.polygonJXG.borders.length; i++) {
      let border = this.polygonJXG.borders[i];
      border.visProp.visible = visibleNow;
      border.visPropCalc.visible = visibleNow;
      
      border.needsUpdate = true;
      border.update();
    }

    this.board.updateRenderer();

  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  polygon2d: PolygonRenderer,
}

export default AvailableRenderers;
