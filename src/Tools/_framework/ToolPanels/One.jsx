import React from 'react';
import {
  useRecoilCallback,
} from 'recoil';
import { toolViewAtom } from '../NewToolRoot';

export default function One(){
  const mainPanelToCount2 = useRecoilCallback(({set})=> ()=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was};
      newObj.mainPanel = "Count2";
      return newObj;
    })
  })
  return <><h1>One</h1>
  <div><button onClick={mainPanelToCount2}>Switch to Count2</button></div>

  </>
}