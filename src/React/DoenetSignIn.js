import React, { useState } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';

export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");
  let [stayLoggedIn, setStayLoggedIn] = useState(false);
  let [submittedEmail, setSubmittedEmail] = useState(false);
  const [cookiePassword,setCookiePassword] = useCookies('cookiePassword');
  const [cookieEmail,setCookieEmail] = useCookies('cookieEmail');
  let url_string = window.location.href;
  var url = new URL(url_string);


  if (cookiePassword.cookiePassword && cookieEmail.cookieEmail){
    location.href = "/profile";
  }

  let validEmail = false;



  if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    validEmail = true;
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
      <div><p>Check your email for a short password to complete sign in.</p></div>
      <p><label>Email Address: <input type="text" value={shortPassword} onChange={(e)=>{setShortPassword(e.target.value)}}/></label></p>

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

