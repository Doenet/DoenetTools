import React, { useRef, useState } from 'react';
import DoenetRenderer from './DoenetRenderer';
import styled from "styled-components";
import useDoenetRender from './useDoenetRenderer';


const TextNoSelect = styled.text`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;
const ModeButton = styled.button`
  &:focus {
    outline: 0;
  }
  width: 120px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  margin-left: 1px;
  margin-top: 1px;
`;



export default function subsetOfReals(props) {
  let { name, SVs } = useDoenetRender(props,false);
  let bounds = useRef(null);
  let [mode,setMode] = useState("add remove points");


  if (SVs.hidden) {
    return null;
  }

  //Build control buttons
  const activeButtonColor = "lightblue";
  const inactiveButtonColor = "lightgrey";


  let addRemovePointsStyle = { backgroundColor: inactiveButtonColor };
  if (mode === "add remove points") {
    addRemovePointsStyle = { backgroundColor: activeButtonColor };
  }

  let toggleStyle = { backgroundColor: inactiveButtonColor };
  if (mode === "toggle") {
    toggleStyle = { backgroundColor: activeButtonColor };
  }

  let movePointsStyle = { backgroundColor: inactiveButtonColor };
  if (mode === "move points") {
    movePointsStyle = { backgroundColor: activeButtonColor };
  }

  let controlButtons = null;
  if(!SVs.fixed) {
    controlButtons = <>
      <span>
        <ModeButton
          style={addRemovePointsStyle}
          onClick={() => setMode("add remove points")}
        >
          Add/Remove points
        </ModeButton>
      </span>
      <span>
        <ModeButton
          style={toggleStyle}
          onClick={() => setMode("toggle")}
        >
          Toggle points and intervals
        </ModeButton>
      </span>
      <span>
        <ModeButton
          style={movePointsStyle}
          onClick={() => setMode("move points")}
        >
          Move Points
        </ModeButton>
      </span>
      <span>
        <button
          // onClick={() => actions.clear()}
        >
          Clear
        </button>
      </span>
      <span>
        <button
          // onClick={() => actions.setToR()}
        >
          R
        </button>
      </span>
    </>
  }

  //Build axis
  let firstHashXPosition = 40;
  let xBetweenHashes = 36;
  let hashLines = [];
  let numbers = [];

  for (let number = -10; number <= 10; number++) {
    numbers.push(number);
  }

  let labels = [];

  for (let x = firstHashXPosition; x < 780; x = x + xBetweenHashes) {
    hashLines.push(
      <line
        key={"hash" + x}
        x1={x}
        y1="35"
        x2={x}
        y2="45"
        style={{ stroke: "black", strokeWidth: "1" }}
        shapeRendering="geometricPrecision"
      />
    );
    let number = numbers.shift();

    labels.push(
      <TextNoSelect key={"label" + x} x={x} y="66" textAnchor="middle">
        {number}
      </TextNoSelect>
    );
  }


  async function handleInput(e, inputState) {

    console.log("handleInput",e, inputState)

    // let mouseLeft = e.clientX - this.bounds.current.offsetLeft
    // let xPosition = this.xPositionToXValue(mouseLeft);

    // if (inputState === "up") {

    //   if (this.state.mode === "move points") {
    //     if (this.pointGrabbed !== undefined) {
    //       await this.actions.movePoint({
    //         pointInd: this.pointGrabbed,
    //         value: xPosition,
    //         transient: false
    //       });
    //       this.pointGrabbed = undefined;
    //       this.forceUpdate();
    //     }

    //   } else {

    //     let pointInd = -1;
    //     for (let [ind, pt] of this.doenetSvData.points.entries()) {
    //       if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
    //         pointInd = ind;
    //         break;
    //       }
    //     }

    //     if (this.state.mode === "add remove points") {
    //       if (pointInd !== -1) {
    //         await this.actions.deletePoint(pointInd);
    //         this.forceUpdate();
    //       } else if (!this.doenetSvData.points.map(x => x.value).includes(xPosition)) {
    //         await this.actions.addPoint(xPosition);
    //         this.forceUpdate();
    //       }
    //     } else if (this.state.mode === "toggle") {
    //       if (pointInd !== -1) {
    //         await this.actions.togglePoint(pointInd);
    //       } else {
    //         let intervalInd = 0;
    //         for (let pt of this.doenetSvData.points) {
    //           if (pt.value < xPosition) {
    //             intervalInd++;
    //           }
    //         }

    //         await this.actions.toggleInterval(intervalInd);
    //       }
    //       this.forceUpdate();
    //     }
    //   }

    // } else if (inputState === "down") {
    //   if (this.state.mode === "move points") {

    //     let pointInd = -1;
    //     for (let [ind, pt] of this.doenetSvData.points.entries()) {
    //       if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
    //         pointInd = ind;
    //         break;
    //       }
    //     }

    //     if (pointInd !== -1) {
    //       this.pointGrabbed = pointInd;
    //     }
    //   }
    // } else if (inputState === "move") {
    //   if (this.pointGrabbed !== undefined) {

    //     await this.actions.movePoint({
    //       pointInd: this.pointGrabbed,
    //       value: xPosition,
    //       transient: true
    //     });

    //     this.forceUpdate();
    //   }
    // } else if (inputState == "leave") {
    //   if (this.state.mode === "move points") {
    //     if (this.pointGrabbed !== undefined) {
    //       await this.actions.movePoint({
    //         pointInd: this.pointGrabbed,
    //         value: xPosition,
    //         transient: false
    //       });
    //       this.pointGrabbed = undefined;
    //       this.forceUpdate();
    //     }
    //   }
    // }



  }

 return  (
  <>
    <div ref={bounds}>
      {controlButtons}
    </div>
    <svg
      width="808"
      height="80"
      style={{ backgroundColor: "white" }}
      onMouseDown={e => {
        handleInput(e, "down");
      }}
      onMouseUp={e => {
        handleInput(e, "up");
      }}
      onMouseMove={e => {
        handleInput(e, "move");
      }}
      onMouseLeave={e => {
        handleInput(e, "leave");
      }}
    >
      <polygon
        points="5,40 20,50 20,30"
        style={{ fill: "black", stroke: "black", strokeWidth: "1" }}
      />
      <polygon
        points="795,40 780,50 780,30"
        style={{ fill: "black", stroke: "black", strokeWidth: "1" }}
      />
      {/* {this.storedLines} */}
      {hashLines}
      <line
        x1="20"
        y1="40"
        x2="780"
        y2="40"
        style={{ stroke: "black", strokeWidth: "2" }}
      />
      {/* {this.storedPoints} */}
      {labels}
    </svg>
  </>
);

}

export class subsetOfReals2 extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.bounds = React.createRef();

    this.buildLine = this.buildLine.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.buildPoints = this.buildPoints.bind(this);
    this.buildIntervals = this.buildIntervals.bind(this);

    this.state = {
      mode: "toggle or drag points",
      activePointObj: null,
      activeIntervalObj: null,
      pointsAndIntervalsObj: []
    }

    this.primaryColor = "red";
    this.storedPoints = [];
    this.storedLines = [];
    this.firstHashXPosition = 40;
    this.xBetweenHashes = 36;

    this.pointHitTolerance = 0.2;


  }


  xValueToXPosition(xValue) {
    // let minValue = -10;
    // let maxValue = 10;
    //Shift to positive numbers
    //TODO: Calculate shiftAmount and intervalValueWidth
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let shiftedXValue = xValue + shiftAmount;


    let position = this.firstHashXPosition + (shiftedXValue / intervalValueWidth * this.xBetweenHashes);

    return position;
  }

  xPositionToXValue(xPosition) {

    let relativeX = xPosition - this.firstHashXPosition;
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let value = relativeX / this.xBetweenHashes * intervalValueWidth;
    value = value - shiftAmount;

    return value;
  }

  buildPoints() {

    this.storedPoints = [];

    for (let pt of this.doenetSvData.points) {
      let closed = pt.inSubset;

      let xPosition = this.xValueToXPosition(pt.value);

      let currentFillColor = this.primaryColor;
      if (!closed) {
        currentFillColor = "white";
      }

      let key = `point-${xPosition}`;

      this.storedPoints.push(
        <circle
          key={key}
          cx={xPosition}
          cy="40"
          r="6"
          stroke="black"
          strokeWidth="1"
          fill={currentFillColor}
        />
      );

    }


  }

  buildIntervals() {

    this.storedLines = [];

    for (let intervalObj of this.doenetSvData.intervals) {
      if (intervalObj.right < intervalObj.left || !intervalObj.inSubset) { continue; } // Ignore imposible Intervals
      let lowerXPosition = this.xValueToXPosition(intervalObj.left);
      let higherXPosition = this.xValueToXPosition(intervalObj.right);
      const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
      const higherPointKey = `higherIntervalPoint${higherXPosition}`;
      const lineKey = `line${lowerXPosition}-${higherXPosition}`;

      let currentFillColor = this.primaryColor;

      let lowerLine = lowerXPosition;
      let higherLine = higherXPosition;

      if (lowerXPosition < 38) {
        lowerLine = 20;
        this.storedPoints.push(
          <polygon
            key={lowerPointKey}
            points="5,40 20,46 20,34"
            style={{
              fill: currentFillColor,
              stroke: currentFillColor,
              strokeWidth: "1"
            }}
          />
        );
      }

      if (higherXPosition > 778) {
        higherLine = 782;
        this.storedPoints.push(
          <polygon
            key={higherPointKey}
            points="795,40 780,46 780,34"
            style={{
              fill: currentFillColor,
              stroke: currentFillColor,
              strokeWidth: "1"
            }}
          />
        );
      }
      this.storedLines.push(
        <line
          key={lineKey}
          x1={lowerLine}
          y1="40"
          x2={higherLine}
          y2="40"
          style={{ stroke: currentFillColor, strokeWidth: "8" }}
        />
      );



    }
  }

  async handleInput(e, inputState) {

    let mouseLeft = e.clientX - this.bounds.current.offsetLeft
    let xPosition = this.xPositionToXValue(mouseLeft);

    if (inputState === "up") {

      if (this.state.mode === "move points") {
        if (this.pointGrabbed !== undefined) {
          await this.actions.movePoint({
            pointInd: this.pointGrabbed,
            value: xPosition,
            transient: false
          });
          this.pointGrabbed = undefined;
          this.forceUpdate();
        }

      } else {

        let pointInd = -1;
        for (let [ind, pt] of this.doenetSvData.points.entries()) {
          if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
            pointInd = ind;
            break;
          }
        }

        if (this.state.mode === "add remove points") {
          if (pointInd !== -1) {
            await this.actions.deletePoint(pointInd);
            this.forceUpdate();
          } else if (!this.doenetSvData.points.map(x => x.value).includes(xPosition)) {
            await this.actions.addPoint(xPosition);
            this.forceUpdate();
          }
        } else if (this.state.mode === "toggle") {
          if (pointInd !== -1) {
            await this.actions.togglePoint(pointInd);
          } else {
            let intervalInd = 0;
            for (let pt of this.doenetSvData.points) {
              if (pt.value < xPosition) {
                intervalInd++;
              }
            }

            await this.actions.toggleInterval(intervalInd);
          }
          this.forceUpdate();
        }
      }

    } else if (inputState === "down") {
      if (this.state.mode === "move points") {

        let pointInd = -1;
        for (let [ind, pt] of this.doenetSvData.points.entries()) {
          if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
            pointInd = ind;
            break;
          }
        }

        if (pointInd !== -1) {
          this.pointGrabbed = pointInd;
        }
      }
    } else if (inputState === "move") {
      if (this.pointGrabbed !== undefined) {

        await this.actions.movePoint({
          pointInd: this.pointGrabbed,
          value: xPosition,
          transient: true
        });

        this.forceUpdate();
      }
    } else if (inputState == "leave") {
      if (this.state.mode === "move points") {
        if (this.pointGrabbed !== undefined) {
          await this.actions.movePoint({
            pointInd: this.pointGrabbed,
            value: xPosition,
            transient: false
          });
          this.pointGrabbed = undefined;
          this.forceUpdate();
        }
      }
    }



  }

  switchMode(mode) {
    // console.log(mode)
    this.setState({ mode: mode });
  }


  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    this.buildLine();
    this.buildPoints();
    this.buildIntervals();

    const activeButtonColor = "lightblue";
    const inactiveButtonColor = "lightgrey";


    let addRemovePointsStyle = { backgroundColor: inactiveButtonColor };
    if (this.state.mode === "add remove points") {
      addRemovePointsStyle = { backgroundColor: activeButtonColor };
    }

    let toggleStyle = { backgroundColor: inactiveButtonColor };
    if (this.state.mode === "toggle") {
      toggleStyle = { backgroundColor: activeButtonColor };
    }

    let movePointsStyle = { backgroundColor: inactiveButtonColor };
    if (this.state.mode === "move points") {
      movePointsStyle = { backgroundColor: activeButtonColor };
    }

    let controlButtons = null;
    if(!this.doenetSvData.fixed) {
      controlButtons = <>
        <span>
          <ModeButton
            style={addRemovePointsStyle}
            onClick={() => this.switchMode("add remove points")}
          >
            Add/Remove points
          </ModeButton>
        </span>
        <span>
          <ModeButton
            style={toggleStyle}
            onClick={() => this.switchMode("toggle")}
          >
            Toggle points and intervals
          </ModeButton>
        </span>
        <span>
          <ModeButton
            style={movePointsStyle}
            onClick={() => this.switchMode("move points")}
          >
            Move Points
          </ModeButton>
        </span>
        <span>
          <button
            onClick={() => this.actions.clear()}
          >
            Clear
          </button>
        </span>
        <span>
          <button
            onClick={() => this.actions.setToR()}
          >
            R
          </button>
        </span>
      </>
    }

    // return (
    //   <>
    //     <div ref={this.bounds}>
    //       {controlButtons}
    //     </div>
    //     <svg
    //       width="808"
    //       height="80"
    //       style={{ backgroundColor: "white" }}
    //       onMouseDown={e => {
    //         this.handleInput(e, "down");
    //       }}
    //       onMouseUp={e => {
    //         this.handleInput(e, "up");
    //       }}
    //       onMouseMove={e => {
    //         this.handleInput(e, "move");
    //       }}
    //       onMouseLeave={e => {
    //         this.handleInput(e, "leave");
    //       }}
    //     >
    //       <polygon
    //         points="5,40 20,50 20,30"
    //         style={{ fill: "black", stroke: "black", strokeWidth: "1" }}
    //       />
    //       <polygon
    //         points="795,40 780,50 780,30"
    //         style={{ fill: "black", stroke: "black", strokeWidth: "1" }}
    //       />
    //       {/* {intervalSegments} */}
    //       {/* {activeLine} */}
    //       {this.storedLines}
    //       {this.hashLines}
    //       <line
    //         x1="20"
    //         y1="40"
    //         x2="780"
    //         y2="40"
    //         style={{ stroke: "black", strokeWidth: "2" }}
    //       />
    //       {this.storedPoints}
    //       {/* {activePoints} */}
    //       {this.labels}
    //     </svg>
    //   </>
    // );



  }
}
