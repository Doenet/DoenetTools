import React, { useState } from "react";
import styled from "styled-components";
import { atom } from "recoil";
import ResponsiveControlsWrapper from "../Tool/ResponsiveControls";

export const supportVisible = atom({
  key: "supportVisibleAtom",
  default: false,
});

const SupportPanelDiv = styled.div`
  overflow: auto;
`;

export default function SupportPanel(props) {
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

  return (
    <SupportPanelDiv>
      {props.responsiveControls ? (
        <div
          style={{
            height: "32px",
            borderBottom: "1px solid black",
            display: "flex",
          }}
        >
          <ResponsiveControlsWrapper
            mainPanelWidth={supportPanelHeaderGrpWidth}
          >
            {props.responsiveControls}
          </ResponsiveControlsWrapper>
        </div>
      ) : (
        ""
      )}
      {props.children}
    </SupportPanelDiv>
  );
}
