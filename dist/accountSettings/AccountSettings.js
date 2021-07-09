import React, {useState, useContext} from "../_snowpack/pkg/react.js";
import {
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import Tool from "../_framework/Tool.js";
import {profileAtom, ProfileContext} from "../_framework/ToolRoot.js";
import {a} from "../_snowpack/pkg/@react-spring/web.js";
import InfiniteSlider from "../_framework/temp/InfiniteSlider.js";
import "../_framework/doenet.css.proxy.js";
import Textinput from "../_framework/Textinput.js";
import Switch from "../_framework/Switch.js";
// import GlobalFont from "../_utils/GlobalFont.js";
import axios from "../_snowpack/pkg/axios.js";
import {faTimes} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
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
const picture_items = PROFILE_PICTURES.map((picture) => {
  let path = `/media/profile_pictures/${picture}.jpg`;
  let url = `url("${path}")`;
  return {css: url};
});
const boolToString = (bool) => {
  if (bool) {
    return "1";
  } else {
    return "0";
  }
};
const translateArray = (arr, k) => arr.concat(arr).slice(k, k + arr.length);
export default function DoenetProfile(props) {
  const setProfile = useRecoilCallback(({set}) => async (newProfile) => {
    const url = "/api/saveProfile.php";
    const data = {
      ...newProfile
    };
    localStorage.setItem("Profile", JSON.stringify(data));
    set(profileAtom, data);
    await axios.post(url, data);
  });
  const profile = useContext(ProfileContext);
  const [initPhoto, setInitPhoto] = useState(profile.profilePicture);
  let [editMode, setEditMode] = useState(false);
  let [pic, setPic] = useState(0);
  const translatednames = translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(initPhoto));
  const translateditems = translatednames.map((picture) => `/media/profile_pictures_copy/${picture}.jpg`);
  if (profile.signedIn === "0") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ 
      // React.createElement(GlobalFont, null), 
      /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
      title: "Account Settings"
    }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
      style: {
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
      href: "/signin",
      style: {color: "white", textDecoration: "none"}
    }, "Sign in with this link")))))));
  }
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Account Settings"
  }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "auto", width: "70%"}
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
      data.profilePicture = translatednames[i];
      setProfile(data);
    }
  }, ({css}, i) => {
    return /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Image, {
      style: {backgroundImage: css, borderRadius: "50%"}
    }));
  })), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "screen name",
    label: "Screen Name",
    value: profile.screenName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile};
      data.screenName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile};
        data.screenName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "firstName",
    label: "First Name",
    value: profile.firstName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile};
      data.firstName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile};
        data.firstName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "lastName",
    label: "Last Name",
    value: profile.lastName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile};
      data.lastName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
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
  }), /* @__PURE__ */ React.createElement("p", null, "I consent to the use of tracking technologies."), /* @__PURE__ */ React.createElement("p", null, '"I consent to the tracking of my progress and my activity on educational websites which participate in Doenet; my data will be used to provide my instructor with my grades on course assignments, and anonymous data may be provided to content authors to improve the educational effectiveness."', /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Revoking your consent may impact your ability to recieve credit for coursework.")), /* @__PURE__ */ React.createElement(SectionHeader, null, "Your Roles"), /* @__PURE__ */ React.createElement(Switch, {
    id: "student",
    onChange: (e) => {
      let data = {...profile};
      data.roleStudent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.roleStudent
  }), /* @__PURE__ */ React.createElement("p", null, "Student"), /* @__PURE__ */ React.createElement(Switch, {
    id: "instructor",
    onChange: (e) => {
      let data = {...profile};
      data.roleInstructor = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.roleInstructor
  }), /* @__PURE__ */ React.createElement("p", null, "Instructor"), /* @__PURE__ */ React.createElement(Switch, {
    id: "course_designer",
    onChange: (e) => {
      let data = {...profile};
      data.roleCourseDesigner = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.roleCourseDesigner
  }), /* @__PURE__ */ React.createElement("p", null, "Course Designer"))));
}
