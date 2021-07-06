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
  
  let lastAtomTool = useRef(null);
  // let lastParamTool = useRef(null);
  const setTool = useRecoilCallback(({set})=> (tool,lastAtomTool)=>{
    //Set starting tool
    if (tool === ""){
      tool = 'courseChooser';
      window.history.replaceState('','','/new#/course?tool=courseChooser')
    }
    if (tool === lastAtomTool){ return; }

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
      }else if (tool === 'navigation'){
        // if (role === "Student"){
          //TODO
        // }else if (role === "Owner" || role === "Admin"){
            set(toolViewAtom,(was)=>{
              let newObj = {...was}
              newObj.currentMainPanel = "Drive";
              newObj.currentMenus = ["AddDriveItems","EnrollStudents"];
              newObj.menusTitles = ["Add Items","Enrollment"];
              newObj.menusInitOpen = [true,false];

              return newObj;
            });
        // }
       
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
  const atomTool = useRecoilValue(searchParamAtomFamily('tool')) 
  // const searchParamObj = Object.fromEntries(new URLSearchParams(location.search))
  // const paramTool = searchParamObj['tool']
  // if (atomTool !== paramTool){
    // console.log(`>>> atomTool >${atomTool}< lastAtomTool.current >${lastAtomTool.current}<`)
    // console.log(`>>> paramTool >${paramTool}< lastParamTool.current >${lastParamTool.current}<`)
  // }
  // lastParamTool.current = paramTool;

  if (atomTool !== lastAtomTool.current){
    setTool(atomTool,lastAtomTool.current)
    lastAtomTool.current = atomTool;
  }
  return null;

}