import React, { useState } from 'react';

export default function Count(props){
  const [count,setCount] = useState(1);

  
  return <div style={props.style}>
  <h1>Count {count}</h1>
  <button onClick={()=>setCount((was)=>{return was + 1})}>+</button>

  </div>
}