import React from "react";
import { useNavigate } from "react-router";
import {
  useRecoilCallback,
  atom,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";

import styled from "styled-components";
import { pageToolViewAtom } from "./NewToolRoot";

const LogoButton = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/Doenet_Logo_cloud_only.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 50px 25px;
  transition: 300ms;
  background-color: var(--canvas);
  width: 50px;
  height: 25px;
  display: inline-block;
  justify-content: center;
  border-radius: 10px;
  align-items: center;
  border-style: none;
  // border-radius: 50%;
  // margin-top: 8px;
  // margin-left: 90px;
  cursor: ${(props) => (props.hasLink ? "pointer" : "default")};
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;

export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default: {},
});

export default function Logo({ hasLink = true }) {
  const navigate = useNavigate();

  // if (profile.state === "loading"){ return null;}
  //   if (profile.state === "hasError"){
  //     console.error(profile.contents)
  //     return null;}

  // let profilePicName = "cat";
  // return <ProfilePicture pic={profilePicName} onClick={()=>{location.href = '/accountSettings/'}}/>
  return (
    <LogoButton
      hasLink={hasLink}
      onClick={() => {
        if (hasLink) {
          navigate("/");
        }
      }}
    />
  );
}
