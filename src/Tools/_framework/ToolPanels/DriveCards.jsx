import React, {useState} from 'react';
// import { useHistory } from 'react-router';
import Button from '../temp/Button'
import { useRecoilCallback } from 'recoil';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler'

export default function DriveCards(props){
  console.log(">>>===DriveCards")
  const setSelectedCourse = useRecoilCallback(({set})=>(driveIds)=>{
    console.log(">>>driveId",driveIds);
    set(drivecardSelectedNodesAtom,driveIds)
    set(selectedMenuPanelAtom,"SelectedCourse");
  },[])
  const clearSelectedCourse = useRecoilCallback(({set})=>()=>{
    // console.log(">>>driveId",driveId);
    set(drivecardSelectedNodesAtom,[])
    set(selectedMenuPanelAtom,"");
  },[])
  // const [count,setCount] = useState(0)
  // let history = useHistory();
  return <div style={props.style}><h1>Drive Cards</h1>
  <p>put Drive Cards here</p>
  {/* <Button value="Test Selection"/> */}
  <button onClick={()=>setSelectedCourse(['A Id','B Id'])}>Test A & BSelection</button>
  <button onClick={()=>setSelectedCourse(['A Id'])}>Test A Selection</button>
  <button onClick={()=>clearSelectedCourse()}>Clear Selection</button>
  {/* <Button onClick={()=>console.log(">>>test")} value="Test Selection"/> */}


  </div>
}