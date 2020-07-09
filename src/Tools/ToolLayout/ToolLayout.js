import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PlacementContext from './PlacementContext';
import DoenetHeader from "../DoenetHeader";
import './toollayout.css';
import "../../imports/doenet.css";
import { useCookies } from 'react-cookie';
import axios from "axios";


//This component deals with resizing and resizers

// styled component for the toollayout container with no header
const Container = styled.div`
  display: flex;
  position: fixed;
  height:calc(100vh - 50px);
  overflow:hidden;
  z-index:0;
  width:100%;
`;

const widthToDevice = () => {
  let w = document.documentElement.clientWidth;
  if (w >= 768) {
    return "computer";
  }
  return "phone";
};

export default function ToolLayout(props) {
  let anonymousUserProfile = {
    accessAllowed: "0",
    adminAccessAllowed: "0",
    bio: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: "anonymous",
    roleCommunityTA: "0",
    roleCourseDesigner: "0",
    roleInstructor: "0",
    roleLiveDataCommunity: "0",
    roleStudent: "1",
    roleWatchdog: "0",
    studentId: null,
    toolAccess: ["Chooser", "Documentation"],
    trackingConsent: "1",
    username: "anonymous",
  }
  const [cookieProfile, setCookieProfile] = useCookies('Profile');
  const [jwt, setjwt] = useCookies('JWT');
  let isSignedIn = false;
  if (Object.keys(jwt).includes("JWT")) {
    isSignedIn = true;
  }

  let currentProfile = anonymousUserProfile;

  if (Object.keys(cookieProfile).includes("Profile")) {
    currentProfile = cookieProfile.Profile;
  }

  const [profile, setProfile] = useState(currentProfile);
  



  useEffect(() => {
    //Fires each time you change the tool

    if (Object.keys(cookieProfile).includes("Profile")) {

      if (Object.keys(cookieProfile.Profile).length < 3) {
        //Need to load profile from database 
        console.log("HERE!!!")
        //Ask Server for data which matches email address
        const phpUrl = '/api/loadProfile.php';
        const data = {
          emailaddress: cookieProfile.Profile.email,
          nineCode: cookieProfile.Profile.nineCode
        }
        const payload = {
          params: data
        }
        axios.get(phpUrl, payload)
          .then(resp => {
            // console.log('resp', resp);
            if (resp.data.success === "1") {
              let profile = resp.data.profile;
              profile['nineCode'] = cookieProfile.Profile.nineCode;
              setCookieProfile("Profile",profile,{path:"/"});
              setProfile(profile);
            }
          })
          .catch(error => { this.setState({ error: error }) });
      }
    }
    else if (location.hostname !== "localhost") {
      setProfile(currentProfile);

    } else {
      //Start Signed In when local host development
      //To Start Signed Out Clear the Cookies and comment the next line out
      // let devUserProfile = {
      //   accessAllowed: "1",
      //   adminAccessAllowed: "1",
      //   bio: "Hello, my name is Dev User. I appear in many databases. I like to think I'm very important. c:",
      //   email: "devuser@example.com",
      //   firstName: "Dev",
      //   lastName: "User",
      //   profilePicture: "emu",
      //   roleCommunityTA: "0",
      //   roleCourseDesigner: "0",
      //   roleInstructor: "1",
      //   roleLiveDataCommunity: "0",
      //   roleStudent: "1",
      //   roleWatchdog: "0",
      //   studentId: null,
      //   toolAccess: ["Chooser", "Course", "Profile", "Documentation", "Gradebook"],
      //   trackingConsent: "1",
      //   username: "devuser",
      // }
      // setCookieProfile("Profile", devUserProfile)
      // setProfile(devUserProfile);

    }

  }, []);

  if (Object.keys(cookieProfile).includes("Profile")) {

    if (Object.keys(cookieProfile.Profile).length < 3) {
      return (<h1>Loading...</h1>)
    }
  }

  var w = window.innerWidth;
  let leftW;
  let rightW;

  if (props.children && Array.isArray(props.children)) {
    if (props.leftPanelWidth) {
      leftW = parseInt(props.leftPanelWidth, 10) > 300 ? 300 : props.leftPanelWidth;
    } else {
      leftW = 200;
    }
  }
  if (props.rightPanelWidth) {
    rightW = parseInt(props.rightPanelWidth, 10) > 500 ? 500 : props.rightPanelWidth;
  } else {
    rightW = 300;
  }
  const resizerW = 3;


  //Assume 3 if 1 child then we don't worry about middleW
  let middleW = w - (props.leftPanelClose ? 0 : leftW) - (props.rightPanelClose ? 0 : rightW) - resizerW - resizerW;
  if (props.children.length === 2) {
    middleW = w - (props.leftPanelClose ? 0 : leftW) - resizerW;
  }
  const [leftWidth, setLeftWidth] = useState(leftW);
  const [rightWidth, setRightWidth] = useState(rightW);
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizer, setCurrentResizer] = useState("");
  const [firstPanelHidden, setFirstPanelHidden] = useState(false);
  const [leftCloseBtn, setLeftCloseBtn] = useState(!props.leftPanelClose);
  const [rightCloseBtn, setRightCloseBtn] = useState(!props.rightPanelClose);
  const [leftOpenBtn, setLeftOpenBtn] = useState(!!props.leftPanelClose);
  const [rightOpenBtn, setRightOpenBtn] = useState(!!props.rightPanelClose);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [headerSectionCount, setHeaderSectionCount] = useState(1);
  const [phoneVisiblePanel, setPhoneVisiblePanel] = useState("middle");
  const [middleWidth, setMiddleWidth] = useState(middleW);
  const container = useRef();
  const [deviceType, setDeviceType] = useState(widthToDevice());

  useEffect(() => {

    if (deviceType === "computer") {
      window.addEventListener("mouseup", stopResize);
      window.addEventListener("touchend", stopResize);
      container && container.current && container.current.addEventListener("touchstart", startResize);
      container && container.current && container.current.addEventListener("touchmove", resizingResizer);
      container && container.current && container.current.addEventListener("mousedown", startResize);
      container && container.current && container.current.addEventListener("mousemove", resizingResizer);
      return () => {
        window.removeEventListener("touchend", stopResize);
        window.removeEventListener("mouseup", stopResize);
        container && container.current && container.current.removeEventListener("touchstart", startResize);
        container && container.current && container.current.removeEventListener("touchmove", resizingResizer);
        container && container.current && container.current.removeEventListener("mousedown", startResize);
        container && container.current && container.current.removeEventListener("mousemove", resizingResizer);
      };
    }
  });
  const windowResizeHandler = () => {
    let deviceWidth = widthToDevice();
    if (deviceType !== deviceWidth) {
      setDeviceType(deviceWidth);
    }
    let w = window.innerWidth;
    let middleW =
      w - (!!leftCloseBtn ? leftWidth : 0) - (!!rightCloseBtn ? rightWidth : 0) - resizerW - resizerW;
    if (props.children.length === 2) {
      middleW = w - (!!leftCloseBtn ? leftWidth : 0) - resizerW;
    }
    setMiddleWidth(middleW);
  };

  window.addEventListener("resize", windowResizeHandler);


  const startResize = (event) => {
    setCurrentResizer(event.target.id);
    setIsResizing(true);
  };

  const stopResize = () => {
    setIsResizing(false);
    setCurrentResizer("");
  };

  const resizingResizer = (e) => {

    if (isResizing) {
      const w = window.innerWidth;
      let event = {};
      if (e && e.changedTouches && e.changedTouches.length >= 0) {
        event = e.changedTouches[0];
      } else {
        event = e;
      }
      if (currentResizer === "first") {

        const firstResizer = document.querySelector('#first.resizer');
        let leftW = event.clientX - resizerW / 2;
        let rightW = (!!rightCloseBtn ? rightWidth : 0);
        if (leftW < 40) {
          leftW = 0;
          setLeftOpenBtn(true);
          firstResizer.className = 'resizer left-resizer';
        } else if (leftW < 100) {
          leftW = 100;
          setLeftCloseBtn(true);
          setLeftOpenBtn(false);
          firstResizer.className = 'resizer column-resizer';
        } else if (leftW >= 300) {
          leftW = 300;
          setLeftCloseBtn(true);
          setLeftOpenBtn(false);
          firstResizer.className = 'resizer right-resizer';
        } else if (firstPanelHidden) {
          setFirstPanelHidden(false);
        }
        let middleW = w - leftW - rightW - resizerW - resizerW;
        if (props.children.length === 2) {
          middleW = w - leftW - resizerW;
        }
        if (middleW < 100) {
          middleW = 100;
          leftW = w - rightW - resizerW - resizerW - middleW;
        }
        setLeftWidth(leftW);
        setMiddleWidth(middleW);
      } else if (currentResizer === "second") {
        const secondResizer = document.querySelector('#second.resizer');
        const leftW = (!!leftCloseBtn ? leftWidth : 0);
        let rightW = w - event.clientX - resizerW - resizerW;
        if (rightW < 40) {
          rightW = 0;
          setRightOpenBtn(true);
          secondResizer.className = 'resizer right-resizer';
        } else if (rightW < 100) {
          rightW = 100;
          setRightCloseBtn(true);
          setRightOpenBtn(false);
          secondResizer.className = 'resizer column-resizer';
        } else {
          setRightCloseBtn(true);
          setRightOpenBtn(false);
          secondResizer.className = 'resizer column-resizer';
        }
        middleW = w - leftW - resizerW - resizerW - rightW;
        if (middleW <= 100) {
          middleW = 100;
          secondResizer.className = 'resizer left-resizer';
          rightW = w - leftW - resizerW - resizerW - middleW;
          setRightCloseBtn(true);
          setRightOpenBtn(false);
        }
        setRightWidth(rightW);
        setMiddleWidth(middleW);
      }
    }
  };

  let allParts = [];


  const leftPanelHideable = () => {
    setLeftCloseBtn(false);
    setLeftOpenBtn(true);
    let middleW = w - resizerW - resizerW - (!!rightCloseBtn ? rightWidth : 0);
    if (props.children.length === 2) {
      middleW = w - (!!leftCloseBtn ? 0 : leftWidth) - resizerW;
    }
    setMiddleWidth(middleW);
  };

  const leftPanelVisible = () => {
    // if (middleWidth === 100) {
    //   return;
    // }
    let leftW = 0;
    if (!leftCloseBtn) {
      leftW = leftWidth;
    }
    if (leftWidth === 0) {
      leftW = 200;
    }
    setLeftCloseBtn(true);
    setLeftOpenBtn(false);
    let middleW = w - resizerW - resizerW - leftW - (!!rightCloseBtn ? rightWidth : 0);
    if (props.children.length === 2) {
      middleW = w - leftW - resizerW;
    }
    setLeftWidth(leftW);
    setMiddleWidth(middleW);
  };
  const rightPanelVisible = () => {
    let rightW = 0;
    if (!rightCloseBtn) {
      rightW = rightWidth;
    }
    if (rightWidth === 0) {
      rightW = 300;
    }
    setRightCloseBtn(true);
    setRightOpenBtn(false);
    let middleW = w - resizerW - resizerW - rightW - (!!leftCloseBtn ? leftWidth : 0);
    if (props.children.length === 2) {
      middleW = w - (!!leftCloseBtn ? 0 : leftWidth) - resizerW;
    }
    setRightWidth(rightW);
    setMiddleWidth(middleW);
  };

  const rightPanelHideable = () => {
    setRightCloseBtn(false);
    setRightOpenBtn(true);
    let middleW = w - resizerW - resizerW - (!!leftCloseBtn ? leftWidth : 0);
    setMiddleWidth(middleW);
  };


  const showCollapseMenu = (flag, count) => {
    setSliderVisible(flag);
    setHeaderSectionCount(count);
  }
  //Props children[0]
  let leftNavContent = props.children && Array.isArray(props.children) ? props.children[0] : props.children;
  let panelHeadersControlVisible = {
    sliderVisible: false,
    hideMenu: false,
    hideCollapse: false,
    showFooter: false,
    hideFooter: false,
    headerSectionCount
  };

  panelHeadersControlVisible.hideMenu = !Array.isArray(props.children) && !leftNavContent.props.panelHeaderControls;
  panelHeadersControlVisible.showFooter = deviceType === "phone" && !!Array.isArray(props.children) && props.children.length > 1;
  panelHeadersControlVisible.hideFooter = deviceType === "phone" && !Array.isArray(props.children);
  panelHeadersControlVisible.sliderVisible = deviceType === "phone" && sliderVisible;
  panelHeadersControlVisible.hideCollapse = !Array.isArray(props.children);

  let leftNav = <PlacementContext.Provider value={{ leftCloseBtn: leftCloseBtn, width: `${leftWidth}px`, position: 'left', panelHeadersControlVisible, leftPanelHideable, isResizing }}>{leftNavContent}</PlacementContext.Provider>

  !props.guestUser && allParts.push(<div key="part1" id="leftpanel" className="leftpanel" style={{ width: `${leftWidth}px`, marginLeft: `${leftOpenBtn ? `-${leftWidth}px` : '0px'} ` }} >{leftNav}</div>);

  //Resizer
  if (props.children.length === 2 || props.children.length === 3) {
    allParts.push(
      <div key="resizer1" id="first" className="resizer column-resizer" />

    );
  }

  //Props children[1]
  let middleNav
  if (props.children[1]) {
    middleNav = <PlacementContext.Provider value={{ splitPanel: props.splitPanel, rightOpenBtn, leftOpenBtn, position: 'middle', panelHeadersControlVisible, leftPanelVisible, rightPanelVisible, isResizing, leftWidth: leftWidth, guestUser: props.guestUser }}> {props.children[1]}</PlacementContext.Provider>
    allParts.push(<div key="part2" id="middlepanel" className="middlepanel" style={{ width: `${middleWidth}px`, display: `${middleWidth === 0 ? "none" : "flex"} ` }} >  {middleNav}</div>);
  }

  //Resizer2
  if (props.children.length >= 3) {
    allParts.push(
      <div key="resizer2" id="second" className="resizer column-resizer" />

    );
  }

  //Props children[2]
  let rightNav
  if (props.children[2]) {
    rightNav = <PlacementContext.Provider value={{ rightCloseBtn, position: 'right', panelHeadersControlVisible, rightPanelHideable, isResizing }}>{props.children[2]}  </PlacementContext.Provider>
    allParts.push(<div key="part3" id="rightpanel" className="rightpanel" style={{ width: `${rightWidth}px`, marginRight: `${rightOpenBtn ? `-${rightWidth}px` : '0px'}` }}>{rightNav}</div>);

  }
  const footerClass = props.children.length > 1 ? 'footer-on' : 'footer-off';
  return (
    <>
      <DoenetHeader
        profile={profile}
        isSignedIn={isSignedIn}
        toolName={props.toolName}
        headingTitle={props.headingTitle}
        headerRoleFromLayout={props.headerRoleFromLayout}
        headerChangesFromLayout={props.headerChangesFromLayout}
        guestUser={props.guestUser}
        onChange={showCollapseMenu} />
      {deviceType === "phone" ? <div ref={container}>
        <div className={footerClass}>
          {(phoneVisiblePanel === "left" || allParts.length === 1) &&
            <div key="part1" id="leftpanel" >{leftNav}</div>}
          {phoneVisiblePanel === "middle" &&
            <div key="part2" id="middlepanel" >{middleNav} </div>}
          {phoneVisiblePanel === "right" && allParts.length > 2 &&
            <div key="part3" id="rightpanel"  > {rightNav} </div>}
        </div>

        {props.children.length > 1 && <div className="phonebuttoncontainer" >
          {leftNav && middleNav && leftNav.props.children.props && middleNav.props.children[1].props && (
            <>
              {!props.guestUser && <button className="phonebutton"
                onClick={() => setPhoneVisiblePanel("left")}>{leftNav.props.children.props.panelName}</button>}
              <button className="phonebutton"
                onClick={() => setPhoneVisiblePanel("middle")}>{middleNav.props.children[1].props.panelName}</button>
            </>)}
          {rightNav && rightNav.props.children[0].props &&
            <button className="phonebutton"
              onClick={() => setPhoneVisiblePanel("right")}>{rightNav.props.children[0].props.panelName}</button>}
        </div>}
      </div>
        :
        <Container ref={container}>{allParts}</Container>
      }
    </>
  );
}
