import React, { useState } from "react";
import styled from "styled-components";
import { atomFamily, useRecoilState } from "recoil";
import ResponsiveControlsWrapper from "./ResponsiveControls";
import { useStackId } from "../LayerRoot";
import Switch from "../../Switch";

export const supportVisible = atomFamily({
  key: "supportVisibleAtom",
  default: false,
});

export function SupportVisiblitySwitch() {
  const stackId = useStackId();

  const [supportVisiblity, setSupportVisiblity] = useRecoilState(
    supportVisible(stackId)
  );

  return (
    <Switch
      checked={supportVisiblity}
      onChange={(e) => {
        setSupportVisiblity(e.target.checked);
      }}
    />
  );
}

const SupportPanelContainer = styled.div`
  overflow: auto;
`;

const ResponsiveControlsContainer = styled.div`
  height: 32px;
  border-bottom: 1px solid black;
  display: flex;
`;

export default function SupportPanel({ children, responsiveControls }) {
  const [supportPanelHeaderGrpWidth, setSupportPanelHeaderGrpWidth] = useState(
    0
  );
  const [
    supportPanelHeaderCtrlGrpEl,
    setSupportPanelHeaderCtrlGrpEl,
  ] = useState(null);

  const setSupportHeaderCtrlGroupRef = (element) => {
    if (element) {
      setSupportPanelHeaderCtrlGrpEl(element);
      setSupportPanelHeaderGrpWidth(element.clientWidth);
    }
  };

  const resizeWindowHanlderForSupportPanel = () => {
    if (supportPanelHeaderCtrlGrpEl) {
      //console.log(supportPanelHeaderCtrlGrpEl.clientWidth, "supportPanelHeaderCtrlGrpEl.clientWidth");
      setSupportPanelHeaderGrpWidth(supportPanelHeaderCtrlGrpEl.clientWidth);
    }
  };

  let responsiveControlsContents = null;

  if (responsiveControls) {
    responsiveControlsContents = (
      <ResponsiveControlsContainer>
        <ResponsiveControlsWrapper mainPanelWidth={supportPanelHeaderGrpWidth}>
          {responsiveControls}
        </ResponsiveControlsWrapper>
      </ResponsiveControlsContainer>
    );
  }

  return (
    <SupportPanelContainer>
      {responsiveControlsContents}
      {children}
    </SupportPanelContainer>
  );
}
