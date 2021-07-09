import React, { useState, useContext } from "react";
import {
    useRecoilCallback,
  } from "recoil";
import styled from "styled-components";
import Tool from '../_framework/Tool';
import { profileAtom, ProfileContext } from '../_framework/ToolRoot';
import { a } from '@react-spring/web'
import InfiniteSlider from '../_framework/temp/InfiniteSlider'
import "../_framework/doenet.css";
import Textinput from "../_framework/Textinput";
import Switch from "../_framework/Switch";
// import GlobalFont from '../../_utils/GlobalFont';
import axios from "axios";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let SectionHeader = styled.h2`
  margin-top: 2em;
  margin-bottom: 2em;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
`

const Image = styled(a.div)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
`


const PROFILE_PICTURES = ['bird', 'cat', 'dog', 'emu', 'fox', 'horse', 'penguin', 'quokka', 'squirrel', 'swan', 'tiger', 'turtle', 'anonymous'];
const picture_items = PROFILE_PICTURES.map(picture => {
  let path = `/media/profile_pictures/${picture}.jpg`
  let url = `url("${path}")`
  return {css: url}
})



const boolToString = (bool) => {
  if(bool){
    return "1"
  }else{
    return "0"
  }
}

const translateArray = (arr, k) => arr.concat(arr).slice(k, k+arr.length)

export default function DoenetProfile(props) {

    const setProfile = useRecoilCallback(
      ({set}) => async (newProfile) => {
        const url = '/api/saveProfile.php'
        const data = {
          ...newProfile
        }
        localStorage.setItem('Profile', JSON.stringify(data));
        set(profileAtom,  data)
        await axios.post(url, data);
        //console.log(">>> ", newProfile);
      }
    )

    const profile = useContext(ProfileContext);
    const [initPhoto, setInitPhoto] = useState(profile.profilePicture)

    //console.log(">>> init photo", initPhoto)

    let [editMode, setEditMode] = useState(false);
    let [pic, setPic] = useState(0);

    //console.log(">>> translate arr ", translateArray([1, 2, 3, 4, 5], 1))

    const translatednames = translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(initPhoto))

    // if(initPhoto){
    //   translatednames = translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(initPhoto))
    // }

    const translateditems = translatednames.map(picture => `/media/profile_pictures_copy/${picture}.jpg`)

    if (profile.signedIn === '0') {
      return (
        <>
          {/* <GlobalFont /> */}
          <Tool>
            <headerPanel title="Account Settings"></headerPanel>
  
            <mainPanel>
              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '20px',
                  margin: 'auto',
                  marginTop: '10%',
                  padding: '10px',
                  width: '50%',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <h2>You are not signed in</h2>
                  <h2>Account Settings currently requires sign in for use</h2>
                  <button style={{ background: '#1a5a99', borderRadius: '5px' }}>
                    <a
                      href="/signin"
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      Sign in with this link
                    </a>
                  </button>
                </div>
              </div>
            </mainPanel>
          </Tool>
        </>
      );
    }

    return (
        <Tool>
            <headerPanel title="Account Settings" />
            
            <mainPanel>
              <div style = {{margin: "auto", width: "70%"}}>
                <div style = {{margin: "auto", width: "fit-content", marginTop: "20px"}}>
                  <div style = {{width: "150px", height: "150px", margin: "auto"}}>
                  {/* {editMode ?
                  <>
                  <div style = {{float: "right"}}><FontAwesomeIcon onClick = {e => {
                    let data = {...profile}
                    data.profilePicture = pic
                    setProfile(data)
                    setEditMode(false)
                  }} style = {{color: "#444", position: "absolute", zIndex: "2", textAlign: "right"}} icon={faTimes}/></div>
                  <InfiniteSlider items={translateArray(picture_items, PROFILE_PICTURES.indexOf(profile.profilePicture))} showButtons={editMode} showCounter={false} callBack = {(i) => {
                    setPic(translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(profile.profilePicture))[i-1])
                  }}>
                    {({ css }, i) => {
                      // console.log(">>> pic index ", i);
                      
                      // setPicIndex(i)
                      return (
                        <Content>
                          <Image style={{ backgroundImage: css, borderRadius: '50%' }} />
                        </Content>
                      )
                    }}
                  </InfiniteSlider></> : 
                    <Content onClick = {e => setEditMode(true)}>
                      <Image style={{ backgroundImage: `url('/media/profile_pictures/${profile.profilePicture}.jpg')`, borderRadius: '50%' }} />
                    </Content>
                  } */}
                  <InfiniteSlider fileNames = {translateditems} showButtons={true} showCounter={false} callBack = {(i) => {
                    //console.log(translatednames[i])
                    let data = {...profile}
                    data.profilePicture = translatednames[i]
                    setProfile(data)
                    //setPic(translatednames[i])
                  }}>
                    {({ css }, i) => {
                      // console.log(">>> pic index ", i);
                      
                      // setPicIndex(i)
                      return (
                        <Content>
                          <Image style={{ backgroundImage: css, borderRadius: '50%' }} />
                        </Content>
                      )
                    }}
                  </InfiniteSlider>
                  </div>
                  <Textinput
                      style={{ width: '300px' }}
                      id="screen name"
                      label="Screen Name"
                      value = {profile.screenName}
                      onChange = {e => {}}
                      onBlur = {e => {
                        let data = {...profile}
                        data.screenName = e.target.value
                        setProfile(data)
                      }}
                      onKeyDown = {e => {
                        if(e.key === 'Enter'){
                          let data = {...profile}
                          data.screenName = e.target.value
                          setProfile(data)
                        }
                      }}
                  ></Textinput>
                  <Textinput
                    style={{ width: '300px' }}
                    id="firstName"
                    label="First Name"
                    value = {profile.firstName}
                    onChange = {e => {}}
                    onBlur={e => {
                      let data = {...profile}
                      data.firstName = e.target.value
                      setProfile(data)
                    }}
                    onKeyDown = {e => {
                      if(e.key === 'Enter'){
                        let data = {...profile}
                        data.firstName = e.target.value
                        setProfile(data)
                      }
                    }}
                  >
                    {/* {profile.firstName} */}
                  </Textinput>
                  <Textinput
                    style={{ width: '300px' }}
                    id="lastName"
                    label="Last Name"
                    value = {profile.lastName}
                    onChange = {e => {}}
                    onBlur={e => {
                      let data = {...profile}
                      data.lastName = e.target.value
                      setProfile(data)
                    }}
                    onKeyDown = {e => {
                      if(e.key === 'Enter'){
                        let data = {...profile}
                        data.lastName = e.target.value
                        setProfile(data)
                      }
                    }}
                  >
                    {/* {profile.lastName} */}
                  </Textinput>
                </div>

                <p>Email Address: {profile.email}</p>

                <Switch
                  id="trackingConsent"
                  onChange={e => {
                    let data = {...profile}
                    data.trackingConsent = boolToString(e.target.checked)
                    setProfile(data)
                  }}
                  checked={profile.trackingConsent}
                >
                </Switch>
                <p>I consent to the use of tracking technologies.</p>

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
                <Switch
                  id="student"
                  onChange={e => {
                    let data = {...profile}
                    data.roleStudent= boolToString(e.target.checked)
                    setProfile(data)
                  }} // updates immediately
                  checked={profile.roleStudent}
                >
                </Switch>
                <p>Student</p>
                <Switch
                  id="instructor"
                  onChange={e => {
                    let data = {...profile}
                    data.roleInstructor= boolToString(e.target.checked)
                    setProfile(data)
                  }} // updates immediately
                  checked={profile.roleInstructor}
                >
                </Switch>
                <p>Instructor</p>
                <Switch
                  id="course_designer"
                  onChange={e => {
                    let data = {...profile}
                    data.roleCourseDesigner= boolToString(e.target.checked)
                    setProfile(data)
                  }}
                  checked={profile.roleCourseDesigner}
                >
                </Switch>
                <p>Course Designer</p>
              </div>
          </mainPanel> 
          
        </Tool>
    )
}



// console.log(picture_items);

// const getProfileQuerry = atom({
//   key: "getProfileQuerry",
//   default: selector({
//       key: "getProfileQuerry/Default",
//       get: async () => {
//           try{
//               const { data } = await axios.get('/api/loadProfile.php')
//               return data.profile
//           }catch(error){
//               console.log("Error loading user profile", error.message);                
//               return {}
//           }
//       }
//   })
// })

// const PictureSelector = (props) => {
//   //let [selectedPic, setSelectedPic] = useState();

//   var list = props.list.map((item, i) => (
//     <ListItem key={i}>
//       <PictureBox
//         value={item}
//         pic={item}
//         onClick={(e) => {
//           props.callBack(e.target.value);
//         }}
//       />
//     </ListItem>
//   ));

//   return (
//     <DropDown onBlur = {props.onblur}>
//       <ListContainer>{list}</ListContainer>
//     </DropDown>
//   );
// }


// let ProfilePicture = styled.button`
//   background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
//     url("/media/profile_pictures/${props => props.pic}.jpg");
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   width: 5em;
//   height: 5em;
//   color: rgba(0, 0, 0, 0);
//   font-size: 2em;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-left: 100px;
//   border-radius: 50%;
//   border-style:none;
//   user-select: none;
//   &:hover, &:focus {
//     background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
//       url("/media/profile_pictures/${props => props.pic}.jpg");
//     color: rgba(255, 255, 255, 1);
//   }
// `;

