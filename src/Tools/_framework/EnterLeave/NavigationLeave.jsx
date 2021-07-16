import React from 'react';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { useRecoilCallback } from 'recoil';

export default function NavigationLeave(){
  // console.log(">>>===NavigationLeave")
  const setSelections = useRecoilCallback(({set})=>()=>{
    set(selectedMenuPanelAtom,"");
    set(globalSelectedNodesAtom,[]);
  })
  setSelections()

  return null;
}