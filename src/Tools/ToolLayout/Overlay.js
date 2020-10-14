import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PlacementContext from './PlacementContext';
import DoenetHeader from "../DoenetHeader";
import './toollayout.css';
import "../../imports/doenet.css";
import { useCookies } from 'react-cookie';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faBars,faTimes

} from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const OverlayWrapper = styled.div`
  z-index: 6;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: absolute;
  overflow: hidden;
  transition-property: all;
  transition: all 0.2s ease-in-out;
  &.on {
    margin-top: 0%;
  }

  &.off {
    margin-top: 200%;
  }
  @media (max-width: 767px) {
    z-index: 6;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-y: hidden;
    transition-property: all;
    transition: all 0.2s ease-in-out;
    &.on {
      margin-top: 0%;
    }

    &.off {
      margin-top: 400%;
    }
  }
`;
const OverlayContent = styled.div`
  width: 100%;
  height: 100%;
`;
const OverlayHeaderWrapper = styled.div`
  display: flex;
  background-color: #288ae9;
  height: 40px;
`;
const OverlayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: scroll;
  background-color: white;
`;

const OverlayName = styled.span`
  display: inline-flex;
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0 10px 10px;
  align-items: flex-start;
  padding-left: 5px;
  width: 33%;
  color: white;
`;

const OverlayHeader = styled.span`
  display: inline-flex;
  font-size: 20px;
  font-weight: 700;
  width: 33%;
  align-items: center;
  justify-content: center;
  color: white;
`;

const OverlayClose = styled.div`
  display: inline-flex;
  align-items: flex-end;
  border: none;
  transition: all 0.1s ease-in-out;
  width: 33%;
`;

//This component deals with resizing and resizers

// styled component for the toollayout container with no header
const Container = styled.div`
  display: flex;
  position: fixed;
  height: ${props => props.hideHeader ? "calc(100vh - 40px)" : "calc(100vh - 50px)" };
  overflow:hidden;
  z-index:0;
