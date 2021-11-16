import React from "../_snowpack/pkg/react.js";
import {useRecoilCallback, atom, useRecoilValueLoadable, useSetRecoilState} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {profileAtom, pageToolViewAtom} from "./NewToolRoot.js";
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
margin-left: ${(props) => props.margin == false ? "75px" : "5px"};
margin-top: 4px
`;
export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default: {}
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
  return /* @__PURE__ */ React.createElement(ProfilePicture, {
    pic: profilePicName,
    margin: props.margin,
    onClick: () => setPageToolView({page: "settings", tool: "", view: ""})
  });
}
