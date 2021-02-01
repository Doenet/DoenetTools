import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DoenetProfile from "../../Tools/DoenetProfile";
import { useCookies } from "react-cookie";
import axios from "axios";

const HeaderPanelContainer = styled.div`
  grid-area: headerPanel;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  border-left: 1px solid black;
  border-bottom: 2px solid black;
  padding: 4px;
`;

export default function HeaderPanel({ children }) {
  const [profile, setProfile] = useState({});
  const [jwt, setjwt] = useCookies("JWT_JS");

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
        this.setState({ error: error });
      });
  }, []);

  if (Object.keys(profile).length < 1) {
    return <h1>Loading...</h1>;
  }

  return (
    <HeaderPanelContainer>
      {children}
      <DoenetProfile
        profile={profile}
        cookies={jwt}
        isSignedIn={isSignedIn}
        showProfileOnly={true}
        // TODO: this needs review
        // headerRoleFromLayout={props.headerRoleFromLayout}
        // headerChangesFromLayout={props.headerChangesFromLayout}
        // guestUser={props.guestUser}
        // onChange={showCollapseMenu}
      />
    </HeaderPanelContainer>
  );
}
