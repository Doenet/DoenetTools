import React, { useRef } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil'
import { searchParamAtomFamily, toolViewAtom } from '../NewToolRoot';



export default function CourseToolHandler(props){
  // console.log(">>>===CourseToolHandler")
  let lastTool = useRef('');
  const setTool = useRecoilCallback(({set})=> (tool)=>{
      if (tool === 'editor'){
        set(toolViewAtom,(was)=>{
          let newObj = {...was}
          newObj.currentMainPanel = "DriveCards";
          return newObj;
        });

      }else{
        console.log(">>>didn't match!")
      }
  })
  const tool = useRecoilValue(searchParamAtomFamily('tool')) 
  if (tool !== lastTool.current){
    console.log(">>>CourseToolHandler tool>>>",tool)
    setTool(tool)
    lastTool.current = tool;
  }
  return null;

}