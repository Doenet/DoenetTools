import React, { useState } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';

export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");

  console.log("email",email)
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
          // width: "100%",
          // height: "100%",
          margin: "20",
        }}>

        <img style={{ width: "250px", height: "250px" }} src={logo} />
        <div>
          <p><label>Email Address: <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/></label></p>
          <p><input type="checkbox" /> Stay Logged In</p>
          <button style={{ float: "right" }}>Sign in</button></div>
      </div>
    </>
  );
}

