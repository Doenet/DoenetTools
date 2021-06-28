import React from 'react';
import { useHistory } from 'react-router-dom'
import { useRecoilCallback } from 'recoil';
import { toolViewAtom } from '../NewToolRoot';
import Cookies from 'js-cookie'; // import Textinput from "../imports/Textinput";

export default function HomePage(props){
  console.log(">>>===HomePage")
  let history = useHistory();
  const goToSignIn = useRecoilCallback(({set})=>()=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was};
      newObj.currentMainPanel = "SignIn"
      return newObj;
    })
  })
  const jwt = Cookies.get();
  let isSignedIn = false;
  if (Object.keys(jwt).includes('JWT_JS')) {
    isSignedIn = true;
  }
console.log(">>>isSignedIn",isSignedIn)

  return <div style={props.style}>
    <h1>Home Page</h1>
  <p>put home page here</p>
  {/* {isSignedIn ?  */}
  <div><button onClick={()=>history.push('/course')}>Go To Course</button></div>
  {/* : */}
  <div><button onClick={goToSignIn}>Sign In</button></div> 
  {/* } */}
  
  </div>
}