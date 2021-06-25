import React, { useContext } from 'react';
import { useRecoilCallback, atom } from 'recoil';

import styled from 'styled-components';
import { ProfileContext, toolViewAtom } from './NewToolRoot';

const ProfilePicture = styled.button`
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
  url('/media/profile_pictures/${(props) => props.pic}.jpg');
background-position: center;
background-repeat: no-repeat;
background-size: cover;
transition: 300ms;
// color: #333333;
width: 30px;
height: 30px;
display: inline-block;
// color: rgba(0, 0, 0, 0);
justify-content: center;
align-items: center;
border-radius: 50%;
border-style: none;
margin-left: ${(props) => props.margin ? '75px' : '0px'};
margin-top: 4px
`;

export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default:{},
})
 
export default function Profile(props){
  const profile = useContext(ProfileContext)
  const profilePicName = profile.profilePicture;
  const displaySettings = useRecoilCallback(({set,snapshot})=> async ()=>{
    const viewToolObj = await snapshot.getPromise(toolViewAtom)
    let newViewToolObj = {...viewToolObj}
 
    set(profileToolViewStashAtom,newViewToolObj);

    set(toolViewAtom,(was)=>{
      let newObj = {...was}
      newObj.curentMenuPanels = []
      newObj.menuPanelsInitOpen = []
      newObj.menuPanelsTitles = []
      newObj.currentMainPanel = "AccountSettings"
      newObj.supportPanelOptions = []
      newObj.supportPanelTitles = []
      newObj.hasNoMenuPanels = true
      newObj.headerControls = ["CloseProfileButton"]
      newObj.headerControlsPositions = ["Right"]
  
      return newObj;
    }) 
  })


  // let profilePicName = "cat";
// return <ProfilePicture pic={profilePicName} onClick={()=>{location.href = '/accountSettings/'}}/>
return <ProfilePicture pic={profilePicName} 
margin={props.margin} 
onClick={()=>displaySettings()}/>
}