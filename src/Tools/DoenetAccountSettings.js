import React, { useState, useRef } from "react";
import styled from "styled-components";
import ToolLayout from './ToolLayout/ToolLayout';
import ToolLayoutPanel from './ToolLayout/ToolLayoutPanel';
import "../imports/doenet.css";
import Textinput from "../imports/Textinput";
import Switch from "../imports/Switch";
import { useCookies } from 'react-cookie';
import axios from "axios";


/*
 * SECTION
 * Styled components
 */
// general styled components
let SpanAll = styled.div`
  grid-column: 1/-1;
  color:white;
`;

let WidthEnforcer = styled.div`
  // min-width: 1500px;
  margin: auto;
`;


let ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/profile_pictures/${props => props.pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 5em;
  height: 5em;
  color: rgba(0, 0, 0, 0);
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 100px;
  border-radius: 50%;
  border-style:none;
  user-select: none;
  &:hover, &:focus {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("/profile_pictures/${props => props.pic}.jpg");
    color: rgba(255, 255, 255, 1);
  }
`;

// styled components for ProfilePicModal
// dims the page
let Modal = styled.div`
  visibility: hidden;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.3);
`;

let ModalContent = styled.div`
  overflow: auto;
  background-color: white;
  width: 400px;
  margin: 15% auto;
  border-radius: 0.25em;
  padding: 1em;
`;

let ModalPicsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-height: 30em;
  overflow: scroll;
  margin-top: 1em;
`;

let ModalHeader = styled.h3`
  display: inline;
  padding-top: 1em;
  margin: 1em;
`;

let ModalClose = styled.button`
  float: right;
  border: none;
  font-weight: bold;
  font-size: 1.7em;
  padding: 0;
  position: relative;
  top: -0.25em;
`;

let ModalPic = styled.button`
  width: 10em;
  height: 10em;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 1em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0);
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("${props => props.pic}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-style: none;
  user-select: none;
  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("${props => props.pic}");
    color: rgba(255, 255, 255, 1);
  }
`;

let StyledSwitch = styled(Switch)`
  margin-top: 1em;
`;

let SectionHeader = styled.h2`
  margin-top: 2em;
  margin-bottom: 2em;
`;


