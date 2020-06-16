import React, { useState } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';


export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");
  let [stayLoggedIn, setStayLoggedIn] = useState(false);
  let [submitted, setSubmitted] = useState(false);

  let validEmail = false;

  if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    validEmail = true;
  }

 

  if (submitted){
    
    return (
      <>
      <div style={
        {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: "20",
        }}>
      <h2 style={{textAlign: "center"}}>Email Sent!</h2>
      <div><p>Check your email to complete sign in.</p></div>
      </div>
      </>
    )
  }
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
          <p><label>Email Address: <input type="password" value={email} onChange={(e)=>{setEmail(e.target.value)}}/></label></p>
          <p><input type="checkbox" checked={stayLoggedIn} onChange={(e)=>{setStayLoggedIn(e.target.checked)}}
          /> Stay Logged In</p>
          <button disabled={!validEmail} style={{ float: "right" }} onClick={()=>setSubmitted(true)}>Send Email</button></div>
      </div>
    </>
  );
}

