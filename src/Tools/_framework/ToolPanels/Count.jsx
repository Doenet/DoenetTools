import React, { useState } from 'react';
import {
  useRecoilCallback,
} from 'recoil';
import { toolViewAtom } from '../NewToolRoot';

export default function Count(props){
  const [count,setCount] = useState(1);
  const mainPanelToOne = useRecoilCallback(({set})=> ()=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was};
      newObj.mainPanel = "One";
      return newObj;
    })
  })

  
  return <div style={props.style}>
  <h1>Count {count}</h1>
  <button onClick={()=>setCount((was)=>{return was + 1})}>+</button>
  <div><button onClick={mainPanelToOne}>Switch to One</button></div>
  </div>
}