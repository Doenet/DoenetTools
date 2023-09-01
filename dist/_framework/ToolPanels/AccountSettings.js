import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import {
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, profileAtom} from "../NewToolRoot.js";
import "../doenet.css.proxy.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {checkIfUserClearedOut} from "../../_utils/applicationUtils.js";
export default function DoenetProfile(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [signedIn, setSignedIn] = useState(null);
  let checkingCookie = useRef(false);
  const profile = useRecoilValueLoadable(profileAtom);
  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile.contents);
    return null;
  }
  let email = profile?.contents?.email;
  console.log("profile", profile);
  if (!checkingCookie.current) {
    checkingCookie.current = true;
    checkIfUserClearedOut().then(({cookieRemoved}) => {
      setSignedIn(cookieRemoved);
    });
  }
  if (signedIn == null) {
    return null;
  }
  let messageJSX = null;
  if (signedIn) {
    messageJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "You are NOT signed in"), /* @__PURE__ */ React.createElement(Button, {
      value: "Sign in",
      onClick: () => {
        setPageToolView({page: "signout", tool: "", view: ""});
        window.location.href = "/signin";
      }
    }));
  } else {
    messageJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "You are signed in"), /* @__PURE__ */ React.createElement("p", null, "Email: ", email), /* @__PURE__ */ React.createElement(Button, {
      value: "Sign out",
      onClick: () => {
        setPageToolView({page: "signout", tool: "", view: ""});
      }
    }));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      ...props.style,
      border: "1px solid var(--mainGray)",
      borderRadius: "20px",
      margin: "auto",
      marginTop: "10%",
      padding: "10px",
      width: "50%"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      alignItems: "center",
      marginBottom: "20px"
    }
  }, messageJSX)));
}
