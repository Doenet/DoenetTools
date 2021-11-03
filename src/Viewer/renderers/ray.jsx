import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Ray extends DoenetRenderer {
  constructor(props) {
    super(props)

    if (props.board) {
      this.createGraphicalObject();

      this.doenetPropsForChildren = { board: this.props.board };
      this.initializeChildren();
    }
  }

  static initializeChildrenOnConstruction = false;

  createGraphicalObject() {

    if (this.doenetSvData.numericalEndpoint.length !== 2 ||
      this.doenetSvData.numericalThroughpoint.length !== 2
    ) {
      return;
    }

    //things to be passed to JSXGraph as attributes
    var jsxRayAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: !this.doenetSvData.draggable || this.doenetSvData.fixed,
      layer: 10 * this.doenetSvData.layer + 7,
      strokeColor: this.doenetSvData.selectedStyle.lineColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.lineColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
      straightFirst: false,
    };

    if (!this.doenetSvData.draggable || this.doenetSvData.fixed) {
      jsxRayAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.rayWidth;
    }


    let through = [
      [...this.doenetSvData.numericalEndpoint],
      [...this.doenetSvData.numericalThroughpoint]
    ];

    this.rayJXG = this.props.board.create('line', through, jsxRayAttributes);

    this.rayJXG.on('drag', function (e) {
      this.dragged = true;
      this.onDragHandler(e);
    }.bind(this));

    this.rayJXG.on('up', function (e) {
      if (this.dragged) {
        this.actions.finalizeRayPosition();
      }
    }.bind(this));

    this.rayJXG.on('down', function (e) {
      this.dragged = false;
      this.pointerAtDown = [e.x, e.y];
      this.pointsAtDown = [
        [...this.rayJXG.point1.coords.scrCoords],
        [...this.rayJXG.point2.coords.scrCoords]
      ]

    }.bind(this));

    this.previousWithLabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";

    return this.rayJXG;

  }

  deleteGraphicalObject() {
    this.rayJXG.off('drag');
    this.rayJXG.off('down');
    this.rayJXG.off('up');
    this.props.board.removeObject(this.rayJXG);
    delete this.rayJXG;
  }

  componentWillUnmount() {
    if (this.rayJXG) {
      this.deleteGraphicalObject();
    }
  }


  update({ sourceOfUpdate }) {

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    if (this.rayJXG === undefined) {
      return this.createGraphicalObject();
    }

    if (this.doenetSvData.numericalEndpoint.length !== 2 ||
      this.doenetSvData.numericalThroughpoint.length !== 2
    ) {
      return this.deleteGraphicalObject();
    }

    let validCoords = true;

    for (let coords of [this.doenetSvData.numericalEndpoint, this.doenetSvData.numericalThroughpoint]) {
      if (!Number.isFinite(coords[0])) {
        validCoords = false;
      }
      if (!Number.isFinite(coords[1])) {
        validCoords = false;
      }
    }

    this.rayJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, this.doenetSvData.numericalEndpoint);
    this.rayJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, this.doenetSvData.numericalThroughpoint);

    let visible = !this.doenetSvData.hidden;

    if (validCoords) {
      let actuallyChangedVisibility = this.rayJXG.visProp["visible"] !== visible;
      this.rayJXG.visProp["visible"] = visible;
      this.rayJXG.visPropCalc["visible"] = visible;

      if (actuallyChangedVisibility) {
        // at least for point, this function is incredibly slow, so don't run it if not necessary
        // TODO: figure out how to make label disappear right away so don't need to run this function
        this.rayJXG.setAttribute({ visible: visible })
      }

    } else {
      this.rayJXG.visProp["visible"] = false;
      this.rayJXG.visPropCalc["visible"] = false;
      // this.rayJXG.setAttribute({visible: false})
    }

    this.rayJXG.name = this.doenetSvData.label;
    // this.rayJXG.visProp.withlabel = this.showlabel && this.label !== "";

    let withlabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    if (withlabel != this.previousWithLabel) {
      this.rayJXG.setAttribute({ withlabel: withlabel });
      this.previousWithLabel = withlabel;
    }

    this.rayJXG.needsUpdate = true;
    this.rayJXG.update()
    if (this.rayJXG.hasLabel) {
      this.rayJXG.label.needsUpdate = true;
      this.rayJXG.label.update();
    }
    this.props.board.updateRenderer();

  }

  onDragHandler(e) {
    let pointCoords = this.calculatePointPositions(e);
    this.actions.moveRay({
      point1coords: pointCoords[0],
      point2coords: pointCoords[1],
      transient: true,
      skippable: true,
    });
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

    return null;
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