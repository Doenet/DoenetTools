import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class FunctionCurve extends DoenetRenderer {
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
      fixed: true, //this.doenetSvData.draggable !== true,
      layer: 10 * this.doenetSvData.layer + 5,
      strokeColor: this.doenetSvData.selectedStyle.markerColor,
      highlightStrokeColor: this.doenetSvData.selectedStyle.markerColor,
      strokeWidth: this.doenetSvData.selectedStyle.lineWidth,
      dash: styleToDash(this.doenetSvData.selectedStyle.lineStyle),
    };

    if (!this.doenetSvData.draggable) {
      curveAttributes.highlightStrokeWidth = this.doenetSvData.selectedStyle.lineWidth;
    }

    if (this.doenetSvData.curveType === "parameterization") {
      this.curveJXG = this.props.board.create('curve', [
        this.doenetSvData.fs[0], this.doenetSvData.fs[1],
        this.doenetSvData.parminNumeric, this.doenetSvData.parmaxNumeric
      ], curveAttributes);

    } else {
      if (this.doenetSvData.flipFunction) {
        this.originalCurveJXG = this.props.board.create('functiongraph', [this.doenetSvData.fs[0]], { visible: false });
        this.reflectLine = this.props.board.create('line', [0, 1, -1], { visible: false });
        this.curveJXG = this.props.board.create('reflection', [this.originalCurveJXG, this.reflectLine], curveAttributes);
      } else {
        this.curveJXG = this.props.board.create('functiongraph', [this.doenetSvData.fs[0]], curveAttributes);
      }
      this.currentFlipFunction = this.doenetSvData.flipFunction;

    }

    this.currentCurveType = this.doenetSvData.curveType;


    return this.curveJXG;

  }

  deleteGraphicalObject() {
    this.props.board.removeObject(this.curveJXG);
    delete this.curveJXG;
    if (this.reflectLine !== undefined) {
      this.props.board.removeObject(this.reflectLine);
      delete this.reflectLine;
      this.props.board.removeObject(this.originalCurveJXG);
      delete this.originalCurveJXG;
    }
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

    if (
      this.currentCurveType !== this.doenetSvData.currentCurveType ||
      (
        this.currentCurveType === "function" &&
        this.currentFlipFunction !== this.doenetSvData.flipFunction
      )
    ) {
      // redraw entire curve curve type changed or if flip of function changed
      this.deleteGraphicalObject();
      let result = this.createGraphicalObject();

      if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
        if (this.doenetSvData.curveType === "function" && this.doenetSvData.flipFunction) {
          this.props.board.itemsRenderedLowQuality[this._key] = this.originalCurveJXG;
        } else {
          this.props.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
        }
      }

      return result;
    }

    if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
      this.props.board.itemsRenderedLowQuality[this._key] = this.curveJXG;
    }

    let visible = !this.doenetSvData.hidden;

    this.curveJXG.name = this.doenetSvData.label;

    this.curveJXG.visProp["visible"] = visible;
    this.curveJXG.visPropCalc["visible"] = visible;

    if (this.doenetSvData.curveType === "parameterization") {
      this.curveJXG.minX = () => this.doenetSvData.parminNumeric;
      this.curveJXG.maxX = () => this.doenetSvData.parmaxNumeric;
    } else {
      if (this.doenetSvData.flipFunction) {
        this.originalCurveJXG.Y = this.doenetSvData.fs[0];
        this.originalCurveJXG.needsUpdate = true;
        this.originalCurveJXG.updateCurve();
        if (this.props.board.updateQuality === this.props.board.BOARD_QUALITY_LOW) {
          this.props.board.itemsRenderedLowQuality[this._key] = this.originalCurveJXG;
        }
      } else {
        this.curveJXG.Y = this.doenetSvData.fs[0];
      }
    }

    this.curveJXG.needsUpdate = true;
    this.curveJXG.updateCurve();
    if (this.curveJXG.hasLabel) {
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
