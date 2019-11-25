class LineSegmentRenderer {
  constructor({key, label, draggable, layer, point1coords, point2coords, actions,
    color, width, style, visible }){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 7;
    this.point1coords = point1coords;
    this.point2coords = point2coords;
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

    this.onDragHandler = this.onDragHandler.bind(this);

  }

  createGraphicalObject(board) {
    this.board = board;

    let linesegmentColor = this.color;

    //things to be passed to JSXGraph as attributes
    var jsxSegmentAttributes = {
      name: this.label,
      //size: this.size,
      visible: this.visible,
      withLabel: this.label !== "",
      layer: this.layer,
      fixed: this.draggable !== true,
      strokeColor: linesegmentColor,
      highlightStrokeColor: linesegmentColor,
      strokeWidth: this.width,
      dash: this.dash,
    };

    if(!this.draggable) {
      jsxSegmentAttributes.highlightStrokeWidth = this.width;
    }

    let endpoints = [ this.point1coords, this.point2coords ];

    for(let coords of endpoints) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    let jsxPointAttributes = Object.assign({}, jsxSegmentAttributes);
    Object.assign(jsxPointAttributes, {
      withLabel: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: 'lightgray',
      layer: this.layer+1,
    });
    if(this.draggable !== true) {
      jsxPointAttributes.visible = false;
    }

    // create invisible points at endpoints
    this.point1JXG = this.board.create('point', endpoints[0], jsxPointAttributes);
    this.point2JXG = this.board.create('point', endpoints[1], jsxPointAttributes);


    this.lineSegmentJXG = this.board.create('segment', [this.point1JXG, this.point2JXG], jsxSegmentAttributes);

    this.point1JXG.on('drag', e => this.onDragHandler(1,e));
    this.point1JXG.on('drag', e => this.onDragHandler(2,e));
    this.lineSegmentJXG.on('drag', e => this.onDragHandler(0,e));

    return this.lineSegmentJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.lineSegmentJXG);
    delete this.lineSegmentJXG;
    this.board.removeObject(this.point1JXG);
    delete this.point1JXG;
    this.board.removeObject(this.point2JXG);
    delete this.point2JXG;
    
  }

  updateLineSegment({point1coords, point2coords, visible}) {

    this.point1coords = point1coords;
    this.point2coords = point2coords;
    this.visible = visible;

    let validCoords = true;
    for(let coords of [this.point1coords, this.point2coords]) {
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
    if(this.lineSegmentJXG === undefined) {
      return;
    }

    this.lineSegmentJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, point1coords);
    this.lineSegmentJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, point2coords);

    if(validCoords) {
      this.lineSegmentJXG.visProp["visible"] = this.visible;
      this.lineSegmentJXG.visPropCalc["visible"] = this.visible;
      // this.lineSegmentJXG.setAttribute({visible: this.visible})
    }
    else {
      this.lineSegmentJXG.visProp["visible"] = false;
      this.lineSegmentJXG.visPropCalc["visible"] = false;
      // this.lineSegmentJXG.setAttribute({visible: false})
    }


    this.lineSegmentJXG.needsUpdate = true;
    this.lineSegmentJXG.update();
    if(this.lineSegmentJXG.hasLabel) {
      this.lineSegmentJXG.label.needsUpdate = true;
      this.lineSegmentJXG.label.update();
    }
    this.point1JXG.needsUpdate = true;
    this.point1JXG.update();
    this.point2JXG.needsUpdate = true;
    this.point2JXG.update();

    this.board.updateRenderer();

  }

  onDragHandler(i) {
    if(i==1) {
      this.actions.moveLineSegment({
        point1coords: [this.lineSegmentJXG.point1.X(), this.lineSegmentJXG.point1.Y()],
      });
    }else if(i==2) {
      this.actions.moveLineSegment({
        point2coords: [this.lineSegmentJXG.point2.X(), this.lineSegmentJXG.point2.Y()],
      });
    }else {
      this.actions.moveLineSegment({
        point1coords: [this.lineSegmentJXG.point1.X(), this.lineSegmentJXG.point1.Y()],
        point2coords: [this.lineSegmentJXG.point2.X(), this.lineSegmentJXG.point2.Y()],
      });
    }
  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  linesegment2d: LineSegmentRenderer,
}

export default AvailableRenderers;
