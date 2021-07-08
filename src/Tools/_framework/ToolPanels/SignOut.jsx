import React from 'react';
// import { useHistory } from 'react-router-dom'
// import { useRecoilCallback } from 'recoil';
// import { toolViewAtom } from '../NewToolRoot';

export default function SignOut(props){
  // console.log(">>>===SignOut")
  // let history = useHistory();
  // const goToSignIn = useRecoilCallback(({set})=>()=>{
  //   set(toolViewAtom,(was)=>{
  //     let newObj = {...was};
  //     newObj.currentMainPanel = "SignIn";
  //     return newObj;
  //   })
  // })

  return <div style={props.style}>
    <h1>Sign Out</h1>
  <p>put Sign Out here</p>
  {/* <div><button onClick={goToSignIn}>Sign In</button></div> 
  <div><button onClick={()=>history.push('/course')}>Go To Course</button></div> */}
  </div>
}