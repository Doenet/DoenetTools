class LineRenderer {
  constructor({ key, label, draggable, layer = 0, point1coords, point2coords, actions,
    color, width, style, visible }) {
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10 * layer + 7;
    this.point1coords = point1coords;
    this.point2coords = point2coords;
    this.actions = actions;
    this.color = color;
    this.width = width;
    if (style === "solid") {
      this.dash = 0;
    } else if (style === "dashed") {
      this.dash = 2;
    } else if (style === "dotted") {
      this.dash = 1;
    } else {
      this.dash = 0;
    }
    this.visible = visible;

  }

  createGraphicalObject(board) {
    this.board = board;

    //things to be passed to JSXGraph as attributes
    var jsxLineAttributes = {
      name: this.label,
      //size: this.size,
      visible: this.visible,
      withLabel: this.label !== "",
      layer: this.layer,
      fixed: this.draggable !== true,
      strokeColor: this.color,
      highlightStrokeColor: this.color,
      strokeWidth: this.width,
      dash: this.dash,
    };

    if (!this.draggable) {
      jsxLineAttributes.highlightStrokeWidth = this.width;
    }


    let through = [[...this.point1coords], [...this.point2coords]];

    this.lineJXG = this.board.create('line', through, jsxLineAttributes);

    this.lineJXG.on('drag', function () {
      //board.suspendUpdate();
      this.onDragHandler();
      //board.unsuspendUpdate();
    }.bind(this));


    return this.lineJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.lineJXG);
    delete this.lineJXG;
  }

  updateLine({ point1coords, point2coords, visible }) {

    this.point1coords = point1coords;
    this.point2coords = point2coords;
    this.visible = visible;

    let validCoords = true;

    for (let coords of [this.point1coords, this.point2coords]) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }

    // even line that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for lines that don't have a JXG line created
    if (this.lineJXG === undefined) {
      return;
    }
    
    this.lineJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, this.point1coords);
    this.lineJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, this.point2coords);

    if (validCoords) {
      this.lineJXG.visProp["visible"] = this.visible;
      this.lineJXG.visPropCalc["visible"] = this.visible;
      // this.lineJXG.setAttribute({visible: this.visible})
    }
    else {
      this.lineJXG.visProp["visible"] = false;
      this.lineJXG.visPropCalc["visible"] = false;
      // this.lineJXG.setAttribute({visible: false})
    }

    this.lineJXG.needsUpdate = true;
    this.lineJXG.update()
    if (this.lineJXG.hasLabel) {
      this.lineJXG.label.needsUpdate = true;
      this.lineJXG.label.update();
    }
    this.board.updateRenderer();

  }

  onDragHandler() {
    this.actions.moveLine({
      point1coords: [this.lineJXG.point1.X(), this.lineJXG.point1.Y()],
      point2coords: [this.lineJXG.point2.X(), this.lineJXG.point2.Y()],
    });
  }

  jsxCode() {
    return null;
  }
}

let AvailableRenderers = {
  line2d: LineRenderer,
}

export default AvailableRenderers;
