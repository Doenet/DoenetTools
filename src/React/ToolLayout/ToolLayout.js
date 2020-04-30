import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PlacementContext from './PlacementContext';
import DoenetHeader from "../DoenetHeader";
import './toollayout.css';


//This component deals with resizing and resizers

const Container = styled.div`
  display: flex;
  position: fixed;
  height:calc(100%-60px);
  margin-top: 60px;
  overflow:hidden;
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
  let rightW;
  if (props.children && Array.isArray(props.children)) {
    if (props.leftPanelWidth) {
      leftW = props.leftPanelWidth
    } else {
      leftW = 200;
    }
  }
  if (props.rightPanelWidth) {
    rightW = props.rightPanelWidth
  } else {
    rightW = 300;
  }

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
    document.addEventListener("fullscreenchange", function () {
      console.log("fullscreenchange event fired!");
    });
    window.addEventListener("resize", windowResizeHandler);
    setLeftCloseBtn(true);
    setRightCloseBtn(true);

    if (deviceType === "computer") {
      window.addEventListener("resize", windowResizeHandler);
      window.addEventListener("mouseup", stopResize);
      window.addEventListener("touchend", stopResize);
      container && container.current && container.current.addEventListener("touchstart", startResize);
      container && container.current && container.current.addEventListener("touchmove", resizingResizer);
      container && container.current && container.current.addEventListener("mousedown", startResize);
      container && container.current && container.current.addEventListener("mousemove", resizingResizer);
      return () => {
        window.removeEventListener("resize", windowResizeHandler);
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
    console.log("window")
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
    setCurrentResizer(event.target.id);
    setIsResizing(true);
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


  const leftPanelHideable = () => {
    console.log("left close");
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

  let leftNavContent = props.children && Array.isArray(props.children) ? props.children[0] : props.children;
  let leftNav = 
    <PlacementContext.Provider value={{
      leftCloseBtn: leftCloseBtn,
      position: 'left',
      leftPanelHideable
    }}>
      {leftNavContent}
    </PlacementContext.Provider>


  allParts.push(

    <div key="part1"
      id="leftpanel"
      className="leftpanel"
      style={{ width: `${leftWidth}px`, display: `${leftWidth === 0 ? "none" : "flex"} ` }} >
      {leftNav}
    </div>
  );

  if (props.children.length === 2 || props.children.length === 3) {
    allParts.push(<div key="resizer1" id="first" className="resizerfirst"
    ></div>);
  }

  let middleNav
  if (props.children[1]) {
    middleNav = 
      <PlacementContext.Provider value={{ rightOpenBtn, leftOpenBtn, position: 'middle', leftPanelVisible, rightPanelVisible }}>
        {props.children[1]}
      </PlacementContext.Provider>

    allParts.push(
      <div key="part2"
        id="middlepanel"
        className="middlepanel"
        style={{ width: `${middleWidth}px`, display: `${middleWidth === 0 ? "none" : "flex"} ` }} >
        {middleNav}
      </div>
    );
  }

  if (props.children.length >= 3) {
    allParts.push(<div key="resizer2" id="second" className="resizersecond"></div>);
  }


  let rightNav
  if (props.children[2]) {
    rightNav = 
      <PlacementContext.Provider value={{ rightCloseBtn, position: 'right', rightPanelHideable }}>
        {props.children[2]}
      </PlacementContext.Provider>


    allParts.push(
      <div key="part3"
        id="rightpanel"
        className="rightpanel"
        style={{
          width: `${rightWidth}px`,
          display: `${rightWidth === 0 ? "none" : "flex"}`
        }}>
        {rightNav}
      </div>
    );
  }
  return (
    <>
      <DoenetHeader toolTitle={props.toolTitle} headingTitle={props.headingTitle} />

      {deviceType === "phone" ? <div ref={container}>

        <div>
          {(phoneVisiblePanel === "left" || allParts.length === 1) &&
            <div key="part1" id="leftpanel" style={{ position: "fixed", top: "120px" }} className="phone">{leftNav}</div>}
          {phoneVisiblePanel === "middle" &&
            <div key="part2" id="middlepanel" style={{ position: "fixed", top: "120px" }} className="phone">{middleNav} </div>}
          {phoneVisiblePanel === "right" && allParts.length > 2 &&
            <div key="part3" id="rightpanel" style={{ position: "fixed", top: "120px" }} className="phone"> {rightNav} </div>}
        </div>

        <div className="phonebuttoncontainer">
          {leftNav && middleNav && (
            <>
              <button className="phonebutton" onClick={() => setPhoneVisiblePanel("left")}>{leftNav.props.children.props.panelName}</button>
              <button className="phonebutton" onClick={() => setPhoneVisiblePanel("middle")}>{middleNav.props.children.props.panelName}</button>
            </>)}
          {rightNav && <button className="phonebutton" onClick={() => setPhoneVisiblePanel("right")}>{rightNav.props.children.props.panelName}</button>}
        </div>
      </div>
        :
        <Container ref={container}>{allParts}</Container>
      }
    </>
  );
}