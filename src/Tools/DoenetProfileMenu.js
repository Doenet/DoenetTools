import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
axios.defaults.withCredentials = true;
import styled from "styled-components";
import MenuDropDown from "../imports/MenuDropDown";
import { useCookies } from "react-cookie";
import axios from "axios";

const Icon = styled.div`
  font-size: 19px;
  padding: 15px;
`;

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
  guestUser,
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

  //User profile logic
  const [profile, setProfile] = useState({});
  const [jwt] = useCookies("JWT_JS");

  let isSignedIn = false;
  if (Object.keys(jwt).includes("JWT_JS")) {
    isSignedIn = true;
  }

  useEffect(() => {
    //Fires each time you change the tool
    //Need to load profile from database each time
    const phpUrl = "/api/loadProfile.php";
    const data = {};
    const payload = {
      params: data,
    };
    axios
      .get(phpUrl, payload)
      .then((resp) => {
        if (resp.data.success === "1") {
          setProfile(resp.data.profile);
        }
      })
      .catch((error) => {
        // this.setState({ error: error }); currently does nothing
      });
  }, []);

  //should this be here??
  // if (Object.keys(profile).length < 1) {
  //   return (
  //     <ToolContainer $isoverlay={stackId > 0 ?? false}>
  //       <h1>Loading...</h1>
  //     </ToolContainer>
  //   );
  // }
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
