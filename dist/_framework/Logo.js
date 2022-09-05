import React from "../_snowpack/pkg/react.js";
import {useRecoilCallback, atom, useRecoilValueLoadable, useSetRecoilState} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {pageToolViewAtom} from "./NewToolRoot.js";
const LogoButton = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/Doenet_Logo_cloud_only.png');
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
  cursor: ${(props) => props.hasLink ? "pointer" : "default"};
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;
export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default: {}
});
export default function Logo({hasLink = true}) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  return /* @__PURE__ */ React.createElement(LogoButton, {
    hasLink,
    onClick: () => {
      if (hasLink) {
        setPageToolView({page: "home", tool: "", view: ""});
      }
    }
  });
}
