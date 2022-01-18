import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback,
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {pageToolViewAtom, profileAtom} from "../NewToolRoot.js";
import {a} from "../../_snowpack/pkg/@react-spring/web.js";
import InfiniteSlider from "../temp/InfiniteSlider.js";
import "../doenet.css.proxy.js";
import Textinput from "../Textinput.js";
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
  const [initPhoto, setInitPhoto] = useState(profile.profilePicture);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile);
    return null;
  }
  const translatednames = translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(initPhoto));
  const translateditems = translatednames.map((picture) => `/media/profile_pictures_copy/${picture}.jpg`);
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
  }, /* @__PURE__ */ React.createElement("div", {
    style: {...props.style, margin: "auto", width: "70%"}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "auto", width: "fit-content", marginTop: "20px"}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {width: "150px", height: "150px", margin: "auto"}
  }, /* @__PURE__ */ React.createElement(InfiniteSlider, {
    fileNames: translateditems,
    showButtons: true,
    showCounter: false,
    callBack: (i) => {
      let data = {...profile};
      if (data.profilePicture !== translatednames[i]) {
        data.profilePicture = translatednames[i];
        setProfile(data);
      }
    }
  }, ({css}, i) => {
    return /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Image, {
      style: {backgroundImage: css, borderRadius: "50%"}
    }));
  })), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Screen Name",
    style: {width: "300px"},
    id: "screen name",
    value: profile.screenName,
    onChange: (e) => {
      if (e.key === "Enter") {
        let data = {...profile};
        data.screenName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textfield, {
    label: "First Name",
    style: {width: "300px"},
    id: "firstName",
    value: profile.firstName,
    onChange: (e) => {
      if (e.key === "Enter") {
        let data = {...profile};
        data.firstName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Last Name",
    style: {width: "300px"},
    id: "lastName",
    value: profile.lastName,
    onChange: (e) => {
      if (e.key === "Enter") {
        let data = {...profile};
        data.lastName = e.target.value;
        setProfile(data);
      }
    }
  })), /* @__PURE__ */ React.createElement("p", null, "Email Address: ", profile.email), /* @__PURE__ */ React.createElement(Switch, {
    id: "trackingConsent",
    onChange: (e) => {
      let data = {...profile};
      data.trackingConsent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.trackingConsent
  }), /* @__PURE__ */ React.createElement("p", null, "I consent to the use of tracking technologies."), /* @__PURE__ */ React.createElement("p", null, '"I consent to the tracking of my progress and my activity on educational websites which participate in Doenet; my data will be used to provide my instructor with my grades on course assignments, and anonymous data may be provided to content authors to improve the educational effectiveness."', /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Revoking your consent may impact your ability to recieve credit for coursework.")), /* @__PURE__ */ React.createElement(SectionHeader, null, "Your Roles"), /* @__PURE__ */ React.createElement("p", null, "Student"), /* @__PURE__ */ React.createElement(Switch, {
    id: "student",
    onChange: (e) => {
      let data = {...profile};
      data.roleStudent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.roleStudent
  }), /* @__PURE__ */ React.createElement("p", null, "Instructor"), /* @__PURE__ */ React.createElement(Switch, {
    id: "instructor",
    onChange: (e) => {
      let data = {...profile};
      data.roleInstructor = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.roleInstructor
  }), /* @__PURE__ */ React.createElement("p", null, "Course Designer"), /* @__PURE__ */ React.createElement(Switch, {
    id: "course_designer",
    onChange: (e) => {
      let data = {...profile};
      data.roleCourseDesigner = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.roleCourseDesigner
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    value: "Sign out",
    onClick: () => {
      setPageToolView({page: "signout", tool: "", view: ""});
    }
  }), /* @__PURE__ */ React.createElement("br", null)));
}
