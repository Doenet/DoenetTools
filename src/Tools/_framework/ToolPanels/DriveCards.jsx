import React, {useState} from 'react';
// import { useHistory } from 'react-router';
import Button from '../temp/Button'

export default function DriveCards(props){
  console.log(">>>===DriveCards")
  // const [count,setCount] = useState(0)
  // let history = useHistory();
  return <div style={props.style}><h1>Drive Cards</h1>
  <p>put Drive Cards here</p>
  {/* <Button value="Test Selection"/> */}
  <button onClick={()=>console.log(">>>test")}>Test Selection</button>
  {/* <Button onClick={()=>console.log(">>>test")} value="Test Selection"/> */}


  </div>
}