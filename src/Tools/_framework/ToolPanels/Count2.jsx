import React, { useState } from 'react';
import {
  useRecoilCallback,
} from 'recoil';
import { toolViewAtom } from '../NewToolRoot';

export default function Count2(){
  const [count,setCount] = useState(1);
  const mainPanelToOne = useRecoilCallback(({set})=> ()=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was};
      newObj.mainPanel = "Count";
      return newObj;
    })
  })
 

  return <>
  <h1>Count2 {count}</h1>
  <button onClick={()=>setCount((was)=>{return was + 1})}>+</button>
  <div><button onClick={mainPanelToOne}>Switch to Count</button></div>
  </>
}