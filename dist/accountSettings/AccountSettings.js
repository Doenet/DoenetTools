import React, {useState, useRef} from "../_snowpack/pkg/react.js";
import {
  atom,
  RecoilRoot,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import Tool from "../_framework/Tool.js";
import {useToolControlHelper} from "../_framework/ToolRoot.js";
import {a} from "../_snowpack/pkg/react-spring.js";
import InfiniteSlider from "../_framework/temp/InfiniteSlider.js";
import "../_framework/doenet.css.proxy.js";
import Textinput from "../_framework/Textinput.js";
import Switch from "../_framework/Switch.js";
import Cookies from "../_snowpack/pkg/js-cookie.js";
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
console.log(picture_items);
const getProfileQuerry = atom({
  key: "getProfileQuerry",
  default: selector({
    key: "getProfileQuerry/Default",
    get: async () => {
      try {
        const {data} = await axios.get("/api/loadProfile.php");
        return data.profile;
      } catch (error) {
        console.log("Error loading user profile", error.message);
        return {};
      }
    }
  })
});
const getProfile = selector({
  key: "getProfile",
  get: ({get}) => {
    let data = get(getProfileQuerry);
    return data;
  }
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
    set(getProfileQuerry, data);
    await axios.post(url, data);
  });
  let profile = useRecoilValueLoadable(getProfile);
  let [editMode, setEditMode] = useState(false);
  let [pic, setPic] = useState(0);
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Account Settings"
  }), profile.state == "hasValue" ? /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "auto", width: "70%"}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "auto", width: "fit-content", marginTop: "20px"}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {width: "150px", height: "150px", margin: "auto"}
  }, editMode ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {float: "right"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    onClick: (e) => {
      let data = {...profile.contents};
      data.profilePicture = pic;
      setProfile(data);
      setEditMode(false);
    },
    style: {color: "#444", position: "absolute", zIndex: "2", textAlign: "right"},
    icon: faTimes
  })), /* @__PURE__ */ React.createElement(InfiniteSlider, {
    items: translateArray(picture_items, PROFILE_PICTURES.indexOf(profile.contents.profilePicture)),
    showButtons: editMode,
    showCounter: false,
    callBack: (i) => {
      setPic(translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(profile.contents.profilePicture))[i - 1]);
    }
  }, ({css}, i) => {
    return /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Image, {
      style: {backgroundImage: css, borderRadius: "50%"}
    }));
  })) : /* @__PURE__ */ React.createElement(Content, {
    onClick: (e) => setEditMode(true)
  }, /* @__PURE__ */ React.createElement(Image, {
    style: {backgroundImage: `url('/media/profile_pictures/${profile.contents.profilePicture}.jpg')`, borderRadius: "50%"}
  }))), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "screen name",
    label: "Screen Name",
    value: profile.contents.screenName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile.contents};
      data.screenName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile.contents};
        data.screenName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "firstName",
    label: "First Name",
    value: profile.contents.firstName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile.contents};
      data.firstName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile.contents};
        data.firstName = e.target.value;
        setProfile(data);
      }
    }
  }), /* @__PURE__ */ React.createElement(Textinput, {
    style: {width: "300px"},
    id: "lastName",
    label: "Last Name",
    value: profile.contents.lastName,
    onChange: (e) => {
    },
    onBlur: (e) => {
      let data = {...profile.contents};
      data.lastName = e.target.value;
      setProfile(data);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let data = {...profile.contents};
        data.lastName = e.target.value;
        setProfile(data);
      }
    }
  })), /* @__PURE__ */ React.createElement("p", null, "Email Address: ", profile.contents.email), /* @__PURE__ */ React.createElement(Switch, {
    id: "trackingConsent",
    onChange: (e) => {
      let data = {...profile.contents};
      data.trackingConsent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.trackingConsent
  }), /* @__PURE__ */ React.createElement("p", null, "I consent to the use of tracking technologies."), /* @__PURE__ */ React.createElement("p", null, '"I consent to the tracking of my progress and my activity on educational websites which participate in Doenet; my data will be used to provide my instructor with my grades on course assignments, and anonymous data may be provided to content authors to improve the educational effectiveness."', /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Revoking your consent may impact your ability to recieve credit for coursework.")), /* @__PURE__ */ React.createElement(SectionHeader, null, "Your Roles"), /* @__PURE__ */ React.createElement(Switch, {
    id: "student",
    onChange: (e) => {
      let data = {...profile.contents};
      data.roleStudent = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.roleStudent
  }), /* @__PURE__ */ React.createElement("p", null, "Student"), /* @__PURE__ */ React.createElement(Switch, {
    id: "instructor",
    onChange: (e) => {
      let data = {...profile.contents};
      data.roleInstructor = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.roleInstructor
  }), /* @__PURE__ */ React.createElement("p", null, "Instructor"), /* @__PURE__ */ React.createElement(Switch, {
    id: "course_designer",
    onChange: (e) => {
      let data = {...profile.contents};
      data.roleCourseDesigner = boolToString(e.target.checked);
      setProfile(data);
    },
    checked: profile.contents.roleCourseDesigner
  }), /* @__PURE__ */ React.createElement("p", null, "Course Designer"))) : /* @__PURE__ */ React.createElement("p", null, "Loading..."));
}