// const PictureBox = styled.button`
//   width: 40px;
//   height: 40px;
//   background-image: url("/media/profile_pictures/${(props) => props.pic}.jpg");
//   background-size: contain;
//   margin: 3px;
//   border: none;
//   border-radius: 3px;
// `;

// const DropDown = styled.div`
//   text-align: right;
//   width: 150px;
//   z-index: 2;
//   position: absolute;
//   margin-right: 100px;
// `;

// const ListContainer = styled.ul`
//   /* max-width: 80px; */
//   padding: 4px;
//   list-style-type: none;
//   /* border: 1px solid #505050; */
//   border-radius: 3px;
//   box-shadow: 3px 3px 7px #888888;
//   background: #ffffff;
//   margin: 0 auto;
//   text-align: left;
// `;

// const ListItem = styled.li`
//   display: inline-block;
//   vertical-align: top;
// `;

// import React, { useState, useRef } from "react";
// import {
//     atom,
//     RecoilRoot,
//     useSetRecoilState,
//     useRecoilState,
//     useRecoilValue,
//     selector,
//     atomFamily,
//     selectorFamily,
//     useRecoilValueLoadable,
//     useRecoilStateLoadable,
//   } from "recoil";
// import styled from "styled-components";
// import Tool from '../_framework/Tool';
// import { useToolControlHelper } from '../_framework/ToolRoot';


