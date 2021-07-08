import React from 'react';

export default function AccountSettings(props){
  // console.log(">>>===AccountSettings")
  return <div style={props.style}><h1>Account Settings</h1>
  <p>put account settings here</p>
  <button onClick={()=>location.href = 'new#/SignOut'}>Sign Out</button>
  </div>
}