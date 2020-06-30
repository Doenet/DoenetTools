import React, { useState } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';

export default function DoenetSignIn(props) {

  const [jwt,setJwt,removeCookie] = useCookies('jwt');

  console.log('jwt',jwt)
  // removeCookie('JWT')
  removeCookie()
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

