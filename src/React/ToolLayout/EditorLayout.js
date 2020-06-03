import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PlacementContext from './PlacementContext';
import DoenetHeader from "../DoenetHeader";
import './toollayout.css';
import "../../imports/doenet.css";

//This component deals with resizing and resizers

// styled component for the toollayout container with no header
const Container = styled.div`
  display: flex;
  position: fixed;
  height:calc(100vh - 50px);
  overflow:hidden;
  z-index:0;
`;

const widthToDevice = () => {
  let w = document.documentElement.clientWidth;
  if (w >= 768) {
    return "computer";
  }
  return "phone";
};

export default function EditorLayout(props) {
  var w = window.innerWidth;
  let rightW = 500;
  
  if (props.rightPanelWidth) {
    rightW = parseInt(props.rightPanelWidth, 10) > 500 ? 500 : props.rightPanelWidth;
  } 

  let leftW = w - rightW;

  const resizerW = 5;


  //Assume 2 panels
  
  const [leftWidth, setLeftWidth] = useState(leftW);
  const [rightWidth, setRightWidth] = useState(rightW);
  const [isResizing, setIsResizing] = useState(false);
  const [rightCloseBtn, setRightCloseBtn] = useState(!props.rightPanelClose);
  const [rightOpenBtn, setRightOpenBtn] = useState(!!props.rightPanelClose);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [headerSectionCount, setHeaderSectionCount] = useState(1);
  const [phoneVisiblePanel, setPhoneVisiblePanel] = useState("middle");
  const container = useRef();
  const resizerRef = useRef();
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
    let leftW =
      w - (!!rightCloseBtn ? rightWidth : 0) - resizerW;
      setLeftWidth(leftW)
  };

  window.addEventListener("resize", windowResizeHandler);


  const startResize = (event) => {
    setIsResizing(true);
    
  };

  const stopResize = () => {
    setIsResizing(false);
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
      
        let leftW = event.clientX - resizerW / 2;
        let rightW = w - leftW - resizerW;
        if (rightW < 40) {
          rightW = 0;
          setRightOpenBtn(true);
          leftW = w - resizerW;
          resizerRef.current.className = 'resizer right-resizer';
        } else if (rightW < 100) {
          rightW = 100;
          setRightOpenBtn(false);
          leftW = w - rightW - resizerW;
          resizerRef.current.className = 'resizer column-resizer';
        } else {
          resizerRef.current.className = 'resizer column-resizer';
        }
        setRightWidth(rightW);
        setLeftWidth(leftW);
      
    }
  };

  let allParts = [];


  const rightPanelHideable = () => {
    setRightCloseBtn(false);
    setRightOpenBtn(true);
    let leftW = w - resizerW - (!!rightCloseBtn ? rightWidth : 0);
    setLeftWidth(leftW);
  };

  const rightPanelVisible = () => {
    setRightCloseBtn(true);
    setRightOpenBtn(false);
    let leftW = w - resizerW - (!!rightCloseBtn ? rightWidth : 0);
    setLeftWidth(leftW);
  };

  const showCollapseMenu = (flag, count) => {
    setSliderVisible(flag);
    setHeaderSectionCount(count);
  }

  //Props children[0]
  let leftContent = props.children && Array.isArray(props.children) ? props.children[0] : props.children;
  let panelHeadersControlVisible = {
    sliderVisible: false,
    hideMenu: false,
    hideCollapse: false,
    showFooter: false,
    hideFooter: false,
    headerSectionCount
  };

  panelHeadersControlVisible.hideMenu = !Array.isArray(props.children) && !leftContent.props.panelHeaderControls;
  panelHeadersControlVisible.showFooter = deviceType === "phone" && !!Array.isArray(props.children) && props.children.length > 1;
  panelHeadersControlVisible.hideFooter = deviceType === "phone" && !Array.isArray(props.children);
  panelHeadersControlVisible.sliderVisible = deviceType === "phone" && sliderVisible;
  panelHeadersControlVisible.hideCollapse = !Array.isArray(props.children);

  let leftSide = <PlacementContext.Provider value={{ width: `${leftWidth}px`, position: 'middle', panelHeadersControlVisible, isResizing }}>{leftContent}</PlacementContext.Provider>
  allParts.push(<div key="part1" id="middlepanel" className="middlepanel" style={{ width: `${leftWidth}px`, marginLeft: '0px'}} >{leftSide}</div>);

  //Resizer
    allParts.push(
      <div ref={resizerRef} key="resizer" id="resizer" className="resizer column-resizer">
        <div className="horizontal-seperator" />
        <div className="vertical-seperator" />
      </div>
    );

  //Props children[1]
  let rightSide
  if (props.children[1]) {
    rightSide = <PlacementContext.Provider value={{ rightOpenBtn, position: 'right', panelHeadersControlVisible, rightPanelVisible, isResizing, leftWidth: leftWidth }}> {props.children[1]}</PlacementContext.Provider>
    allParts.push(<div key="part2" id="rightpanel" className="rightpanel" style={{ width: `${rightWidth}px`, display: `${rightWidth === 0 ? "none" : "flex"} ` }} >  {rightSide}</div>);
  }

 

  const footerClass = props.children.length > 1 ? 'footer-on' : 'footer-off';
  return (
    <>
      <DoenetHeader guestUser={true} toolName={props.toolName} headingTitle={props.headingTitle}  headerChangesFromLayout={props.headerChangesFromLayout} onChange={showCollapseMenu} />
      {deviceType === "phone" ? <div ref={container}>
        <div className={footerClass}>
          {(phoneVisiblePanel === "left" || allParts.length === 1) &&
            <div key="part1" id="leftpanel" >{leftSide}</div>}
          {phoneVisiblePanel === "middle" &&
            <div key="part2" id="middlepanel" >{rightSide} </div>}
        
        </div>

        {props.children.length > 1 && <div className="phonebuttoncontainer" >
          {leftSide && rightSide && leftSide.props.children.props && rightSide.props.children[1].props && (
            <>
              <button className="phonebutton"
                onClick={() => setPhoneVisiblePanel("left")}>{leftSide.props.children.props.panelName}</button>
              <button className="phonebutton"
                onClick={() => setPhoneVisiblePanel("right")}>{rightSide.props.children[1].props.panelName}</button>
            </>)}
          {rightSide && rightSide.props.children[0].props &&
            <button className="phonebutton"
              onClick={() => setPhoneVisiblePanel("left")}>{leftSide.props.children[0].props.panelName}</button>}
        </div>}
      </div>
        :
        <Container ref={container}>{allParts}</Container>
      }

    </>
  );
}