`;


const widthToDevice = () => {
  let w = document.documentElement.clientWidth;
  let deviceType = "";
  if (w >= 768) {
    deviceType =  "computer";
  }
  else {
    deviceType = "phone";
  }
  return deviceType;
};

export default function Overlay(props) {
 
  const [jwt, setjwt] = useCookies('JWT_JS');

  let isSignedIn = false;
  if (Object.keys(jwt).includes("JWT_JS")) {
    isSignedIn = true;
  }

  const [profile, setProfile] = useState({});

  useEffect(() => {
    //Fires each time you change the tool
    //Need to load profile from database each time
        const phpUrl = '/api/loadProfile.php';
        const data = {}
        const payload = {
          params: data
        }
        axios.get(phpUrl, payload)
          .then(resp => {
            if (resp.data.success === "1") {
              setProfile(resp.data.profile);
            }
          })
          .catch(error => { this.setState({ error: error }) });
        }, []); 
   
  
 

  var w = window.innerWidth;
  let leftW;
  let rightW;

  let isLeftPanel = false; 
  var purposeArr = [];
  // assume default purpose as main 
  // error if purposes are not defined properly 
if(Array.isArray(props.children)){
for (let component of props.children){
  if(
    component.props.purpose === undefined ||
     component.props.purpose.toLowerCase() === "main"){
   purposeArr.push("main");
   
  }
  else if(component.props.purpose.toLowerCase() === "support"){
   purposeArr.push("support");
  }
  else if(component.props.purpose.toLowerCase() === "navigation"){
    isLeftPanel = true;
    purposeArr.push("navigation");
  }
  else{
    throw Error("Purposes should be defined as main, support or navigation");
  }

}
}
else {
  purposeArr.push("main");
}
// console.log("purposes", purposeArr);
// console.log("isLeftPanel", isLeftPanel);
  if (props.children && Array.isArray(props.children)) {
    if (props.leftPanelWidth) {
      leftW = parseInt(props.leftPanelWidth, 10) > 300 ? 300 : props.leftPanelWidth;
    } else {
      leftW = isLeftPanel ? 200 : 0;
    }
  }
  if (props.rightPanelWidth) {
    rightW = parseInt(props.rightPanelWidth, 10) > 500 ? 500 : props.rightPanelWidth;
  } else {
    rightW = 300;
  }
  const resizerW = 3;

  
  //Assume 3 if 1 child then we don't worry about middleW
  // let middleW = w - (props.leftPanelClose ? 0 : leftW) - (props.rightPanelClose ? 0 : rightW) - resizerW - resizerW;
  let middleW = w - (props.rightPanelClose || purposeArr.indexOf("support") === -1 ? 0 : rightW) - resizerW - (isLeftPanel ? leftW : 0);

  // if (props.children.length === 2) {
  //   middleW = w - (props.leftPanelClose ? 0 : leftW) - resizerW;
  // }
  const [leftWidth, setLeftWidth] = useState(leftW);
  const [rightWidth, setRightWidth] = useState(purposeArr && purposeArr.length >= 2 && purposeArr.indexOf("support") !== -1 ? rightW : 0);
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizer, setCurrentResizer] = useState("");
  const [firstPanelHidden, setFirstPanelHidden] = useState(false);
  // const [leftCloseBtn, setLeftCloseBtn] = useState(!props.leftPanelClose);
  const [leftCloseBtn, setLeftCloseBtn] = useState(widthToDevice() === "phone" ? false : true);
  const [rightCloseBtn, setRightCloseBtn] = useState(!props.rightPanelClose);
  const [leftOpenBtn, setLeftOpenBtn] = useState(!!props.leftPanelClose);
  const [rightOpenBtn, setRightOpenBtn] = useState(!!props.rightPanelClose);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [headerSectionCount, setHeaderSectionCount] = useState(1);
  const [middleWidth, setMiddleWidth] = useState(middleW);
  const container = useRef();
  const [deviceType, setDeviceType] = useState(widthToDevice());
  const [totalWidthNoLeft, setTotalWidthNoLeft] = useState(isLeftPanel && leftCloseBtn ? w - leftW : w);
  const [phoneButtonsWidth, setPhoneButtonsWidth] = useState(0);
  const [showHideMiddlePanel, setShowHideMiddlePanel] = useState(true);
  const [showHideRightPanel, setSHowHideRightPanel] = useState(false);
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

  useEffect(()=>{
    let w = window.innerWidth;
    let middleW;
    // console.log(leftCloseBtn);
    if("phone" === deviceType) {
      setLeftCloseBtn(false,()=>{
        leftPanelHideable();
        middleW = window.innerWidth;
        setTotalWidthNoLeft(middleW);
      });
    }
  
    else if("computer" === deviceType){
      setLeftCloseBtn(true);
      // setLeftOpenBtn(true);

     setLeftCloseBtn(true,()=>{
        // leftPanelVisible();
        middleW = w - (!!leftCloseBtn ? leftWidth : 0)-(!!rightCloseBtn ? rightWidth : 0) - resizerW;
        setMiddleWidth(middleW);
      })
      toolPanelsWidthHandler(leftW, middleW, rightW);
    }
  },[deviceType]);

  const windowResizeHandler = () => {
    let deviceWidth = widthToDevice();
    if (deviceType !== deviceWidth) {
      setDeviceType(deviceWidth);
      return;
    }
    let w = window.innerWidth;
    let middleW;
    // console.log(leftCloseBtn,"leftCLosebutton");
    if(deviceType === "computer"){
      middleW = w - (!!leftCloseBtn ? leftWidth : 0)-(!!rightCloseBtn ? rightWidth : 0) - resizerW;
      setTotalWidthNoLeft(middleW+rightWidth);
    }
    else {
      middleW = window.innerWidth;
      setTotalWidthNoLeft(middleW);
      setPhoneButtonsWidth(middleW - leftWidth);
    }
    setMiddleWidth(middleW);
    //toolPanelsWidthHandler(leftW, middleW, rightW);
    // let deviceWidth = widthToDevice();
    // if (deviceType !== deviceWidth) {
    //   setDeviceType(deviceWidth);
    // }
    // let w = window.innerWidth;
    // let middleW =
    //   w - (!!leftCloseBtn ? leftWidth : 0) - (!!rightCloseBtn ? rightWidth : 0) - resizerW - resizerW;
    // if (props.children.length === 2) {
    //   middleW = w - (!!leftCloseBtn ? leftWidth : 0) - resizerW;
    // }
    // setMiddleWidth(middleW);
    // toolPanelsWidthHandler(leftW, middleW, rightW);
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

  const toolPanelsWidthHandler = (leftW, middleW, rightW) => {
    if(!!props.toolPanelsWidth) {
      if(deviceType === "phone") {
        if(props.children.length === 3) {
          props.toolPanelsWidth(window.innerWidth, window.innerWidth, window.innerWidth);
        } else if(props.children.length === 2) {
          props.toolPanelsWidth(window.innerWidth, window.innerWidth, 0);
        } else {
          props.toolPanelsWidth(window.innerWidth, 0, 0);
        }
      } else {
        if(props.children.length === 3) {
          props.toolPanelsWidth(leftW, middleW, rightW);
        } else if(props.children.length === 2) {
          props.toolPanelsWidth(leftW, middleW, 0);
        } else {
          props.toolPanelsWidth(leftW, 0, 0);
        }
      }
    }
  }

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

        toolPanelsWidthHandler(leftW, middleW, rightW);

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

        toolPanelsWidthHandler(leftW, middleW, rightW);
      }
    }
  };

  let allParts = [];


  const leftPanelHideable = () => {
    setLeftCloseBtn(false);
    setLeftOpenBtn(true);
    let middleW = "";
    if(deviceType === "computer") {
      middleW = w - resizerW - (!!rightCloseBtn ? rightWidth : 0);
    }
    else {
      if(!leftCloseBtn) {
        middleW = w - (!!leftCloseBtn ? leftWidth : 0);
      }
      else {
        middleW = w;
      }
      
    }
    
    if (props.children.length === 2) {
      middleW = w - (!!leftCloseBtn ? 0 : leftWidth) - resizerW;
    }
    setMiddleWidth(middleW);
    //if(purposeArr && purposeArr.length === 2) {
      setTotalWidthNoLeft( !!rightCloseBtn ? middleW + rightWidth : middleW );
    //}
    // else{
    //   setTotalWidthNoLeft(middleW);
    // }
    setLeftWidth(0);
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
    let middleW = w - resizerW - leftW - (!!rightCloseBtn && deviceType === "computer" ? rightWidth : 0);
    if (props.children.length === 2) {
      middleW = w - leftW - resizerW;
    }
    setLeftWidth(leftW);
    setTotalWidthNoLeft(w - leftW);
    setPhoneButtonsWidth(middleW + resizerW + resizerW);
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
    let middleW = w - resizerW - rightW - (!!leftCloseBtn ? leftWidth : 0);
    // if (props.children.length === 2) {
    //   middleW = w - (!!leftCloseBtn ? 0 : leftWidth) - resizerW;
    // }
    setRightWidth(rightW);
    setMiddleWidth(middleW);
  };

  const rightPanelHideable = () => {
    // console.log("left width", leftW)
    setRightCloseBtn(false);
    setRightOpenBtn(true);
    // let middleW = w - resizerW - resizerW - (!!leftCloseBtn ? leftWidth : 0);
    let middleW = w - resizerW - (isLeftPanel && !!leftCloseBtn ? leftWidth : 0);

    // let middleW = w - resizerW - resizerW - leftW; 

    setMiddleWidth(middleW);
  };


  const showCollapseMenu = (flag, count) => {
    setSliderVisible(flag);
    setHeaderSectionCount(count);
  }

  const setPhoneVisiblePanel = (panelName) => {
    if (panelName === "middle") {
      setShowHideMiddlePanel(true);
      setSHowHideRightPanel(false);
    }
    if (panelName === "right") {
      setShowHideMiddlePanel(false);
      setSHowHideRightPanel(true);
    }
  }
  //Props children[0]
  // console.log("props",props.children[0])
  let leftNavContent = props.children && Array.isArray(props.children) ? props.children.filter(obj => obj.props.purpose === "navigation")[0] : props.children;
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
  panelHeadersControlVisible.phoneButtonsDisplay = deviceType === "phone" ? ((purposeArr.length === 2 && purposeArr.indexOf("navigation") !== -1) || purposeArr.length === 1 && purposeArr.indexOf("main") !== -1) ? false : true : false;
  panelHeadersControlVisible.purpose = purposeArr;
  panelHeadersControlVisible.deviceTypeToPanels = deviceType;
  panelHeadersControlVisible.headingTitle = props.headingTitle;
  panelHeadersControlVisible.mainPanelWidth = middleW;

  let leftNav = <PlacementContext.Provider
    value={{
      leftCloseBtn: deviceType === "phone" ? false : leftCloseBtn,
      leftOpenBtn: deviceType === "phone" ? true : leftOpenBtn,
      // width: `${leftWidth}px`,
      position: 'left',
      panelHeadersControlVisible,
      leftPanelHideable,
      leftPanelVisible,
      isResizing
    }}>{leftNavContent}</PlacementContext.Provider>
 // !props.guestUser && purposeArr && purposeArr.indexOf("navigation") !== -1 ? allParts.push(
 // <div key="part1"

 // id="leftpanel"
 // className="leftpanel"
 // style={{
 // width: `${leftWidth}px`,
 // marginLeft: `${leftOpenBtn ? `-${leftWidth}px` : '0px'} `
 // }} >
 // {leftNav}</div> ): null;

 //Resizer
// if (purpose && purpose.length > 1 && (props.children.length === 2 || props.children.length === 3)) {
// allParts.push(
// <div key="resizer1" id="first" className="resizer column-resizer" />

// );
// }

 //Props children[1]
 let middleNav
 // if (props.children[1] || (purposeArr && purposeArr.length<=2 && purposeArr.indexOf("main")!==-1)) {
 if (purposeArr && purposeArr.indexOf("main")!==-1) {
 // let middleNavContent = '';
 let middleNavObj = Array.isArray(props.children) ? props.children.filter(obj=>obj.props.purpose === "main" || obj.props.purpose === undefined)[0] : props.children;
 /*switch(purposeArr.length) {
 case 1: middleNavContent = props.children ;break;
 case 2: middleNavContent = purposeArr.indexOf("navigation") !== -1 ? props.children[1] : props.children[0];break;
 case 3: middleNavContent = props.children[1];break;
 }*/
 middleNav = <PlacementContext.Provider value={{ splitPanel: props.splitPanel, rightOpenBtn, leftOpenBtn, position: 'middle', panelHeadersControlVisible, leftPanelVisible, rightPanelVisible, isResizing, leftWidth: leftWidth, guestUser: props.guestUser }}> {middleNavObj}</PlacementContext.Provider>
 allParts.push(<div key="part2" id="middlepanel" className="middlepanel" style={{ width: `${middleWidth}px`, display: `${middleWidth === 0 ? "none" : "flex"} ` }} > {middleNav}</div>);
 }

 //Resizer2
 if (props.children.length >= 2) {
 allParts.push(
 <div key="resizer2" id="second" className="resizer column-resizer" />

 );
 }

 //Props children[2]
 let rightNav

 if(purposeArr && purposeArr.indexOf("support") !== -1) {
 // allParts.push(
 // <div key="resizer2" id="second" className="resizer column-resizer" />
 // );
 let rightNavContent = props.children.filter(obj=>obj.props.purpose === "support")[0];
 /*switch(purposeArr.length) {
 case 1: rightNavContent = props.children[0];break;
 case 2: rightNavContent = props.children[1];break;
 case 3: rightNavContent = props.children[2];break;
 }*/
 rightNav = <PlacementContext.Provider value={{ rightCloseBtn, position: 'right', panelHeadersControlVisible, rightPanelHideable, isResizing }}>{rightNavContent} </PlacementContext.Provider>
 allParts.push(<div key="part3" id="rightpanel" className="rightpanel" style={{ width: `${rightWidth}px`, marginRight: `${rightOpenBtn ? `-${rightWidth}px` : '0px'}` }}>{rightNav}</div>);
 }
 const footerClass = props.children.length > 1 ? 'footer-on' : 'footer-off';
 const phonebuttoncontainer = {
 display : 'flex',
 width: leftCloseBtn ? totalWidthNoLeft : '100%',
 bottom: '0.1px',
 position: 'fixed',
 zIndex:'5',
 textAlign: 'center',
 height:'30px',
 }
 if(!leftCloseBtn) {
 phonebuttoncontainer.left = "0px";
 }

 const phonebutton = {
 color: 'white',
 backgroundColor: 'black',
 width: leftCloseBtn ? phoneButtonsWidth/2 : '100%',
 height:'30px',
}

  //Show loading if profile if not loaded yet (loads each time)
  if (Object.keys(profile).length < 1) {
    return (<h1>Loading...</h1>)
  }
  return (
    <OverlayWrapper className={props.isOpen ? "on" : "off"}>
      <OverlayContent>
        <OverlayHeaderWrapper>
          <OverlayName>{"Test"}</OverlayName>
          <OverlayHeader>{"Test"}</OverlayHeader>
          <OverlayClose onClick={() => props.onClose()} name="closeOverlay">
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{
                fontSize: "21px",
                color: "white",
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
            ></FontAwesomeIcon>
          </OverlayClose>
        </OverlayHeaderWrapper>

        <OverlayContainer>
          <div style={{ display: "flex" }}>
            {/* {
        isLeftPanel && leftCloseBtn ?
          (
            <div
              style={{
                width: leftWidth + "px",
                minWidth: leftWidth + "px"
              }}
              // id="leftpanel"
              className="leftpanel"
            >
              {leftNav}
            </div>) : null
      } */}

            <div style={{ width: totalWidthNoLeft + "px" }}>
              <div>
                {/* {!props.hideHeader && <DoenetHeader
            profile={profile}
            cookies={jwt}
            isSignedIn={isSignedIn}
            toolName={props.toolName}
            headingTitle={props.headingTitle}
            headerRoleFromLayout={props.headerRoleFromLayout}
            headerChangesFromLayout={props.headerChangesFromLayout}
            guestUser={props.guestUser}
            onChange={showCollapseMenu} />} */}
              </div>
              <div>
                {deviceType === "phone" ? (
                  <div ref={container} style={{ width: "100%" }}>
                    <div className={footerClass}>
                      {
                        <div>
                          {" "}
                          {!leftCloseBtn && isLeftPanel ? (
                            <button
                              onClick={() => {
                                leftPanelVisible();
                              }}
                              className="middleLeftButton circle"
                            >
                              <FontAwesomeIcon
                                icon={faBars}
                                style={{
                                  display: "block",
                                  alignSelf: "center",
                                  fontSize: "16px",
                                }}
                              />
                            </button>
                          ) : (
                            isLeftPanel && (
                              <button
                                onClick={() => {
                                  leftPanelHideable();
                                }}
                                className="leftCloseButton circle"
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  style={{
                                    display: "block",
                                    alignSelf: "center",
                                    fontSize: "16px",
                                  }}
                                />
                              </button>
                            )
                          )}
                        </div>
                      }
                      {
                        <div
                          key="part2"
                          id="phonePanels"
                          className={
                            showHideMiddlePanel ? "middlepanel" : "rightpanel"
                          }
                        >
                          {showHideMiddlePanel ? middleNav : ""}
                          {showHideRightPanel ? rightNav : ""}
                        </div>
                      }
                    </div>
                  </div>
                ) : (
                  <Container ref={container} hideHeader={props.hideHeader}>
                    {allParts}
                  </Container>
                )}
              </div>
              {deviceType === "phone" && middleNav && rightNav && (
                <div style={phonebuttoncontainer}>
                  <>
                    {middleNav &&
                      purposeArr &&
                      purposeArr.length > 1 &&
                      purposeArr.indexOf("main") !== -1 &&
                      purposeArr.indexOf("support") !== -1 && (
                        <button
                          style={phonebutton}
                          onClick={() => setPhoneVisiblePanel("middle")}
                        >
                          {middleNav.props.children[1].props.panelName}
                        </button>
                      )}
                  </>
                  {rightNav &&
                    purposeArr &&
                    purposeArr.length > 1 &&
                    purposeArr.indexOf("support") !== -1 && (
                      <button
                        style={phonebutton}
                        onClick={() => setPhoneVisiblePanel("right")}
                      >
                        {rightNav.props.children[0].props.panelName}
                      </button>
                    )}
                </div>
              )}
            </div>
          </div>
        </OverlayContainer>
      </OverlayContent>
    </OverlayWrapper>
  );
}
