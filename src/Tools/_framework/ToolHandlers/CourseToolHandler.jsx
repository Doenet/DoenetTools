import React, { useRef } from 'react';
import { atom, useRecoilValue, useRecoilCallback } from 'recoil'
import { searchParamAtomFamily, toolViewAtom } from '../NewToolRoot';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';

export const drivecardSelectedNodesAtom = atom({
  key:'drivecardSelectedNodesAtom',
  default:[]
})

export default function CourseToolHandler(props){
  console.log(">>>===CourseToolHandler")
  let lastTool = useRef(null);
  const setTool = useRecoilCallback(({set})=> (tool,lastTool)=>{
    // console.log(`>>>setTool >${tool}< >${lastTool}<`)
    //Set starting tool
    if (tool === ""){
      tool = 'courseChooser';
      // window.history.pushState('','','/new#/course?tool=courseChooser')
      window.history.replaceState('','','/new#/course?tool=courseChooser')
    }
    if (tool === lastTool){ return; }

      if (tool === 'courseChooser'){
        set(toolViewAtom,(was)=>{
          let newObj = {...was}
          newObj.currentMainPanel = "DriveCards";
          newObj.currentMenus = ["CreateCourse","CourseEnroll"];
          newObj.menusTitles = ["Create Course","Enroll"];
          newObj.menusInitOpen = [true,false];
          return newObj;
        });
        set(mainPanelClickAtom,[{atom:drivecardSelectedNodesAtom,value:[]},{atom:selectedMenuPanelAtom,value:""}])
      }else if (tool === 'file'){
        console.log(">>>file!")
        // set(toolViewAtom,(was)=>{
        //   let newObj = {...was}
        //   newObj.currentMainPanel = "DriveCards";
        //   return newObj;
        // });
        set(mainPanelClickAtom,[])

      }else if (tool === 'editor'){
        console.log(">>>editor!")
        // set(toolViewAtom,(was)=>{
        //   let newObj = {...was}
        //   newObj.currentMainPanel = "DriveCards";
        //   return newObj;
        // });
        set(mainPanelClickAtom,[])
      }else{
        console.log(">>>didn't match!")
      }
  })
  const tool = useRecoilValue(searchParamAtomFamily('tool')) 


  if (tool !== lastTool.current){
    console.log(">>>CourseToolHandler tool>>>",tool)
    setTool(tool,lastTool.current)
    lastTool.current = tool;
  }
  return null;

}