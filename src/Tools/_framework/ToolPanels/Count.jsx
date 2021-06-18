import React, { useState } from 'react';



export default function Count(){
  const [count,setCount] = useState(1);
  return <>
  <h1>Count {count}</h1>
  <button onClick={()=>setCount((was)=>{return was + 1})}>+</button>
  </>
}