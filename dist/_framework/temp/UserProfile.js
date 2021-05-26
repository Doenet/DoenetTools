import React, {Component, useState} from "../../_snowpack/pkg/react.js";
import "./header.css.proxy.js";
import doenetImage from "../../media/Doenet_Logo_cloud_only.png.proxy.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faTh,
  faUser,
  faArrowLeft,
  faBars,
  faCaretRight,
  faCaretDown
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import axios from "../../_snowpack/pkg/axios.js";
axios.defaults.withCredentials = true;
import styled from "../../_snowpack/pkg/styled-components.js";
import MenuDropDown from "./MenuDropDown.js";
const ExtendedHeader = styled.div`
  display: none;
  width: 100%;
  background-color: red;
  z-index: 1;
  transition: all 0.5s ease-in-out;
  @media (max-width: 768px) {
    display: block !important;
    &.on {
      margin-top: 0px;
      opacity: 1;
    }

    &.off {
      margin-top: ${(props) => "-" + props.extendedMarginOffTop + "px"};
      opacity: 0;
      margin-bottom: 50px;
    }
  }
`;
const Icon = styled.div`
  font-size: 19px;
  padding: 15px;
`;
const ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/profile_pictures/${(props) => props.pic}.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width: 45px;
  height: 45px;
  display: inline;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
