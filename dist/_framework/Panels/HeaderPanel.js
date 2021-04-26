import React, {useContext} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {useToolControlHelper, useStackId, ProfileContext} from "../ToolRoot.js";
import UserProfile from "../temp/UserProfile.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faTimes} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
const Wrapper = styled.div`
  grid-area: headerPanel;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  padding: 4px;
  background-color: hsl(0, 0%, 99%);
`;
const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  width: 100%;
`;
const ExitOverlayButton = styled.button`
  width: 45px;
  height: 45px;
  font-size: 16px;
  color: #ffffff;
  background-color: #1a5a99;
  border: 1px solid #ffffff;
  border-radius: 50%;
  /* border-style: none; */
  cursor: pointer;
`;
export default function HeaderPanel({title, children}) {
  const {close} = useToolControlHelper();
  const stackId = useStackId();
  const profile = useContext(ProfileContext);
  let userProfile = /* @__PURE__ */ React.createElement("p", null, "Loading");
  if (Object.keys(profile).length > 0) {
    userProfile = /* @__PURE__ */ React.createElement(UserProfile, {
      profile,
      showProfileOnly: true
    });
  }
  return /* @__PURE__ */ React.createElement(Wrapper, null, /* @__PURE__ */ React.createElement(ControlsContainer, null, /* @__PURE__ */ React.createElement("p", null, title), children), !(stackId > 0) ? /* @__PURE__ */ React.createElement(React.Fragment, null, userProfile) : /* @__PURE__ */ React.createElement(ExitOverlayButton, {
    onClick: close
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTimes
  })));
}
