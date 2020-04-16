import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Graph extends DoenetRenderer {

  constructor(props) {
    super(props);

    this.setAllBoardsToStayLowQuality = this.setAllBoardsToStayLowQuality.bind(this);
    this.setAllBoardsToHighQualityAndUpdate = this.setAllBoardsToHighQualityAndUpdate.bind(this);
  }

  static initializeChildrenOnConstruction = false;

  componentDidMount() {
    this.drawBoard();
    this.forceUpdate();
    // this.drawGraphicalComponents();
  }

  drawBoard() {

    window.JXG.Options.axis.ticks.majorHeight = 20;

    this.board = window.JXG.JSXGraph.initBoard(this.componentName,
      {
        boundingbox: [this.doenetSvData.xmin, this.doenetSvData.ymax, this.doenetSvData.xmax, this.doenetSvData.ymin],
        axis: false,
        showCopyright: false,
      });

    if (this.doenetSvData.displayAxes) {
      let xaxisOptions = {};
      if (this.doenetSvData.xlabel) {
        xaxisOptions.name = this.doenetSvData.xlabel;
        xaxisOptions.withLabel = true;
        xaxisOptions.label = {
          position: 'rt',
          offset: [-10, 15]
        };
      }
      xaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [-5, -15]
        },
        minorTicks: 5,
        precision: 4,
      }
      let xaxis = this.board.create('axis', [[0, 0], [1, 0]], xaxisOptions)

      let yaxisOptions = {};
      if (this.doenetSvData.ylabel) {
        yaxisOptions.name = this.doenetSvData.ylabel;
        yaxisOptions.withLabel = true;
        yaxisOptions.label = {
          position: 'rt',
          offset: [-25, -5],
        }
      }
      yaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [12, -2]
        },
        minorTicks: 4,
        precision: 4,
      }
      let yaxis = this.board.create('axis', [[0, 0], [0, 1]], yaxisOptions)
    }

    this.board.itemsRenderedLowQuality = {};

    // this.board.on('up', this.setAllBoardsToHighQualityAndUpdate);
    // this.board.on('down', this.setAllBoardsToStayLowQuality);

    this.doenetPropsForChildren = { board: this.board };
    this.initializeChildren();
  }

  resizeBoard({ xmin, xmax, ymin, ymax }) {
    let changedSize = false;
    if (xmin !== undefined && xmin !== this.xmin) {
      this.xmin = xmin;
      changedSize = true;
    }
    if (xmax !== undefined && xmax !== this.xmax) {
      this.xmax = xmax;
      changedSize = true;
    }
    if (ymin !== undefined && ymin !== this.ymin) {
      this.ymin = ymin;
      changedSize = true;
    }
    if (ymax !== undefined && ymax !== this.ymax) {
      this.ymax = ymax;
      changedSize = true;
    }

    if (changedSize) {
      this.board.setBoundingBox([this.xmin, this.ymax, this.xmax, this.ymin]);
      // seem to need to call this again to get the ticks correct
      this.board.fullUpdate();

      if (this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
        this.board.itemsRenderedLowQuality[this.componentName] = this.board;
      }
    }

  }

  setToLowQualityRender({ stayLowQuality } = {}) {
    if (this.board !== undefined) {
      this.board.updateQuality = this.board.BOARD_QUALITY_LOW;
      if (stayLowQuality !== undefined) {
        this.stayLowQuality = stayLowQuality;
      }
    }
  }

  setToHighQualityRenderAndUpdate({ overrideStayLowQuality = false } = {}) {
    if (this.stayLowQuality && !overrideStayLowQuality) {
      return;
    }

    if (this.board === undefined) {
      return;
    }
    this.stayLowQuality = false;
    this.board.updateQuality = this.board.BOARD_QUALITY_HIGH;
    let updatedItem = false;
    for (let key in this.board.itemsRenderedLowQuality) {
      let item = this.board.itemsRenderedLowQuality[key];
      item.needsUpdate = true;
      item.update();
      updatedItem = true;
    }
    if (updatedItem) {
      this.board.updateRenderer();
    }
    this.board.itemsRenderedLowQuality = {};
  }

  setAllBoardsToStayLowQuality() {
    for (let renderer of this.graphRenderComponents) {
      renderer.setToLowQualityRender({ stayLowQuality: true });
    }
  }

  setAllBoardsToHighQualityAndUpdate() {
    for (let renderer of this.graphRenderComponents) {
      renderer.setToHighQualityRenderAndUpdate({ overrideStayLowQuality: true });
    }
  }

  drawGraphicalComponents() {

    this.renderers = {};

    let currentRenderers = this.returnRenderersInGraph();

    for (let componentName in currentRenderers) {
      let componentRenderer = currentRenderers[componentName];
      if (componentRenderer !== undefined && componentRenderer.createGraphicalObject !== undefined) {
        componentRenderer.createGraphicalObject(this.board);
        this.renderers[componentName] = currentRenderers[componentName];
      }
    }
  }

  componentWillUnmount() {
    // let allRenderers = this.renderers;
    // for(let componentName in allRenderers) {
    //   let componentRenderer = allRenderers[componentName];
    //   if(componentRenderer.deleteGraphicalObject !== undefined) {
    //     componentRenderer.deleteGraphicalObject();
    //   }
    // }
  }

  updateGraphicalComponents() {

    // add any new renderers that aren't in renderers
    let currentRenderers = this.returnRenderersInGraph();
    for (let componentName in currentRenderers) {
      let componentRenderer = currentRenderers[componentName];
      if (componentRenderer !== undefined && componentRenderer.createGraphicalObject !== undefined &&
        this.renderers[componentName] === undefined) {
        componentRenderer.createGraphicalObject(this.board);
        this.renderers[componentName] = currentRenderers[componentName];
      }
    }

    // delete graphical objects from any renderers that aren't rendered anymore
    for (let componentName in this.renderers) {
      if (!(componentName in currentRenderers)) {

        // only delete if actually not in currentRenders (not just if currentRenderer is undefined)
        // as deleting JSX graphical object is incredibly slow, only delete if component is no longer there
        this.renderers[componentName].deleteGraphicalObject();
        delete this.renderers[componentName];
      }
    }

  }


  componentDidUpdate() {
    // this.updateGraphicalComponents();
    //window.MathJax.Hub.Queue(["Typeset",window.MathJax.Hub, "#"+this.component.componentName]);
  }

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    const divStyle = {
      width: this.doenetSvData.numericalWidth,
      height: this.doenetSvData.numericalHeight,
    }

    return <React.Fragment>
      <a name={this.componentName} />
      <div id={this.componentName} className="jxgbox" style={divStyle} />
      {this.children}
    </React.Fragment>;
  }

}