import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import Profile from "../Profile.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faChevronRight} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {atom, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {selectedMenuPanelAtom} from "./NewMenuPanel.js";
export const mainPanelClickAtom = atom({
  key: "mainPanelClickAtom",
  default: []
});
const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  // border-radius: 0 0 4px 4px;
  overflow: auto;
`;
const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  flex-direction: row;
  gap: 4px;
  background-color: hsl(0, 0%, 99%);
  // border-radius: 4px 4px 0 0;
  overflow: auto hidden;
  // border-bottom: 2px solid #e3e3e3;
`;
const OpenButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
display: inline-block;
`;
export default function MainPanel({headerControls, headerControlsPositions, children, setMenusOpen, displayProfile}) {
  console.log(">>>===main panel");
  const setClearSelectedCourseMenu = useRecoilCallback(({set}) => () => {
    set(selectedMenuPanelAtom, "");
  });
  const mpOnClick = useRecoilCallback(({set, snapshot}) => async () => {
    const atomArray = await snapshot.getPromise(mainPanelClickAtom);
    for (let obj of atomArray) {
      set(obj.atom, obj.value);
    }
    setClearSelectedCourseMenu();
  });
  const controls = [];
  if (displayProfile) {
    controls.push(/* @__PURE__ */ React.createElement(OpenButton, {
      key: "openbutton",
      onClick: () => setMenusOpen(true)
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronRight
    })));
    controls.push(/* @__PURE__ */ React.createElement(Profile, {
      key: "profile"
    }));
  }
  if (headerControls) {
    for (const [i, control] of Object.entries(headerControls)) {
      const position = headerControlsPositions[i];
      controls.push(/* @__PURE__ */ React.createElement("span", {
        key: `headControl${i}`
      }, control));
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ControlsWrapper, null, controls), /* @__PURE__ */ React.createElement(ContentWrapper, {
    onClick: mpOnClick
  }, children));
}
