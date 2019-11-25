class PointRenderer{
  constructor({key, label, draggable, layer=0, x, y, visible=true, actions,
    size, color, style, showlabel }){
    this._key = key;
    this.label = label;
    this.draggable = draggable;
    this.layer = 10*layer + 9;
    this.x = x;
    this.y = y;
    this.visible = visible;
    this.actions = actions;
    this.size = size;
    this.color = color;
    this.style = style;
    this.showlabel = showlabel;

    if(this.style === "triangle") {
      this.style = "triangleup";
    }
  }

  createGraphicalObject(board) {

    this.board = board;

    //things to be passed to JSXGraph as attributes
    var jsxPointAttributes = {
      name: this.label,
      //size: this.component.state.size,
      visible: this.visible,
      withLabel: this.showlabel && this.label !== "",
      fixed: this.draggable !== true,
      layer: this.layer,
      fillColor: this.color,
      strokeColor: this.color,
      // highlightFillColor: this.color,
      // highlightStrokeColor: this.color,
      size: this.size,
      face: this.style,
    };

    if(this.draggable) {
      jsxPointAttributes.highlightFillColor = "#EEEEEE";
      jsxPointAttributes.highlightStrokeColor = "#C3D9FF";
      jsxPointAttributes.showInfoBox = true;
    } else {
      jsxPointAttributes.highlightFillColor = this.color;
      jsxPointAttributes.highlightStrokeColor = this.color;
      jsxPointAttributes.showInfoBox = false;
    }

    let coords = [ this.x, this.y ];

    if(!Number.isFinite(coords[0])) {
      coords[0] = 0;
      jsxPointAttributes['visible'] = false;
    }
    if(!Number.isFinite(coords[1])) {
      coords[1] = 0;
      jsxPointAttributes['visible'] = false;
    }

    this.pointJXG = board.create('point', coords, jsxPointAttributes);

    this.pointJXG.on('drag', function() {
      //board.suspendUpdate();
      this.onDragHandler();
      //board.unsuspendUpdate();
    }.bind(this));


    return this.pointJXG;

  }

  deleteGraphicalObject() {
    this.board.removeObject(this.pointJXG);
    delete this.pointJXG;
  }

  updatePoint({x,y,changeInitiatedWithPoint, label, visible, draggable , showlabel}) {

    let prevWithlabel = this.showlabel && this.label !== "";

    this.x = x;
    this.y = y;

    this.visible = visible;
    this.label = label;
    this.showlabel = showlabel;
    this.draggable = draggable;


    // even points that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for points that don't have a JXG point created
    if(this.pointJXG === undefined) {
      return;
    }

    this.pointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);

    if(Number.isFinite(x) && Number.isFinite(y)) {
      let actuallyChangedVisibility = this.pointJXG.visProp["visible"] !== this.visible;
      this.pointJXG.visProp["visible"] = this.visible;
      this.pointJXG.visPropCalc["visible"] = this.visible;
      
      if(actuallyChangedVisibility) {
        // this function is incredibly slow, so don't run it if not necessary
        // TODO: figure out how to make label disappear right away so don't need to run this function
        this.pointJXG.setAttribute({visible: this.visible})
      }
    }
    else {
      this.pointJXG.visProp["visible"] = false;
      this.pointJXG.visPropCalc["visible"] = false;
      // this.pointJXG.setAttribute({visible: false})
    }

    if(this.draggable) {
      this.pointJXG.visProp.highlightfillcolor = "#EEEEEE";
      this.pointJXG.visProp.highlightstrokecolor = "#C3D9FF";
      this.pointJXG.visProp.showinfobox = true;
      this.pointJXG.visProp.fixed = false;
    } else {
      this.pointJXG.visProp.highlightfillcolor = this.color;
      this.pointJXG.visProp.highlightstrokecolor = this.color;
      this.pointJXG.visProp.showinfobox = false;
      this.pointJXG.visProp.fixed = true;
    }
  

    if(changeInitiatedWithPoint) {
      this.board.updateInfobox(this.pointJXG);
    }

    this.pointJXG.name = this.label;
    // this.pointJXG.visProp.withlabel = this.showlabel && this.label !== "";
    
    let withlabel = this.showlabel && this.label !== "";
    if(withlabel != prevWithlabel) {
      this.pointJXG.setAttribute({withlabel: withlabel})
    }

    this.pointJXG.needsUpdate = true;
    this.pointJXG.update();
    if(this.pointJXG.hasLabel) {
      this.pointJXG.label.needsUpdate = true;
      this.pointJXG.label.update();
    }
    this.board.updateRenderer();

  }

  onDragHandler() {
    this.actions.movePoint({x: this.pointJXG.X(), y: this.pointJXG.Y()});
  }

  jsxCode(){
      return null;
  }
}

let AvailableRenderers = {
  point2d: PointRenderer,
}

export default AvailableRenderers;
