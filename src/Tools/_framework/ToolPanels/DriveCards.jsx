import React from 'react';
import { useHistory } from 'react-router';

export default function DriveCards(props){
  console.log(">>>===DriveCards")
  let history = useHistory();
  return <div style={props.style}><h1>Drive Cards</h1>
  <p>put Drive Cards here</p>
  {/* <div><button onClick={()=>{history.push('/course?view=author')}}>use history Author View</button></div>
  <div><button onClick={()=>{history.push('/course?view=editor')}}>use history Editor View</button></div>
  <div><button onClick={()=>{location.href = '/new#/course?view=author';}}>use location.href Author View</button></div>
  <div><button onClick={()=>{location.href = '/new#/course?view=editor';}}>use location.href Editor View</button></div> */}
  </div>
}