class VectorRenderer {
  constructor({key, label, draggable, layer, tailcoords, headcoords, actions,
      color, width, style,}){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 7;
    this.tailcoords = tailcoords;
    this.headcoords = headcoords;
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

    this.onDragHandler = this.onDragHandler.bind(this);

  }

  createGraphicalObject(board) {
    this.board = board;

    let vectorColor = this.color;

    //things to be passed to JSXGraph as attributes
    var jsxVectorAttributes = {
      name: this.label,
      //size: this.size,
      visible: true,//this.visible,
      withLabel: this.label !== "",
      layer: this.layer,
      fixed: this.draggable !== true,
      strokeColor: vectorColor,
      highlightStrokeColor: vectorColor,
      strokeWidth: this.width,
      dash: this.dash,
    };

    let endpoints = [ this.tailcoords, this.headcoords ];

    for(let coords of endpoints) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    let jsxPointAttributes = Object.assign({}, jsxVectorAttributes);
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


    this.vectorJXG = this.board.create('arrow', [this.point1JXG, this.point2JXG], jsxVectorAttributes);


    this.point1JXG.on('drag', e => this.onDragHandler(1,e));
    this.point2JXG.on('drag', e => this.onDragHandler(2,e));
    this.vectorJXG.on('drag', e => this.onDragHandler(0,e));

    return this.vectorJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.vectorJXG);
    delete this.vectorJXG;
    this.board.removeObject(this.point1JXG);
    delete this.point1JXG;
    this.board.removeObject(this.point2JXG);
    delete this.point2JXG;
    
  }

  setPointCoordinates({tailcoords, headcoords}) {

    this.tailcoords = tailcoords;
    this.headcoords = headcoords;

    for(let coords of [this.tailcoords, this.headcoords]) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    // even line that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for lines that don't have a JXG line created
    if(this.vectorJXG === undefined) {
      return;
    }

    this.vectorJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, tailcoords);
    this.vectorJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, headcoords);
    this.vectorJXG.needsUpdate = true;
    this.vectorJXG.update();
    if(this.vectorJXG.hasLabel) {
      this.vectorJXG.label.needsUpdate = true;
      this.vectorJXG.label.update();
    }

    this.point1JXG.needsUpdate = true;
    this.point1JXG.update();
    this.point2JXG.needsUpdate = true;
    this.point2JXG.update();

    this.board.updateRenderer();
  }

  onDragHandler(i) {
    if(i==1) {
      this.actions.moveVector({
        tailcoords: [this.vectorJXG.point1.X(), this.vectorJXG.point1.Y()],
      });
    }else if(i==2) {
      this.actions.moveVector({
        headcoords: [this.vectorJXG.point2.X(), this.vectorJXG.point2.Y()],
      });
    }else {
      this.actions.moveVector({
        tailcoords: [this.vectorJXG.point1.X(), this.vectorJXG.point1.Y()],
        headcoords: [this.vectorJXG.point2.X(), this.vectorJXG.point2.Y()],
      });
    }
  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  vector2d: VectorRenderer,
}

export default AvailableRenderers;