`;
const ProfilePictureLrg = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/profile_pictures/${({pic}) => pic}.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width: 100px;
  height: 100px;
  margin-top: 10px;
  display: block;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
`;
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.toolAccess = props?.profile?.toolAccess;
    this.state = {
      menuVisble: false,
      showToolbox: false,
      sliderVisible: false,
      myRoles: {}
    };
    this.select = null;
    this.updateNumber = 0;
    this.roles = [];
    this.adminAccess = 0;
    this.accessAllowed = 0;
    this.headerSectionCount = 1;
    if (this.props.rights) {
      this.rightToView = this.props.rights.rightToView;
      this.rightToEdit = this.props.rights.rightToEdit;
      this.instructorRights = this.props.rights.instructorRights;
      if (this.instructorRights) {
        this.roles.push("Instructor");
      }
      if (this.rightToView) {
        this.roles.push("Student");
      }
      this.coursesPermissions = this.props.rights.permissions;
    } else {
      this.rightToView = false;
      this.rightToEdit = false;
      this.instructorRights = false;
    }
    this.selectPermission = null;
    this.currentCourseId = "";
    if (this.props.rights) {
      this.currentCourseId = this.props.rights.defaultId;
    }
    this.options = [];
    if (this.props.rights && this.props.rights.arrayIds != []) {
      this.props.rights.arrayIds.map((id, index) => {
        this.options.push(/* @__PURE__ */ React.createElement("option", {
          key: this.updateNumber++,
          value: id
        }, this.props.rights.courseInfo[id]["courseName"]));
      });
    } else {
      this.options.push(/* @__PURE__ */ React.createElement("option", {
        key: this.updateNumber++
      }, "No courses"));
    }
    this.select = /* @__PURE__ */ React.createElement("select", {
      value: this.props.rights ? this.props.rights.defaultId : void 0,
      className: "select",
      onChange: (e) => {
        this.currentCourseId = e.target.value;
        this.accessAllowed = this.coursesPermissions["courseInfo"][this.currentCourseId]["accessAllowed"];
        this.adminAccess = this.coursesPermissions["courseInfo"][this.currentCourseId]["adminAccess"];
        if (this.accessAllowed === "1") {
          this.rightToView = true;
          if (this.adminAccess === "1") {
            this.rightToEdit = true;
            this.instructorRights = true;
          }
        }
        this.props.rights.parentFunction(e.target.value);
        this.forceUpdate();
      }
    }, this.options);
    this.prepareProfileDropDown(this.profilePicture);
  }
  prepareProfileDropDown(picture) {
    this.profileMenuMap = [
      {
        optionElem: /* @__PURE__ */ React.createElement(ProfilePictureLrg, {
          pic: picture,
          name: "changeProfilePicture",
          id: "changeProfilePicture"
        }),
        id: "profile",
        label: `${this.props.profile.screenName}`,
        subLabel: `${this.props.profile.device}`
      }
    ];
    for (let toolName of this.toolAccess) {
      let name = toolName.toLowerCase();
      switch (name) {
        case "library":
          this.profileMenuMap.push({
            id: "Library",
            label: "Library",
            link: "/library/"
          });
          break;
        case "course":
          this.profileMenuMap.push({
            id: "Course",
            label: "Course",
            link: "/course/"
          });
          break;
        case "documentation":
          this.profileMenuMap.push({
            id: "Documentation",
            label: "Documentation",
            link: "/docs/"
          });
          break;
        case "gradebook":
          this.profileMenuMap.push({
            id: "Gradebook",
            label: "Gradebook",
            link: "/gradebook/"
          });
          break;
        case "account":
          this.profileMenuMap.push({
            id: "Account",
            label: "Account Settings",
            link: "/accountSettings/"
          });
          break;
      }
    }
    if (this.props.profile.signedIn == "1") {
      this.profileMenuMap.push({
        id: "SignOut",
        label: "Sign out",
        link: "/signout/"
      });
    } else {
      this.profileMenuMap.push({
        id: "SignIn",
        label: "Sign in",
        link: "/signin/"
      });
    }
  }
  componentWillUnmount() {
    this.select = void 0;
    this.selectPermission = void 0;
    this.coursesPermissions = void 0;
    this.accessAllowed = void 0;
    this.adminAccess = void 0;
    if (this.props.rights) {
      this.props.rights.rightToView = void 0;
      this.props.rights.rightToEdit = void 0;
      this.props.rights.instructorRights = void 0;
      this.props.rights.downloadPermission = void 0;
      this.props.rights.permissions = void 0;
      this.props.rights.arrayIds = void 0;
      this.props.rights.courseInfo = void 0;
      this.props.rights.defaultId = void 0;
      this.props.rights.defaultRole = void 0;
      this.props.rights.permissionCallBack = void 0;
      this.props.rights.parentFunction = void 0;
    }
  }
  toogleToolbox() {
    if (!this.state.showToolbox) {
      document.addEventListener("click", this.toogleToolbox, false);
    } else {
      document.removeEventListener("click", this.toogleToolbox, false);
    }
    this.setState((prevState) => ({
      showToolbox: !prevState.showToolbox
    }));
  }
  toggleSlider() {
    this.setState((prevState) => ({
      sliderVisible: !prevState.sliderVisible
    }));
    this.props.onChange(!this.state.sliderVisible, this.headerSectionCount);
  }
  render() {
    this.profilePicture = this.props?.profile?.profilePicture ?? "anonymous";
    this.prepareProfileDropDown(this.profilePicture);
    const sliderClass = this.state.sliderVisible ? "on" : "off";
    if (!!this.refs.extendedHeader) {
      this.headerSectionCount = this.refs.extendedHeader.children.length;
    }
    const extendedMarginOffTop = (this.headerSectionCount + 1) * 50;
    const menuIcon = /* @__PURE__ */ React.createElement(Icon, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faTh,
      size: "lg"
    }));
    const profilePicture = /* @__PURE__ */ React.createElement(ProfilePicture, {
      position: "left",
      pic: this.profilePicture,
      name: "changeProfilePicture",
      id: "changeProfilePicture"
    });
    const profileMenu = /* @__PURE__ */ React.createElement(MenuDropDown, {
      position: "left",
      menuBase: profilePicture,
      offset: -20,
      showThisMenuText: this.props.toolName,
      options: this.profileMenuMap
    });
    const isMultipleRoles = !!this.state.myRoles && !!this.state.myRoles.permissionRoles ? this.state.myRoles.permissionRoles.length > 1 : false;
    const isSingleRole = !!this.state.myRoles && !!this.state.myRoles.permissionRoles ? this.state.myRoles.permissionRoles.length === 1 : false;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, this.props.showProfileOnly ? /* @__PURE__ */ React.createElement("div", null, profileMenu) : /* @__PURE__ */ React.createElement("div", {
      className: "headingContainer"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "headerPlayBtn",
      onClick: this.toggleSlider
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      id: "headerPlayBtn-icon",
      fontSize: "16px",
      icon: this.state.sliderVisible ? faCaretDown : faCaretRight
    })), this.props.toolName && /* @__PURE__ */ React.createElement("div", {
      className: "toolName"
    }, /* @__PURE__ */ React.createElement("img", {
      id: "doenetLogo",
      src: doenetImage,
      height: "40px"
    }), /* @__PURE__ */ React.createElement("span", null, this.props.toolName)), this.props.headingTitle && /* @__PURE__ */ React.createElement("div", {
      className: "headingTitle"
    }, /* @__PURE__ */ React.createElement("span", null, this.props.headingTitle)), !this.props.guestUser && /* @__PURE__ */ React.createElement("div", {
      className: "headingToolbar"
    }, isMultipleRoles && /* @__PURE__ */ React.createElement(MenuDropDown, {
      position: "left",
      offsetPos: -20,
      showThisMenuText: "Instructor",
      options: this.state.myRoles.permissionRoles,
      placeholder: "Select Course"
    }), isSingleRole && /* @__PURE__ */ React.createElement("button", {
      style: {
        alignItems: "center",
        borderRadius: "5px"
      }
    }, this.state.myRoles.permissionRoles[0].label), profileMenu)));
  }
}
export default UserProfile;
