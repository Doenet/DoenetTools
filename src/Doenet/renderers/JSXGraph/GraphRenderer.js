import React from 'react';

class GraphRenderer{
  constructor({key, returnRenderersInGraph,
      graphRenderComponents,
      width, height, xmin, xmax, ymin, ymax, displayaxes, xlabel, ylabel}){

    this._key = key;
    this.returnRenderersInGraph = returnRenderersInGraph;
    this.graphRenderComponents = graphRenderComponents;
    this.width = width;
    this.height = height;
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.displayaxes = displayaxes;
    this.xlabel = xlabel;
    this.ylabel = ylabel;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);

    this.setAllBoardsToStayLowQuality = this.setAllBoardsToStayLowQuality.bind(this);
    this.setAllBoardsToHighQualityAndUpdate = this.setAllBoardsToHighQualityAndUpdate.bind(this);
  }

  componentDidMount(){
    this.drawBoard();
    this.drawGraphicalComponents();
  }
  
  drawBoard(){

    window.JXG.Options.axis.ticks.majorHeight = 20;

    this.board = window.JXG.JSXGraph.initBoard(this._key,
    {
      boundingbox: [this.xmin, this.ymax, this.xmax, this.ymin],
      axis: false,
      showCopyright: false,
    });

    if(this.displayaxes) {
      let xaxisOptions = {};
      if(this.xlabel) {
        xaxisOptions.name = this.xlabel;
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
      let xaxis = this.board.create('axis', [[0,0],[1,0]], xaxisOptions)
      
      let yaxisOptions = {};
      if(this.ylabel) {
        yaxisOptions.name = this.ylabel;
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
      let yaxis = this.board.create('axis', [[0,0],[0,1]], yaxisOptions)
    }

    this.board.itemsRenderedLowQuality = {};

    this.board.on('up', this.setAllBoardsToHighQualityAndUpdate);
    this.board.on('down', this.setAllBoardsToStayLowQuality);
    
  }

  resizeBoard({xmin, xmax, ymin, ymax}) {
    let changedSize = false;
    if(xmin !== undefined && xmin !== this.xmin) {
      this.xmin = xmin;
      changedSize = true;
    }
    if(xmax !== undefined && xmax !== this.xmax) {
      this.xmax = xmax;
      changedSize = true;
    }
    if(ymin !== undefined && ymin !== this.ymin) {
      this.ymin = ymin;
      changedSize = true;
    }
    if(ymax !== undefined && ymax !== this.ymax) {
      this.ymax = ymax;
      changedSize = true;
    }

    if(changedSize) {
      this.board.setBoundingBox([this.xmin, this.ymax, this.xmax, this.ymin]);
      // seem to need to call this again to get the ticks correct
      this.board.fullUpdate();

      if(this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
        this.board.itemsRenderedLowQuality[this._key] = this.board;
      }
    }

  }

  setToLowQualityRender({stayLowQuality}={}) {
    if(this.board !== undefined) {
      this.board.updateQuality = this.board.BOARD_QUALITY_LOW;
      if(stayLowQuality !== undefined) {
        this.stayLowQuality = stayLowQuality;
      }
    }
  }

  setToHighQualityRenderAndUpdate({overrideStayLowQuality=false}={}) {
    if(this.stayLowQuality && !overrideStayLowQuality) {
      return;
    }

    if(this.board === undefined) {
      return;
    }
    this.stayLowQuality = false;
    this.board.updateQuality = this.board.BOARD_QUALITY_HIGH;
    let updatedItem = false;
    for(let key in this.board.itemsRenderedLowQuality) {
      let item = this.board.itemsRenderedLowQuality[key];
      item.needsUpdate = true;
      item.update();
      updatedItem = true;
    }
    if(updatedItem) {
      this.board.updateRenderer();
    }
    this.board.itemsRenderedLowQuality = {};
  }

  setAllBoardsToStayLowQuality() {
    for(let renderer of this.graphRenderComponents) {
      renderer.setToLowQualityRender({stayLowQuality: true});
    }
  }

  setAllBoardsToHighQualityAndUpdate() {
    for(let renderer of this.graphRenderComponents) {
      renderer.setToHighQualityRenderAndUpdate({overrideStayLowQuality: true});
    }
  }

  drawGraphicalComponents() {

    
    this.renderers = {};

    let currentRenderers = this.returnRenderersInGraph();
    
    for(let componentName in currentRenderers) {
      let componentRenderer = currentRenderers[componentName];
      if(componentRenderer !== undefined && componentRenderer.createGraphicalObject !== undefined) {
        componentRenderer.createGraphicalObject(this.board);
        this.renderers[componentName] = currentRenderers[componentName];
      }
    }
  }

  componentWillUnmount() {
    let allRenderers = this.renderers;
    for(let componentName in allRenderers) {
      let componentRenderer = allRenderers[componentName];
      if(componentRenderer.deleteGraphicalObject !== undefined) {
        componentRenderer.deleteGraphicalObject();
      }
    }
  }

  updateGraphicalComponents() {

    // add any new renderers that aren't in renderers
    let currentRenderers = this.returnRenderersInGraph();
    for(let componentName in currentRenderers) {
      let componentRenderer = currentRenderers[componentName];
      if(componentRenderer !== undefined && componentRenderer.createGraphicalObject !== undefined &&
        this.renderers[componentName] === undefined) {
        componentRenderer.createGraphicalObject(this.board);
        this.renderers[componentName] = currentRenderers[componentName];
      }
    }

    // delete graphical objects from any renderers that aren't rendered anymore
    for(let componentName in this.renderers) {
      if(!(componentName in currentRenderers)){

        // only delete if actually not in currentRenders (not just if currentRenderer is undefined)
        // as deleting JSX graphical object is incredibly slow, only delete if component is no longer there
        this.renderers[componentName].deleteGraphicalObject();
        delete this.renderers[componentName];
      }
    }

  }


  componentDidUpdate(){
    this.updateGraphicalComponents();
    //window.MathJax.Hub.Queue(["Typeset",window.MathJax.Hub, "#"+this.component.componentName]);
  }
  
  jsxCode(){
    const divStyle = {
      width: this.width,
      height: this.height,}
    return <React.Fragment><a name={this._key} /><div id={this._key} className="jxgbox" style={divStyle}></div></React.Fragment>;
  }

}

let AvailableRenderers = {
  graph2d: GraphRenderer,
}

export default AvailableRenderers;
