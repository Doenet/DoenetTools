import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback,
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {pageToolViewAtom, profileAtom} from "../NewToolRoot.js";
import {a} from "../../_snowpack/pkg/@react-spring/web.js";
import "../doenet.css.proxy.js";
import Switch from "../Switch.js";
import axios from "../../_snowpack/pkg/axios.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
let SectionHeader = styled.h2`
  margin-top: 2em;
  margin-bottom: 2em;
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
`;
const Image = styled(a.div)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
`;
const PROFILE_PICTURES = ["bird", "cat", "dog", "emu", "fox", "horse", "penguin", "quokka", "squirrel", "swan", "tiger", "turtle", "anonymous"];
const boolToString = (bool) => {
  if (bool) {
    return "1";
  } else {
    return "0";
  }
};
const translateArray = (arr, k) => arr.concat(arr).slice(k, k + arr.length);
export default function DoenetProfile(props) {
  const setProfile = useRecoilCallback(({set}) => (newProfile) => {
    const data = {...newProfile};
    localStorage.setItem("Profile", JSON.stringify(data));
    set(profileAtom, data);
    axios.post("/api/saveProfile.php", data);
  });
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile);
    return null;
  }
  if (profile.signedIn === "0") {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        ...props.style,
        border: "1px solid grey",
        borderRadius: "20px",
        margin: "auto",
        marginTop: "10%",
        padding: "10px",
        width: "50%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        textAlign: "center",
        alignItems: "center",
        marginBottom: "20px"
      }
    }, /* @__PURE__ */ React.createElement("h2", null, "You are not signed in"), /* @__PURE__ */ React.createElement("h2", null, "Account Settings currently requires sign in for use"), /* @__PURE__ */ React.createElement("button", {
      style: {background: "#1a5a99", borderRadius: "5px"}
    }, /* @__PURE__ */ React.createElement("a", {
      href: "/#/signin",
      style: {color: "white", textDecoration: "none"}
    }, "Sign in with this link")))));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("p", null, "Email Address: ", profile.email), /* @__PURE__ */ React.createElement(Button, {
    value: "Sign out",
    onClick: () => {
      setPageToolView({page: "signout", tool: "", view: ""});
    }
  }), /* @__PURE__ */ React.createElement("br", null));
}
