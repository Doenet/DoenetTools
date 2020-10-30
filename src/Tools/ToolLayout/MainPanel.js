import React ,{useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import doenetImage from '../../media/Doenet_Logo_cloud_only.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faShare , faBars} from '@fortawesome/free-solid-svg-icons';
import Switch from "../../imports/Switch";
import PanelHeaderControlOverlay from "./PanelHeaderControlOverlay";
import { useCookies } from 'react-cookie';
import axios from "axios";
import DoenetHeader from "../DoenetHeader";


const MainpanelDiv = styled.div`
width: 100%;
`;

export default function MainPanel(props) {
  const [showHideSupportPanel, setshowHideSupportPanel] = useState(false);
  const [showHideOverlay, setShowHideOverlay] = useState(false);
  const [activeHeaderPanelContent, setActiveHeaderPanelContent] = useState();
  // const [sliderVisible, setSliderVisible] = useState(false);
  // const [headerSectionCount, setHeaderSectionCount] = useState(1);
  const node = useRef();

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

  const onSwitchClick = () => {
    setshowHideSupportPanel(!showHideSupportPanel);

  }

  const showNavPanel = () => {
    props.hideNavPanel(false);
  }

  const showHideOverLayFunc =(obj) => {
    console.log(obj.props.children);
    setActiveHeaderPanelContent(obj.props.children);
    setShowHideOverlay(!showHideOverlay);
  }

  const overlayOnClose = () => {
    setShowHideOverlay(!showHideOverlay);
  }

  // useEffect(() => {
  //   document.addEventListener('click', handleClick, false);
  //   return () => {
  //       document.removeEventListener('click', handleClick, false);
  //   };
  // });
  console.log(props.responsiveControls, "props.responsiveControls in main panel");
  console.log(props.responsiveControlsFromTools, "props.responsiveControls in main panel from Tools");
  const handleClick = e => {
    console.log(node);
    console.log(e.target,"target");
    if (node.current.contains(e.target)) {
      setShowHideOverlay(!showHideOverlay)
    } else {
      setShowHideOverlay(false)
    }
  }

  const showCollapseMenu = (flag, count) => {
    // setSliderVisible(flag);
    // setHeaderSectionCount(count);
  }

  //Show loading if profile if not loaded yet (loads each time)
  if (Object.keys(profile).length < 1) {
    return (<h1>Loading...</h1>)
  }

  return (
    <div style={{ width: props.showHideNavPanel ? "calc(100% - 240px)" :  "calc(100% - 480px)" }}>
      {props.showHideNavPanel !== undefined && props.showHideNavPanel ? 
        <button  onClick={()=>{showNavPanel()}} className="middleLeftButton circle">
                <FontAwesomeIcon
                  icon={faBars}
                  style={{
                    display: "block",
                    alignSelf: "center",
                    fontSize: '16px'
                  }} 
                />
        </button> : ""
      }
      <PanelHeaderControlOverlay refEl={node} open={showHideOverlay} onClose={()=>{overlayOnClose()}} body={activeHeaderPanelContent}/>
      <div>
        <div style={{ display: "flex ", height: "50px", borderBottom: "1px solid black"}}>
          <div style={{width: '150px'}}>
            <div className="toolName">
              <img id="doenetLogo" src={doenetImage} height='40px' />
              {props.onUndo ? <button onClick={props.onUndo}>
              <FontAwesomeIcon icon={faReply} />
                </button> : ""}
              {props.onRedo ? <button onClick={props.onRedo}>
              <FontAwesomeIcon icon={faShare} />

              </button> : ""}

            </div>
          </div>
          <div style={{width: "100%"}}>
            <div style={{textAlign: "center"}}>{props.title}</div>
            <div style={{display:"flex"}}>
              {props.responsiveControlsFromTools ? <div style={{height: "25px", width:"100%"}}>{props.responsiveControlsFromTools} </div>: ""}
              <div style={{marginLeft: "auto"}}><Switch onChange={onSwitchClick}/></div>
            </div>
          </div>
          <div style={{display:"flex", width:"300px"}}>
            <div>
              <DoenetHeader
                profile={profile}
                cookies={jwt}
                isSignedIn={isSignedIn}
                showProfileOnly={true}
                headerRoleFromLayout={props.headerRoleFromLayout}
                headerChangesFromLayout={props.headerChangesFromLayout}
                guestUser={props.guestUser}
                onChange={showCollapseMenu} 
                />
            </div>
            <div style={{display: 'flex', width: "240px", justifyContent: "space-between", borderLeft: "1px solid black"}}>
              {props.headerMenuPanels && props.headerMenuPanels.map(hmpObj=> (
                  React.cloneElement(hmpObj, {buttonText:hmpObj.props.buttonText,buttonClick: ()=>{showHideOverLayFunc(hmpObj)}})
              ))}
            </div>
          </div>
        </div>
        <div style={{display: showHideSupportPanel ? 'flex' : 'block'}}>
          <div style={{width: showHideSupportPanel ? '50%' : '100%', height: '100vh'}}>
            {props.responsiveControls ? <div style={{height: "50px", borderBottom: "1px solid black"}}>{props.responsiveControls }</div> : "" }
            {props.children}
          </div>
          {showHideSupportPanel ? <div style={{borderLeft: '1px solid black',width: '50%', height: '100vh'}}>{props.supportPanelObj}</div> : ""}
        </div>
      </div>
    </div>
  )
}