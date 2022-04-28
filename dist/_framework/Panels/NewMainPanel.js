import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faChevronRight, faCog} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {atom, useRecoilCallback, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import Banner from "../../_reactComponents/PanelHeaderComponents/Banner.js";
export const mainPanelClickAtom = atom({
  key: "mainPanelClickAtom",
  default: []
});
const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 100%);
  height: 100%;
  // border-radius: 0 0 4px 4px;
  overflow: auto;
`;
const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  flex-direction: row;
  gap: 4px;
  background-color: hsl(0, 0%, 100%);
  // border-radius: 4px 4px 0 0;
  overflow: auto hidden;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  // border-bottom: 2px solid #e3e3e3;
`;
const OpenButton = styled.button`
  background-color: #1a5a99;
  height: 35px;
  width: 20px;
  color: white;
  border: none;
  position: relative;
  cursor: pointer;
`;
export default function MainPanel({
  headerControls,
  children,
  setMenusOpen,
  openMenuButton,
  displaySettings,
  hasNoHeaderPanel
}) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const mpOnClick = useRecoilCallback(({set, snapshot}) => async () => {
    const atomArray = await snapshot.getPromise(mainPanelClickAtom);
    for (let obj of atomArray) {
      if (typeof obj === "function") {
        obj();
      } else {
        set(obj.atom, obj.value);
      }
    }
  });
  const controls = [];
  if (openMenuButton) {
    controls.push(/* @__PURE__ */ React.createElement(OpenButton, {
      key: "openbutton",
      onClick: () => setMenusOpen(true)
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronRight
    })));
  }
  if (headerControls) {
    for (const [i, control] of Object.entries(headerControls)) {
      controls.push(/* @__PURE__ */ React.createElement("span", {
        key: `headControl${i}`
      }, control));
    }
  }
  const contents = [];
  if (displaySettings) {
  }
  if (children) {
    contents.push(children);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, hasNoHeaderPanel === true ? null : /* @__PURE__ */ React.createElement(ControlsWrapper, null, controls), /* @__PURE__ */ React.createElement(ContentWrapper, {
    onClick: mpOnClick
  }, contents));
}
