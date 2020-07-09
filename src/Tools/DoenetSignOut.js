import React, { useState } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';

export default function DoenetSignOut(props) {

  const [jwt,setJwt,removeCookie] = useCookies('jwt');
  const [signedOutAttempts, setSignedOutAttempts] = useState(0);

  const vanillaCookies = document.cookie.split(';');

  removeCookie('JWT',{path:"/"})
  removeCookie('Profile',{path:"/"})
  removeCookie('TrackingConsent',{path:"/"})

  if (vanillaCookies.length === 1 && vanillaCookies[0] === ""){
    return (
      <>
        <div style={
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20",
          }}>
  
          <img style={{ width: "250px", height: "250px" }} src={logo} />
          <div>
            <h2>You are Signed Out!</h2>
            </div>
        </div>
      </>
    );
  }

  if (signedOutAttempts > 4){
    return (
      <>
        <div style={
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20",
          }}>
  
          <img style={{ width: "250px", height: "250px" }} src={logo} />
          <div>
            <h2>FAILED SIGN OUT</h2>
            <p>Please manually remove your cookies.</p>
            </div>
        </div>
      </>
    );
  }

  setTimeout(()=>{setSignedOutAttempts(signedOutAttempts+1)},100);

  return (
    <>
      <div style={
        {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20",
        }}>

        <img style={{ width: "250px", height: "250px" }} src={logo} />
        <div>
          <h2>Signing you out...</h2>
          </div>
      </div>
    </>
  );

 


 
}

