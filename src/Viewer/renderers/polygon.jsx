import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Polygon extends DoenetRenderer {
  constructor(props) {
    super(props)

    this.onDragHandler = this.onDragHandler.bind(this);

    if (props.board) {
      this.createGraphicalObject();

      this.doenetPropsForChildren = { board: this.props.board };
      this.initializeChildren();
    }
  }

  static initializeChildrenOnConstruction = false;

  createGraphicalObject() {

    if (!(this.doenetSvData.nVertices >= 2)) {
      return;
    }

    this.jsxPointAttributes = {
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: 'lightgray',
      visible: this.doenetSvData.draggable && !this.doenetSvData.fixed,
      withLabel: false,
      layer: 10 * this.doenetSvData.layer + 8,
    };

    this.jsxBorderAttributes = {
      highlight: false,
      visible: !this.doenetSvData.hidden,
      layer: 10 * this.doenetSvData.layer + 7,
      strokeColor: this.doenetSvData.selectedStyle.lineColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.lineColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
    };

    if (!this.doenetSvData.draggable || this.doenetSvData.fixed) {
      this.jsxBorderAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }


    this.jsxPolygonAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: !this.doenetSvData.draggable || this.doenetSvData.fixed,
      layer: 10 * this.doenetSvData.layer + 7,

      //specific to polygon
      fillColor: 'none',
      highlight: false,
      vertices: this.jsxPointAttributes,
      borders: this.jsxBorderAttributes,
    };

    if (this.doenetSvData.selectedStyle.fillColor !== "none") {
      this.jsxPolygonAttributes.fillColor = this.doenetSvData.selectedStyle.fillColor;
    }

    let pts = [];
    this.doenetSvData.numericalVertices.forEach(z => { pts.push([z[0], z[1]]) });

    this.props.board.suspendUpdate();

    this.polygonJXG = this.props.board.create('polygon', pts, this.jsxPolygonAttributes);

    this.initializePoints();

    this.initializeBorders();

    this.props.board.unsuspendUpdate();

    this.previousWithLabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    this.previousNVertices = this.doenetSvData.nVertices;

    return this.polygonJXG;

  }


  initializePoints() {
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      let vertex = this.polygonJXG.vertices[i];
      vertex.off('drag');
      vertex.on('drag', x => this.onDragHandler(i, true));
      vertex.off('up');
      vertex.on('up', x => this.onDragHandler(i, false));
    }
  }

  initializeBorders() {
    let offsets = [];
    let renderer = this;
    // create listeners for border so that when drag border,
    // the whole polygon translates
    // To accomplish this, set offset for all vertices on mousedown
    // and change coordinates for all vertices on drag

    let polygonJXG = this.polygonJXG;
    let newPointcoords;
    let board = this.props.board;
    let borderPointsAtDown;
    let pointerAtDown;

    function onDownBorder(e) {

      pointerAtDown = [e.x, e.y];

      borderPointsAtDown = [[...this.point1.coords.scrCoords], [...this.point2.coords.scrCoords]];

      newPointcoords = undefined;
      offsets = [];
      // calculate offsets for all vertices not on given border segment
      for (let j = 0; j < renderer.doenetSvData.nVertices; j++) {
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
    }

    function onDragBorder(i, e) {

      let o = board.origin.scrCoords;

      // create update instructions for moving entire polygon
      newPointcoords = {};

      let border = polygonJXG.borders[i];

      let borderPointCoords = [];
      for (let i = 0; i < 2; i++) {
        let calculatedX = (borderPointsAtDown[i][1] + e.x - pointerAtDown[0]
          - o[1]) / board.unitX;
        let calculatedY = (o[2] -
          (borderPointsAtDown[i][2] + e.y - pointerAtDown[1]))
          / board.unitY;
        borderPointCoords.push([calculatedX, calculatedY]);
      }

      for (let j = 0; j < renderer.doenetSvData.nVertices; j++) {
        let point = polygonJXG.vertices[j];
        if (point === border.point1) {
          newPointcoords[j] = borderPointCoords[0]
        } else if (point === border.point2) {
          newPointcoords[j] = borderPointCoords[1]
        } else {
          // for remaining vertices, set to offset from
          // first point of segment dragged
          let item = offsets.find(x => x.id === point.id);
          newPointcoords[j] = [
            border.point1.X() + item.offset[0],
            border.point1.Y() + item.offset[1]
          ];
        }
      }

      renderer.actions.movePolygon({
        pointCoords: newPointcoords,
        transient: true,
        skippable: true,
      });
    }

    function onUpBorder() {
      if (newPointcoords) {

        renderer.actions.movePolygon({
          pointCoords: newPointcoords,
        });
      }
    }

    for (let i = 0; i < this.polygonJXG.borders.length; i++) {
      let border = this.polygonJXG.borders[i];

      border.off('drag');
      border.on('drag', (e) => onDragBorder(i, e))
      border.off('up');
      border.on('up', onUpBorder)
      border.off('down');
      border.on('down', onDownBorder);
    }
  }

  deleteGraphicalObject() {
    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      let vertex = this.polygonJXG.vertices[i];
      if (vertex) {
        vertex.off('drag');
        vertex.off('up');
      }
    }
    if (this.polygonJXG.borders) {
      for (let i = 0; i < this.polygonJXG.borders.length; i++) {
        let border = this.polygonJXG.borders[i];
        border.off('drag')
        border.off('up')
        border.off('down');
      }
    }
    this.props.board.removeObject(this.polygonJXG);
    delete this.polygonJXG;
  }

  componentWillUnmount() {
    if (this.polygonJXG) {
      this.deleteGraphicalObject();
    }
  }


  update({ sourceOfUpdate }) {

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    if (this.doenetSvData.nVertices >= 2) {
      if (this.polygonJXG === undefined) {
        return this.createGraphicalObject();
      }
      // if reach here, will continue below to update polygon 
      // that already is rendered

    } else {
      if (this.polygonJXG === undefined) {
        return;
      } else {
        return this.deleteGraphicalObject();
      }
    }


    let validCoords = true;

    for (let coords of this.doenetSvData.numericalVertices) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }

    // add or delete points as required and change data array size
    if (this.doenetSvData.nVertices > this.previousNVertices) {
      for (let i = this.previousNVertices; i < this.doenetSvData.nVertices; i++) {
        let newPoint = this.props.board.create('point', [...this.doenetSvData.numericalVertices[i]], this.jsxPointAttributes)
        this.polygonJXG.addPoints(newPoint);
      }
      this.initializePoints();
      this.initializeBorders();

    } else if (this.doenetSvData.nVertices < this.previousNVertices) {
      // remove all border event handlers
      // (they will get recreated in initializeBorders)
      for (let i = 0; i < this.polygonJXG.borders.length; i++) {
        let border = this.polygonJXG.borders[i];
        border.off('drag')
        border.off('up')
        border.off('down');
      }
      for (let i = this.previousNVertices - 1; i >= this.doenetSvData.nVertices; i--) {
        this.polygonJXG.vertices[i].drag('drag')
        this.polygonJXG.vertices[i].drag('down')
        this.polygonJXG.vertices[i].drag('up')
        this.polygonJXG.removePoints(this.polygonJXG.vertices[i]);
      }
      this.initializePoints();
      this.initializeBorders();
    }

    for (let i = 0; i < this.doenetSvData.nVertices; i++) {
      this.polygonJXG.vertices[i].coords.setCoordinates(JXG.COORDS_BY_USER, [...this.doenetSvData.numericalVertices[i]]);
      this.polygonJXG.vertices[i].needsUpdate = true;
      this.polygonJXG.vertices[i].update();
    }

    let visibleNow = !this.doenetSvData.hidden;
    if (!validCoords) {
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

    this.props.board.updateRenderer();

  }


  onDragHandler(i, transient) {

    let pointCoords = {};
    pointCoords[i] = [this.polygonJXG.vertices[i].X(), this.polygonJXG.vertices[i].Y()];
    this.actions.movePolygon({ pointCoords, transient, skippable: transient });

  }

  render() {

    if (this.props.board) {
      return <><a name={this.componentName} />{this.children}</>
    }

    if (this.doenetSvData.hidden) {
      return null;
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