import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import Cookies from "../../_snowpack/pkg/js-cookie.js";
import axios from "../../_snowpack/pkg/axios.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {useToast, toastType} from "../Toast.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
export default function SignIn(props) {
  let [email, setEmail] = useState("");
  let [nineCode, setNineCode] = useState("");
  let [maxAge, setMaxAge] = useState(0);
  let [signInStage, setSignInStage] = useState("beginning");
  let [isSentEmail, setIsSentEmail] = useState(false);
  let [deviceName, setDeviceName] = useState("");
  let [sendEmailAlert, setSendEmailAlert] = useState(false);
  let [signInAlert, setSignInAlert] = useState(false);
  let [validEmail, setValidEmail] = useState(false);
  let [validCode, setValidCode] = useState(false);
  let [sendEmailDisabled, setSendEmailDisabled] = useState(true);
  let [signInDisabled, setSignInDisabled] = useState(true);
  console.log(signInStage);
  const jwt = Cookies.get();
  const emailRef = useRef(null);
  const codeRef = useRef(null);
  const toast = useToast();
  function validateEmail(inputEmail) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail)) {
      setSendEmailDisabled(false);
      setValidEmail(true);
      setSendEmailAlert(false);
    } else {
      setSendEmailDisabled(true);
      setValidEmail(false);
      setSendEmailAlert(true);
    }
  }
  useEffect(() => {
    if (/\d{9}/.test(nineCode)) {
      setSignInDisabled(false);
      setValidCode(true);
      setSignInAlert(false);
    } else if (nineCode === "") {
      setSignInDisabled(true);
      setValidCode(false);
      setSignInAlert(false);
    } else {
      setSignInDisabled(true);
      setValidCode(false);
      setSignInAlert(true);
    }
    if (codeRef.current !== null && !validCode) {
      codeRef.current.focus();
    } else if (emailRef.current !== null && !validEmail) {
      emailRef.current.focus();
    }
  });
  if (Object.keys(jwt).includes("JWT_JS")) {
    axios.get("/api/loadProfile.php", {params: {}}).then((resp) => {
      if (resp.data.success === "1") {
        localStorage.setItem("Profile", JSON.stringify(resp.data.profile));
        location.href = "/#/course";
      } else {
      }
    }).catch((error) => {
      console.log(error);
    });
    return null;
  }
  if (window.Cypress) {
    let emailaddress = "devuser@example.com";
    let deviceName2 = "Cacao tree";
    let cookieSettingsObj = {path: "/", expires: 24e3, sameSite: "strict"};
    Cookies.set("Device", deviceName2, cookieSettingsObj);
    Cookies.set("Stay", 1, cookieSettingsObj);
    location.href = `/api/jwt.php?emailaddress=${encodeURIComponent(emailaddress)}&nineCode=${encodeURIComponent("123456789")}&deviceName=${deviceName2}&newAccount=${"0"}&stay=${"1"}`;
  }
  if (signInStage === "check code") {
    const data = {
      emailaddress: email,
      nineCode,
      deviceName
    };
    const payload = {
      params: data
    };
    axios.get("/api/checkCredentials.php", payload).then((resp) => {
      if (resp.data.success) {
        let newAccount = "1";
        if (resp.data.existed) {
          newAccount = "0";
        }
        let stay = "0";
        if (maxAge > 0) {
          stay = "1";
        }
        location.href = `/api/jwt.php?emailaddress=${encodeURIComponent(email)}&nineCode=${encodeURIComponent(nineCode)}&deviceName=${deviceName}&newAccount=${newAccount}&stay=${stay}`;
      } else {
        if (resp.data.reason === "Code expired") {
          setSignInStage("Code expired");
        } else if (resp.data.reason === "Invalid Code") {
          setSignInStage("enter code");
          toast("Invalid code. Please try again.", toastType.ERROR);
        }
      }
    }).catch((error) => {
      console.error(error);
    });
    setSignInStage("Loading");
    return null;
  }
  if (signInStage === "Loading") {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("h2", {
      style: {textAlign: "center"}
    }, "Signing in...")));
  }
  if (signInStage === "Code expired") {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("h2", {
      style: {textAlign: "center"}
    }, "Code Expired"), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => {
        location.href = "/#/signin";
      },
      value: "Restart Signin"
    }));
  }
  if (signInStage === "enter code" || signInStage === "Invalid Code") {
    if (!isSentEmail) {
      const phpUrl = "/api/sendSignInEmail.php";
      const data = {
        emailaddress: email
      };
      const payload = {
        params: data
      };
      axios.get(phpUrl, payload).then((resp) => {
        setDeviceName(resp.data.deviceName);
        let cookieSettingsObj = {path: "/", sameSite: "strict"};
        if (maxAge > 0) {
          cookieSettingsObj.maxAge = maxAge;
        }
      }).catch((error) => {
        this.setState({error});
      });
      setIsSentEmail(true);
    }
    let heading = /* @__PURE__ */ React.createElement("h2", {
      style: {textAlign: "center"}
    }, "Email Sent!");
    if (signInStage === "Invalid Code") {
      heading = /* @__PURE__ */ React.createElement("h2", {
        style: {textAlign: "center"}
      }, "Invalid Code. Try again.");
    }
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: "20"
      }
    }, heading, /* @__PURE__ */ React.createElement("div", {
      style: {weight: "bold", fontSize: "14px"}
    }, "Device Name: ", deviceName), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", {
      style: {fontSize: "14px"}
    }, "Check your email for a code to complete sign in.")), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(Textfield, {
      label: "Code (9 digit code):",
      ref: codeRef,
      value: nineCode,
      "data-test": "signinCodeInput",
      alert: signInAlert,
      onKeyDown: (e) => {
        if (e.key === "Enter" && validCode) {
          setSignInStage("check code");
        } else if (e.key === "Enter" && !validCode) {
          toast("Invalid code format. Please enter 9 digits.", toastType.ERROR);
        }
      },
      onBlur: () => {
        if (!validCode && !signInAlert) {
          toast("Invalid code format. Please enter 9 digits.", toastType.ERROR);
        }
      },
      onChange: (e) => {
        setNineCode(e.target.value);
      }
    })), /* @__PURE__ */ React.createElement(Button, {
      disabled: signInDisabled,
      onClick: () => {
        if (validCode) {
          setSignInStage("check code");
        }
      },
      "data-test": "signInButton",
      value: "Sign In"
    })));
  }
  if (signInStage === "beginning") {
    let stay = 0;
    if (maxAge > 0) {
      stay = 1;
    }
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("img", {
      style: {width: "250px", height: "250px"},
      alt: "Doenet Logo",
      src: "/media/Doenet_Logo_Frontpage.png"
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", {
      style: {marginLeft: "2px"}
    }, /* @__PURE__ */ React.createElement(Textfield, {
      label: "Email Address:",
      ref: emailRef,
      value: email,
      alert: sendEmailAlert,
      "data-test": "signinEmailInput",
      onKeyDown: (e) => {
        validateEmail(email);
        if (e.key === "Enter" && validEmail) {
          setSignInStage("enter code");
        } else if (e.key === "Enter" && !validEmail) {
          toast("Invalid email. Please try again.", toastType.ERROR);
        }
      },
      onBlur: () => {
        validateEmail(email);
        if (!validEmail && !sendEmailAlert) {
          toast("Invalid email. Please try again.", toastType.ERROR);
        }
      },
      onChange: (e) => {
        setEmail(e.target.value);
      }
    })), /* @__PURE__ */ React.createElement("p", {
      style: {fontSize: "14px"}
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: stay,
      onClick: (e) => {
        if (!stay) {
          setMaxAge(24e4);
        } else {
          setMaxAge(0);
        }
      }
    }), " ", "Stay Logged In"), /* @__PURE__ */ React.createElement(Button, {
      disabled: sendEmailDisabled,
      onClick: () => {
        if (validEmail) {
          setSignInStage("enter code");
        }
      },
      "data-test": "sendEmailButton",
      value: "Send Email"
    }))));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "20"
    }
  }, /* @__PURE__ */ React.createElement("h2", {
    style: {textAlign: "center"}
  }, "Loading...")));
}
