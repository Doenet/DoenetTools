import React, { useState } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';

export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");
  let [nineCode, setNineCode] = useState("");
  let [stayLoggedIn, setStayLoggedIn] = useState(false);
  let [submittedEmail, setSubmittedEmail] = useState(true);
  let [signedIn, setSignedIn] = useState(false);
  const [cookiePassword,setCookiePassword] = useCookies('cookiePassword');
  const [cookieEmail,setCookieEmail] = useCookies('cookieEmail');


  if (cookiePassword.cookiePassword && cookieEmail.cookieEmail){
    location.href = "/profile";
  }

  let validEmail = false;
  if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    validEmail = true;
  }

  let validCode = false;
  if ((/^\d{9}$/.test(nineCode))){
    validCode = true;
  }

  if (signedIn){
    location.href = "/profile";
  }


  if (submittedEmail){
      setCookieEmail('cookieEmail', {email},{path:"/"})
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
      <div><p>Check your email for a code to complete sign in.</p></div>
      <p><label>Code (9 digit code): <input type="text" value={nineCode} onChange={(e)=>{setNineCode(e.target.value)}}/></label></p>
      <button disabled={!validCode} style={{  }} onClick={()=>setSignedIn(true)}>Sign In</button>
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
          <p><label>Email Address: <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/></label></p>
          <p><input type="checkbox" checked={stayLoggedIn} onChange={(e)=>{setStayLoggedIn(e.target.checked)}}
          /> Stay Logged In</p>
          <button disabled={!validEmail} style={{ float: "right" }} onClick={()=>setSubmittedEmail(true)}>Send Email</button></div>
      </div>
    </>
  );
}

