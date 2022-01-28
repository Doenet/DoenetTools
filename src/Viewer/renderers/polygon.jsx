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
      layer: 10 * this.doenetSvData.layer + 9,
    };

    this.jsxBorderAttributes = {
      highlight: false,
      visible: !this.doenetSvData.hidden,
      layer: 10 * this.doenetSvData.layer + 6,
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

    this.polygonJXG.on('drag', e => this.onDragHandler(-1, true, e));
    this.polygonJXG.on('up', function (e) {
      if (this.draggedPoint === -1) {
        this.actions.finalizePolygonPosition();
      }
    }.bind(this));

    this.polygonJXG.on('down', function (e) {
      this.draggedPoint = null
      this.pointerAtDown = [e.x, e.y];

      this.pointsAtDown = this.polygonJXG.vertices.map(x => [...x.coords.scrCoords])

    }.bind(this));


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
      vertex.off('down');
      vertex.on('down', x => this.draggedPoint = null);

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

    } else if (this.doenetSvData.nVertices < this.previousNVertices) {
      for (let i = this.previousNVertices - 1; i >= this.doenetSvData.nVertices; i--) {
        this.polygonJXG.vertices[i].drag('drag')
        this.polygonJXG.vertices[i].drag('down')
        this.polygonJXG.vertices[i].drag('up')
        this.polygonJXG.removePoints(this.polygonJXG.vertices[i]);
      }
      this.initializePoints();
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


  onDragHandler(i, transient, e) {
    if (transient) {
      this.draggedPoint = i;
    } else if (this.draggedPoint !== i) {
      return;
    }

    if (i === -1) {
      let pointCoords = this.calculatePointPositions(e);

      this.actions.movePolygon({ pointCoords, transient, skippable: transient });
    } else {
      let pointCoords = {};
      pointCoords[i] = [this.polygonJXG.vertices[i].X(), this.polygonJXG.vertices[i].Y()];
      this.actions.movePolygon({
        pointCoords,
        transient,
        skippable: transient,
        sourceInformation: { vertex: i }
      });
    }

  }

  calculatePointPositions(e) {

    // the reason we calculate point positions with this algorithm,
    // is so that points don't get trapped on an attracting object
    // if you move the mouse slowly.

    var o = this.props.board.origin.scrCoords;

    let pointCoords = []

    for (let i = 0; i < this.polygonJXG.vertices.length - 1; i++) {
      let calculatedX = (this.pointsAtDown[i][1] + e.x - this.pointerAtDown[0]
        - o[1]) / this.props.board.unitX;
      let calculatedY = (o[2] -
        (this.pointsAtDown[i][2] + e.y - this.pointerAtDown[1]))
        / this.props.board.unitY;
      pointCoords.push([calculatedX, calculatedY]);
    }
    return pointCoords;
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