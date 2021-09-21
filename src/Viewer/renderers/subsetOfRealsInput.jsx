import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import styled from "styled-components";



{/* 
 <intervalinput width="4px" height="100px">
  <xmin>-10</xmin>
  <xmax>10</xmax>
  <interval>(-6,2]</interval>
  <interval>[3,8)</interval>
  <point>6</point>
</intervalinput>
*/}

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

export default class subsetOfReals extends DoenetRenderer {
  constructor(props) {
    super(props);

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
    this.removeColor = "grey";
    this.storedPoints = [];
    this.storedLines = [];
    this.firstHashXPosition = 40;
    this.xBetweenHashes = 36;

    this.pointHitTolerance = 0.2;

    // console.log(this.doenetSvData);
    // console.log(this.doenetSvData.numericalPoints);
    // console.log(this.doenetSvData.numericalIntervals);
    //Infinity and -Infinity start and end

  }

  buildLine() {
    this.hashLines = [];
    let numbers = [];

    for (let number = -10; number <= 10; number++) {
      numbers.push(number);
    }
    this.labels = [];

    for (let x = this.firstHashXPosition; x < 780; x = x + this.xBetweenHashes) {
      this.hashLines.push(
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

      this.labels.push(
        <TextNoSelect key={"label" + x} x={x} y="66" textAnchor="middle">
          {number}
        </TextNoSelect>
      );
    }
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
    // TODO: why do we have to subtract 30?
    let relativeX = xPosition - this.firstHashXPosition - 30;
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
      let remove = false;

      let xPosition = this.xValueToXPosition(pt.value);

      let currentFillColor = this.primaryColor;
      if (!closed) {
        currentFillColor = "white";
      }
      if (remove) {
        currentFillColor = this.removeColor;
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

  handleInput(e, inputState) {

    let xPosition = this.xPositionToXValue(e.clientX);

    if (inputState === "up") {

      let pointInd = -1;
      for (let [ind, pt] of this.doenetSvData.points.entries()) {
        if (Math.abs(pt.value - xPosition) < this.pointHitTolerance) {
          pointInd = ind;
          break;
        }
      }

      if (this.state.mode === "add remove points") {
        if (pointInd !== -1) {
          this.actions.deletePoint(pointInd);
          this.forceUpdate();
        } else if (!this.doenetSvData.points.map(x => x.value).includes(xPosition)) {
          this.actions.addPoint(xPosition);
          this.forceUpdate();
        }
      } else if (this.state.mode === "toggle") {
        if (pointInd !== -1) {
          this.actions.togglePoint(pointInd);
        } else {
          let intervalInd = 0;
          for (let pt of this.doenetSvData.points) {
            if (pt.value < xPosition) {
              intervalInd++;
            }
          }

          this.actions.toggleInterval(intervalInd);
        }
        this.forceUpdate();
      }

    }

    if (inputState === "down") {
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
          this.pointGrabbedLocation = xPosition;
        }
      }
    }

    if (inputState === "move") {
      if(this.pointsGrabbed !== undefined) {

        // cannot rely
        let pointInd = -1;
        for (let [ind, pt] of this.doenetSvData.points.entries()) {
          if (Math.abs(pt.value - this.pointGrabbedLocation) < this.pointHitTolerance) {
            pointInd = ind;
            break;
          }
        }


      }
    }



  }

  switchMode(mode) {
    console.log(mode)
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

    // let addIntervalStyle = { backgroundColor: inactiveButtonColor };
    // if (this.state.mode === "add interval" || this.state.mode === "add 2nd intervalPoint") {
    //   addIntervalStyle = { backgroundColor: activeButtonColor };
    // }

    // let removeIntervalStyle = { backgroundColor: inactiveButtonColor };
    // if (this.state.mode === "remove interval") {
    //   removeIntervalStyle = { backgroundColor: activeButtonColor };
    // }

    // let addPointStyle = { backgroundColor: inactiveButtonColor };
    // if (this.state.mode === "add point") {
    //   addPointStyle = { backgroundColor: activeButtonColor };
    // }

    // let removePointStyle = { backgroundColor: inactiveButtonColor };
    // if (this.state.mode === "remove point") {
    //   removePointStyle = { backgroundColor: activeButtonColor };
    // }

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


    return (
      <>
        <div>
          {/* <span>
            <ModeButton
              style={addPointStyle}
              onClick={() => this.switchMode("add point")}
            >
              Add Point
            </ModeButton>
          </span>
          <span>
            <ModeButton
              style={removePointStyle}
              onClick={() => this.switchMode("remove point")}
            >
              Remove Point
            </ModeButton>
          </span> */}
          <span>
            <ModeButton
              style={addRemovePointsStyle}
              onClick={() => this.switchMode("add remove points")}
            >
              Add/Remove boundary points
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
              Move Points -- doesn't work
            </ModeButton>
          </span>
          {/* <span>
            <ModeButton
              style={addIntervalStyle}
              onClick={() => this.switchMode("add interval")}
            >
              Add Interval
            </ModeButton>
          </span>
          <span>
            <ModeButton
              style={removeIntervalStyle}
              onClick={() => this.switchMode("remove interval")}
            >
              Remove Interval
            </ModeButton>
          </span> */}
          {/* <span>
            <ModeButton
              style={{ backgroundColor: inactiveButtonColor }}
              onClick={() => console.log("simplify")}
            >
              Simplify
            </ModeButton>
          </span> */}
        </div>
        <svg
          width="808"
          height="80"
          style={{ backgroundColor: "white" }}
          onMouseDown={e => {
            this.handleInput(e, "down");
          }}
          onMouseUp={e => {
            this.handleInput(e, "up");
          }}
          onMouseMove={e => {
            this.handleInput(e, "move");
          }}
          onMouseLeave={e => {
            this.handleInput(e, "leave");
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
          {/* {intervalSegments} */}
          {/* {activeLine} */}
          {this.storedLines}
          {this.hashLines}
          <line
            x1="20"
            y1="40"
            x2="780"
            y2="40"
            style={{ stroke: "black", strokeWidth: "2" }}
          />
          {this.storedPoints}
          {/* {activePoints} */}
          {this.labels}
        </svg>
      </>
    );



  }
}

// this.handleKeyPress = this.handleKeyPress.bind(this);
    // this.handleKeyDown = this.handleKeyDown.bind(this);
    // this.handleBlur = this.handleBlur.bind(this);
    // this.handleFocus = this.handleFocus.bind(this);
    // this.onChangeHandler = this.onChangeHandler.bind(this);

    // this.currentValue = this.doenetSvData.value;
    // this.valueToRevertTo = this.doenetSvData.value;


// const inputKey = this.componentName + '_input';

    // let surroundingBorderColor = "#efefef";
    // if (this.focused) {
    //   surroundingBorderColor = "#82a5ff";
    // }


    // if (this.doenetSvData.value !== this.currentValue) {
    //   this.currentValue = this.doenetSvData.value;
    //   this.valueToRevertTo = this.doenetSvData.value;
    // }

    // return <React.Fragment>
    //   <a name={this.componentName} />
    //   {this.doenetSvData.numericalPoints.map((x)=>{
    //     return <p key={x}>{x}</p>
    //   })}
    //   {/* <span className="textInputSurroundingBox" id={this.componentName}>
    //     <input
    //       key={inputKey}
    //       id={inputKey}
    //       value={this.currentValue}
    //       disabled={this.doenetSvData.disabled}
    //       onChange={this.onChangeHandler}
    //       onKeyPress={this.handleKeyPress}
    //       onKeyDown={this.handleKeyDown}
    //       onBlur={this.handleBlur}
    //       onFocus={this.handleFocus}
    //       style={{
    //         width: `${this.doenetSvData.size * 10}px`,
    //         height: "22px",
    //         fontSize: "14px",
    //         borderWidth: "1px",
    //         borderColor: surroundingBorderColor,
    //         padding: "4px",
    //       }}
    //     />
    //   </span> */}

    // </React.Fragment>


  // handleKeyPress(e) {
  //   if (e.key === "Enter") {
  //     this.valueToRevertTo = this.doenetSvData.value;
  //     if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
  //       this.actions.submitAnswer();
  //     }
  //     this.forceUpdate();
  //   }
  // }

  // handleKeyDown(e) {
  //   if (e.key === "Escape") {
  //     this.actions.updateText({
  //       text: this.valueToRevertTo
  //     });
  //     this.forceUpdate();
  //   }
  // }

  // handleFocus(e) {
  //   this.focused = true;
  //   this.forceUpdate();
  // }

  // handleBlur(e) {
  //   this.focused = false;
  //   this.valueToRevertTo = this.doenetSvData.value;

  //   this.forceUpdate();
  // }

  // onChangeHandler(e) {
  //   this.currentValue = e.target.value;
  //   this.actions.updateText({
  //     text: e.target.value
  //   });
  //   this.forceUpdate();
  // }