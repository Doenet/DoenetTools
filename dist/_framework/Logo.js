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
  background-color: white;
  width: 50px;
  height: 25px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  border-style: none;
  // border-radius: 50%;
  // margin-top: 8px;
  // margin-left: 90px;
  cursor: pointer;
`;
export const profileToolViewStashAtom = atom({
  key: "profileToolViewStashAtom",
  default: {}
});
export default function Logo(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  return /* @__PURE__ */ React.createElement(LogoButton, {
    onClick: () => setPageToolView({page: "home", tool: "", view: ""})
  });
}
