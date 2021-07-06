import  { useRef } from 'react';
import { atom, useRecoilValue, useRecoilCallback } from 'recoil'
import { searchParamAtomFamily, toolViewAtom } from '../NewToolRoot';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';

export const drivecardSelectedNodesAtom = atom({
  key:'drivecardSelectedNodesAtom',
  default:[]
})

export default function CourseToolHandler(){
  console.log(">>>===CourseToolHandler")
  
  let lastAtomTool = useRef(null);

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
        set(selectedMenuPanelAtom,""); //clear selection
        set(mainPanelClickAtom,[{atom:drivecardSelectedNodesAtom,value:[]},{atom:selectedMenuPanelAtom,value:""}])
      }else if (tool === 'navigation'){
        // if (role === "Student"){
          //TODO
        // }else if (role === "Owner" || role === "Admin"){
            set(toolViewAtom,(was)=>{
              let newObj = {...was}
              newObj.currentMainPanel = "DrivePanel";
              newObj.currentMenus = ["AddDriveItems","EnrollStudents"];
              newObj.menusTitles = ["Add Items","Enrollment"];
              newObj.menusInitOpen = [true,false];

              return newObj;
            });
        // }
        set(selectedMenuPanelAtom,""); //clear selection
        set(mainPanelClickAtom,[])  //clear main panel click

      }else if (tool === 'editor'){
        console.log(">>>editor!")
        // set(toolViewAtom,(was)=>{
        //   let newObj = {...was}
        //   newObj.currentMainPanel = "DriveCards";
        //   return newObj;
        // });
        set(selectedMenuPanelAtom,""); //clear selection
        set(mainPanelClickAtom,[])  //clear main panel click
      }else{
        console.log(">>>didn't match!")
      }
  })
  const atomTool = useRecoilValue(searchParamAtomFamily('tool')) 
  

  //Update panels when tool changes
  if (atomTool !== lastAtomTool.current){
    setTool(atomTool,lastAtomTool.current)
    lastAtomTool.current = atomTool;
  }
  return null;

}