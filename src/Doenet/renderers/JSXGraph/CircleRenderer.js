class CircleRenderer {
  constructor({key, label, draggable, layer=0, center, radius, actions, visible }){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 6;
    this.center = center;
    this.radius = radius;
    this.actions = actions;
    this.visible = visible;

  }

  createGraphicalObject(board) {
    this.board = board;

    if(!(Number.isFinite(this.radius) && this.radius > 0)) {
      return;
    }

    let circleColor = "blue";

    //things to be passed to JSXGraph as attributes
    var jsxCircleAttributes = {
      name: this.label,
      //size: this.size,
      layer: this.layer,
      visible: this.visible,
      withLabel: this.label !== "",
      fixed: this.draggable !== true,
      strokeColor: circleColor,
      highlightStrokeColor: circleColor,
    };

    if(!Number.isFinite(this.center[0])) {
      this.center[0] = NaN;
    }
    if(!Number.isFinite(this.center[1])) {
      this.center[1] = NaN;
    }

    this.circleJXG = this.board.create('circle', [this.center, this.radius], jsxCircleAttributes);

    let dragFunction = function() {
      //board.suspendUpdate();
      this.onDragHandler();
      //board.unsuspendUpdate();
    }.bind(this);


    this.circleJXG.on('drag', dragFunction);

    return this.circleJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.circleJXG);
    delete this.circleJXG;
  }

  updateCircle({center, radius, visible}) {

    this.center = center;
    this.radius = radius;
    this.visible = visible;

    // even objects that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for objects that don't have a board
    if(this.board === undefined) {
      return;
    }

    if(!(Number.isFinite(this.radius) && this.radius > 0)) {
      // can't render circle
      if(this.circleJXG === undefined) {
        return;
      }else {
        return this.deleteGraphicalObject();
      }
    }else {
      if(this.circleJXG === undefined) {
        // create new circle
        let result = this.createGraphicalObject(this.board);
        if(this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
          this.board.itemsRenderedLowQuality[this._key] = this.circleJXG;
        }
        return result;
      }
    }

    if(this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
      this.board.itemsRenderedLowQuality[this._key] = this.circleJXG;
    }

    let validCoords = true;
    if(!Number.isFinite(this.center[0])) {
      this.center[0] = NaN;
      validCoords = false;
    }
    if(!Number.isFinite(this.center[1])) {
      this.center[1] = NaN;
      validCoords = false;
    }

    this.circleJXG.center.coords.setCoordinates(JXG.COORDS_BY_USER, this.center);
    this.circleJXG.setRadius(this.radius);

    if(validCoords) {
      this.circleJXG.visProp["visible"] = this.visible;
      this.circleJXG.visPropCalc["visible"] = this.visible;
      // this.circleJXG.setAttribute({visible: this.visible})
    }
    else {
      this.circleJXG.visProp["visible"] = false;
      this.circleJXG.visPropCalc["visible"] = false;
      // this.circleJXG.setAttribute({visible: false})
    }


    this.circleJXG.needsUpdate = true;
    this.circleJXG.update();
    this.board.updateRenderer();

  }

  onDragHandler() {
    if(this.circleJXG !== undefined) {
      this.actions.moveCircle({
        center: [this.circleJXG.center.X(), this.circleJXG.center.Y()],
        // radius: this.circleJXG.radius,
      });
    }
  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  circle2d: CircleRenderer,
}

export default AvailableRenderers;
