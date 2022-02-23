import React from 'react';
import useDoenetRenderer from './useDoenetRenderer';

export default function orbitalDiagramInput(props){
  let {name, SVs, children} = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return <OrbitalRow />
}

function OrbitalSpin(props){
  return <input type='text' size='2' />
}

function OrbitalRow(props){
  return <div style={{display:"flex"}}><OrbitalSpin /><OrbitalBox boxNum='1' arrows='UUU' /><OrbitalBox boxNum='2' arrows='DDD' /><OrbitalBox boxNum='3' arrows='UD' /></div>
}

function OrbitalBox({boxNum,arrows=''}){

  const firstUp = <polyline id={`firstUp${boxNum}`} points="6,14 12,6 18,14 12,6 12,35" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const firstDown = <polyline id={`firstDown${boxNum}`} points="6,26 12,34 18,26 12,34 12,5" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const secondUp = <polyline id={`secondUp${boxNum}`} points="22,14 28,6 34,14 28,6 28,35" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const secondDown = <polyline id={`secondDown${boxNum}`} points="22,26 28,34 34,26 28,34 28,5" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const thirdUp = <polyline id={`thirdUp${boxNum}`} points="38,14 44,6 50,14 44,6 44,35" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const thirdDown = <polyline id={`thirdDown${boxNum}`} points="38,26 44,34 50,26 44,34 44,5" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />

  let arrowsJSX = [];
  let [first,second,third] = arrows.split('');
  console.log(first,second,third)
  if (first == 'U'){
    arrowsJSX.push(firstUp);
  }
  if (first == 'D'){
    arrowsJSX.push(firstDown);
  }
  if (second == 'U'){
    arrowsJSX.push(secondUp);
  }
  if (second == 'D'){
    arrowsJSX.push(secondDown);
  }
  if (third == 'U'){
    arrowsJSX.push(thirdUp);
  }
  if (third == 'D'){
    arrowsJSX.push(thirdDown);
  }

  let boxWidth = 40;
  if (third){
    boxWidth = 56;
  }

  return <svg style={{margin:'2px'}} width={boxWidth} height='40'>
    <rect x="0" y="0" rx="4" ry="4" width={boxWidth} height="40"
  style={{fill:"white",stroke:"black",strokeWidth:"2",fillOpacity:"1",strokeOpacity:"1"}} />
  {arrowsJSX}
  </svg>
}


// import React, { useRef, useState } from 'react';
// import styled from "styled-components";
// import useDoenetRender from './useDoenetRenderer';


// const TextNoSelect = styled.text`
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
//   -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
// `;
// const ModeButton = styled.button`
//   &:focus {
//     outline: 0;
//   }
//   width: 120px;
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
//   -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
//   margin-left: 1px;
//   margin-top: 1px;
// `;



// export default function orbitalDiagramInput(props) {
//   let { name, SVs, actions, callAction } = useDoenetRender(props,false);
//   console.log("ODI renderer!!!!")
//   // let [mode,setMode] = useState("add remove points");
//   // let bounds = useRef(null);
//   // let pointGrabbed = useRef(null);

//   if (SVs.hidden) {
//     return null;
//   }

//   return <p>orbitalDiagramInput</p>;
// }
//   //Build control buttons
//   const activeButtonColor = "lightblue";
//   const inactiveButtonColor = "lightgrey";
//   let primaryColor = "red";


//   let addRemovePointsStyle = { backgroundColor: inactiveButtonColor };
//   if (mode === "add remove points") {
//     addRemovePointsStyle = { backgroundColor: activeButtonColor };
//   }

//   let toggleStyle = { backgroundColor: inactiveButtonColor };
//   if (mode === "toggle") {
//     toggleStyle = { backgroundColor: activeButtonColor };
//   }

//   let movePointsStyle = { backgroundColor: inactiveButtonColor };
//   if (mode === "move points") {
//     movePointsStyle = { backgroundColor: activeButtonColor };
//   }

