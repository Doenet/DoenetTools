import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
axios.defaults.withCredentials = true;
import styled from "styled-components";
import MenuDropDown from "../imports/MenuDropDown";

const ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/profile_pictures/${({ pic }) => pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width: 45px;
  height: 45px;
  display: inline;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
`;

const ProfilePictureLrg = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/profile_pictures/${({ pic }) => pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width: 100px;
  height: 100px;
  margin-top: 10px;
  display: block;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
`;

export default function DoenetMenuProfile({
  rights,
  profile,
  isSignedIn,
  guestUser,
  cookies,
  toolName,
  headingTitle,
  headerRolesFromLayout,
  headerChangesFromLayout,
  onChange,
  extraMenus,
}) {
  const [menuVisble, setMenuVisble] = useState(false);
  const [myRoles, setMyRoles] = useState({});
  const [profilePicture, setProfilePicture] = useState("");

  const profilePictureElement = (
    <ProfilePicture
      position={"left"}
      pic={profilePicture}
      name="changeProfilePicture"
      id="changeProfilePicture"
    />
  );

  const profileMenu = (
    <MenuDropDown
      position={"left"}
      menuBase={profilePictureElement}
      offset={-20}
      showThisMenuText={toolName}
      options={this.profileMenuMap}
    />
  );

  return <>{profileMenu}</>;
}
