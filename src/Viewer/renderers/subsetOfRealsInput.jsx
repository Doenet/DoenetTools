import React, { useRef, useState } from 'react';
import styled from "styled-components";
import useDoenetRender from './useDoenetRenderer';
import ActionButton from '../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';


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
  let { name, SVs, actions, callAction } = useDoenetRender(props,false);
  let [mode,setMode] = useState("add remove points");
  let bounds = useRef(null);
  let pointGrabbed = useRef(null);

  if (SVs.hidden) {
    return null;
  }

  //Build control buttons
  // const activeButtonColor = "var(--lightBlue)";
  // const inactiveButtonColor = "var(--mainGray)";
  // let primaryColor = "red";


  // let addRemovePointsStyle = { backgroundColor: inactiveButtonColor };
  // if (mode === "add remove points") {
  //   addRemovePointsStyle = { backgroundColor: activeButtonColor };
  // }

  // let toggleStyle = { backgroundColor: inactiveButtonColor };
  // if (mode === "toggle") {
  //   toggleStyle = { backgroundColor: activeButtonColor };
  // }

  // let movePointsStyle = { backgroundColor: inactiveButtonColor };
  // if (mode === "move points") {
  //   movePointsStyle = { backgroundColor: activeButtonColor };
  // }

  let controlButtons = null;
  if(!SVs.fixed) {
    controlButtons =
      <ActionButtonGroup>
        <ActionButton
          // style={addRemovePointsStyle}
          onClick={() => setMode("add remove points")}
          value="Add/Remove points"
        >
        </ActionButton>
        <ActionButton
          // style={toggleStyle}
          onClick={() => setMode("toggle")}
          value="Toggle points and intervals"
        >
        </ActionButton>
        <ActionButton
          // style={movePointsStyle}
          onClick={() => setMode("move points")}
          value="Move Points"
        >
        </ActionButton>
        <ActionButton
          onClick={()=> callAction({
            action: actions.clear,
          })}
          value="Clear"
        >
        </ActionButton>
        <ActionButton
          onClick={()=> callAction({
            action: actions.setToR,
          })}
          value="R"
        >
        </ActionButton>
      </ActionButtonGroup>
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

  //Build points
  let storedPoints = [];

  for (let pt of SVs.points) {
    let closed = pt.inSubset;

    let xPosition = xValueToXPosition(pt.value);

    let currentFillColor = "var(--mainRed)";
    if (!closed) {
      currentFillColor = "white";
    }

    let key = `point-${xPosition}`;

    storedPoints.push(
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

  //Build lines
  let storedLines = [];
  for (let intervalObj of SVs.intervals) {
    if (intervalObj.right < intervalObj.left || !intervalObj.inSubset) { continue; } // Ignore imposible Intervals
    let lowerXPosition = xValueToXPosition(intervalObj.left);
    let higherXPosition = xValueToXPosition(intervalObj.right);
    const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
    const higherPointKey = `higherIntervalPoint${higherXPosition}`;
    const lineKey = `line${lowerXPosition}-${higherXPosition}`;

    let currentFillColor = "var(--mainRed)";

    let lowerLine = lowerXPosition;
    let higherLine = higherXPosition;

    if (lowerXPosition < 38) {
      lowerLine = 20;
      storedPoints.push(
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
      storedPoints.push(
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
    storedLines.push(
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

  function xValueToXPosition(xValue) {
    // let minValue = -10;
    // let maxValue = 10;
    //Shift to positive numbers
    //TODO: Calculate shiftAmount and intervalValueWidth
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let shiftedXValue = xValue + shiftAmount;


    let position = firstHashXPosition + (shiftedXValue / intervalValueWidth * xBetweenHashes);

    return position;
  }

  function xPositionToXValue(xPosition) {

    let relativeX = xPosition - firstHashXPosition;
    let shiftAmount = 10;
    let intervalValueWidth = 1;
    let value = relativeX / xBetweenHashes * intervalValueWidth;
    value = value - shiftAmount;

    return value;
  }

  async function handleInput(e, inputState) {

    let mouseLeft = e.clientX - bounds.current.offsetLeft
    let xPosition = xPositionToXValue(mouseLeft);
    let pointHitTolerance = 0.2;

    if (inputState === "up") {

      if (mode === "move points") {
        if (pointGrabbed.current !== null) {
 
        callAction({
          action: actions.movePoint,
          args: {
            pointInd: pointGrabbed.current,
            value: xPosition,
            transient: false
          }
        })
        pointGrabbed.current = null;

        }

      } 

        if (mode === "add remove points") {
          if (pointGrabbed.current !== null) {
            callAction({
              action: actions.deletePoint,
              args: pointGrabbed.current
            })
          } else if (!SVs.points.map(x => x.value).includes(xPosition)) {
            callAction({
              action: actions.addPoint,
              args: xPosition
            })
          }
        } else if (mode === "toggle") {
          if (pointGrabbed.current !== null) {
            callAction({
              action: actions.togglePoint,
              args: pointGrabbed.current
            })
          } else {
            let intervalInd = 0;
            for (let pt of SVs.points) {
              if (pt.value < xPosition) {
                intervalInd++;
              }
            }
            callAction({
              action: actions.toggleInterval,
              args: intervalInd
            })
          }
        }

    } else if (inputState === "down") {

        let pointInd = null;
        for (let [ind, pt] of SVs.points.entries()) {
          if (Math.abs(pt.value - xPosition) < pointHitTolerance) {
            pointInd = ind;
            break;
          }
        }

        if (pointInd !== null) {
          pointGrabbed.current = pointInd;
        }else{
          pointGrabbed.current = null;
        }
    } else if (inputState === "move") {
      if (mode === "move points" && pointGrabbed.current !== null) {
    
        callAction({
          action: actions.movePoint,
          args: {
            pointInd: pointGrabbed.current,
            value: xPosition,
            transient: true
          }
        })

      }
    } else if (inputState == "leave") {
      if (mode === "move points") {
        if (pointGrabbed.current !== null) {
          callAction({
            action: actions.movePoint,
            args: {
              pointInd: pointGrabbed.current,
              value: xPosition,
              transient: false
            }
          })

          pointGrabbed.current = null;
        }
      }
    }



  }

 return  (
  <>
    <a name={name} />
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
      {storedLines}
      {hashLines}
      <line
        x1="20"
        y1="40"
        x2="780"
        y2="40"
        style={{ stroke: "black", strokeWidth: "2" }}
      />
      {storedPoints}
      {labels}
    </svg>
  </>
  );

}