// import "../_framework/doenet.css";
// import Textinput from "../_framework/Textinput";
// import Switch from "../_framework/Switch";
// import Cookies from 'js-cookie';
// import axios from "axios";


// /*
//  * SECTION
//  * Styled components
//  */
// // general styled components
// let SpanAll = styled.div`
//   grid-column: 1/-1;
//   color:white;
// `;

// let WidthEnforcer = styled.div`
//   // min-width: 1500px;
//   margin: auto;
// `;


// let ProfilePicture = styled.button`
//   background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
//     url("/media/profile_pictures/${props => props.pic}.jpg");
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   width: 5em;
//   height: 5em;
//   color: rgba(0, 0, 0, 0);
//   font-size: 2em;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-left: 100px;
//   border-radius: 50%;
//   border-style:none;
//   user-select: none;
//   &:hover, &:focus {
//     background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
//       url("/media/profile_pictures/${props => props.pic}.jpg");
//     color: rgba(255, 255, 255, 1);
//   }
// `;

// // styled components for ProfilePicModal
// // dims the page
// let Modal = styled.div`
//   visibility: hidden;
//   position: fixed;
//   z-index: 1;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   overflow: auto;
//   background-color: rgba(0, 0, 0, 0.3);
// `;

// let ModalContent = styled.div`
//   overflow: auto;
//   background-color: white;
//   width: 400px;
//   margin: 15% auto;
//   border-radius: 0.25em;
//   padding: 1em;
// `;

