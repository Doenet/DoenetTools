import React from "react";
import {
  useRecoilCallback,
  atom,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";

import styled from "styled-components";
import { profileAtom, pageToolViewAtom } from "./NewToolRoot";

const ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/media/profile_pictures/${(props) => props.pic}.jpg");
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
  margin-left: ${(props) => (props.margin == false ? "75px" : "5px")};
  margin-top: 4px;
`;

export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default: {},
});

export default function Profile(props) {
  const profile = useRecoilValueLoadable(profileAtom);
  const profilePicName = profile.contents.profilePicture;
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile.contents);
    return null;
  }

  // let profilePicName = "cat";
  // return <ProfilePicture pic={profilePicName} onClick={()=>{location.href = '/accountSettings/'}}/>
  return (
    <ProfilePicture
      pic={profilePicName}
      margin={props.margin}
      onClick={() => setPageToolView({ page: "settings", tool: "", view: "" })}
    />
  );
}
