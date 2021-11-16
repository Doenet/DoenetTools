import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
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
  }
  drawBoard() {
    let boundingbox = [this.doenetSvData.xmin, this.doenetSvData.ymax, this.doenetSvData.xmax, this.doenetSvData.ymin];
    this.board = window.JXG.JSXGraph.initBoard(this.componentName, {
      boundingbox,
      axis: false,
      showCopyright: false,
      showNavigation: this.doenetSvData.showNavigation && !this.doenetSvData.fixAxes,
      keepAspectRatio: this.doenetSvData.identicalAxisScales,
      zoom: {wheel: !this.doenetSvData.fixAxes},
      pan: {enabled: !this.doenetSvData.fixAxes}
    });
    if (this.doenetSvData.displayXAxis) {
      let xaxisOptions = {};
      if (this.doenetSvData.xlabel) {
        let position = "rt";
        let offset = [5, 10];
        let anchorx = "right";
        if (this.doenetSvData.xlabelPosition === "left") {
          position = "lft";
          anchorx = "left";
          offset = [-5, 10];
        }
        xaxisOptions.name = this.doenetSvData.xlabel;
        xaxisOptions.withLabel = true;
        xaxisOptions.label = {
          position,
          offset,
          anchorx
        };
      }
      xaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [-5, -15]
        },
        minorTicks: 4,
        precision: 4
      };
      if (this.doenetSvData.grid === "dense") {
        xaxisOptions.ticks.majorHeight = -1;
        xaxisOptions.ticks.minorHeight = -1;
      } else if (this.doenetSvData.grid === "medium") {
        xaxisOptions.ticks.majorHeight = -1;
        xaxisOptions.ticks.minorHeight = 10;
      } else {
        xaxisOptions.ticks.majorHeight = 20;
        xaxisOptions.ticks.minorHeight = 10;
      }
      if (!this.doenetSvData.displayYAxis) {
        xaxisOptions.ticks.drawZero = true;
      }
      this.xaxis = this.board.create("axis", [[0, 0], [1, 0]], xaxisOptions);
    }
    if (this.doenetSvData.displayYAxis) {
      let yaxisOptions = {};
      if (this.doenetSvData.ylabel) {
        let position = "rt";
        let offset = [-10, -5];
        let anchorx = "right";
        if (this.doenetSvData.ylabelPosition === "bottom") {
          position = "lft";
          offset[1] = 5;
        }
        if (this.doenetSvData.ylabelAlignment === "right") {
          anchorx = "left";
          offset[0] = 10;
        }
        yaxisOptions.name = this.doenetSvData.ylabel;
        yaxisOptions.withLabel = true;
        yaxisOptions.label = {
          position,
          offset,
          anchorx
        };
      }
      yaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [12, -2]
        },
        minorTicks: 4,
        precision: 4
      };
      if (this.doenetSvData.grid === "dense") {
        yaxisOptions.ticks.majorHeight = -1;
        yaxisOptions.ticks.minorHeight = -1;
      } else if (this.doenetSvData.grid === "medium") {
        yaxisOptions.ticks.majorHeight = -1;
        yaxisOptions.ticks.minorHeight = 10;
      } else {
        yaxisOptions.ticks.majorHeight = 20;
        yaxisOptions.ticks.minorHeight = 10;
      }
      if (!this.doenetSvData.displayXAxis) {
        yaxisOptions.ticks.drawZero = true;
      }
      this.yaxis = this.board.create("axis", [[0, 0], [0, 1]], yaxisOptions);
    }
    this.board.itemsRenderedLowQuality = {};
    this.board.on("boundingbox", () => {
      if (!(this.settingBoundingBox || this.resizingBoard)) {
        this.previousBoundingbox = this.board.getBoundingBox();
        let [xmin, ymax, xmax, ymin] = this.previousBoundingbox;
        this.actions.changeAxisLimits({
          xmin,
          xmax,
          ymin,
          ymax
        });
      }
    });
    this.doenetPropsForChildren = {board: this.board};
    this.initializeChildren();
    this.previousBoundingbox = boundingbox;
    this.previousDimensions = {
      width: parseFloat(sizeToCSS(this.doenetSvData.width)),
      height: parseFloat(sizeToCSS(this.doenetSvData.height))
    };
  }
  update() {
    if (!this.board) {
      return;
    }
    if (this.doenetSvData.grid === "dense") {
      if (this.xaxis) {
        this.xaxis.defaultTicks.setAttribute({majorHeight: -1});
        this.xaxis.defaultTicks.setAttribute({minorHeight: -1});
      }
      if (this.yaxis) {
        this.yaxis.defaultTicks.setAttribute({majorHeight: -1});
        this.yaxis.defaultTicks.setAttribute({minorHeight: -1});
      }
    } else if (this.doenetSvData.grid === "medium") {
      if (this.xaxis) {
        this.xaxis.defaultTicks.setAttribute({majorHeight: -1});
        this.xaxis.defaultTicks.setAttribute({minorHeight: 10});
      }
      if (this.yaxis) {
        this.yaxis.defaultTicks.setAttribute({majorHeight: -1});
        this.yaxis.defaultTicks.setAttribute({minorHeight: 10});
      }
    } else {
      if (this.xaxis) {
        this.xaxis.defaultTicks.setAttribute({majorHeight: 20});
        this.xaxis.defaultTicks.setAttribute({minorHeight: 10});
      }
      if (this.yaxis) {
        this.yaxis.defaultTicks.setAttribute({majorHeight: 20});
        this.yaxis.defaultTicks.setAttribute({minorHeight: 10});
      }
    }
    if (this.doenetSvData.displayXAxis) {
      this.xaxis.name = this.doenetSvData.xlabel;
      if (this.xaxis.hasLabel) {
        let position = "rt";
        let offset = [5, 10];
        let anchorx = "right";
        if (this.doenetSvData.xlabelPosition === "left") {
          position = "lft";
          anchorx = "left";
          offset = [-5, 10];
        }
        this.xaxis.label.visProp.position = position;
        this.xaxis.label.visProp.anchorx = anchorx;
        this.xaxis.label.visProp.offset = offset;
        this.xaxis.label.needsUpdate = true;
        this.xaxis.label.fullUpdate();
      }
    }
    if (this.doenetSvData.displayYAxis) {
      this.yaxis.name = this.doenetSvData.ylabel;
      if (this.yaxis.hasLabel) {
        let position = "rt";
        let offset = [-10, -5];
        let anchorx = "right";
        if (this.doenetSvData.ylabelPosition === "bottom") {
          position = "lft";
          offset[1] = 5;
        }
        if (this.doenetSvData.ylabelAlignment === "right") {
          anchorx = "left";
          offset[0] = 10;
        }
        this.yaxis.label.visProp.position = position;
        this.yaxis.label.visProp.offset = offset;
        this.yaxis.label.visProp.anchorx = anchorx;
        this.yaxis.label.needsUpdate = true;
        this.yaxis.label.fullUpdate();
      }
    }
    let currentDimensions = {
      width: parseFloat(sizeToCSS(this.doenetSvData.width)),
      height: parseFloat(sizeToCSS(this.doenetSvData.height))
    };
    if ((currentDimensions.width !== this.previousDimensions.width || currentDimensions.height !== this.previousDimensions.height) && Number.isFinite(currentDimensions.width) && Number.isFinite(currentDimensions.height)) {
      this.resizingBoard = true;
      this.board.resizeContainer(currentDimensions.width, currentDimensions.height);
      this.resizingBoard = false;
      this.previousDimensions = currentDimensions;
    }
    let boundingbox = [this.doenetSvData.xmin, this.doenetSvData.ymax, this.doenetSvData.xmax, this.doenetSvData.ymin];
    if (boundingbox.some((v, i) => v !== this.previousBoundingbox[i])) {
      this.settingBoundingBox = true;
      this.board.setBoundingBox(boundingbox);
      this.settingBoundingBox = false;
      this.board.fullUpdate();
      if (this.board.updateQuality === this.board.BOARD_QUALITY_LOW) {
        this.board.itemsRenderedLowQuality[this.componentName] = this.board;
      }
      this.previousBoundingbox = boundingbox;
    }
    super.update();
  }
  setToLowQualityRender({stayLowQuality} = {}) {
    if (this.board !== void 0) {
      this.board.updateQuality = this.board.BOARD_QUALITY_LOW;
      if (stayLowQuality !== void 0) {
        this.stayLowQuality = stayLowQuality;
      }
    }
  }
  setToHighQualityRenderAndUpdate({overrideStayLowQuality = false} = {}) {
    if (this.stayLowQuality && !overrideStayLowQuality) {
      return;
    }
    if (this.board === void 0) {
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
      renderer.setToLowQualityRender({stayLowQuality: true});
    }
  }
  setAllBoardsToHighQualityAndUpdate() {
    for (let renderer of this.graphRenderComponents) {
      renderer.setToHighQualityRenderAndUpdate({overrideStayLowQuality: true});
    }
  }
  componentWillUnmount() {
    this.board.off("boundingbox");
  }
  render() {
    const divStyle = {
      width: sizeToCSS(this.doenetSvData.width),
      height: sizeToCSS(this.doenetSvData.height)
    };
    if (this.doenetSvData.hidden) {
      divStyle.display = "none";
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("div", {
      id: this.componentName,
      className: "jxgbox",
      style: divStyle
    }), this.children);
  }
}