// let ModalPicsContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-wrap: wrap;
//   max-height: 30em;
//   overflow: scroll;
//   margin-top: 1em;
// `;

// let ModalHeader = styled.h3`
//   display: inline;
//   padding-top: 1em;
//   margin: 1em;
// `;

// let ModalClose = styled.button`
//   float: right;
//   border: none;
//   font-weight: bold;
//   font-size: 1.7em;
//   padding: 0;
//   position: relative;
//   top: -0.25em;
// `;

// let ModalPic = styled.button`
//   width: 10em;
//   height: 10em;
//   flex-shrink: 0;
//   flex-grow: 0;
//   margin: 1em;
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: rgba(0, 0, 0, 0);
//   background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
//     url("${props => props.pic}");
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   border-style: none;
//   user-select: none;
//   &:hover {
//     background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
//       url("${props => props.pic}");
//     color: rgba(255, 255, 255, 1);
//   }
// `;

// let StyledSwitch = styled(Switch)`
//   margin-top: 1em;
// `;

// let SectionHeader = styled.h2`
//   margin-top: 2em;
//   margin-bottom: 2em;
// `;


// export default function DoenetProfile(props) {

//   const [modal, setModal] = useState("hidden");
//   const [saveTimerRunning, setSaveTimerRunning] = useState(false);


//   let changeModalVisibility = (e, vis) => {
//     if (e.target == e.currentTarget) setModal(vis);
//   };

//   const jwt = Cookies.get();
  
//   const trackingCookie = Cookies.get('TrackingConsent');
//   const deviceNameCookie = Cookies.get('Device');
//   const stayCookie = Cookies.get('Stay');

//   console.log(">>>", trackingCookie, deviceNameCookie, stayCookie);

//   // const [trackingCookie, setTrackingCookie] = useCookies('TrackingConsent');
//   // const [jwt, setJwt] = useCookies('jwt');
//   // const [deviceNameCookie, setDeviceNameCookie] = useCookies('Device');
//   // const [stayCookie, setStayCookie] = useCookies('Stay');

//   const [profile, setProfile] = useState({});
//   const [tracking, setTracking] = useState(trackingCookie);
//   if (tracking === undefined){
//     let cookieSettingsObj = { path: "/" };
//     if (stayCookie > 0){cookieSettingsObj.maxAge = stayCookie }
//     Cookies.set('TrackingConsent', true, cookieSettingsObj);
//     setTracking(true);
//   }

//   if (!Object.keys(jwt).includes("JWT_JS")) {
//     //Not signed in
//     return (
//       <Tool>
//         <mainPanel>
//         <SpanAll>
//           <SectionHeader>Tracking</SectionHeader>
//           <StyledSwitch
//             id="trackingconsent"
//             onChange={e => {
//               Cookies.set('TrackingConsent', e.target.checked, { path: "/" })
//               setTracking(e.target.checked);
//             }
              
//             } // updates immediately
//             checked={tracking}
//           >
//             I consent to the use of tracking technologies.
//           </StyledSwitch>
//           <p>
//             "I consent to the tracking of my progress and my activity on
//             educational websites which participate in Doenet; my data will be
//             used to provide my instructor with my grades on course assignments,
//             and anonymous data may be provided to content authors to improve the
//             educational effectiveness."
//             <br />
//             <br />
//             <em>
//               Revoking your consent may impact your ability to recieve credit
//               for coursework.
//             </em>
//           </p>
//         </SpanAll>
//         </mainPanel>
        
//       </Tool>
//     )

//   }

//   //Load profile from database if only email and nine code
//   if (Object.keys(profile).length < 1) {

//     //Need to load profile from database 
//     //Ask Server for data which matches email address
//     const phpUrl = '/api/loadProfile.php';
//     const data = {}
//     const payload = {
//       params: data
//     }
//     axios.get(phpUrl, payload)
//       .then(resp => {
//         if (resp.data.success === "1") {
//           setProfile(resp.data.profile);
//         }
//       })
//       .catch(error => { this.setState({ error: error }) });
//     return (<h1>Loading...</h1>)
//   }

