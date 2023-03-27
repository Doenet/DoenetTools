import React, { createRef, useEffect, useState } from 'react';
import useDoenetRenderer from '../useDoenetRenderer';
import styled from 'styled-components';
import VisibilitySensor from 'react-visibility-sensor-v2';

// border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};

const Box = styled.svg`
border: '2px solid red';
margin: 2px;
outline: none;
`;

export default React.memo(function orbitalDiagram(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRenderer(props);
  // console.log("orbitalDiagramInput SVs ", SVs);

  // use ref for fixed so changed value appears in callbacks
  let fixed = createRef(SVs.fixed);
  fixed.current = SVs.fixed;

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

  if (SVs.hidden || !SVs.value) {
    return null;
  }

  let rows = [...SVs.value].reverse();

  let rowsJSX = [];
  for (let [index, row] of Object.entries(rows)) {
    let rowNumber = rows.length - index - 1;
    rowsJSX.push(<OrbitalRow
      key={`OrbitalRow${rowNumber}`}
      rowNumber={rowNumber}
      orbitalText={row.orbitalText}
      boxes={row.boxes}
      name={id}
    />)
  }


  return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><>
    {rowsJSX}
    </></VisibilitySensor>
})

const OrbitalRow = React.memo(function OrbitalRow({ rowNumber,orbitalText, boxes, name }) {
  let rowStyle = {
    width: "800px",
    height: "44px",
    display: "flex",
    backgroundColor: "#E2E2E2",
    marginTop: "2px",
    marginBottom: "2px",
    padding: "2px",
    border: "white solid 2px",
  };


  //Make boxes
  let boxesJSX = [];
  for (let [index, code] of Object.entries(boxes)) {
    boxesJSX.push(<OrbitalBox key={`OrbitalBox${rowNumber}-${index}`} boxNum={index} rowNumber={rowNumber} arrows={code} name={name} />)
  }

  return <div
    key={`OrbitalRow${rowNumber}`}
    id={`OrbitalRow${rowNumber}${name}`}
    tabIndex="-1"
    style={rowStyle}>
    {/* <span style={{marginRight:"2px"}}>row {rowNumber + 1}</span> */}
    <OrbitalText orbitalText={orbitalText} rowNumber={rowNumber} name={name} />
    {boxesJSX}
  </div>
})

const OrbitalText = React.memo(function OrbitalText({ rowNumber, orbitalText, name }) {
  return <div
    id={`OrbitalText${rowNumber}${name}`}
    style={{ marginRight: "4px", height: '14px', width: '40px', backgroundColor: "white" }}
    type='text'
    size='4'
    >
      {orbitalText}
    </div>
})

const OrbitalBox = React.memo(function OrbitalBox({ boxNum, arrows = '', rowNumber, name }) {

  const firstUp = <polyline key={`orbitalboxfirstUp${boxNum}`} id={`firstUp${boxNum}`} points="6,14 12,6 18,14 12,6 12,35" style={{ fill: "none", stroke: "black", strokeWidth: "2" }} />
  const firstDown = <polyline key={`orbitalboxfirstDown${boxNum}`} id={`firstDown${boxNum}`} points="6,26 12,34 18,26 12,34 12,5" style={{ fill: "none", stroke: "black", strokeWidth: "2" }} />
  const secondUp = <polyline key={`orbitalboxsecondUp${boxNum}`} id={`secondUp${boxNum}`} points="22,14 28,6 34,14 28,6 28,35" style={{ fill: "none", stroke: "black", strokeWidth: "2" }} />
  const secondDown = <polyline key={`orbitalboxsecondDown${boxNum}`} id={`secondDown${boxNum}`} points="22,26 28,34 34,26 28,34 28,5" style={{ fill: "none", stroke: "black", strokeWidth: "2" }} />
  const thirdUp = <polyline key={`orbitalboxthirdUp${boxNum}`} id={`thirdUp${boxNum}`} points="38,14 44,6 50,14 44,6 44,35" style={{ fill: "none", stroke: "black", strokeWidth: "2" }} />
  const thirdDown = <polyline key={`orbitalboxthirdDown${boxNum}`} id={`thirdDown${boxNum}`} points="38,26 44,34 50,26 44,34 44,5" style={{ fill: "none", stroke: "black", strokeWidth: "2" }} />

  let arrowsJSX = [];
  let [first, second, third] = arrows.split('');

  if (first == 'U') {
    arrowsJSX.push(firstUp);
  }
  if (first == 'D') {
    arrowsJSX.push(firstDown);
  }
  if (second == 'U') {
    arrowsJSX.push(secondUp);
  }
  if (second == 'D') {
    arrowsJSX.push(secondDown);
  }
  if (third == 'U') {
    arrowsJSX.push(thirdUp);
  }
  if (third == 'D') {
    arrowsJSX.push(thirdDown);
  }

  let boxWidth = 40;
  if (third) {
    boxWidth = 56;
  }

  let boxColor = 'black';
  let strokeWidth = '2px';

  return <Box
    key={`orbitalbox${boxNum}`}
    id={`orbitalbox${name}${rowNumber}-${boxNum}`}
    tabIndex="-1"
    width={boxWidth}
    height='40'
  >
    <rect x="0" y="0" rx="4" ry="4" width={boxWidth} height="40"
      style={{ fill: "white", stroke: boxColor, strokeWidth: strokeWidth, fillOpacity: "1", strokeOpacity: "1" }} />
    {arrowsJSX}
  </Box>
})
