import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class LineSegment extends DoenetRenderer {
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

    if (this.doenetSvData.numericalEndpoints.length !== 2 ||
      this.doenetSvData.numericalEndpoints.some(x => x.length !== 2)
    ) {
      return;
    }

    //things to be passed to JSXGraph as attributes
    var jsxSegmentAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: !this.doenetSvData.draggable || this.doenetSvData.fixed,
      layer: 10 * this.doenetSvData.layer + 7,
      strokeColor: this.doenetSvData.selectedStyle.lineColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.lineColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
    };

    if (!this.doenetSvData.draggable || this.doenetSvData.fixed) {
      jsxSegmentAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }

    let jsxPointAttributes = Object.assign({}, jsxSegmentAttributes);
    Object.assign(jsxPointAttributes, {
      withLabel: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: 'lightgray',
      layer: 10 * this.doenetSvData.layer + 8,
      showInfoBox: this.doenetSvData.showCoordsWhenDragging,
    });
    if (!this.doenetSvData.draggable || this.doenetSvData.fixed) {
      jsxPointAttributes.visible = false;
    }


    let endpoints = [
      [...this.doenetSvData.numericalEndpoints[0]],
      [...this.doenetSvData.numericalEndpoints[1]]
    ];

    // create invisible points at endpoints
    this.point1JXG = this.props.board.create('point', endpoints[0], jsxPointAttributes);
    this.point2JXG = this.props.board.create('point', endpoints[1], jsxPointAttributes);


    this.lineSegmentJXG = this.props.board.create('segment', [this.point1JXG, this.point2JXG], jsxSegmentAttributes);

    this.point1JXG.on('drag', () => this.onDragHandler(1, true));
    this.point2JXG.on('drag', () => this.onDragHandler(2, true));
    this.lineSegmentJXG.on('drag', (e) => this.onDragHandler(0, true, e));

    this.point1JXG.on('up', () => this.onDragHandler(1, false));
    this.point2JXG.on('up', () => this.onDragHandler(2, false));
    this.lineSegmentJXG.on('up', function (e) {
      if (this.draggedPoint === 0) {
        this.actions.finalizeLineSegmentPosition();
      }
    }.bind(this));

    this.point1JXG.on('down', () => this.draggedPoint = null);
    this.point2JXG.on('down', () => this.draggedPoint = null);
    this.lineSegmentJXG.on('down', function (e) {
      this.draggedPoint = null;
      this.pointerAtDown = [e.x, e.y];
      this.pointsAtDown = [
        [...this.point1JXG.coords.scrCoords],
        [...this.point2JXG.coords.scrCoords]
      ]
    }.bind(this));

    this.previousWithLabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";

    return this.lineSegmentJXG;

  }

  deleteGraphicalObject() {
    this.lineSegmentJXG.off('drag');
    this.lineSegmentJXG.off('down');
    this.lineSegmentJXG.off('up');
    this.props.board.removeObject(this.lineSegmentJXG);
    delete this.lineSegmentJXG;

    this.point1JXG.off('drag');
    this.point1JXG.off('down');
    this.point1JXG.off('up');
    this.props.board.removeObject(this.point1JXG);
    delete this.point1JXG;

    this.point2JXG.off('drag');
    this.point2JXG.off('down');
    this.point2JXG.off('up');
    this.props.board.removeObject(this.point2JXG);
    delete this.point2JXG;
  }

  componentWillUnmount() {
    if (this.lineSegmentJXG) {
      this.deleteGraphicalObject();
    }
  }


  update({ sourceOfUpdate }) {

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    if (this.lineSegmentJXG === undefined) {
      return this.createGraphicalObject();
    }

    if (this.doenetSvData.numericalEndpoints.length !== 2 ||
      this.doenetSvData.numericalEndpoints.some(x => x.length !== 2)
    ) {
      return this.deleteGraphicalObject();
    }

    let validCoords = true;

    for (let coords of [this.doenetSvData.numericalEndpoints[0], this.doenetSvData.numericalEndpoints[1]]) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }

    this.lineSegmentJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, this.doenetSvData.numericalEndpoints[0]);
    this.lineSegmentJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, this.doenetSvData.numericalEndpoints[1]);

    let visible = !this.doenetSvData.hidden;

    if (validCoords) {
      let actuallyChangedVisibility = this.lineSegmentJXG.visProp["visible"] !== visible;
      this.lineSegmentJXG.visProp["visible"] = visible;
      this.lineSegmentJXG.visPropCalc["visible"] = visible;

      if (actuallyChangedVisibility) {
        // at least for point, this function is incredibly slow, so don't run it if not necessary
        // TODO: figure out how to make label disappear right away so don't need to run this function
        this.lineSegmentJXG.setAttribute({ visible: visible })
      }
    }
    else {
      this.lineSegmentJXG.visProp["visible"] = false;
      this.lineSegmentJXG.visPropCalc["visible"] = false;
      // this.lineSegmentJXG.setAttribute({visible: false})
    }

    this.lineSegmentJXG.name = this.doenetSvData.label;
    // this.lineSegmentJXG.visProp.withlabel = this.showlabel && this.label !== "";

    let withlabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    if (withlabel != this.previousWithLabel) {
      this.lineSegmentJXG.setAttribute({ withlabel: withlabel });
      this.previousWithLabel = withlabel;
    }

    this.lineSegmentJXG.needsUpdate = true;
    this.lineSegmentJXG.update()
    if (this.lineSegmentJXG.hasLabel) {
      this.lineSegmentJXG.label.needsUpdate = true;
      this.lineSegmentJXG.label.update();
    }
    this.point1JXG.needsUpdate = true;
    this.point1JXG.update();
    this.point2JXG.needsUpdate = true;
    this.point2JXG.update();

    this.props.board.updateRenderer();

  }

  onDragHandler(i, transient, e) {

    if (transient) {
      this.draggedPoint = i;
    } else if (this.draggedPoint !== i) {
      return;
    }

    if (i == 1) {
      this.actions.moveLineSegment({
        point1coords: [this.lineSegmentJXG.point1.X(), this.lineSegmentJXG.point1.Y()],
        transient,
        skippable: transient,
      });
    } else if (i == 2) {
      this.actions.moveLineSegment({
        point2coords: [this.lineSegmentJXG.point2.X(), this.lineSegmentJXG.point2.Y()],
        transient,
        skippable: transient
      });
    } else {
      let pointCoords = this.calculatePointPositions(e);
      this.actions.moveLineSegment({
        point1coords: pointCoords[0],
        point2coords: pointCoords[1],
        transient: true,
        skippable: true,
      });
    }
  }

  calculatePointPositions(e) {

    // the reason we calculate point position with this algorithm,
    // rather than using .X() and .Y() directly
    // is so that points don't get trapped on an attracting object
    // if you move the mouse slowly.
    // The attributes .X() and .Y() are affected by
    // .setCoordinates functions called in update()
    // so will get modified to go back to the attracting object

    var o = this.props.board.origin.scrCoords;

    let pointCoords = []

    for (let i = 0; i < 2; i++) {
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