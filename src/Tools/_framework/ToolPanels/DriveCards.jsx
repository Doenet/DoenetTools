import React, { useEffect } from 'react';
// import { useHistory } from 'react-router';
import Button from '../temp/Button'
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler'
import { toolViewAtom } from '../NewToolRoot';

export default function DriveCards(props){
  console.log(">>>===DriveCards")
  const setSelectedCourse = useRecoilCallback(({set})=>(driveIds)=>{
    console.log(">>>driveId",driveIds);
    set(drivecardSelectedNodesAtom,driveIds)
    set(selectedMenuPanelAtom,"SelectedCourse");
  },[])
  // const clearSelectedCourse = useRecoilCallback(({set})=>()=>{
  //   console.log(">>>clearSelectedCourse");
  //   set(drivecardSelectedNodesAtom,[])
  //   set(selectedMenuPanelAtom,"");
  // },[])

  const tempChangeMenus = useRecoilCallback(({set})=>(newMenus,menusTitles,initOpen)=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was};
      newObj.currentMenus = newMenus;
      newObj.menusTitles = menusTitles;
      newObj.menusInitOpen = initOpen;
      return newObj
    })
  })


  // const [count,setCount] = useState(0)
  // let history = useHistory();
  return <div style={props.style}><h1>Drive Cards</h1>
  <p>put Drive Cards here</p>
  <hr />

  <h2>Selection Experiment</h2>
  <button onClick={(e)=>{e.stopPropagation();setSelectedCourse(['A Id','B Id'])}}>Test A & BSelection</button>
  <button onClick={(e)=>{e.stopPropagation();setSelectedCourse(['A Id'])}}>Test A Selection</button>
  {/* <button onClick={(e)=>{e.stopPropagation();clearSelectedCourse()}}>Clear Selection</button> */}
  <hr />
  <h2>Menu Experiment</h2>
  <div><button onClick={(e)=>{e.stopPropagation();tempChangeMenus(["CreateCourse","CourseEnroll"],["Create Course","Enroll"],[true,false])}}>Create and Enroll</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();tempChangeMenus(["CourseEnroll"],["Enroll"],[false])}}>Just Enroll</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();tempChangeMenus([],[],[])}}>No Menus</button></div>


  </div>
}