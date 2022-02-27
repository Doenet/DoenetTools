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
  let {name, SVs, actions, callAction} = useDoenetRenderer(props);
  console.log("orbitalDiagramInput SVs ",SVs);

  orbitalDiagramInput.ignoreActionsWithoutCore = true;

  // let [selectedRow,setSelectedRow] = useState(-1); //-1 indicates nothing is selected
  // let [selectedBox,setSelectedBox] = useState(-1); //-1 indicates nothing is selected
  // let [rows,setRows] = useState([{orbitalText:"",boxes:[]}])

  if (SVs.hidden) {
    return null;
  }

  function setSelectedRow(index){
    callAction({
      action: actions.selectRow,
      args:index
    });
  }

  function setSelectedBox(index){
    callAction({
      action: actions.selectBox,
      args:index
    });
  }

  function deselect(e){
    if (e.relatedTarget?.id !== `orbitaladdrow${name}` &&
    e.relatedTarget?.id !== `orbitalremoverow${name}` &&
    e.relatedTarget?.id !== `orbitaladdbox${name}` &&
    e.relatedTarget?.id !== `orbitaladduparrow${name}` &&
    e.relatedTarget?.id !== `orbitaladddownarrow${name}` &&
    e.relatedTarget?.id !== `orbitalremovearrow${name}` &&
    e.relatedTarget?.id !== `orbitalremovebox${name}`){
      if (e.relatedTarget?.id !== `OrbitalText${SVs.selectedRowIndex}${name}` &&
      e.relatedTarget?.id !== `OrbitalRow${SVs.selectedRowIndex}${name}` &&
      e.relatedTarget?.id.substring(0,(10+name.length)) !== `orbitalbox${name}` 
      ){
        setSelectedRow(-1);
      }
      setSelectedBox(-1);
    }
    
  }

  let rowsJSX = [];
  for (let [index,row] of Object.entries(SVs.rows)){
    let rowNumber = SVs.rows.length - index - 1;
    rowsJSX.push(<OrbitalRow 
      key={`OrbitalRow${rowNumber}`}
      rowNumber={rowNumber} 
      selectedRow={SVs.selectedRowIndex} 
      setSelectedRow={setSelectedRow} 
      orbitalText={row.orbitalText}
      boxes={row.boxes}
      setRows={()=>{}} //Call Actions
      selectedBox={SVs.selectedBoxIndex}
      setSelectedBox={setSelectedBox}
      deselect={deselect}
      name={name}
      />)
  }

  return <>
  <div>
    <button id={`orbitaladdrow${name}`} 
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      callAction({
        action: actions.addRow,
      });
    }}>Add Row</button>

    <button id={`orbitalremoverow${name}`} onClick={()=>{
      callAction({
        action: actions.removeRow,
      });
    }}>Remove Row</button>

    <button id={`orbitaladdbox${name}`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      callAction({
        action: actions.addBox,
      });
    }}>Add Box</button>

    <button id={`orbitalremovebox${name}`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      callAction({
        action: actions.removeBox,
      });
    }}>Remove Box</button>

    <button id={`orbitaladduparrow${name}`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      callAction({
        action: actions.addUpArrow,
      });
    }}>Add Up Arrow</button>

    <button id={`orbitaladddownarrow${name}`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      callAction({
        action: actions.addDownArrow,
      });
    }}>Add Down Arrow</button>
    
    <button id={`orbitalremovearrow${name}`}
    onBlur={(e)=>{
      deselect(e);
    }}
    onClick={()=>{
      callAction({
        action: actions.removeArrow,
      });
    }}>Remove Arrow</button>
    </div>
  {rowsJSX}
  </>
}

function OrbitalRow({rowNumber,selectedRow,setSelectedRow,orbitalText,boxes,setRows,selectedBox,setSelectedBox,deselect,name}){
  let rowStyle = {
    width:"800px",
    height:"44px",
    display:"flex",
    backgroundColor:"#E2E2E2",
    marginTop:"2px",
    marginBottom:"2px",
    padding:"2px",
    border:"white solid 2px",
  };
  if (selectedRow === rowNumber){ 
    rowStyle['border'] = '#1A5A99 solid 2px';
    // rowStyle['backgroundColor'] = '#1A5A99';
  }

  //Make boxes
  let boxesJSX = [];
  for (let [index,code] of Object.entries(boxes)){
    let isSelected = false;
    // console.log("selectedBox === index",selectedBox,index,selectedBox === index,selectedBox == index)
    if (selectedRow == rowNumber && selectedBox == index){
      isSelected = true;
    }
    boxesJSX.push(<OrbitalBox key={`OrbitalBox${rowNumber}-${index}`} boxNum={index} rowNumber={rowNumber} arrows={code} isSelected={isSelected} setSelectedBox={setSelectedBox} name={name}/>)
  }

  return <div 
  key={`OrbitalRow${rowNumber}`}
  id={`OrbitalRow${rowNumber}${name}`}
  tabIndex="-1"
  onClick={()=>{
    if (selectedRow !== rowNumber){
      setSelectedRow(rowNumber)}
    }}
    onBlur={(e)=>{
      deselect(e);
    }}
   style={rowStyle}>
     {/* <span style={{marginRight:"2px"}}>row {rowNumber + 1}</span> */}
     <OrbitalText orbitalText={orbitalText} setRows={setRows} rowNumber={rowNumber} selectedRow={selectedRow} setSelectedRow={setSelectedRow} name={name}/> 
     {boxesJSX}
     </div>
}

function OrbitalText({rowNumber,selectedRow,setSelectedRow,orbitalText,setRows,name}){
  return <input 
  id={`OrbitalText${rowNumber}${name}`} 
  style={{marginRight:"4px",height:'14px'}} 
  type='text' 
  size='4' 
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

function OrbitalBox({boxNum,arrows='',setSelectedBox,isSelected,rowNumber,name}){

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
  let strokeWidth = '2px';
  if (isSelected){
    boxColor = '#1A5A99';
    strokeWidth = '6px';
  }

  return <Box 
  key={`orbitalbox${boxNum}`}
  id={`orbitalbox${name}${rowNumber}-${boxNum}`}
  tabIndex="-1" 
  onClick={()=>{
    setSelectedBox(boxNum);
  }}
  width={boxWidth} 
  height='40'
  >
    <rect x="0" y="0" rx="4" ry="4" width={boxWidth} height="40"
  style={{fill:"white",stroke:boxColor,strokeWidth:strokeWidth,fillOpacity:"1",strokeOpacity:"1"}} />
  {arrowsJSX}
  </Box>
}
