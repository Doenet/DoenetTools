import React, {useState} from 'react';
import useDoenetRenderer from './useDoenetRenderer';
import styled from 'styled-components';

// border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};

const Box = styled.svg`
border: '2px solid red';
margin: 2px;
outline: none;
`;

export default function orbitalDiagramInput(props){
  let {name, SVs, children} = useDoenetRenderer(props);
  // console.log("name",name)
  let [selectedRow,setSelectedRow] = useState(-1);
  let [selectedBox,setSelectedBox] = useState(-1);
  let [rows,setRows] = useState([{orbitalText:"",boxes:[]}])
  if (SVs.hidden) {
    return null;
  }

  function deselect(e){
    if (e.relatedTarget?.id !== `OrbitalText${selectedRow}` &&
    e.relatedTarget?.id !== `OrbitalRow${selectedRow}` &&
    e.relatedTarget?.id !== 'orbitaladdrow' &&
    e.relatedTarget?.id !== 'orbitalremoverow' &&
    e.relatedTarget?.id !== 'orbitaladdbox' &&
    e.relatedTarget?.id !== 'orbitaladduparrow' &&
    e.relatedTarget?.id !== 'orbitaladddownarrow' &&
    e.relatedTarget?.id !== 'orbitalremovearrow' &&
    e.relatedTarget?.id !== 'orbitalremovebox'
    ){
      setSelectedRow(-1);
      setSelectedBox(-1);
    }
  }

  let rowsJSX = [];
  for (let [index,row] of Object.entries(rows)){
    let rowNumber = rows.length - index - 1;
    rowsJSX.push(<OrbitalRow 
      key={`OrbitalRow${rowNumber}`}
      rowNumber={rowNumber} 
      selectedRow={selectedRow} 
      setSelectedRow={setSelectedRow} 
      orbitalText={row.orbitalText}
      boxes={row.boxes}
      setRows={setRows}
      selectedBox={selectedBox}
      setSelectedBox={setSelectedBox}
      deselect={deselect}
      />)
  }

  return <>
  <div>
    <button id={`orbitaladdrow`} 
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      let numberOfRows = rows.length;
      if (numberOfRows < 20){ //maximum number of rows
        if (selectedRow !== -1){
          let topRowIndex = rows.length;
          setSelectedRow(topRowIndex); //Select top row if a row was selected
        }
        setSelectedBox(-1);
        setRows((was)=>{
          return [{orbitalText:"",boxes:[]},...was]
        })
      }
      
    }}>Add Row</button>

    <button id={`orbitalremoverow`} onClick={()=>{
      if (rows.length > 1){ //Don't delete the last one
        let removeRowNumber = rows.length - 1 - selectedRow;
        if (removeRowNumber === -1){
          removeRowNumber = rows.length - 1;
        }
        setSelectedRow(-1);
        setSelectedBox(-1);
        setRows((was)=>{
          let newObj = [];
          for(let [index,obj] of Object.entries(was)){
            if (index != removeRowNumber){
              newObj.push(obj)
            }
          }
          return newObj;
        })
      }
      
    }}>Remove Row</button>

    <button id={`orbitaladdbox`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      let activeRowNumber = rows.length - selectedRow -1;
      if (selectedRow === -1){
        activeRowNumber = 0;
      }
      let numberOfBoxes = rows[activeRowNumber].boxes.length;
      if (numberOfBoxes < 20){ //maximum boxes in one row
        setRows((was)=>{
          let newObj = [...was];
          newObj[activeRowNumber] = {...was[activeRowNumber]}
          newObj[activeRowNumber]['boxes'] = [...was[activeRowNumber]['boxes'],""];
          return newObj;
        })
      }
    }}>Add Box</button>

    <button id={`orbitalremovebox`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      let activeRowNumber = rows.length - selectedRow -1;
      if (selectedRow === -1){
        activeRowNumber = 0;
      }
      
      setRows((was)=>{
        let newObj = [...was];
        newObj[activeRowNumber] = {...was[activeRowNumber]}
        newObj[activeRowNumber]['boxes'] = [...was[activeRowNumber]['boxes']];
        newObj[activeRowNumber]['boxes'].splice(selectedBox, 1); //-1 removes last box
        return newObj;
      })
      
      
    }}>Remove Box</button>

    <button id={`orbitaladduparrow`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      let activeRowNumber = rows.length - selectedRow -1;
      if (selectedRow === -1){
        activeRowNumber = 0;
      }
      let activeBox = selectedBox;
      if (activeBox === -1){
        activeBox = rows[activeRowNumber].boxes.length -1;
      }
      setRows((was)=>{
        if (activeBox === -1){
          //No box in the row to add an arrow to
          return was;
        }
        let newObj = [...was];
        newObj[activeRowNumber] = {...was[activeRowNumber]}
        newObj[activeRowNumber]['boxes'] = [...was[activeRowNumber]['boxes']];
        if (newObj[activeRowNumber]['boxes'].length == 0){
          return was;
        }
        if (newObj[activeRowNumber]['boxes'][activeBox].length < 3){
          newObj[activeRowNumber]['boxes'][activeBox] = newObj[activeRowNumber]['boxes'][activeBox] + 'U';
        }
        return newObj;
      })
    }}>Add Up Arrow</button>

    <button id={`orbitaladddownarrow`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      let activeRowNumber = rows.length - selectedRow -1;
      if (selectedRow === -1){
        activeRowNumber = 0;
      }
      let activeBox = selectedBox;
      if (activeBox === -1){
        activeBox = rows[activeRowNumber].boxes.length -1;
      }
      setRows((was)=>{
        if (activeBox === -1){
          //No box in the row to add an arrow to
          return was;
        }
        let newObj = [...was];
        newObj[activeRowNumber] = {...was[activeRowNumber]}
        newObj[activeRowNumber]['boxes'] = [...was[activeRowNumber]['boxes']];
        if (newObj[activeRowNumber]['boxes'].length == 0){
          return was;
        }
        if (newObj[activeRowNumber]['boxes'][activeBox].length < 3){
          newObj[activeRowNumber]['boxes'][activeBox] = newObj[activeRowNumber]['boxes'][activeBox] + 'D';
        }
        return newObj;
      })
    }}>Add Down Arrow</button>
    
    <button id={`orbitalremovearrow`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      let activeRowNumber = rows.length - selectedRow -1;
      if (selectedRow === -1){
        activeRowNumber = 0;
      }
      let activeBox = selectedBox;
      if (activeBox === -1){
        activeBox = rows[activeRowNumber].boxes.length -1;
      }
      setRows((was)=>{
        if (activeBox === -1){
          //No box in the row to remove arrow from
          return was;
        }
        let newObj = [...was];
        newObj[activeRowNumber] = {...was[activeRowNumber]}
        newObj[activeRowNumber]['boxes'] = [...was[activeRowNumber]['boxes']];
        if (newObj[activeRowNumber]['boxes'].length == 0){
          return was;
        }
        if (newObj[activeRowNumber]['boxes'][activeBox].length > 0){
          newObj[activeRowNumber]['boxes'][activeBox] = newObj[activeRowNumber]['boxes'][activeBox].slice(0, -1)
        }
        return newObj;
      })
    }}>Remove Arrow</button>
    </div>
  {rowsJSX}
  </>
}

