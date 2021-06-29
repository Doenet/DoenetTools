import React, {useState} from 'react';
import { useHistory } from 'react-router';

export default function Empty(props){
  console.log(">>>===Empty")
  // const [count,setCount] = useState(0)
  // let history = useHistory();
  return <div style={props.style}>

  {/* <div><button onClick={()=>{setCount((was)=>was+1)}}>count {count}</button></div>
  <hr></hr>
  <div><button onClick={()=>{history.push('/course?tool=author')}}>use history Author Tool</button></div>
  <div><button onClick={()=>{history.push('/course?tool=editor')}}>use history Editor Tool</button></div>
  <div><button onClick={()=>{location.href = '/new#/course?tool=author';}}>use location.href Author Tool</button></div>
  <div><button onClick={()=>{location.href = '/new#/course?tool=editor';}}>use location.href Editor Tool</button></div>
  <div><button onClick={()=>{window.history.pushState('','','/new#/course?tool=author');}}>window.history Author Tool</button></div>
  <div><button onClick={()=>{window.history.pushState('','','/new#/course?tool=editor');}}>window.history Editor Tool</button></div> */}
  </div>
}