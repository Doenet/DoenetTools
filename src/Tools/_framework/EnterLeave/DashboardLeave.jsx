// import React from 'react';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { useRecoilCallback } from 'recoil';

export default function DashboardLeave() {
  // console.log('>>>>DashbaordLeave');
  const setSelections = useRecoilCallback(({set})=>()=>{
    set(selectedMenuPanelAtom,"");
    set(globalSelectedNodesAtom,[]);
  })
  setSelections()
  return null;
}
