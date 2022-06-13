import React, { useState } from "react";
import {
    useRecoilCallback,
    useRecoilValueLoadable,
    useSetRecoilState,
  } from "recoil";
import styled from "styled-components";
import { pageToolViewAtom, profileAtom } from '../NewToolRoot';
import { a } from '@react-spring/web'
// import InfiniteSlider from '../temp/InfiniteSlider'
import "../doenet.css";
import Switch from "../Switch";
import axios from "axios";
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";

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
// const picture_items = PROFILE_PICTURES.map(picture => {
//   let path = `/media/profile_pictures/${picture}.jpg`
//   let url = `url("${path}")`
//   return {css: url}
// })



const boolToString = (bool) => {
  if(bool){
    return "1"
  }else{
    return "0"
  }
}

const translateArray = (arr, k) => arr.concat(arr).slice(k, k+arr.length)

export default function DoenetProfile(props) {

    const setProfile = useRecoilCallback(({set}) => (newProfile) => {
        const data = { ...newProfile }
        localStorage.setItem('Profile', JSON.stringify(data));
        set(profileAtom,  data)
        axios.post('/api/saveProfile.php', data)
         // .then((resp)=>{console.log(">>>save profile resp.data",resp.data)})
      }
    )
    const loadProfile = useRecoilValueLoadable(profileAtom);
    let profile = loadProfile.contents;

    // const [initPhoto, setInitPhoto] = useState(profile.profilePicture)
    const setPageToolView = useSetRecoilState(pageToolViewAtom);


    // let [editMode, setEditMode] = useState(false);
    // let [pic, setPic] = useState(0);

    if (profile.state === "loading"){ return null;}
    if (profile.state === "hasError"){ 
      console.error(profile)
      return null;}

    //console.log(">>> translate arr ", translateArray([1, 2, 3, 4, 5], 1))

    // const translatednames = translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(initPhoto))

    // if(initPhoto){
    //   translatednames = translateArray(PROFILE_PICTURES, PROFILE_PICTURES.indexOf(initPhoto))
    // }

    // const translateditems = translatednames.map(picture => `/media/profile_pictures_copy/${picture}.jpg`)

    if (profile.signedIn === '0') {
      return (<div style = {props.style}>
              <div
                style={{
                  ...props.style,
                  border: '1px solid var(--mainGray)',
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
                  <button style={{ background: 'var(--mainBlue)', borderRadius: '5px' }}>
                    <a
                      href="/#/signin"
                      style={{ color: 'var(--canvas)', textDecoration: 'none' }}
                    >
                      Sign in with this link
                    </a>
                  </button>
                </div>
              </div>
              </div>
      );
    }

    return (<div style = {props.style}>
       <p>Email Address: {profile.email}</p>

<Button value={"Sign out"} onClick={() =>{setPageToolView({page: 'signout', tool: '', view: ''})}}/>
<br/>
{/* <Switch
  id="trackingConsent"
  onChange={e => {
    let data = {...profile}
    data.trackingConsent = boolToString(e.target.checked)
    setProfile(data)
  }}
  checked={profile.trackingConsent}
>
</Switch>

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
</p> */}
</div>)
}