import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
const SupportWrapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  display: ${({$hide}) => $hide ? "none" : "block"}
  // border-radius: 0 0 4px 4px;
`;
const ControlsWrapper = styled.div`
  overflow: auto;
  grid-area: supportControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 99%);
  display: ${({$hide}) => $hide ? "none" : "block"}
  // border-radius: 4px 4px 0 0;
  // border-bottom: 2px solid #e3e3e3;

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
    $hide: hide
  }), /* @__PURE__ */ React.createElement(SupportWrapper, {
    $hide: hide
  }, children));
}
