class AngleRenderer {
  constructor({key, label, draggable, layer=0, renderAsAcuteAngle, angle,
      point1coords, point2coords, point3coords,
      radius, visible}){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 2;
    this.renderAsAcuteAngle = renderAsAcuteAngle;
    this.angle = angle;

    this.point2coords = point2coords;
    if(this.renderAsAcuteAngle && (this.angle % (2*Math.PI)) > Math.PI) {
      this.point1coords = point3coords;
      this.point3coords = point1coords;
    }else {
      this.point1coords = point1coords;
      this.point3coords = point3coords;
    }
    this.radius = radius;
    this.visible = visible;
  }

  createGraphicalObject(board) {
    this.board = board;

    if(!(Number.isFinite(this.radius) && this.radius > 0)) {
      return;
    }

    let angleColor = "#FF7F00";

    var jsxAngleAttributes = {
      name: this.label,
      //size: this.size,
      visible: this.visible,
      withLabel: this.label !== "",
      fixed: true,
      layer: this.layer,
      radius: this.radius,
      fillColor: angleColor,
      strokeColor: angleColor,
      highlightFillColor: angleColor,
      highlightStrokeColor: angleColor,
    };

    let through = [ this.point1coords, this.point2coords, this.point3coords ];

    for(let coords of through) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    let jsxPointAttributes = {
      visible: false,
    };

    // create invisible points at through
    this.point1JXG = this.board.create('point', through[0], jsxPointAttributes);
    this.point2JXG = this.board.create('point', through[1], jsxPointAttributes);
    this.point3JXG = this.board.create('point', through[2], jsxPointAttributes);

    this.angleJXG = this.board.create('angle', [this.point1JXG, this.point2JXG, this.point3JXG], jsxAngleAttributes);

    return this.angleJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.angleJXG);
    delete this.angleJXG;
    this.board.removeObject(this.point1JXG);
    delete this.point1JXG;
    this.board.removeObject(this.point2JXG);
    delete this.point2JXG;
    this.board.removeObject(this.point3JXG);
    delete this.point3JXG;
    
  }

  updateAngle({angle, point1coords, point2coords, point3coords, radius, visible}) {

    this.angle = angle;

    this.point2coords = point2coords;

    if(this.renderAsAcuteAngle && (this.angle % (2*Math.PI)) > Math.PI) {
      this.point1coords = point3coords;
      this.point3coords = point1coords;
    }else {
      this.point1coords = point1coords;
      this.point3coords = point3coords;
    }

    this.radius = radius;
    
    this.visible = visible;

    // even angles that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for angles that don't have a JXG line created
    if(this.board === undefined) {
      return;
    }

    if(!(Number.isFinite(this.radius) && this.radius > 0)) {
      // can't render angle
      if(this.angleJXG === undefined) {
        return;
      }else {
        return this.deleteGraphicalObject();
      }
    }else {
      if(this.angleJXG === undefined) {
        // create new angle
        return this.createGraphicalObject(this.board);
      }
    }

    for(let coords of [this.point1coords, this.point2coords, this.point3coords]) {
      if(!Number.isFinite(coords[0])) {
        coords[0] = NaN;
      }
      if(!Number.isFinite(coords[1])) {
        coords[1] = NaN;
      }
    }

    // in JSXgraph, point 1 and point 2 are switched
    this.angleJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, this.point1coords);
    this.angleJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, this.point2coords);
    this.angleJXG.point3.coords.setCoordinates(JXG.COORDS_BY_USER, this.point3coords);

    this.angleJXG.setAttribute({radius: this.radius, visible: this.visible});

    this.angleJXG.needsUpdate = true;
    this.angleJXG.update();
    // this.point1JXG.needsUpdate = true;
    // this.point1JXG.update();
    // this.point2JXG.needsUpdate = true;
    // this.point2JXG.update();
    // this.point3JXG.needsUpdate = true;
    // this.point3JXG.update();

    this.board.updateRenderer();

  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  angle2d: AngleRenderer,
}

export default AvailableRenderers;
