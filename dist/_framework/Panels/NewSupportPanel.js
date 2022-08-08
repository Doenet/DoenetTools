import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faQuestionCircle} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
const SupportWrapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: var(--canvas);
  height: 100%;
  display: ${({$hide}) => $hide ? "none" : "block"}
  // border-radius: 0 0 4px 4px;
`;
const ControlsWrapper = styled.div`
  overflow: auto;
  grid-area: supportControls;
  display: flex;
  gap: 4px;
  background-color: var(--canvas);
  display: ${({$hide}) => $hide ? "none" : "block"}
  // border-radius: 4px 4px 0 0;
  // border-bottom: 2px solid var(--mainGray);

`;
export default function SupportPanel({hide, children, panelTitles = [], panelIndex}) {
  const setSupportPanelIndex = useRecoilCallback(({set}) => (index) => {
    console.log(">>>TODO: change SupportPanelIndex to ", index);
  });
  let panelSelector = null;
  if (panelTitles.length > 0) {
    let options = [];
    for (let [i, name] of Object.entries(panelTitles)) {
      options.push(/* @__PURE__ */ React.createElement("option", {
        key: `panelSelector${i}`,
        value: i
      }, name));
    }
    panelSelector = /* @__PURE__ */ React.createElement("select", {
      value: panelIndex,
      onChange: (e) => {
        setSupportPanelIndex(e.target.value);
      }
    }, options);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ControlsWrapper, {
    $hide: hide,
    "aria-label": "complementary controls"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "/public?tool=editor&doenetId=_DG5JOeFNTc5rpWuf2uA-q",
    target: "_blank"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faQuestionCircle,
    style: {
      fontDecoration: "none",
      color: "black",
      float: "right",
      marginTop: "8px",
      marginRight: "8px",
      height: "20px",
      width: "20px"
    }
  }))), /* @__PURE__ */ React.createElement(SupportWrapper, {
    $hide: hide,
    role: "complementary"
  }, children));
}
