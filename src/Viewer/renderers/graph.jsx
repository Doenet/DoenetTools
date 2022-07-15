import React, { useEffect, useState, useRef, createContext } from 'react';
import { sizeToCSS } from './utils/css';
import useDoenetRender from './useDoenetRenderer';
import me from 'math-expressions';
import VisibilitySensor from 'react-visibility-sensor-v2';

export const BoardContext = createContext();

export default React.memo(function Graph(props) {
  let { name, SVs, children, actions, callAction } = useDoenetRender(props);
  // console.log({ name, SVs, children, actions })

  const [board, setBoard] = useState(null);

  const previousDimensions = useRef(null);
  const previousBoundingbox = useRef(null);
  const xaxis = useRef(null);
  const yaxis = useRef(null);
  const settingBoundingBox = useRef(false);
  // const resizingBoard = useRef(false);
  const boardJustInitialized = useRef(false);

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  //Draw Board after mounting component
  useEffect(() => {
    let boundingbox = [SVs.xmin, SVs.ymax, SVs.xmax, SVs.ymin];
    previousBoundingbox.current = boundingbox;

    JXG.Options.layer.numlayers = 100;
    JXG.Options.navbar.highlightFillColor = "var(--canvastext)";
    JXG.Options.navbar.strokeColor = "var(--canvastext)";

    // check if have grid with specified width
    let haveFixedGrid = false;
    if (Array.isArray(SVs.grid)) {
      haveFixedGrid = true;
      JXG.Options.grid.gridX = SVs.grid[0];
      JXG.Options.grid.gridY = SVs.grid[1];
    }

    let board = window.JXG.JSXGraph.initBoard(name,
      {
        boundingbox,
        axis: false,
        showCopyright: false,
        showNavigation: SVs.showNavigation && !SVs.fixAxes,
        // keepAspectRatio: SVs.identicalAxisScales,
        zoom: { wheel: !SVs.fixAxes },
        pan: { enabled: !SVs.fixAxes },
        grid: haveFixedGrid

      });

    board.itemsRenderedLowQuality = {};

    board.on('boundingbox', () => {
      if (!(settingBoundingBox.current
        //  || resizingBoard.current
      )) {
        let newBoundingbox = board.getBoundingBox();
        let [xmin, ymax, xmax, ymin] = newBoundingbox;

        // look for a change in bounding box that isn't due to roundoff error
        let xscale = Math.abs(xmax - xmin);
        let yscale = Math.abs(ymax - ymin);
        let diffs = newBoundingbox.map((v, i) => Math.abs(v - previousBoundingbox.current[i]));
        if (Math.max(diffs[0] / xscale, diffs[1] / yscale, diffs[2] / xscale, diffs[3] / yscale) > 1E-12) {

          previousBoundingbox.current = newBoundingbox;
          callAction({
            action: actions.changeAxisLimits,
            args: { xmin, xmax, ymin, ymax }
          })
        }
      }
    })
    setBoard(board);

    previousDimensions.current = {
      width: parseFloat(sizeToCSS(SVs.width)),
      aspectRatio: SVs.aspectRatio,
    };


    if (SVs.displayXAxis) {
      let xaxisOptions = {};
      if (SVs.xlabel) {
        let position = 'rt';
        let offset = [5, 10];
        let anchorx = 'right'
        if (SVs.xlabelPosition === "left") {
          position = 'lft';
          anchorx = 'left';
          offset = [-5, 10];
        }
        xaxisOptions.name = SVs.xlabel;
        xaxisOptions.withLabel = true;
        xaxisOptions.label = {
          position,
          offset,
          anchorx,
          strokeColor: "var(--canvastext)"
        };
      }
      xaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [-5, -15],
          layer: 2,
        },
        // minorTicks: 4,
        precision: 4,
        strokeColor: 'var(--canvastext)',
        drawLabels: SVs.displayXAxisTickLabels
      }
      if (SVs.xTickScaleFactor !== null) {
        let xTickScaleFactor = me.fromAst(SVs.xTickScaleFactor);
        let scale = xTickScaleFactor.evaluate_to_constant();
        if (scale > 0) {
          let scaleSymbol = xTickScaleFactor.toString();
          xaxisOptions.ticks.scale = scale;
          xaxisOptions.ticks.scaleSymbol = scaleSymbol;
        }
      }
      xaxisOptions.strokeColor = "var(--canvastext)";
      xaxisOptions.highlight = false;

      if (SVs.grid === "dense") {
        xaxisOptions.ticks.majorHeight = -1;
        xaxisOptions.ticks.minorHeight = -1;
      } else if (SVs.grid === "medium") {
        xaxisOptions.ticks.majorHeight = -1;
        xaxisOptions.ticks.minorHeight = 10;
      } else {
        xaxisOptions.ticks.majorHeight = 20;
        xaxisOptions.ticks.minorHeight = 10;
      }

      if (!SVs.displayYAxis) {
        xaxisOptions.ticks.drawZero = true;
      }

      xaxis.current = board.create('axis', [[0, 0], [1, 0]], xaxisOptions)

      // change default ticks function to decreasing starting tick size
      xaxis.current.defaultTicks.ticksFunction = function () {
        var delta, b, dist;

        b = this.getLowerAndUpperBounds(this.getZeroCoordinates(), 'ticksdistance');
        dist = b.upper - b.lower;

        // only change from JSXgraph: 0.6 * dist became 0.2 * dist
        delta = Math.pow(10, Math.floor(Math.log(0.2 * dist) / Math.LN10));
        if (dist <= 6 * delta) {
          delta *= 0.5;
        }
        return delta;

      };

      // hack JSXgraph tick function so that
      // if major tick is 2*10^n for some integer n, then have 3 minor ticks,
      // otherwise have 4 minor ticks
      // (Other changes are simply to account for fact that
      // don't have access to Mat and Type)
      xaxis.current.defaultTicks.generateEquidistantTicks = function (coordsZero, bounds) {
        var tickPosition,
          eps2 = 1E-6,
          deltas,
          // Distance between two major ticks in user coordinates
          ticksDelta = (this.equidistant ? this.ticksFunction(1) : this.ticksDelta),
          ev_it = true,
          ev_mt = 4;
        this.visProp.minorticks = 4;

        // Calculate X and Y distance between two major ticks
        deltas = this.getXandYdeltas();

        // adjust ticks distance
        ticksDelta *= this.visProp.scale;
        if (ev_it && this.minTicksDistance > 1E-6) {
          ticksDelta = this.adjustTickDistance(ticksDelta, coordsZero, deltas);

          // Only change from JSXgraph function:
          // check if ticksDelta is 2*10^n for some integer n
          let mag = 10 ** Math.floor(Math.log10(ticksDelta)) * this.visProp.scale;
          if (Math.abs(ticksDelta / mag - 2) < 1E-14) {
            ev_mt = 3;
            this.visProp.minorticks = 3
          }
          ticksDelta /= (ev_mt + 1);
        } else if (!ev_it) {
          ticksDelta /= (ev_mt + 1);
        }
        this.ticksDelta = ticksDelta;

        if (ticksDelta < 1E-6) {
          return;
        }

        // Position ticks from zero to the positive side while not reaching the upper boundary
        tickPosition = 0;
        // if (!Type.evaluate(this.visProp.drawzero)) {
        tickPosition = ticksDelta;
        // }
        while (tickPosition <= bounds.upper + eps2) {
          // Only draw ticks when we are within bounds, ignore case where tickPosition < lower < upper
          if (tickPosition >= bounds.lower - eps2) {
            this.processTickPosition(coordsZero, tickPosition, ticksDelta, deltas);
          }
          tickPosition += ticksDelta;

          // Emergency out
          if ((bounds.upper - tickPosition) > ticksDelta * 10000) {
            break;
          }
        }

        // Position ticks from zero (not inclusive) to the negative side while not reaching the lower boundary
        tickPosition = -ticksDelta;
        while (tickPosition >= bounds.lower - eps2) {
          // Only draw ticks when we are within bounds, ignore case where lower < upper < tickPosition
          if (tickPosition <= bounds.upper + eps2) {
            this.processTickPosition(coordsZero, tickPosition, ticksDelta, deltas);
          }
          tickPosition -= ticksDelta;

          // Emergency out
          if ((tickPosition - bounds.lower) > ticksDelta * 10000) {
            break;
          }
        }
      }

    }

    if (SVs.displayYAxis) {

      let yaxisOptions = {};
      if (SVs.ylabel) {
        let position = 'rt';
        let offset = [-10, -5];
        let anchorx = 'right';
        if (SVs.ylabelPosition === "bottom") {
          position = 'lft';
          offset[1] = 5;
        }
        if (SVs.ylabelAlignment === "right") {
          anchorx = 'left';
          offset[0] = 10;
        }
        yaxisOptions.name = SVs.ylabel;
        yaxisOptions.withLabel = true;
        yaxisOptions.label = {
          position,
          offset,
          anchorx,
          strokeColor: "var(--canvastext)"
        }
      }
      yaxisOptions.strokeColor = "var(--canvastext)";
      yaxisOptions.highlight = false;

      yaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [12, -2],
          layer: 2
        },
        // minorTicks: 4,
        precision: 4,
        strokeColor: "var(--canvastext)",
        drawLabels: SVs.displayYAxisTickLabels
      }
      if (SVs.yTickScaleFactor !== null) {
        let yTickScaleFactor = me.fromAst(SVs.yTickScaleFactor);
        let scale = yTickScaleFactor.evaluate_to_constant();
        if (scale > 0) {
          let scaleSymbol = yTickScaleFactor.toString();
          yaxisOptions.ticks.scale = scale;
          yaxisOptions.ticks.scaleSymbol = scaleSymbol;
        }
      }
      if (SVs.grid === "dense") {
        yaxisOptions.ticks.majorHeight = -1;
        yaxisOptions.ticks.minorHeight = -1;
      } else if (SVs.grid === "medium") {
        yaxisOptions.ticks.majorHeight = -1;
        yaxisOptions.ticks.minorHeight = 10;
      } else {
        yaxisOptions.ticks.majorHeight = 20;
        yaxisOptions.ticks.minorHeight = 10;
      }

      if (!SVs.displayXAxis) {
        yaxisOptions.ticks.drawZero = true;
      }

      yaxis.current = board.create('axis', [[0, 0], [0, 1]], yaxisOptions)


      // change default ticks function to decreasing starting tick size
      yaxis.current.defaultTicks.ticksFunction = function () {
        var delta, b, dist;

        b = this.getLowerAndUpperBounds(this.getZeroCoordinates(), 'ticksdistance');
        dist = b.upper - b.lower;

        // only change from JSXgraph: 0.6 * dist became 0.2 * dist
        delta = Math.pow(10, Math.floor(Math.log(0.2 * dist) / Math.LN10));
        if (dist <= 6 * delta) {
          delta *= 0.5;
        }
        return delta;

      };

      // hack JSXgraph tick function so that
      // if major tick is 2*10^n for some integer n, then have 3 minor ticks,
      // otherwise have 4 minor ticks
      // (Other changes are simply to account for fact that
      // don't have access to Mat and Type)
      yaxis.current.defaultTicks.generateEquidistantTicks = function (coordsZero, bounds) {
        var tickPosition,
          eps2 = 1E-6,
          deltas,
          // Distance between two major ticks in user coordinates
          ticksDelta = (this.equidistant ? this.ticksFunction(1) : this.ticksDelta),
          ev_it = true,
          ev_mt = 4;
        this.visProp.minorticks = 4;

        // Calculate X and Y distance between two major ticks
        deltas = this.getXandYdeltas();

        // adjust ticks distance
        ticksDelta *= this.visProp.scale;
        if (ev_it && this.minTicksDistance > 1E-6) {
          ticksDelta = this.adjustTickDistance(ticksDelta, coordsZero, deltas);

          // Only change from JSXgraph function:
          // check if ticksDelta is 2*10^n for some integer n
          let mag = 10 ** Math.floor(Math.log10(ticksDelta)) * this.visProp.scale;
          if (Math.abs(ticksDelta / mag - 2) < 1E-14) {
            ev_mt = 3;
            this.visProp.minorticks = 3
          }
          ticksDelta /= (ev_mt + 1);
        } else if (!ev_it) {
          ticksDelta /= (ev_mt + 1);
        }
        this.ticksDelta = ticksDelta;

        if (ticksDelta < 1E-6) {
          return;
        }

        // Position ticks from zero to the positive side while not reaching the upper boundary
        tickPosition = 0;
        // if (!Type.evaluate(this.visProp.drawzero)) {
        tickPosition = ticksDelta;
        // }
        while (tickPosition <= bounds.upper + eps2) {
          // Only draw ticks when we are within bounds, ignore case where tickPosition < lower < upper
          if (tickPosition >= bounds.lower - eps2) {
            this.processTickPosition(coordsZero, tickPosition, ticksDelta, deltas);
          }
          tickPosition += ticksDelta;

          // Emergency out
          if ((bounds.upper - tickPosition) > ticksDelta * 10000) {
            break;
          }
        }

        // Position ticks from zero (not inclusive) to the negative side while not reaching the lower boundary
        tickPosition = -ticksDelta;
        while (tickPosition >= bounds.lower - eps2) {
          // Only draw ticks when we are within bounds, ignore case where lower < upper < tickPosition
          if (tickPosition <= bounds.upper + eps2) {
            this.processTickPosition(coordsZero, tickPosition, ticksDelta, deltas);
          }
          tickPosition -= ticksDelta;

          // Emergency out
          if ((tickPosition - bounds.lower) > ticksDelta * 10000) {
            break;
          }
        }
      }


    }

    boardJustInitialized.current = true;

    // on unmount
    return () => {
      board.off('boundingbox');
    }

  }, [])



  const divStyle = {
    width: sizeToCSS(SVs.width),
    aspectRatio: String(SVs.aspectRatio),
    maxWidth: "100%"
  }

  if (SVs.hidden) {
    divStyle.display = "none";
  }
  divStyle.border = "2px solid var(--canvastext)";
  divStyle.marginBottom = "12px";
  divStyle.marginTop = "12px";
  divStyle.backgroundColor = "var(--canvas)";
  divStyle.color = "var(--canvastext)";


  if (!board) {
    return <>
      <a name={name} />
      <div id={name} className="jxgbox" style={divStyle} />
    </>;
  }


  if (boardJustInitialized.current) {
    // skip the update logic the first time after just created the board
    boardJustInitialized.current = false;
  } else {

    // check if have grid with specified width
    if (Array.isArray(SVs.grid)) {
      let gridParamsChanged = JXG.Options.grid.gridX !== SVs.grid[0] || JXG.Options.grid.gridY !== SVs.grid[1];
      if (gridParamsChanged) {
        JXG.Options.grid.gridX = SVs.grid[0];
        JXG.Options.grid.gridY = SVs.grid[1];
        if (board.grids.length > 0) {
          board.removeObject(board.grids[0]);
          board.grids = [];
        }
      }
      if (board.grids.length === 0) {
        board.create("grid", [], { gridX: SVs.grid[0], gridY: SVs.grid[1] })
      }
    } else {
      if (board.grids.length > 0) {
        board.removeObject(board.grids[0]);
        board.grids = [];
      }
    }


    if (SVs.grid === "dense") {
      if (xaxis.current) {
        xaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
        xaxis.current.defaultTicks.setAttribute({ minorHeight: -1 });
      }
      if (yaxis.current) {
        yaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
        yaxis.current.defaultTicks.setAttribute({ minorHeight: -1 });
      }
    } else if (SVs.grid === "medium") {
      if (xaxis.current) {
        xaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
        xaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
      }
      if (yaxis.current) {
        yaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
        yaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
      }
    } else {
      if (xaxis.current) {
        xaxis.current.defaultTicks.setAttribute({ majorHeight: 20 });
        xaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
      }
      if (yaxis.current) {
        yaxis.current.defaultTicks.setAttribute({ majorHeight: 20 });
        yaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
      }
    }

    if (SVs.displayXAxis) {
      xaxis.current.name = SVs.xlabel;
      xaxis.current.defaultTicks.setAttribute({ drawLabels: SVs.displayXAxisTickLabels });
      if (xaxis.current.hasLabel) {
        let position = 'rt';
        let offset = [5, 10];
        let anchorx = 'right'
        if (SVs.xlabelPosition === "left") {
          position = 'lft';
          anchorx = 'left';
          offset = [-5, 10];
        }
        xaxis.current.label.visProp.position = position;
        xaxis.current.label.visProp.anchorx = anchorx;
        xaxis.current.label.visProp.offset = offset;
        xaxis.current.label.needsUpdate = true;
        xaxis.current.label.fullUpdate();
      }
    }

    if (SVs.displayYAxis) {
      yaxis.current.name = SVs.ylabel;
      yaxis.current.defaultTicks.setAttribute({ drawLabels: SVs.displayYAxisTickLabels });
      if (yaxis.current.hasLabel) {
        let position = 'rt';
        let offset = [-10, -5];
        let anchorx = 'right';
        if (SVs.ylabelPosition === "bottom") {
          position = 'lft';
          offset[1] = 5;
        }
        if (SVs.ylabelAlignment === "right") {
          anchorx = 'left';
          offset[0] = 10;
        }
        yaxis.current.label.visProp.position = position;
        yaxis.current.label.visProp.offset = offset;
        yaxis.current.label.visProp.anchorx = anchorx;
        yaxis.current.label.needsUpdate = true;
        yaxis.current.label.fullUpdate();
      }
    }
    let currentDimensions = {
      width: parseFloat(sizeToCSS(SVs.width)),
      aspectRatio: SVs.aspectRatio,
    }

    if ((currentDimensions.width !== previousDimensions.current.width ||
      currentDimensions.aspectRatio !== previousDimensions.current.aspectRatio)
      && Number.isFinite(currentDimensions.width) && Number.isFinite(currentDimensions.aspectRatio)
    ) {

      // resizingBoard.current = true;
      // board.resizeContainer(currentDimensions.width, currentDimensions.height);
      // resizingBoard.current = false;
      previousDimensions.current = currentDimensions;
    }

    let boundingbox = [SVs.xmin, SVs.ymax, SVs.xmax, SVs.ymin];

    if (boundingbox.some((v, i) => v !== previousBoundingbox.current[i])) {

      settingBoundingBox.current = true;
      board.setBoundingBox(boundingbox);
      settingBoundingBox.current = false;
      // seem to need to call this again to get the ticks correct
      board.fullUpdate();

      if (board.updateQuality === board.BOARD_QUALITY_LOW) {
        board.itemsRenderedLowQuality[name] = board;
      }

      previousBoundingbox.current = boundingbox;

    }


  }



  return (
    // <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
    <>
      <a name={name} />
      <div id={name} className="jxgbox" style={divStyle} />
      <BoardContext.Provider value={board}>
        {children}
      </BoardContext.Provider>
    </>
    //  </VisibilitySensor>
  );
})
