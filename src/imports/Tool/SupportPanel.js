import React, {useState} from 'react';
import styled from 'styled-components';
import ResponsiveControlsWrapper from "../Tool/ResponsiveControls";

const SupportPanelDiv = styled.div`
height: 100vh;`;

export default function SupportPanel(props) {
  const [supportPanelHeaderGrpWidth, setSupportPanelHeaderGrpWidth] = useState(0);
  const [supportPanelHeaderCtrlGrpEl, setSupportPanelHeaderCtrlGrpEl] = useState(null);

  const setSupportHeaderCtrlGroupRef = element => {
    if (element) {
      setSupportPanelHeaderCtrlGrpEl(element);
      setSupportPanelHeaderGrpWidth(element.clientWidth);
    }
  }

  const resizeWindowHanlderForSupportPanel = () => {
    if(supportPanelHeaderCtrlGrpEl) {
      //console.log(supportPanelHeaderCtrlGrpEl.clientWidth, "supportPanelHeaderCtrlGrpEl.clientWidth");
      setSupportPanelHeaderGrpWidth(supportPanelHeaderCtrlGrpEl.clientWidth);
    }
  }

  // window.addEventListener("resize", resizeWindowHanlderForSupportPanel);

  return (
    <SupportPanelDiv>
      {props.responsiveControls ? <div style={{height: "32px", borderBottom: "1px solid black", display: "flex"}}><ResponsiveControlsWrapper mainPanelWidth={supportPanelHeaderGrpWidth}>{props.responsiveControls}</ResponsiveControlsWrapper></div> : "" }
      <div style={{height: props.responsiveControls ? 'calc(100vh - 82px)' : 'calc(100vh - 50px) ',overflow: "scroll"}}>{props.children}</div>
    </SupportPanelDiv>
  )
}