//   let controlButtons = null;
//   if(!SVs.fixed) {
//     controlButtons = <>
//       <span>
//         <ModeButton
//           style={addRemovePointsStyle}
//           onClick={() => setMode("add remove points")}
//         >
//           Add/Remove points
//         </ModeButton>
//       </span>
//       <span>
//         <ModeButton
//           style={toggleStyle}
//           onClick={() => setMode("toggle")}
//         >
//           Toggle points and intervals
//         </ModeButton>
//       </span>
//       <span>
//         <ModeButton
//           style={movePointsStyle}
//           onClick={() => setMode("move points")}
//         >
//           Move Points
//         </ModeButton>
//       </span>
//       <span>
//         <button
//           onClick={()=> callAction({
//             action: actions.clear,
//           })}
//         >
//           Clear
//         </button>
//       </span>
//       <span>
//         <button
//           onClick={()=> callAction({
//             action: actions.setToR,
//           })}
//         >
//           R
//         </button>
//       </span>
//     </>
//   }

//   //Build axis
//   let firstHashXPosition = 40;
//   let xBetweenHashes = 36;
//   let hashLines = [];
//   let numbers = [];

//   for (let number = -10; number <= 10; number++) {
//     numbers.push(number);
//   }

//   let labels = [];

//   for (let x = firstHashXPosition; x < 780; x = x + xBetweenHashes) {
//     hashLines.push(
//       <line
//         key={"hash" + x}
//         x1={x}
//         y1="35"
//         x2={x}
//         y2="45"
//         style={{ stroke: "black", strokeWidth: "1" }}
//         shapeRendering="geometricPrecision"
//       />
//     );
//     let number = numbers.shift();

//     labels.push(
//       <TextNoSelect key={"label" + x} x={x} y="66" textAnchor="middle">
//         {number}
//       </TextNoSelect>
//     );
//   }

//   //Build points
//   let storedPoints = [];

//   for (let pt of SVs.points) {
//     let closed = pt.inSubset;

//     let xPosition = xValueToXPosition(pt.value);

//     let currentFillColor = primaryColor;
//     if (!closed) {
//       currentFillColor = "white";
//     }

//     let key = `point-${xPosition}`;

//     storedPoints.push(
//       <circle
//         key={key}
//         cx={xPosition}
//         cy="40"
//         r="6"
//         stroke="black"
//         strokeWidth="1"
//         fill={currentFillColor}
//       />
//     );

//   }

//   //Build lines
//   let storedLines = [];
//   for (let intervalObj of SVs.intervals) {
//     if (intervalObj.right < intervalObj.left || !intervalObj.inSubset) { continue; } // Ignore imposible Intervals
//     let lowerXPosition = xValueToXPosition(intervalObj.left);
//     let higherXPosition = xValueToXPosition(intervalObj.right);
//     const lowerPointKey = `lowerIntervalPoint${lowerXPosition}`;
//     const higherPointKey = `higherIntervalPoint${higherXPosition}`;
//     const lineKey = `line${lowerXPosition}-${higherXPosition}`;

//     let currentFillColor = primaryColor;

//     let lowerLine = lowerXPosition;
//     let higherLine = higherXPosition;

//     if (lowerXPosition < 38) {
//       lowerLine = 20;
//       storedPoints.push(
//         <polygon
//           key={lowerPointKey}
//           points="5,40 20,46 20,34"
//           style={{
//             fill: currentFillColor,
//             stroke: currentFillColor,
//             strokeWidth: "1"
//           }}
//         />
//       );
//     }

//     if (higherXPosition > 778) {
//       higherLine = 782;
//       storedPoints.push(
//         <polygon
//           key={higherPointKey}
//           points="795,40 780,46 780,34"
//           style={{
//             fill: currentFillColor,
//             stroke: currentFillColor,
//             strokeWidth: "1"
//           }}
//         />
//       );
//     }
//     storedLines.push(
//       <line
//         key={lineKey}
//         x1={lowerLine}
//         y1="40"
//         x2={higherLine}
//         y2="40"
//         style={{ stroke: currentFillColor, strokeWidth: "8" }}
//       />
//     );
//   }

