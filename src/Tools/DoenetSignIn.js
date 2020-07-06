import React, { useState, useEffect, useRef } from "react";
import logo from '../media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';
import Textinput from "../imports/Textinput";
import axios from "axios";

export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");
  let [nineCode, setNineCode] = useState("");
  let [stayLoggedIn, setStayLoggedIn] = useState(false);

  let [signInStage, setSignInStage] = useState("beginning");
  let [isSentEmail,setIsSentEmail] = useState(false);
  let [codeSuccess, setCodeSuccess] = useState(false);
  let [reason, setReason] = useState("");
  let [existed, setExisted] = useState(false);

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

 

  if (signInStage === "check code"){
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
        // console.log('resp',resp);
        setSignInStage("resolve server code check response");
        setCodeSuccess(resp.data.success);
        setReason(resp.data.reason);
        setExisted(resp.data.existed);
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

  if (signInStage === "resolve server code check response"){
    if (codeSuccess){
      setProfile('JWT', {token:"put token here"}, {path:"/"})
      setProfile('Profile', {email}, {path:"/"})
    }
    if (codeSuccess && existed){
      location.href = "/dashboard";
    }else if (codeSuccess && !existed){
      location.href = "/accountsettings";
    }else if (reason === "Code expired"){
      return (
        <div style={
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: "20",
          }}>
        <h2 style={{textAlign: "center"}}>Code Expired</h2>
        <button onClick={()=>{location.href = '/signin'}}>Restart Signin</button>
  
        </div>
      )
    }
    
  }

  function submitCode(){
    setReason("");
    setSignInStage("check code");
  }

  if (signInStage === "enter code" || reason === "Invalid Code"){

    if (!isSentEmail){
      const phpUrl = '/api/sendSignInEmail.php';
      const data = {
        emailaddress: email,
      }
      const payload = {
        params: data
      }
      axios.get(phpUrl, payload)
        .then(resp => {
          //Ignore response
        })
        .catch(error => { this.setState({ error: error }) });
      setIsSentEmail(true);
    }
    

      let heading = <h2 style={{textAlign: "center"}}>Email Sent!</h2>
      if (reason === "Invalid Code"){
        heading = <h2 style={{textAlign: "center"}}>Invalid Code. Try again.</h2>
      }

      return (
      <div style={
        {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: "20",
        }}>
      {heading}
      <div><p>Check your email for a code to complete sign in.</p></div>
      <p><label>Code (9 digit code): <input type="text" 
      ref={codeRef} 
      value={nineCode} 
      onKeyDown={(e)=>{
        if (e.key === 'Enter' && validCode) {submitCode()}
      }}
      onChange={(e)=>{setNineCode(e.target.value)}}/></label></p>
      <button disabled={!validCode} style={{  }} onClick={()=>submitCode()}>Sign In</button>
      </div>
    )
  }


  if (signInStage === "beginning"){
    return (
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
            if (e.key === 'Enter' && validEmail) {setSignInStage("enter code")}
          }}
          onChange={(e)=>{setEmail(e.target.value)}}/></label></p>
          <p><input type="checkbox" checked={stayLoggedIn} onChange={(e)=>{setStayLoggedIn(e.target.checked)}}
          /> Stay Logged In</p>
          <button disabled={!validEmail} style={{ float: "right" }} onClick={()=>setSignInStage("enter code")}>Send Email</button></div>
      </div>
  );
        }

  return (
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

<h2 style={{textAlign: "center"}}>Loading...</h2>

    </div>
);
  

  
}

