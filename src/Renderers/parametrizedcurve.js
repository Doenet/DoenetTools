import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class ParametrizedCurve extends DoenetRenderer {
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

    //things to be passed to JSXGraph as attributes
    var curveAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: this.doenetSvData.draggable !== true,
      layer: 10 * this.doenetSvData.layer + 5,
      strokeColor: this.doenetSvData.selectedStyle.markerColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.markerColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
    };

    if (!this.doenetSvData.draggable) {
      curveAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }

    this.curveJXG = this.props.board.create('curve', [
      this.doenetSvData.fs[0], this.doenetSvData.fs[1],
      this.doenetSvData.parminNumeric, this.doenetSvData.parmaxNumeric
    ], curveAttributes);

    return this.curveJXG;

  }

  deleteGraphicalObject() {
    this.props.board.removeObject(this.curveJXG);
    delete this.curveJXG;
  }

  componentWillUnmount() {
    if (this.curveJXG) {
      this.deleteGraphicalObject();
    }
  }

  update({ sourceOfUpdate }) {

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    // even curves that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for curves that don't have a JXG curve created
    if (this.curveJXG === undefined) {
      return;
    }

    if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
      this.props.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
    }

    let visible = !this.doenetSvData.hidden;

    this.curveJXG.name = this.doenetSvData.label;

    this.curveJXG.visProp["visible"] = visible;
    this.curveJXG.visPropCalc["visible"] = visible;


    this.curveJXG.X = this.doenetSvData.fs[0];
    this.curveJXG.Y = this.doenetSvData.fs[1];

    this.curveJXG.minX = x => this.doenetSvData.parminNumeric;
    this.curveJXG.maxX = x => this.doenetSvData.parmaxNumeric;



    this.curveJXG.needsUpdate = true;
    this.curveJXG.updateCurve();
    if(this.curveJXG.hasLabel) {
      this.curveJXG.label.needsUpdate = true;
      this.curveJXG.label.visPropCalc.visible = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
      this.curveJXG.label.update();
    }
    this.props.board.updateRenderer();
  }


  render() {

    if (this.props.board) {
      return <><a name={this.componentName} /></>
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
