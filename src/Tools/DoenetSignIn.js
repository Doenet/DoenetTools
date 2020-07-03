import React, { useState, useEffect, useRef } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';
import Textinput from "../imports/Textinput";


export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");
  let [nineCode, setNineCode] = useState("");
  let [stayLoggedIn, setStayLoggedIn] = useState(false);

  let [isSubmittedEmail, setIsSubmittedEmail] = useState(false);
  let [isSignedIn, setIsSignedIn] = useState(false);
  let [haveServerResponse, setHaveServerResponse] = useState(false);

  const [jwt,setJwt] = useCookies('jwt');
  const [profile,setProfile] = useCookies('Profile');

  const emailRef = useRef(null);
  const codeRef = useRef(null);

  let validEmail = false;
  if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    validEmail = true;
  }

  let validCode = false;
  if ((/^\d{9}$/.test(nineCode))){
    validCode = true;
  }


  useEffect(()=>{
    if (codeRef.current !== null && !validCode){
      codeRef.current.focus();
    }else if (emailRef.current !== null && !validEmail) {
      emailRef.current.focus();
    }
  });

  if (Object.keys(jwt).includes("JWT")){
    location.href = "/dashboard";
  }

 


  if (isSignedIn){
    //Ask Server for data which matches email address
    const phpUrl = '/api/checkCredentials.php';
    const data = {
      emailaddress: email,
      nineCode: nineCode
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl, payload)
      .then(resp => {
        console.log('resp',resp);
        
      })
      .catch(error => { this.setState({ error: error }) });

    return (
      <div style={
        {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: "20",
        }}>
      <h2 style={{textAlign: "center"}}>Signing in...</h2>

      </div>
    )
  }

  if (haveServerResponse){
    setProfile('JWT', {token:"put token here"}, {path:"/"})
    setProfile('Profile', {email,screenName,firstName,lastName}, {path:"/"})
    location.href = "/accountsettings";
    return (
      <div style={
        {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: "20",
        }}>
      <h2 style={{textAlign: "center"}}>Please Select a Screen Name</h2>

      </div>
    )
  }


  if (isSubmittedEmail){
    const phpUrl = '/api/sendSignInEmail.php';
    const data = {
      emailaddress: email,
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl, payload)
      .then(resp => {
        console.log('resp',resp);
        
      })
      .catch(error => { this.setState({ error: error }) });

      return (
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
      <p><label>Code (9 digit code): <input type="text" 
      ref={codeRef} 
      value={nineCode} 
      onKeyDown={(e)=>{
        if (e.key === 'Enter' && validCode) {setIsSignedIn(true)}
      }}
      onChange={(e)=>{setNineCode(e.target.value)}}/></label></p>
      <button disabled={!validCode} style={{  }} onClick={()=>setIsSignedIn(true)}>Sign In</button>
      </div>
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
          <p><label>Email Address: <input type="text" 
          label="Email Address"
          ref={emailRef}
          value={email} 
          onKeyDown={(e)=>{
            if (e.key === 'Enter' && validEmail) {setIsSubmittedEmail(true)}
          }}
          onChange={(e)=>{setEmail(e.target.value)}}/></label></p>
          <p><input type="checkbox" checked={stayLoggedIn} onChange={(e)=>{setStayLoggedIn(e.target.checked)}}
          /> Stay Logged In</p>
          <button disabled={!validEmail} style={{ float: "right" }} onClick={()=>setIsSubmittedEmail(true)}>Send Email</button></div>
      </div>
    </>
  );
}