//   function saveProfileToDB(immediate = false) {
//       const url = '/api/saveProfile.php'
//       const data = {
//         ...profile
//       }
//       axios.post(url, data)
//         .then(function (resp) {
//           console.log("Save Profile To DB -- resp.data", resp.data);
//         })
//         .catch(function (error) {
//           console.warn(error)
//           // this.setState({ error: error });

//         })

    
//   }

//   function updateMyProfile(field, value, immediate = false) {
//       profile[field] = value;
//     profile["toolAccess"] = defineToolAccess(profile);
//     if (immediate) {
//       saveProfileToDB();
//     }
//     if (!saveTimerRunning) {
//       setSaveTimerRunning(true);
//       setTimeout(function () { 
//         setSaveTimerRunning(false);
//         saveProfileToDB() 
//       }, 1000)
//     }
//   }

//   function defineToolAccess(profile){
//     let roleToToolAccess = {
//       "roleStudent": ["Chooser", "Course", "Dashboard"],
//       "roleInstructor": ["Chooser", "Course", "Documentation", "Gradebook", "Dashboard"],
//       "roleCourseDesigner": ["Chooser", "Course", "Documentation", "Dashboard"],
//     }
//     let toolAccess = [];

//         for (let [key,val] of Object.entries(profile)){
        
//         if (roleToToolAccess[key] && (Number(val) + 0) === 1){
//         toolAccess.push(...roleToToolAccess[key]);
//       }
//     }
//     let set = new Set(toolAccess)

//     return [...set];
//   }

//   function ProfilePicModal(props) {
//     let pics = [
//       "bird",
//       "cat",
//       "dog",
//       "emu",
//       "fox",
//       "horse",
//       "penguin",
//       "squirrel",
//       "swan",
//       "turtle",
//       "quokka"
//     ];

//     let picElements = pics.map((value, index) => {
//       return (
//         <ModalPic
//           key={`modalpic-${value}`}
//           pic={`/media/profile_pictures/${value}.jpg`}
//           alt={`${value} profile picture`}
//           onClick={e => {
//             updateMyProfile("profilePicture", value, true); // updates immediately
//             // setMyProfile(prev => prev = { ...prev, "profilePicture": value }); // use the previous state to create a state where profilePicture is value
//             changeModalVisibility(e, "hidden");
//           }}
//         >
//           SELECT
//         </ModalPic>
//       );
//     });

//     return (
//       <Modal
//         style={{ visibility: modal }}
//         onClick={e => changeModalVisibility(e, "hidden")}
//       >
//         <ModalContent>
//           <ModalHeader>Choose Your Profile Picture</ModalHeader>
//           <ModalClose onClick={e => changeModalVisibility(e, "hidden")} name="closeProfilePictureModal">
//             &times;
//           </ModalClose>
//           <ModalPicsContainer>{picElements}</ModalPicsContainer>
//         </ModalContent>
//       </Modal>
//     );
//   }

//   let toolAccess = <p>{profile.toolAccess.join(", ")}</p>
//   if (profile.toolAccess.length === 0) {
//     toolAccess = <p>You have no access to tools.</p>
//   }

//   let textfieldwidth = "300px";

//   return (
//     <Tool>
//       <headerPanel title="Account Settings" />
//       {/* <navPanel>
//         <div>
//           <button onClick={() => { alert('scroll to Public') }}>Public</button><br />
//           <button onClick={() => { alert('scroll to Private') }}>Private</button><br />
//           <button onClick={() => { alert('scroll to Tracking') }}>Tracking</button><br />
//           <button onClick={() => { alert('scroll to Roles') }}>Roles</button>
//         </div>
//       </navPanel> */}
//       <mainPanel>
//         <div style={{ padding: "0px 10px 1300px 10px" }}>
//           <SectionHeader>Public</SectionHeader>