//   function xValueToXPosition(xValue) {
//     // let minValue = -10;
//     // let maxValue = 10;
//     //Shift to positive numbers
//     //TODO: Calculate shiftAmount and intervalValueWidth
//     let shiftAmount = 10;
//     let intervalValueWidth = 1;
//     let shiftedXValue = xValue + shiftAmount;


//     let position = firstHashXPosition + (shiftedXValue / intervalValueWidth * xBetweenHashes);

//     return position;
//   }

//   function xPositionToXValue(xPosition) {

//     let relativeX = xPosition - firstHashXPosition;
//     let shiftAmount = 10;
//     let intervalValueWidth = 1;
//     let value = relativeX / xBetweenHashes * intervalValueWidth;
//     value = value - shiftAmount;

//     return value;
//   }

//   async function handleInput(e, inputState) {

//     let mouseLeft = e.clientX - bounds.current.offsetLeft
//     let xPosition = xPositionToXValue(mouseLeft);
//     let pointHitTolerance = 0.2;

//     if (inputState === "up") {

//       if (mode === "move points") {
//         if (pointGrabbed.current !== null) {
 
//         callAction({
//           action: actions.movePoint,
//           args: {
//             pointInd: pointGrabbed.current,
//             value: xPosition,
//             transient: false
//           }
//         })
//         pointGrabbed.current = null;

//         }

//       } 

//         if (mode === "add remove points") {
//           if (pointGrabbed.current !== null) {
//             callAction({
//               action: actions.deletePoint,
//               args: pointGrabbed.current
//             })
//           } else if (!SVs.points.map(x => x.value).includes(xPosition)) {
//             callAction({
//               action: actions.addPoint,
//               args: xPosition
//             })
//           }
//         } else if (mode === "toggle") {
//           if (pointGrabbed.current !== null) {
//             callAction({
//               action: actions.togglePoint,
//               args: pointGrabbed.current
//             })
//           } else {
//             let intervalInd = 0;
//             for (let pt of SVs.points) {
//               if (pt.value < xPosition) {
//                 intervalInd++;
//               }
//             }
//             callAction({
//               action: actions.toggleInterval,
//               args: intervalInd
//             })
//           }
//         }

//     } else if (inputState === "down") {

//         let pointInd = null;
//         for (let [ind, pt] of SVs.points.entries()) {
//           if (Math.abs(pt.value - xPosition) < pointHitTolerance) {
//             pointInd = ind;
//             break;
//           }
//         }

//         if (pointInd !== null) {
//           pointGrabbed.current = pointInd;
//         }else{
//           pointGrabbed.current = null;
//         }
//     } else if (inputState === "move") {
//       if (mode === "move points" && pointGrabbed.current !== null) {
    
//         callAction({
//           action: actions.movePoint,
//           args: {
//             pointInd: pointGrabbed.current,
//             value: xPosition,
//             transient: true
//           }
//         })

//       }
//     } else if (inputState == "leave") {
//       if (mode === "move points") {
//         if (pointGrabbed.current !== null) {
//           callAction({
//             action: actions.movePoint,
//             args: {
//               pointInd: pointGrabbed.current,
//               value: xPosition,
//               transient: false
//             }
//           })

//           pointGrabbed.current = null;
//         }
//       }
//     }



//   }

//  return  (
//   <>
//     <a name={name} />
//     <div ref={bounds}>
//       {controlButtons}
//     </div>
//     <svg
//       width="808"
//       height="80"
//       style={{ backgroundColor: "white" }}
//       onMouseDown={e => {
//         handleInput(e, "down");
//       }}
//       onMouseUp={e => {
//         handleInput(e, "up");
//       }}
//       onMouseMove={e => {
//         handleInput(e, "move");
//       }}
//       onMouseLeave={e => {
//         handleInput(e, "leave");
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
//       {storedLines}
//       {hashLines}
//       <line
//         x1="20"
//         y1="40"
//         x2="780"
//         y2="40"
//         style={{ stroke: "black", strokeWidth: "2" }}
//       />
//       {storedPoints}
//       {labels}
//     </svg>
//   </>
//   );

// }