function OrbitalRow({rowNumber,selectedRow,setSelectedRow,orbitalText,boxes,setRows,selectedBox,setSelectedBox,deselect}){
  let rowStyle = {width:"800px",height:"40px",display:"flex"};
  if (selectedRow === rowNumber){ 
    rowStyle['border'] = '#1A5A99 solid 2px';
    // rowStyle['backgroundColor'] = '#1A5A99';
  }

  //Make boxes
  let boxesJSX = [];
  for (let [index,code] of Object.entries(boxes)){
    let isSelected = false;
    if (selectedRow === rowNumber && selectedBox === index){
      isSelected = true;
    }
    boxesJSX.push(<OrbitalBox key={`OrbitalBox${rowNumber}-${index}`} boxNum={index} arrows={code} isSelected={isSelected} setSelectedBox={setSelectedBox}/>)
  }

  return <div 
  key={`OrbitalRow${rowNumber}`}
  id={`OrbitalRow${rowNumber}`}
  tabIndex="-1"
  onClick={()=>{
    if (selectedRow !== rowNumber){
      setSelectedRow(rowNumber)}
    }}
    onBlur={(e)=>{
      deselect(e);
    }}
   style={rowStyle}>
     <span style={{marginRight:"2px"}}>row {rowNumber + 1}</span>
     <OrbitalText orbitalText={orbitalText} setRows={setRows} rowNumber={rowNumber} selectedRow={selectedRow} setSelectedRow={setSelectedRow}/> 
     {boxesJSX}
     </div>
}

function OrbitalText({rowNumber,selectedRow,setSelectedRow,orbitalText,setRows}){
  return <input 
  id={`OrbitalText${rowNumber}`} 
  style={{marginRight:"4px"}} 
  type='text' 
  size='2' 
  value={orbitalText}
  onChange={(e)=>{
    let newValue = e.target.value;
    setRows((was)=>{
      let index = was.length - rowNumber - 1;
    let newObj = [...was];
      newObj[index] = {...was[index]}
      newObj[index]['orbitalText'] = newValue;
      return newObj;
    })
  }}
  />
}

function OrbitalBox({boxNum,arrows='',setSelectedBox,isSelected}){

  const firstUp = <polyline key={`orbitalboxfirstUp${boxNum}`} id={`firstUp${boxNum}`} points="6,14 12,6 18,14 12,6 12,35" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const firstDown = <polyline key={`orbitalboxfirstDown${boxNum}`} id={`firstDown${boxNum}`} points="6,26 12,34 18,26 12,34 12,5" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const secondUp = <polyline key={`orbitalboxsecondUp${boxNum}`} id={`secondUp${boxNum}`} points="22,14 28,6 34,14 28,6 28,35" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const secondDown = <polyline key={`orbitalboxsecondDown${boxNum}`} id={`secondDown${boxNum}`} points="22,26 28,34 34,26 28,34 28,5" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const thirdUp = <polyline key={`orbitalboxthirdUp${boxNum}`} id={`thirdUp${boxNum}`} points="38,14 44,6 50,14 44,6 44,35" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />
  const thirdDown = <polyline key={`orbitalboxthirdDown${boxNum}`} id={`thirdDown${boxNum}`} points="38,26 44,34 50,26 44,34 44,5" style={{fill:"none",stroke:"black",strokeWidth:"2"}} />

  let arrowsJSX = [];
  let [first,second,third] = arrows.split('');

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

  let boxColor = 'black';
  if (isSelected){
    boxColor = '#1A5A99';
  }

  return <Box 
  key={`orbitalbox${boxNum}`}
  tabIndex="-1" 
  onClick={()=>{
    setSelectedBox(boxNum);
  }}
  width={boxWidth} 
  height='40'
  >
    <rect x="0" y="0" rx="4" ry="4" width={boxWidth} height="40"
  style={{fill:"white",stroke:boxColor,strokeWidth:"2",fillOpacity:"1",strokeOpacity:"1"}} />
  {arrowsJSX}
  </Box>
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

