import React, { useState } from 'react';
import {
  useRecoilCallback,
} from 'recoil';
import { toolViewAtom } from '../NewToolRoot';

export default function TestControl(props){
  const [count,setCount] = useState(1);
  const mainPanel = useRecoilCallback(({set})=> (panelName)=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was};
      newObj.mainPanel = panelName;
      return newObj;
    })
  })

  
  return <div style={props.style}>
  <h1>State Count {count}</h1>
  <button onClick={()=>setCount((was)=>{return was + 1})}>+</button>
  <div><button onClick={()=>mainPanel("One")}>Switch to One</button></div>
  <div><button onClick={()=>mainPanel("Two")}>Switch to Two</button></div>
  <div><button onClick={()=>mainPanel("Count")}>Switch to Count</button></div>
  <div><button onClick={()=>mainPanel("Count2")}>Switch to Count2</button></div>
  </div>
}