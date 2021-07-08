import  { useRef } from 'react';
import { atom, useRecoilValue, useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil'
import { searchParamAtomFamily, toolViewAtom, paramObjAtom } from '../NewToolRoot';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';

export const drivecardSelectedNodesAtom = atom({
  key:'drivecardSelectedNodesAtom',
  default:[]
})

export default function CourseToolHandler(){
  console.log(">>>===CourseToolHandler")
  
  let lastAtomTool = useRef("");

  const setTool = useRecoilCallback(({set})=> (tool,lastAtomTool)=>{
    //Set starting tool
    // if (tool === ""){
    //   tool = 'courseChooser';
    //   window.history.replaceState('','','/new#/course?tool=courseChooser')
    // }
    // if (tool === lastAtomTool){ return; }

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
        set(mainPanelClickAtom,[{atom:globalSelectedNodesAtom,value:[]},{atom:selectedMenuPanelAtom,value:""}])
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
        console.log(">>>Course Tool Handler: didn't match!")
      }
  })
  const atomTool = useRecoilValue(searchParamAtomFamily('tool')) 
  const setParamObj = useSetRecoilState(paramObjAtom);
  // console.log(`>>>atomTool >${atomTool}< lastAtomTool.current >${lastAtomTool.current}<`)


  //Update panels when tool changes
  if (atomTool !== lastAtomTool.current){
    setTool(atomTool,lastAtomTool.current)
    lastAtomTool.current = atomTool;
  }else if (atomTool === '' && lastAtomTool.current === ''){
    setParamObj({tool:'courseChooser'})
  }
  return null;

}