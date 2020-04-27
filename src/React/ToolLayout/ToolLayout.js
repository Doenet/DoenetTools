import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DoenetHeader from "../DoenetHeader";
import './toollayout.css';

import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

//This component deals with resizing and resizers

const Container = styled.div`
  display: flex;
  position: fixed;
  height: 100vh;
  margin-top: 60px;
`;

const widthToDevice = () => {
  let w = document.documentElement.clientWidth;
  if (w >= 768) {
    return "computer";
  }
  return "phone";
};

export default function ToolLayout(props) {
  var w = window.innerWidth;
  let leftW;
  if(props.children && Array.isArray(props.children)) {
    leftW = 200;
  }
  const rightW = 300;
  const resizerW = 6;

  //Assume 3 if 1 child then we don't worry about middleW
  let middleW = w - leftW - rightW - resizerW - resizerW;
  if (props.children.length === 2) {
    middleW = w - leftW - resizerW;
  }

  const [leftWidth, setLeftWidth] = useState(leftW);
  const [rightWidth, setRightWidth] = useState(rightW);
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizer, setCurrentResizer] = useState("");
  const [firstPanelHidden, setFirstPanelHidden] = useState(false);
  const [leftCloseBtn, setLeftCloseBtn] = useState(true);
  const [rightCloseBtn, setRightCloseBtn] = useState(true);
  const [leftOpenBtn, setLeftOpenBtn] = useState(false);
  const [rightOpenBtn, setRightOpenBtn] = useState(false);
  const [phoneVisiblePanel, setPhoneVisiblePanel] = useState("middle");
  const [middleWidth, setMiddleWidth] = useState(middleW);
  const container = useRef();
  const [deviceType, setDeviceType] = useState(widthToDevice());

  useEffect(() => {
    document.addEventListener("fullscreenchange", function() {
      console.log("fullscreenchange event fired!");
    }); 
    window.addEventListener("resize", windowResizeHandler);
    setLeftCloseBtn(true);
    setRightCloseBtn(true);
   
    if (deviceType === "computer") {
      // window.addEventListener("resize", handleWindowResize);
      window.addEventListener("mouseup", stopResize);
      window.addEventListener("touchend", stopResize);
      container && container.current && container.current.addEventListener("touchstart", startResize);
      container && container.current && container.current.addEventListener("touchmove", resizingResizer);
      container && container.current && container.current.addEventListener("mousedown", startResize);
      container && container.current && container.current.addEventListener("mousemove", resizingResizer);
      return () => {
        // window.removeEventListener("resize", handleWindowResize);
        window.removeEventListener("touchend", stopResize);
        window.removeEventListener("mouseup", stopResize);
        container && container.current && container.current.removeEventListener("touchstart", startResize);
        container && container.current && container.current.removeEventListener("touchmove", resizingResizer);
        container && container.current && container.current.removeEventListener("mousedown", startResize);
        container && container.current && container.current.removeEventListener("mousemove", resizingResizer);
      };
    } else if (deviceType === "phone") {
        setLeftCloseBtn(false);
        setLeftOpenBtn(false);
        setRightCloseBtn(false);
        setRightOpenBtn(false);
    }
    return () => {
      window.removeEventListener("resize", windowResizeHandler);
      
    };
  });

  const windowResizeHandler = () => {
    let deviceWidth = widthToDevice();
    if (deviceType !== deviceWidth) {
      setDeviceType(deviceWidth);
    }
    let w = window.innerWidth;

   
   let middleW =
    w - leftWidth - rightWidth - resizerW - resizerW;
  let rightW = rightWidth;
  let leftW = leftWidth;
  if (props.children.length === 2) {
    middleW = w - leftW - resizerW;
  }
  setMiddleWidth(middleW);
  setRightWidth(rightW);
  setLeftWidth(leftW);
    
  
  };

 const startResize = event => {
    if (event.target.id === "first" || event.target.id === "second") {
      setCurrentResizer(event.target.id);
      setIsResizing(true);
    }
  };

  const stopResize = () => {
    setIsResizing(false);
    setCurrentResizer("");
  };

  const resizingResizer = e => {
    if (isResizing) {
      const w = window.innerWidth;
      let event = {};
      if (e && e.changedTouches && e.changedTouches.length >= 0) {
        event = e.changedTouches[0];
      } else {
        event = e;
      }
      if (currentResizer === "first") {
        let leftW = event.clientX - resizerW / 2;
        let rightW = rightWidth;
        if (leftW < 40) {
          leftW = 0;
          setLeftOpenBtn(true);
          event.target.style.cursor = "e-resize";
        } else if (leftW < 100) {
          leftW = 100;
          setLeftCloseBtn(true);
          setLeftOpenBtn(false);
          e.target.style.cursor = "col-resize";
        } else if (leftW >= 300) {
          leftW = 300;
          setLeftCloseBtn(true);
          setLeftOpenBtn(false);
          e.target.style.cursor = "w-resize";
        } else if (firstPanelHidden) {
          setFirstPanelHidden(false);
        }
        let middleW = w - leftW - rightWidth - resizerW - resizerW;
        if (middleW < 100) {
          middleW = 100;
          leftW = w - rightWidth - resizerW - resizerW - middleW;
        }
        if (props.children.length === 2) {
          middleW = w - leftW - resizerW;
        }
        setLeftWidth(leftW);
        setMiddleWidth(middleW);
        setRightWidth(rightW);
      } else if (currentResizer === "second") {
          let middleW = event.clientX - leftWidth - resizerW;
          let rightW = w - leftWidth - resizerW - middleW - resizerW;
          if (rightW < 40) {
            rightW = 0;
            setRightOpenBtn(true);
            middleW = w - leftWidth - resizerW - resizerW - rightW;
            e.target.style.cursor = "w-resize";
        } else if (rightW < 100) {
            rightW = 100;
            setRightOpenBtn(false);
            middleW = w - leftWidth - resizerW - resizerW - rightW;
            e.target.style.cursor = "col-resize";
        } else if (middleW < 100) {
            middleW = 100;
            rightW = w - leftWidth - resizerW - resizerW - middleW;
        } else {
            e.target.style.cursor = "col-resize";
        }
        setRightWidth(rightW);
        setMiddleWidth(middleW);
      }
    }
  };

  let allParts = [];

  // let Left = styled.div`
  //   width: ${deviceType !== "phone" && leftWidth}px;
  //   min-height: 1vh;
  //   position: relative;
  //   display: ${leftWidth === 0 ? "none" : "flex"};
  //   flex-direction: column;
  // `;

  // let Middle = styled.div`
  //   width: ${deviceType !== "phone" && middleWidth}px;
  //   min-height: 1vh;
  //   position: relative;
  //   display: ${middleWidth === 0 ? "none" : "flex"};
  //   flex-direction: column;
  // `;

  // let Right = styled.div`
  //   width: ${deviceType !== "phone" && rightWidth}px;
  //   display: ${rightWidth === 0 ? "none" : "flex"};
  //   flex-direction: column;
  //   min-height: 1vh;
  //   position: relative;
  // `;

  // let ResizerFirst = styled.div`
  //   width: 5px;
  //   border-right: 1px solid black;
  //   position: relative;
  //   cursor: col-resize;
  //   flex-shrink: 0;
  // `;

  // let ResizerSecond = styled.div`
  //   width: 5px;
  //   border-left: 1px solid black;
  //   position: relative;
  //   cursor: col-resize;
  //   flex-shrink: 0;
  // `;

  const leftPanelHideable = () => {
    setLeftCloseBtn(false);
    setLeftOpenBtn(true);
    let leftW = leftWidth;
    if (leftW > 0) {
      leftW = 0;
    }
    let rightW = rightWidth;
    let middleW = w - resizerW - resizerW - leftW - rightWidth;
    if (props.children.length === 2) {
      middleW = w - leftW - resizerW;
    }
    setLeftWidth(leftW);
    setMiddleWidth(middleW);
    setRightWidth(rightW);
  };

  const rightPanelHideable = () => {
    setRightCloseBtn(false);
    setRightOpenBtn(true);
    let rightW = rightWidth;
    if (rightW > 0) {
      rightW = 0;
    }
    let leftW = leftWidth;
    let middleW = w - resizerW - resizerW - rightW - leftWidth;
    setLeftWidth(leftW);
    setMiddleWidth(middleW);
    setRightWidth(rightW);
  };

  const leftPanelVisible = () => {
    setLeftCloseBtn(true);
    setLeftOpenBtn(false);
    let leftW = leftWidth;
    if (leftW === 0) {
      leftW = 100;
    }
    let rightW = rightWidth;
    let middleW = w - resizerW - resizerW - leftW - rightWidth;
    if (props.children.length === 2) {
      middleW = w - leftW - resizerW;
    }
    setLeftWidth(leftW);
    setMiddleWidth(middleW);
    setRightWidth(rightW);
  };

  const rightPanelVisible = () => {
    setRightCloseBtn(true);
    setRightOpenBtn(false);
    let rightW = rightWidth;
    if (rightW === 0) {
      rightW = 100;
    }
    let leftW = leftWidth;
    let middleW = w - resizerW - resizerW - rightW - leftWidth;
    if (props.children.length === 2) {
      middleW = w - leftW - resizerW;
    }
    setLeftWidth(leftW);
    setMiddleWidth(middleW);
    setRightWidth(rightW);
  };

  const renderMiddleMenu = () => {
    return (
      <>
        { leftOpenBtn && (
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{
              position: "absolute",
              border: "1px solid black",
              background: "white",
              display: "block",
              alignSelf: "center"
            }}
            onClick={leftPanelVisible}
          />
        )}
        { rightOpenBtn && (
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{
              position: "absolute",
              border: "1px solid black",
              background: "white",
              right: "1px",
              alignSelf: "center"
            }}
            onClick={rightPanelVisible}
          />
        )}
      </>
    );
  };

  const renderLeftMenu = () => {
    return (
      <>
        { leftCloseBtn && (
          <FontAwesomeIcon
            style={{
              position: "absolute",
              right: "0px",
              border: "1px solid black",
              background: "white",
              alignSelf: "center"
            }}
            icon={faChevronLeft}
            onClick={leftPanelHideable}
          />
        )}
      </>
    );
  };

  let renderRightMenu = () => {
    return (
      <>
        { rightCloseBtn && (
          <FontAwesomeIcon
            style={{
              position: "absolute",
              border: "1px solid black",
              background: "white",
              alignSelf: "center"
            }}
            icon={faChevronRight}
            onClick={rightPanelHideable}
          />
        )}
      </>
    );
  };

  let leftNavContent = props.children && Array.isArray(props.children) ? props.children[0] : props.children;
  let leftNav = React.cloneElement(leftNavContent, {
    leftMenu: props.children[0] && renderLeftMenu()
  });

  allParts.push(
    // <Left key="part1" id="leftpanel">
    //   {leftNav} 
    // </Left>
    <div key="part1" id="leftpanel" className="leftpanel" >
      {leftNav}
    </div>
  );

  if (props.children.length === 2 || props.children.length === 3) {
    allParts.push(<div key="resizer1" id="first" className="resizerfirst"></div>);
  }

  let middleNav 
  if(props.children[1]) {
      middleNav = React.cloneElement(props.children[1], {
      middleMenu: renderMiddleMenu()
    });
    allParts.push(
      // <Middle key="part2" id="middlepanel">
      //   {middleNav}
      // </Middle>
      <div key="part2" id="middlepanel" className="middlepanel">
        {middleNav}
      </div>
    );
  }

  if (props.children.length >= 3) {
    allParts.push( <div key="resizer2" id="second" className="resizersecond"></div>);
  }

  let rightNav
  if (props.children[2]) {
      rightNav = React.cloneElement(props.children[2], {
      rightMenu: renderRightMenu()
    });
    allParts.push(
      // <Right key="part3" id="rightpanel">
      //   {rightNav}
      // </Right>
      <div key="part3" id="rightpanel" className="rightpanel">
        {rightNav}
      </div>
    );
    }

  const PhoneContainer = styled.div`
    display : flex;
    width: 100%;
    bottom: 0.1px;
    height: 40px;
    position: fixed;
    left: 0px;
    text-align: center;
  `;
  
  const PhoneButton = styled.button`
    color: white;
    background-color: black;
    width: 100%;

  `;

  return (
      <>
        <DoenetHeader toolTitle={props.toolTitle} headingTitle={props.documentHeading} />

        { deviceType === "phone" ? <div ref={ container }>
        <div style={{ position: "fixed", top: "120px" }}>
          <div style={{ height: "95vh", display: "flex" }}>
          { (phoneVisiblePanel === "left" || allParts.length === 1) && <Left key="part1" id="leftpanel"> { leftNav } </Left> }
          { phoneVisiblePanel === "middle" && <Middle key="part2" id="middlepanel">{ middleNav } </Middle> }
          { phoneVisiblePanel === "right" && allParts.length > 2 &&  <Right key="part3" id="rightpanel">{ rightNav } </Right> }
          </div>
          <PhoneContainer>
          { leftNav && middleNav && (
            <>
              <PhoneButton onClick={() => setPhoneVisiblePanel("left")}>
                { leftNav.props.panelName }
              </PhoneButton>
                <PhoneButton onClick={() => setPhoneVisiblePanel("middle")}>
                     { middleNav.props.panelName }
                </PhoneButton>
                </>
              )
            }
              { rightNav && (
                <PhoneButton onClick={() => setPhoneVisiblePanel("right")}>
                   { rightNav.props.panelName }
                </PhoneButton>
              )}
            </PhoneContainer>
          )}
        </div>
      </div>
      :
      <Container ref={ container }>{ allParts }</Container>
    }
    </>
  );
}