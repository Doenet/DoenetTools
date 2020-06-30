import React, { useState, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import styled from "styled-components";
import ToolLayout from './ToolLayout/ToolLayout';
import ToolLayoutPanel from './ToolLayout/ToolLayoutPanel';
import "../accountsettings/profile.css";
import "../imports/doenet.css";
import Textinput from "../imports/Textinput";
import Switch from "../imports/Switch";
import { useTransition, animated } from "react-spring";
import { useCookies } from 'react-cookie';

/*
 * SECTION
 * Params
 */
const UPDATEQUEUETIME = 750; // in ms

/*
 * SECTION
 * Styled components
 */
// general styled components
let SpanAll = styled.div`
  grid-column: 1/-1;
`;

let WidthEnforcer = styled.div`
  // min-width: 1500px;
  margin: auto;
`;

// Styled components for DoenetProfile
let ProfileContainer = styled(WidthEnforcer)`
  padding: 3em;
  display: grid;
  grid-template-columns: 25em 1fr 1fr;
  grid-template-rows: 4em 5em 5em 11em;
  grid-column-gap: 10px;
  @media screen and (max-width: 1000px) {
    grid-template-rows: 2em 25em auto 5em;
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

let ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/profile_pictures/${props => props.pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 10em;
  height: 10em;
  color: rgba(0, 0, 0, 0);
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 2 / span 2;
  margin: auto;
  border-radius: 50%;
  user-select: none;
  &:hover, &:focus {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("/profile_pictures/${props => props.pic}.jpg");
    color: rgba(255, 255, 255, 1);
  }
  @media screen and (max-width: 1000px) {
    grid-column: 1 / -1;
  }
`;

let WideTextinput = styled(Textinput)`
  grid-column: 2 / -1;
  @media screen and (max-width: 1000px) {
    grid-column: 1 / -1;
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

let PageHeader = styled.h1`
  text-align: center;
  grid-row: 1 / 2;
  grid-column: 1 / -1;
`;

let SectionHeader = styled.h2`
  margin-top: 2em;
  margin-bottom: 2em;
`;


export default function DoenetProfile(props) {
  /*
   * SECTION
   * initialization: states (and the functions/code to change them) and initial data loading
   */
  const [modal, setModal] = useState("hidden");

  let changeModalVisibility = (e, vis) => {
    if (e.target == e.currentTarget) setModal(vis);
  };
  // const toolLayoutRef = useRef();

  const [myProfile, setCookieProfile] = useCookies('Profile');
  const [tracking, setTracking] = useCookies('TrackingConsent');
  const [jwt, setJwt] = useCookies('jwt');
  console.log("myProfile1", myProfile)

  if (!Object.keys(tracking).includes("TrackingConsent")) {
    setTracking("TrackingConsent", true);
  }

  if (!Object.keys(jwt).includes("JWT")) {
    //Not signed in
    return (
      <ToolLayout toolName="Account Settings" headerChangesFromLayout={myProfile.Profile}>
        <SpanAll>
          <SectionHeader>Tracking</SectionHeader>
          <StyledSwitch
            id="trackingconsent"
            onChange={e =>
              setTracking("TrackingConsent", e.target.checked)
            } // updates immediately
            checked={tracking.TrackingConsent}
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
      </ToolLayout>
    )

  }

  console.log('myprofile keys', Object.keys(myProfile.Profile));
  if (Object.keys(myProfile.Profile).length < 2) {
    //Fill in name and set profile pic

    return (<ToolLayout toolName="Account Settings" headerChangesFromLayout={myProfile.Profile} >
         <ToolLayoutPanel>
         <ProfileContainer id="content">
            <PageHeader>{myProfile.Profile.username}'s Profile</PageHeader>
            <ProfilePicture
              pic={myProfile.Profile.profilePicture}
              onClick={e => changeModalVisibility(e, "visible")}
              name="changeProfilePicture"
              id="changeProfilePicture"
            >
              CHANGE
        </ProfilePicture>
            <ProfilePicModal />

            <Textinput
              id="firstName"
              label="First Name"
              onChange={e => updateMyProfile("firstName", e.target.value)} 
            >
              {myProfile.Profile.firstName}
            </Textinput>
            <Textinput
              id="lastName"
              label="Last Name"
              onChange={e => updateMyProfile("lastName", e.target.value)} 
            >
              {myProfile.Profile.lastName}
            </Textinput>
          
            <WideTextinput
              id="bio"
              label="Bio"
              onChange={e => updateMyProfile("bio", e.target.value)}
              area={true}
              maxlength="512"
              rows="6"
              resize="none"
            >
              {myProfile.Profile.bio}
            </WideTextinput>
            </ProfileContainer>
         </ToolLayoutPanel>
      </ToolLayout>)
   
          


  }
          // function loadMyProfile() {
          //   axios
          //     .get(`/api/loadMyProfile.php?timestamp=${new Date().getTime()}`) // added timestamp to eliminate browser caching
          //     .then(resp => {
          //       console.log("profile")
          //       console.dir(resp.data);
          //       // setMyProfile(resp.data);
          //       setMyProfile({
          //         accessAllowed: "0",
          //         adminAccessAllowed: "0",
          //         bio: "",
          //         email: "",
          //         firstName: "",
          //         lastName: "",
          //         profilePicture: "anonymous",
          //         roleCommunityTA: "0",
          //         roleCourseDesigner: "0",
          //         roleInstructor: "0",
          //         roleLiveDataCommunity: "0",
          //         roleStudent: "1",
          //         roleWatchdog: "0",
          //         studentId: null,
          //         toolAccess: ["Chooser", "Documentation", "Profile"],
          //         trackingConsent: "1",
          //         username: "anonymous",
          //       });
          //     })
          //     .catch(err => console.error(err.response.toString()));
          // }

          // if (myProfile === undefined) {
          //   loadMyProfile();
          //   return <p>loading</p>;
          // }

          /*
           * SECTION
           * myProfile updater
           */
          let pendingUpdate = {
          field: undefined,
    val: undefined,
    doUpdate: undefined, // this is used to remove the update from beforeunload listener
    timeout: undefined // this contains the call to `doUpdate`
  };

  function updateMyProfile(field, value, immediate = false) {
    console.log("field",field)
    console.log("value",value);
    
    //       function doUpdate(f, v) {
    //         // reset the pending update, it is the job of caller to make sure that we can clobber the pending update.
    //         cancelUpdate();
    //         pendingUpdate = {
    //           field: undefined,
    //           val: undefined,
    //           doUpdate: undefined,
    //           timeout: undefined
    //         };

    //         axios
    //           .put(
    //             `/api/updateMyProfile.php?changeField=${f}&toValue=${
    //             typeof v === "boolean" ? Number(v) : v // we must change this to 1 or 0, else it will be sent as "true" or "false". the server wants "1" or "0"
    //             }`
    //           )
    //           .then(resp => {
    //             // console.log(`updated profile with ${f}: ${v}`);
    //             // console.dir(resp.data)
    //             setMyProfile(resp.data);
    //             // because the states of all the inputs are controlled by themselves (the value/children prop is only used to initialize the element, not for updates), this will not cause a malignant race condition. This is at the loss of recieving updates when the profile is changed externally.
    //           })
    //           .catch(err => console.error(err.response.toString()));
    //       }

    // function cancelUpdate() {
    //       clearTimeout(pendingUpdate.timeout);
    //   window.removeEventListener("beforeunload", pendingUpdate.doUpdate);
    // }

    // function queueUpdate(f, v) {
    //       cancelUpdate(); // just in case, but not originally necessary
    //   pendingUpdate.field = f;
    //   pendingUpdate.value = v;
    //   pendingUpdate.doUpdate = () => doUpdate(f, v);
    //   pendingUpdate.timeout = setTimeout(pendingUpdate.doUpdate, 750);
    //   window.addEventListener("beforeunload", pendingUpdate.doUpdate);
    // }

    // // if there is a currently queued update
    // if (pendingUpdate.timeout !== undefined) {
    //   // if the update is not on the same field
    //   if (pendingUpdate.field === field) {
    //       // the existing queued update is for the same field. we now have an updated value for that field (rendering the old one incorrect), so we cancel that update.
    //       cancelUpdate();
    //   } else {
    //       doUpdate(pendingUpdate.field, pendingUpdate.value); // do the existing update now, this also clears `pendingUpdate` and its timeout
    //   }
    // }

    // if (immediate) {
    //       doUpdate(field, value); // for things like profile picture (for immediate feedback), or a boolean that doesn't change often. this also clears `pendingUpdate` and its timeout
    // } else {
    //       queueUpdate(field, value); // set up this update for non-spammy updating
    // }
  }

  /*
   * SECTION
   * Profile picture chooser modal
   */
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
            setMyProfile(prev => prev = { ...prev, "profilePicture": value }); // use the previous state to create a state where profilePicture is value
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

  /*
   * SECTION
   * Return
   */

  console.log("myProfile", myProfile)

  let toolAccess = <p>{myProfile.Profile.toolAccess.join(", ")}</p>
  // console.log(myProfile.toolAccess.length);
  if (myProfile.Profile.toolAccess.length === 0) {
          toolAccess = <p>You have no access to tools.</p>
        }

  return (
        <>
          <ToolLayout toolName="Account Settings" headerChangesFromLayout={myProfile.Profile}
          // ref={toolLayoutRef}
          >
            <ToolLayoutPanel>
              test
</ToolLayoutPanel>
            <ToolLayoutPanel>
              <ProfileContainer id="content">
                <PageHeader>{myProfile.Profile.username}'s Profile</PageHeader>
                <ProfilePicture
                  pic={myProfile.Profile.profilePicture}
                  onClick={e => changeModalVisibility(e, "visible")}
                  name="changeProfilePicture"
                  id="changeProfilePicture"
                >
                  CHANGE
        </ProfilePicture>
                <ProfilePicModal />

                <Textinput
                  id="firstName"
                  label="First Name"
                  onChange={e => updateMyProfile("firstName", e.target.value)} 
                >
                  {myProfile.Profile.firstName}
                </Textinput>
                <Textinput
                  id="lastName"
                  label="Last Name"
                  onChange={e => updateMyProfile("lastName", e.target.value)} 
                >
                  {myProfile.Profile.lastName}
                </Textinput>
                <WideTextinput
                  id="email"
                  label="Email Address"
                  onChange={e => updateMyProfile("email", e.target.value)} 
                >
                  {myProfile.Profile.email}
                </WideTextinput>
                <WideTextinput
                  id="bio"
                  label="Bio"
                  onChange={e => updateMyProfile("bio", e.target.value)}
                  area={true}
                  maxlength="512"
                  rows="6"
                  resize="none"
                >
                  {myProfile.Profile.bio}
                </WideTextinput>

                <SpanAll>
                  <SectionHeader>Tracking</SectionHeader>
                  <StyledSwitch
                    id="trackingconsent"
                    onChange={e =>
                      setTracking("TrackingConsent", e.target.checked)
                    } // updates immediately
                    checked={tracking.TrackingConsent}
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

                <SpanAll>
                  <SectionHeader>Your Roles</SectionHeader>
                  <StyledSwitch
                    id="student"
                    onChange={e => {
                      e.preventDefault();
                      updateMyProfile("roleStudent", e.target.checked, true)
                    }
                    } // updates immediately
                    checked={Number(myProfile.Profile.roleStudent)}
                  >
                    Student
          </StyledSwitch>
                  <StyledSwitch
                    id="instructor"
                    onChange={e =>
                      updateMyProfile("roleInstructor", e.target.checked, true)
                    } // updates immediately
                    checked={Number(myProfile.Profile.roleInstructor)}
                  >
                    Instructor
          </StyledSwitch>
                  <StyledSwitch
                    id="course_designer"
                    onChange={
                      e => updateMyProfile("roleCourseDesigner", e.target.checked, true) // updates immediately
                    }
                    checked={Number(myProfile.Profile.roleCourseDesigner)}
                  >
                    Course Designer
          </StyledSwitch>
                  {/* <StyledSwitch
            id="watchdog"
            onChange={e =>
              updateMyProfile("roleWatchdog", e.target.checked, true)
            } // updates immediately
            checked={Number(myProfile.Profile.roleWatchdog)}
          >
            Watchdog
          </StyledSwitch>
          <StyledSwitch
            id="community_ta"
            onChange={e =>
              updateMyProfile("roleCommunityTA", e.target.checked, true)
            } // updates immediately
            checked={Number(myProfile.Profile.roleCommunityTA)}
          >
            Community TA
          </StyledSwitch>
          <StyledSwitch
            id="live_data_community"
            onChange={
              e =>
                updateMyProfile("roleLiveDataCommunity", e.target.checked, true) // updates immediately
            }
            checked={Number(myProfile.Profile.roleLiveDataCommunity)}
          >
            Live Data Community
          </StyledSwitch> */}
                  <h4>{"You have access to:"}</h4>
                  {toolAccess}
                </SpanAll>

                {/* <SectionHeader>Invites</SectionHeader> */}
              </ProfileContainer>
            </ToolLayoutPanel>
          </ToolLayout>

        </>
  );



}