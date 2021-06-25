import React from 'react';
// import { useHistory } from 'react-router-dom'
// import { useRecoilCallback } from 'recoil';
// import { toolViewAtom } from '../NewToolRoot';

export default function SignIn(props){
  console.log(">>>===SignIn")
  // let history = useHistory();
  // const goToSignIn = useRecoilCallback(({set})=>()=>{
  //   set(toolViewAtom,(was)=>{
  //     let newObj = {...was};
  //     newObj.currentMainPanel = "SignIn";
  //     return newObj;
  //   })
  // })

  return <div style={props.style}>
    <h1>Sign In</h1>
  <p>put Sign In here</p>
  {/* <div><button onClick={goToSignIn}>Sign In</button></div> 
  <div><button onClick={()=>history.push('/course')}>Go To Course</button></div> */}
  </div>
}