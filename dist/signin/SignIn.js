import React, {useState, useEffect, useRef} from "../_snowpack/pkg/react.js";
import logo from "../media/Doenet_Logo_Frontpage.png.proxy.js";
import Cookies from "../_snowpack/pkg/js-cookie.js";
import axios from "../_snowpack/pkg/axios.js";
export default function SignIn() {
  let [email, setEmail] = useState("");
  let [nineCode, setNineCode] = useState("");
  let [maxAge, setMaxAge] = useState(0);
  let [signInStage, setSignInStage] = useState("beginning");
  let [isSentEmail, setIsSentEmail] = useState(false);
  let [deviceName, setDeviceName] = useState("");
  const jwt = Cookies.get();
  const emailRef = useRef(null);
  const codeRef = useRef(null);
  let validEmail = false;
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    validEmail = true;
  }
  let validCode = false;
  if (/^\d{9}$/.test(nineCode)) {
    validCode = true;
  }
  useEffect(() => {
    if (codeRef.current !== null && !validCode) {
      codeRef.current.focus();
    } else if (emailRef.current !== null && !validEmail) {
      emailRef.current.focus();
    }
  });
  if (Object.keys(jwt).includes("JWT_JS")) {
    location.href = "/dashboard";
  }
  if (signInStage === "check code") {
    const phpUrl = "/api/checkCredentials.php";
    const data = {
      emailaddress: email,
      nineCode,
      deviceName
    };
    const payload = {
      params: data
    };
    axios.get(phpUrl, payload).then((resp) => {
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
          setSignInStage("Invalid Code");
        }
      }
    }).catch((error) => {
      this.setState({error});
    });
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
    }, "Signing in..."));
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
    }, "Code Expired"), /* @__PURE__ */ React.createElement("button", {
      onClick: () => {
        location.href = "/signin";
      }
    }, "Restart Signin"));
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
        Cookies.set("Device", resp.data.deviceName, cookieSettingsObj);
        Cookies.set("Stay", maxAge, cookieSettingsObj);
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
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: "20"
      }
    }, heading, /* @__PURE__ */ React.createElement("div", {
      style: {weight: "bold"}
    }, "Device Name: ", deviceName), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "Check your email for a code to complete sign in.")), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("label", null, "Code (9 digit code):", " ", /* @__PURE__ */ React.createElement("input", {
      type: "text",
      ref: codeRef,
      value: nineCode,
      "data-cy": "signinCodeInput",
      onKeyDown: (e) => {
        if (e.key === "Enter" && validCode) {
          setSignInStage("check code");
        }
      },
      onChange: (e) => {
        setNineCode(e.target.value);
      }
    }))), /* @__PURE__ */ React.createElement("button", {
      disabled: !validCode,
      style: {},
      onClick: () => setSignInStage("check code"),
      "data-cy": "signInButton"
    }, "Sign In"));
  }
  if (signInStage === "beginning") {
    let stay = 0;
    if (maxAge > 0) {
      stay = 1;
    }
    return /* @__PURE__ */ React.createElement("div", {
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
      src: logo
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("label", null, "Email Address:", " ", /* @__PURE__ */ React.createElement("input", {
      type: "text",
      label: "Email Address",
      ref: emailRef,
      value: email,
      "data-cy": "signinEmailInput",
      onKeyDown: (e) => {
        if (e.key === "Enter" && validEmail) {
          setSignInStage("enter code");
        }
      },
      onChange: (e) => {
        setEmail(e.target.value);
      }
    }))), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("input", {
      type: "checkbox",
      checked: stay,
      onChange: (e) => {
        if (e.target.checked) {
          setMaxAge(24e4);
        } else {
          setMaxAge(0);
        }
      }
    }), " ", "Stay Logged In"), /* @__PURE__ */ React.createElement("button", {
      disabled: !validEmail,
      style: {float: "right"},
      onClick: () => setSignInStage("enter code"),
      "data-cy": "sendEmailButton"
    }, "Send Email")));
  }
  return /* @__PURE__ */ React.createElement("div", {
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
  }, "Loading..."));
}
