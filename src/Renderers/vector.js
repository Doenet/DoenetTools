import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Vector extends DoenetRenderer {
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

    if(this.doenetSvData.numericalEndpoints.length !== 2) {
      return;
    }

    let layer = 10 * this.doenetSvData.layer + 7;

    //things to be passed to JSXGraph as attributes
    var jsxVectorAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hide,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: this.doenetSvData.draggable !== true,
      layer,
      strokeColor: this.doenetSvData.selectedStyle.markerColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.markerColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
    };

    if (!this.doenetSvData.draggable) {
      jsxVectorAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }

    let endpoints = [
      [...this.doenetSvData.numericalEndpoints[0]],
      [...this.doenetSvData.numericalEndpoints[1]]
    ];

    let jsxPointAttributes = Object.assign({}, jsxVectorAttributes);
    Object.assign(jsxPointAttributes, {
      withLabel: false,
      fillColor: 'none',
      strokeColor: 'none',
      highlightStrokeColor: 'none',
      highlightFillColor: 'lightgray',
      layer: layer+1,
    });
    if(this.doenetSvData.draggable !== true) {
      jsxPointAttributes.visible = false;
    }

    // create invisible points at endpoints
    this.point1JXG = this.props.board.create('point', endpoints[0], jsxPointAttributes);
    this.point2JXG = this.props.board.create('point', endpoints[1], jsxPointAttributes);


    this.vectorJXG = this.props.board.create('arrow', [this.point1JXG, this.point2JXG], jsxVectorAttributes);

    this.point1JXG.on('drag', e => this.onDragHandler(1,e));
    this.point2JXG.on('drag', e => this.onDragHandler(2,e));
    this.vectorJXG.on('drag', e => this.onDragHandler(0,e));

    return this.vectorJXG;

  }

  deleteGraphicalObject() {
    this.props.board.removeObject(this.vectorJXG);
    delete this.vectorJXG;
    this.props.board.removeObject(this.point1JXG);
    delete this.point1JXG;
    this.props.board.removeObject(this.point2JXG);
    delete this.point2JXG;
  }

  componentWillUnmount() {
    if (this.vectorJXG) {
      this.deleteGraphicalObject();
    }
  }


  update({ sourceOfUpdate }) {

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    // even vectors that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for vectors that don't have a JXG vector created
    if (this.vectorJXG === undefined) {
      return;
    }


    let validPoints = true;

    for (let coords of [this.doenetSvData.numericalEndpoints[0], this.doenetSvData.numericalEndpoints[1]]) {
      if (!Number.isFinite(coords[0])) {
        validPoints = false;
      }
      if (!Number.isFinite(coords[1])) {
        validPoints = false;
      }
    }

    this.vectorJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, this.doenetSvData.numericalEndpoints[0]);
    this.vectorJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, this.doenetSvData.numericalEndpoints[1]);

    let visible = !this.doenetSvData.hide;

    if (validPoints) {
      this.vectorJXG.visProp["visible"] = visible;
      this.vectorJXG.visPropCalc["visible"] = visible;
      // this.vectorJXG.setAttribute({visible: visible})
    }
    else {
      this.vectorJXG.visProp["visible"] = false;
      this.vectorJXG.visPropCalc["visible"] = false;
      // this.vectorJXG.setAttribute({visible: false})
    }

    this.vectorJXG.name = this.doenetSvData.label;
    // this.vectorJXG.visProp.withlabel = this.showlabel && this.label !== "";

    let withlabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    if (withlabel != this.previousWithLabel) {
      this.vectorJXG.setAttribute({ withlabel: withlabel });
      this.previousWithLabel = withlabel;
    }

    this.vectorJXG.needsUpdate = true;
    this.vectorJXG.update()
    if (this.vectorJXG.hasLabel) {
      this.vectorJXG.label.needsUpdate = true;
      this.vectorJXG.label.update();
    }

    this.point1JXG.needsUpdate = true;
    this.point1JXG.update();
    this.point2JXG.needsUpdate = true;
    this.point2JXG.update();

    this.props.board.updateRenderer();

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

  componentDidMount() {
    if (!this.props.board) {
      window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
    }
  }

  componentDidUpdate() {
    if (!this.props.board) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
    }
  }

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    if(this.props.board) {
      return <><a name={this.componentName} />{this.children}</>
    }

    let mathJaxify = "\\(" + this.doenetSvData.displacement + "\\)";
    return <><a name={this.componentName} /><span id={this.componentName}>{mathJaxify}</span></>
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