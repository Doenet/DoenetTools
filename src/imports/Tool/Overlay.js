import React , {useState,useRef} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 
  faTimesCircle,faReply, faShare, faBars
} from "@fortawesome/free-solid-svg-icons";
import doenetImage from '../../media/Doenet_Logo_cloud_only.png';
import ResponsiveControlsWrapper from "./ResponsiveControlsWrapper";
import Switch from "../Switch";
import HeaderMenuPanelContent from "./HeaderMenuPanelContent";


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
  width: 100vw;
  height: 100vh;
`;
const OverlayHeaderWrapper = styled.div`
  display: flex;
  background-color: #288ae9;
  height: 50px;
`;
const OverlayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: scroll;
  background-color:white;
  font-color:black;
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
  // align-items: flex-end;
  border: none;
  transition: all 0.1s ease-in-out;
  width: 40px;
  margin:2px;
  padding:4px;
`;

//This component deals with resizing and resizers

// styled component for the toollayout container with no header
const Container = styled.div`
  display: flex;
  position: fixed;
  height: ${props => props.hideHeader ? "calc(100vh - 40px)" : "calc(100vh - 50px)"};
  overflow:hidden;
  z-index:0;
`;

export default function Overlay(props) {
  //console.log(props.responsiveControls, "props.responsiveControls in tool");
  const [panelDataIndex, setPanelDataIndex] = React.useState(-1);
  const [supportPanelObj, setSupportPanelObj] = React.useState({});
  const [navPanelObj, setNavPanelObj] = React.useState(null);
  const [showHideNavPanel, setShowHideNavPanel] = React.useState(false);
  const [headerCtrlGrpWidth, setHeaderCtrlGrpWidth] = useState(0);
  const [headerCtrlGroupEl, setHeaderCtrlGroupEl] = useState(null);
  const [activeHeaderPanelContent, setActiveHeaderPanelContent] = useState();
  const [showHideSupportPanel, setshowHideSupportPanel] = useState(false);


  const showHideMenuPanelContent = (index) => {
    setPanelDataIndex(index);
  }

  const hideNavPanel = (showHideNavPanelFlag) => {
    if (showHideNavPanelFlag !== undefined) {
      setShowHideNavPanel(showHideNavPanelFlag);
    }
  }

  const onSwitchClick = () => {
    setshowHideSupportPanel(!showHideSupportPanel);

  }

  const showHideOverLayFunc = (obj) => {
    console.log(obj, "Clciked object ");
    // setClickedButtonObj(obj);
    setActiveHeaderPanelContent(obj.props.children);
    setShowHideOverlay(!showHideOverlay);
  }

  console.log(">>>props", props.children);
  React.useEffect(() => {
    if (props.children && Array.isArray(props.children)) {
      props.children.map((obj, index) => {
        if (obj && obj.type && typeof (obj.type) === "function" && obj.type.name === "MenuPanel") {
          if (panelDataIndex === -1) {
            setPanelDataIndex(prevState => {
              //console.log(prevState);
              let oldIndex = prevState;
              if (oldIndex === -1) {
                return index;
              }
              return oldIndex;
            })
          }
        }
        if (obj && obj.type && typeof (obj.type) === "function" && obj.type.name === "SupportPanel") {
          //console.log(obj.props, "obj.props");
          setSupportPanelObj(React.cloneElement(obj, { responsiveControls: obj.props.responsiveControls }));
        }
        if (obj && obj.type && typeof (obj.type) === "function" && obj.type.name === "NavPanel") {
          setNavPanelObj(React.cloneElement(obj, { hideNavPanel: hideNavPanel }));
        }
      })
    }
  }, [])

  return (
    <>
    {/* <HeaderMenuPanelContent open={showHideOverlay} onClose={() => { overlayOnClose() }} body={activeHeaderPanelContent} /> */}

    <OverlayWrapper className={props.isOpen ? "on" : "off"}>
      <OverlayContent>
        <OverlayHeaderWrapper>

          <div style={{display:"flex", height:"50px",width:"100%"}}>
          <div style={{margin: '2px', padding: '4px' ,  width: '135px' }}>
            <div style={{ display:'flex'}}>
              <img id="doenetLogo" src={doenetImage} height='40px' />
              <div style={{display:'flex',padding:'4px'}}>
                {props.onUndo ? <button style={{ border: 'none',background:'none',height:"35px",fontSize:"20px"}} onClick={props.onUndo}>
                  <FontAwesomeIcon icon={faReply} />
                </button> : ""}
                {props.onRedo ? <button style={{ border: 'none',background:'none',height:"35px",fontSize:"20px" }} onClick={props.onRedo}>
                  <FontAwesomeIcon icon={faShare}/>

                </button> : ""}
              </div>


            </div>
          </div>
          <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center" ,height:'14px',margin:'2px' }}>{props.title}</div>
            <div style={{ display: "flex",padding:'4px', margin:'2px'}}>
              {props.responsiveControlsFromTools ? <div /*ref={setHeaderCtrlGroupRef}*/ 
              style={{ 
                //  border: "1px solid black",
                 display:"flex",
                  width: "100%",
                  //  resize: 'horizontal',
                    overflow: 'auto'
                   }}
              >
                <ResponsiveControlsWrapper mainPanelWidth={headerCtrlGrpWidth}>{props.responsiveControlsFromTools}</ResponsiveControlsWrapper>
                </div> : ""}
              <div style={{ marginLeft: "auto" }}><Switch onChange={onSwitchClick} /></div>
            </div>
          </div>
          <div style={{ display: "flex", width: "240px" }}>
          
            <div style={{ display: 'flex', width: "240px", justifyContent: "space-between", borderLeft: "1px solid black" }}>
              {props.headerMenuPanels && props.headerMenuPanels.map(hmpObj => (
                React.cloneElement(hmpObj, { buttonText: hmpObj.props.buttonText, buttonClick: () => { showHideOverLayFunc(hmpObj) } })
              ))}
            </div>
          </div>



          </div>
      
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
          <div style={{ display: "flex", height: "100vh",width:"100vw" }}>
            {navPanelObj ? !showHideNavPanel ? navPanelObj : "" : ""}
            {props.children && Array.isArray(props.children) && props.children.map(obj => {
              console.log("obj.type.name", obj.type.name);
              return (
                obj && obj.type && typeof (obj.type) === "function" && (
                  <>
                    {obj.type.name === "MainPanel" ?
                      React.cloneElement(obj, {fromOverlayNew: true,showHideOverlayFromOverlayNew: showHideSupportPanel,
                        responsiveControlsFromTools: props.responsiveControls, responsiveControls: obj.props.responsiveControls, hideNavPanel: hideNavPanel, showHideNavPanel: showHideNavPanel, onUndo: props.onUndo, onRedo: props.onRedo, title: props.title,
                        supportPanelObj: supportPanelObj, headerMenuPanels: props.headerMenuPanels
                      }) : ""}
                  </>
                ))
            })}
            {props.children && !Array.isArray(props.children) && React.cloneElement(props.children,{fromOverlayNew: true,responsiveControlsFromTools: props.responsiveControls, responsiveControls: props.children.props.responsiveControls, hideNavPanel: hideNavPanel, showHideNavPanel: showHideNavPanel, onUndo: props.onUndo, onRedo: props.onRedo, title: props.title,
                        supportPanelObj: supportPanelObj, headerMenuPanels: props.headerMenuPanels})}
           
          </div>
        </OverlayContainer>
      </OverlayContent>
    </OverlayWrapper>
    </>
  )

}