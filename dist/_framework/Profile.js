import React, {useContext} from "../_snowpack/pkg/react.js";
import {useRecoilCallback, atom} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {ProfileContext, toolViewAtom} from "./NewToolRoot.js";
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
margin-left: ${(props) => props.margin ? "75px" : "0px"};
margin-top: 4px
`;
export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default: {}
});
export default function Profile(props) {
  const profile = useContext(ProfileContext);
  const profilePicName = profile.profilePicture;
  const displaySettings = useRecoilCallback(({set, snapshot}) => async () => {
    const viewToolObj = await snapshot.getPromise(toolViewAtom);
    let newViewToolObj = {...viewToolObj};
    set(profileToolViewStashAtom, {toolViewAtom: newViewToolObj, href: location.href});
    const url = location.origin + location.pathname + "#/settings";
    window.history.pushState("", "", url);
    set(toolViewAtom, (was) => {
      let newObj = {...was};
      newObj.currentMenus = [];
      newObj.menusInitOpen = [];
      newObj.menusTitles = [];
      newObj.currentMainPanel = "AccountSettings";
      newObj.supportPanelOptions = [];
      newObj.supportPanelTitles = [];
      newObj.hasNoMenuPanel = true;
      newObj.headerControls = ["CloseProfileButton"];
      newObj.headerControlsPositions = ["Right"];
      return newObj;
    });
  });
  return /* @__PURE__ */ React.createElement(ProfilePicture, {
    pic: profilePicName,
    margin: props.margin,
    onClick: () => displaySettings()
  });
}
