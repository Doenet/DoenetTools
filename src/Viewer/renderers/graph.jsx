import React, { useEffect, useState, useRef, createContext } from 'react';
import { sizeToCSS } from './utils/css';
import useDoenetRender from './useDoenetRenderer';


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
  const resizingBoard = useRef(false);
  const boardJustInitialized = useRef(false);

  //Draw Board after mounting component
  useEffect(() => {
    let boundingbox = [SVs.xmin, SVs.ymax, SVs.xmax, SVs.ymin];
    previousBoundingbox.current = boundingbox;

    JXG.Options.layer.numlayers = 100;

    let board = window.JXG.JSXGraph.initBoard(name,
      {
        boundingbox,
        axis: false,
        showCopyright: false,
        showNavigation: SVs.showNavigation && !SVs.fixAxes,
        keepAspectRatio: SVs.identicalAxisScales,
        zoom: { wheel: !SVs.fixAxes },
        pan: { enabled: !SVs.fixAxes }
      });

    board.itemsRenderedLowQuality = {};

    board.on('boundingbox', () => {
      if (!(settingBoundingBox.current || resizingBoard.current)) {
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
      height: parseFloat(sizeToCSS(SVs.height)),
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
          anchorx
        };
      }
      xaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [-5, -15]
        },
        minorTicks: 4,
        precision: 4,
        drawLabels: SVs.displayXAxisTickLabels
      }

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
          anchorx
        }
      }
      yaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
          offset: [12, -2]
        },
        minorTicks: 4,
        precision: 4,
        drawLabels: SVs.displayYAxisTickLabels
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
    }

    boardJustInitialized.current = true;

    // on unmount
    return () => {
      board.off('boundingbox');
    }

  }, [])



  const divStyle = {
    width: sizeToCSS(SVs.width),
    height: sizeToCSS(SVs.height),
  }

  if (SVs.hidden) {
    divStyle.display = "none";
  }
  divStyle.border = "2px solid black";
  divStyle.margin = "12px";
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
      height: parseFloat(sizeToCSS(SVs.height)),
    }

    if ((currentDimensions.width !== previousDimensions.current.width ||
      currentDimensions.height !== previousDimensions.current.height)
      && Number.isFinite(currentDimensions.width) && Number.isFinite(currentDimensions.height)
    ) {

      resizingBoard.current = true;
      board.resizeContainer(currentDimensions.width, currentDimensions.height);
      resizingBoard.current = false;
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



  return <>
    <a name={name} />
    <div id={name} className="jxgbox" style={divStyle} />
    <BoardContext.Provider value={board}>
      {children}
    </BoardContext.Provider>
  </>;
})
