import React, { useState, useEffect, useRef } from "react";
import logo from '../local_media/Doenet_Logo_Frontpage.png';
import { useCookies } from 'react-cookie';
// import Textinput from "../imports/Textinput";
import axios from "axios";

export default function DoenetSignIn(props) {
  let [email, setEmail] = useState("");
  let [nineCode, setNineCode] = useState("");
  let [maxAge, setMaxAge] = useState(0);

  let [signInStage, setSignInStage] = useState("beginning");
  let [isSentEmail, setIsSentEmail] = useState(false);
  let [deviceName, setDeviceName] = useState("");

  const [jwt, setJwt] = useCookies('JWT_JS');
  const [deviceNameCookie, setDeviceNameCookie] = useCookies('Device');
  const [stayCookie, setStayCookie] = useCookies('Stay');

  const emailRef = useRef(null);
  const codeRef = useRef(null);

  let validEmail = false;
  if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
    validEmail = true;
  }

  let validCode = false;
  if ((/^\d{9}$/.test(nineCode))) {
    validCode = true;
  }

  useEffect(() => {
    if (codeRef.current !== null && !validCode) {
      codeRef.current.focus();
    } else if (emailRef.current !== null && !validEmail) {
      emailRef.current.focus();
    }
  });

  //If already signed in go to dashboard
  if (Object.keys(jwt).includes("JWT_JS")) {
    location.href = "/dashboard";
  }

  // ** *** *** *** *** **
  //Developer only sign in as devuser
  //Comment this if statement out if you are working on 
  // sign in or multiple devices
  
  if (window.location.hostname === "localhost"){
    console.log("Auto Signing In Devuser");
    let emailaddress = "devuser@example.com";
    let deviceName = "Cacao tree";
    let maxAge = "2147483647"
    let cookieSettingsObj = { path: "/", maxAge };
    setDeviceNameCookie('Device', deviceName, cookieSettingsObj);
    setStayCookie('Stay',maxAge,cookieSettingsObj);
    location.href = `/api/jwt.php?emailaddress=${encodeURIComponent(emailaddress)}&nineCode=${encodeURIComponent("123456789")}&deviceName=${deviceName}&newAccount=${"0"}&stay=${"1"}`;

  }

  // ** *** *** *** *** **


  if (signInStage === "check code") {
    //Ask Server for data which matches email address
    const phpUrl = '/api/checkCredentials.php';
    const data = {
      emailaddress: email,
      nineCode: nineCode,
      deviceName: deviceName,
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl, payload)
      .then(resp => {
        // console.log('checkCredentials resp',resp);

        if (resp.data.success){
          let newAccount = "1";
          if (resp.data.existed){
            newAccount = "0";
          }
          let stay = "0";
          if (maxAge > 0){
            stay = "1";
          }

          // console.log(`/api/jwt.php?emailaddress=${encodeURIComponent(email)}&nineCode=${encodeURIComponent(nineCode)}&deviceName=${deviceName}&newAccount=${newAccount}&stay=${stay}`)
          location.href = `/api/jwt.php?emailaddress=${encodeURIComponent(email)}&nineCode=${encodeURIComponent(nineCode)}&deviceName=${deviceName}&newAccount=${newAccount}&stay=${stay}`;
        }else{
          if (resp.data.reason === "Code expired") {
          setSignInStage("Code expired");
          }else if (resp.data.reason === "Invalid Code"){
            setSignInStage("Invalid Code");
          }
        }
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
        <h2 style={{ textAlign: "center" }}>Signing in...</h2>

      </div>
    )
  }

  if (signInStage === "Code expired") {

      return (
        <div style={
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: "20",
          }}>
          <h2 style={{ textAlign: "center" }}>Code Expired</h2>
          <button onClick={() => { location.href = '/signin' }}>Restart Signin</button>

        </div>
      )
    }

  
  if (signInStage === "enter code" || signInStage === "Invalid Code") {

    if (!isSentEmail) {
      const phpUrl = '/api/sendSignInEmail.php';
      const data = {
        emailaddress: email,
      }
      const payload = {
        params: data
      }
      axios.get(phpUrl, payload)
        .then(resp => {
            setDeviceName(resp.data.deviceName);
            let cookieSettingsObj = { path: "/" };
            if (maxAge > 0){cookieSettingsObj.maxAge = maxAge }
            setDeviceNameCookie('Device', resp.data.deviceName, cookieSettingsObj);
            setStayCookie('Stay',maxAge,cookieSettingsObj);
        })
        .catch(error => { this.setState({ error: error }) });
      setIsSentEmail(true);
    }


    let heading = <h2 style={{ textAlign: "center" }}>Email Sent!</h2>
    if (signInStage === "Invalid Code") {
      heading = <h2 style={{ textAlign: "center" }}>Invalid Code. Try again.</h2>
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
        <div style={{weight: "bold"}}>Device Name: {deviceName}</div>
        <div><p>Check your email for a code to complete sign in.</p></div>
        <p><label>Code (9 digit code): <input type="text"
          ref={codeRef}
          value={nineCode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && validCode) { setSignInStage("check code") }
          }}
          onChange={(e) => { setNineCode(e.target.value) }} /></label></p>
        <button disabled={!validCode} style={{}} onClick={() => setSignInStage("check code")}>Sign In</button>
      </div>
    )
  }


  if (signInStage === "beginning") {
    let stay = 0;
    if (maxAge > 0){
      stay = 1;
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

        <img style={{ width: "250px", height: "250px" }} alt="Doenet Logo" src={logo} />
        <div>
          <p><label>Email Address: <input type="text"
            label="Email Address"
            ref={emailRef}
            value={email}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && validEmail) { setSignInStage("enter code") }
            }}
            onChange={(e) => { setEmail(e.target.value) }} /></label></p>
          <p><input type="checkbox" checked={stay} onChange={(e) => { 
            if (e.target.checked){
              // console.log('stay')
              setMaxAge(2147483647) 
            }else{
              // console.log('not stay')
              setMaxAge(0) 
            }}}
          /> Stay Logged In</p>
          <button disabled={!validEmail} style={{ float: "right" }} onClick={() => setSignInStage("enter code")}>Send Email</button></div>
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

      <h2 style={{ textAlign: "center" }}>Loading...</h2>

    </div>
  );



}