//           <ProfilePicture
//             pic={profile.profilePicture}
//             onClick={e => changeModalVisibility(e, "visible")}
//             name="changeProfilePicture"
//             id="changeProfilePicture"
//           >
//             CHANGE
//           </ProfilePicture>
//           <ProfilePicModal />
//           <Textinput
//             style={{ width: textfieldwidth }}
//             id="screen name"
//             label="Screen Name"
//             onChange={e => updateMyProfile("screenName", e.target.value)}
//           >
//             {profile.screenName}
//           </Textinput>
//           Device Name: {deviceNameCookie}
//           <SectionHeader>Private</SectionHeader>

//           <Textinput
//             style={{ width: textfieldwidth }}
//             id="firstName"
//             label="First Name"
//             onChange={e => updateMyProfile("firstName", e.target.value)}
//           >
//             {profile.firstName}
//           </Textinput>
//           <Textinput
//             style={{ width: textfieldwidth }}
//             id="lastName"
//             label="Last Name"
//             onChange={e => updateMyProfile("lastName", e.target.value)}
//           >
//             {profile.lastName}
//           </Textinput>

//       Email Address: {profile.email}



//           <SectionHeader>Tracking</SectionHeader>
//           <StyledSwitch
//             id="trackingConsent"
//             onChange={e => {
//               let cookieSettingsObj = { path: "/" };
//               if (stayCookie > 0){cookieSettingsObj.maxAge = stayCookie }
//               Cookies.set('TrackingConsent', e.target.checked, cookieSettingsObj);
//               setTracking(e.target.checked);
//               updateMyProfile("trackingConsent", e.target.checked + 0,true)
//             }} // updates immediately
//             checked={tracking}
//           >
//             I consent to the use of tracking technologies.
//           </StyledSwitch>
//           <p>
//             "I consent to the tracking of my progress and my activity on
//             educational websites which participate in Doenet; my data will be
//             used to provide my instructor with my grades on course assignments,
//             and anonymous data may be provided to content authors to improve the
//             educational effectiveness."
//             <br />
//             <br />
//             <em>
//               Revoking your consent may impact your ability to recieve credit
//               for coursework.
//             </em>
//           </p>



//           <SectionHeader>Your Roles</SectionHeader>
//           <StyledSwitch
//             id="student"
//             onChange={e => {
//               e.preventDefault(); //why is this here?
//               updateMyProfile("roleStudent", e.target.checked, true)
//             }
//             } // updates immediately
//             checked={Number(profile.roleStudent)}
//           >
//             Student
//           </StyledSwitch>
//           <StyledSwitch
//             id="instructor"
//             onChange={e =>
//               updateMyProfile("roleInstructor", e.target.checked, true)
//             } // updates immediately
//             checked={Number(profile.roleInstructor)}
//           >
//             Instructor
//           </StyledSwitch>
//           <StyledSwitch
//             id="course_designer"
//             onChange={
//               e => updateMyProfile("roleCourseDesigner", e.target.checked, true) // updates immediately
//             }
//             checked={Number(profile.roleCourseDesigner)}
//           >
//             Course Designer
//           </StyledSwitch>
//           {/* <StyledSwitch
//     id="watchdog"
//     onChange={e =>
//       updateMyProfile("roleWatchdog", e.target.checked, true)
//     } // updates immediately
//     checked={Number(profile.roleWatchdog)}
//   >
//     Watchdog
//   </StyledSwitch>
//   <StyledSwitch
//     id="community_ta"
//     onChange={e =>
//       updateMyProfile("roleCommunityTA", e.target.checked, true)
//     } // updates immediately
//     checked={Number(profile.roleCommunityTA)}
//   >
//     Community TA
//   </StyledSwitch>
//   <StyledSwitch
//     id="live_data_community"
//     onChange={
//       e =>
//         updateMyProfile("roleLiveDataCommunity", e.target.checked, true) // updates immediately
//     }
//     checked={Number(profile.roleLiveDataCommunity)}
//   >
//     Live Data Community
//   </StyledSwitch> */}
//           <h4>{"You have access to:"}</h4>
//           {toolAccess}


//           {/* <SectionHeader>Invites</SectionHeader> */}
//         </div>
//       </mainPanel>
//     </Tool>
//   );



// }