export default function DoenetProfile(props) {

  const [modal, setModal] = useState("hidden");
  const [saveTimerRunning, setSaveTimerRunning] = useState(false);


  let changeModalVisibility = (e, vis) => {
    if (e.target == e.currentTarget) setModal(vis);
  };

  const [trackingCookie, setTrackingCookie] = useCookies('TrackingConsent');
  const [jwt, setJwt] = useCookies('jwt');
  const [deviceNameCookie, setDeviceNameCookie] = useCookies('Device');
  const [stayCookie, setStayCookie] = useCookies('Stay');

  const [profile, setProfile] = useState({});
  const [tracking, setTracking] = useState(trackingCookie.TrackingConsent);
  if (tracking === undefined){
    let cookieSettingsObj = { path: "/" };
    if (stayCookie.Stay > 0){cookieSettingsObj.maxAge = stayCookie.Stay }
    setTrackingCookie("TrackingConsent", true, cookieSettingsObj);
    setTracking(true);
  }

  if (!Object.keys(jwt).includes("JWT_JS")) {
    //Not signed in
    return (
      <ToolLayout toolName="Account Settings" headerChangesFromLayout={profile}>
        <ToolLayoutPanel >
        <SpanAll>
          <SectionHeader>Tracking</SectionHeader>
          <StyledSwitch
            id="trackingconsent"
            onChange={e => {
              setTrackingCookie("TrackingConsent", e.target.checked, { path: "/" })
              setTracking(e.target.checked);
            }
              
            } // updates immediately
            checked={tracking}
          >
            I consent to the use of tracking technologies.
          </StyledSwitch>
          <p>
            "I consent to the tracking of my progress and my activity on
            educational websites which participate in Doenet; my data will be
            used to provide my instructor with my grades on course assignments,
            and anonymous data may be provided to content authors to improve the
            educational effectiveness."
            <br />
            <br />
            <em>
              Revoking your consent may impact your ability to recieve credit
              for coursework.
            </em>
          </p>
        </SpanAll>
        </ToolLayoutPanel>
        
      </ToolLayout>
    )

  }

  //Load profile from database if only email and nine code
  if (Object.keys(profile).length < 1) {

    //Need to load profile from database 
    //Ask Server for data which matches email address
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
    return (<h1>Loading...</h1>)
  }

  function saveProfileToDB(immediate = false) {
      const url = '/api/saveProfile.php'
      const data = {
        ...profile
      }
      axios.post(url, data)
        .then(function (resp) {
          console.log("Save Profile To DB -- resp.data", resp.data);
        })
        .catch(function (error) {
          console.warn(error)
          // this.setState({ error: error });

        })

    
  }

  function updateMyProfile(field, value, immediate = false) {
      profile[field] = value;
    profile["toolAccess"] = defineToolAccess(profile);
    if (immediate) {
      saveProfileToDB();
    }
    if (!saveTimerRunning) {
      setSaveTimerRunning(true);
      setTimeout(function () { 
        setSaveTimerRunning(false);
        saveProfileToDB() 
      }, 1000)
    }
  }

  function defineToolAccess(profile){
    let roleToToolAccess = {
      "roleStudent": ["Chooser", "Course", "Dashboard"],
      "roleInstructor": ["Chooser", "Course", "Documentation", "Gradebook", "Dashboard"],
      "roleCourseDesigner": ["Chooser", "Course", "Documentation", "Dashboard"],
    }
    let toolAccess = [];

        for (let [key,val] of Object.entries(profile)){
        
        if (roleToToolAccess[key] && (Number(val) + 0) === 1){
        toolAccess.push(...roleToToolAccess[key]);
      }
    }
    let set = new Set(toolAccess)

    return [...set];
  }

  function ProfilePicModal(props) {
    let pics = [
      "bird",
      "cat",
      "dog",
      "emu",
      "fox",
      "horse",
      "penguin",
      "squirrel",
      "swan",
      "turtle",
      "quokka"
    ];

    let picElements = pics.map((value, index) => {
      return (
        <ModalPic
          key={`modalpic-${value}`}
          pic={`/profile_pictures/${value}.jpg`}
          alt={`${value} profile picture`}
          onClick={e => {
            updateMyProfile("profilePicture", value, true); // updates immediately
            // setMyProfile(prev => prev = { ...prev, "profilePicture": value }); // use the previous state to create a state where profilePicture is value
            changeModalVisibility(e, "hidden");
          }}
        >
          SELECT
        </ModalPic>
      );
    });

    return (
      <Modal
        style={{ visibility: modal }}
        onClick={e => changeModalVisibility(e, "hidden")}
      >
        <ModalContent>
          <ModalHeader>Choose Your Profile Picture</ModalHeader>
          <ModalClose onClick={e => changeModalVisibility(e, "hidden")} name="closeProfilePictureModal">
            &times;
          </ModalClose>
          <ModalPicsContainer>{picElements}</ModalPicsContainer>
        </ModalContent>
      </Modal>
    );
  }

  let toolAccess = <p>{profile.toolAccess.join(", ")}</p>
  if (profile.toolAccess.length === 0) {
    toolAccess = <p>You have no access to tools.</p>
  }

  let textfieldwidth = "300px";

  return (
    <ToolLayout toolName="Account Settings" headerChangesFromLayout={profile}
    // ref={toolLayoutRef}
    >
      <ToolLayoutPanel>
        <div>
          <button onClick={() => { alert('scroll to Public') }}>Public</button><br />
          <button onClick={() => { alert('scroll to Private') }}>Private</button><br />
          <button onClick={() => { alert('scroll to Tracking') }}>Tracking</button><br />
          <button onClick={() => { alert('scroll to Roles') }}>Roles</button>
        </div>

      </ToolLayoutPanel>
      <ToolLayoutPanel>
        <div style={{ padding: "0px 10px 1300px 10px" }}>
          <SectionHeader>Public</SectionHeader>

          <ProfilePicture
            pic={profile.profilePicture}
            onClick={e => changeModalVisibility(e, "visible")}
            name="changeProfilePicture"
            id="changeProfilePicture"
          >
            CHANGE
</ProfilePicture>
          <ProfilePicModal />
          <Textinput
            style={{ width: textfieldwidth }}
            id="screen name"
            label="Screen Name"
            onChange={e => updateMyProfile("screenName", e.target.value)}
          >
            {profile.screenName}
          </Textinput>
          Device Name: {deviceNameCookie.Device}
          <SectionHeader>Private</SectionHeader>

          <Textinput
            style={{ width: textfieldwidth }}
            id="firstName"
            label="First Name"
            onChange={e => updateMyProfile("firstName", e.target.value)}
          >
            {profile.firstName}
          </Textinput>
          <Textinput
            style={{ width: textfieldwidth }}
            id="lastName"
            label="Last Name"
            onChange={e => updateMyProfile("lastName", e.target.value)}
          >
            {profile.lastName}
          </Textinput>

      Email Address: {profile.email}



          <SectionHeader>Tracking</SectionHeader>
          <StyledSwitch
            id="trackingConsent"
            onChange={e => {
              let cookieSettingsObj = { path: "/" };
              if (stayCookie.Stay > 0){cookieSettingsObj.maxAge = stayCookie.Stay }
              setTrackingCookie("TrackingConsent", e.target.checked, cookieSettingsObj);
              setTracking(e.target.checked);
              updateMyProfile("trackingConsent", e.target.checked + 0,true)
            }} // updates immediately
            checked={tracking}
          >
            I consent to the use of tracking technologies.
  </StyledSwitch>
          <p>
            "I consent to the tracking of my progress and my activity on
            educational websites which participate in Doenet; my data will be
            used to provide my instructor with my grades on course assignments,
            and anonymous data may be provided to content authors to improve the
            educational effectiveness."
    <br />
            <br />
            <em>
              Revoking your consent may impact your ability to recieve credit
              for coursework.
    </em>
          </p>



          <SectionHeader>Your Roles</SectionHeader>
          <StyledSwitch
            id="student"
            onChange={e => {
              e.preventDefault();
              updateMyProfile("roleStudent", e.target.checked, true)
            }
            } // updates immediately
            checked={Number(profile.roleStudent)}
          >
            Student
  </StyledSwitch>
          <StyledSwitch
            id="instructor"
            onChange={e =>
              updateMyProfile("roleInstructor", e.target.checked, true)
            } // updates immediately
            checked={Number(profile.roleInstructor)}
          >
            Instructor
  </StyledSwitch>
          <StyledSwitch
            id="course_designer"
            onChange={
              e => updateMyProfile("roleCourseDesigner", e.target.checked, true) // updates immediately
            }
            checked={Number(profile.roleCourseDesigner)}
          >
            Course Designer
  </StyledSwitch>
          {/* <StyledSwitch
    id="watchdog"
    onChange={e =>
      updateMyProfile("roleWatchdog", e.target.checked, true)
    } // updates immediately
    checked={Number(profile.roleWatchdog)}
  >
    Watchdog
  </StyledSwitch>
  <StyledSwitch
    id="community_ta"
    onChange={e =>
      updateMyProfile("roleCommunityTA", e.target.checked, true)
    } // updates immediately
    checked={Number(profile.roleCommunityTA)}
  >
    Community TA
  </StyledSwitch>
  <StyledSwitch
    id="live_data_community"
    onChange={
      e =>
        updateMyProfile("roleLiveDataCommunity", e.target.checked, true) // updates immediately
    }
    checked={Number(profile.roleLiveDataCommunity)}
  >
    Live Data Community
  </StyledSwitch> */}
          <h4>{"You have access to:"}</h4>
          {toolAccess}


          {/* <SectionHeader>Invites</SectionHeader> */}
        </div>
      </ToolLayoutPanel>
    </ToolLayout>
  );



}