// import React from 'react';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';
import { useRecoilCallback } from 'recoil';

export default function CourseChooserLeave(){
  console.log(">>>===CourseChooserLeave")
  const setSelections = useRecoilCallback(({set})=>()=>{
    set(selectedMenuPanelAtom,"");
    set(globalSelectedNodesAtom,[]);
    set(drivecardSelectedNodesAtom,[]);
  })
  setSelections()

  return null;
}