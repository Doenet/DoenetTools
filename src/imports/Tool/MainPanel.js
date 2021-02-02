import React, { useState } from "react";
import styled from "styled-components";
import ResponsiveControlsWrapper from "../Tool/ResponsiveControlsWrapper";

const MainPanelContainer = styled.div`
  grid-area: mainPanel;
  overflow: auto;
`;

const ResponsiveControlsContainer = styled.div`
  height: 32px;
  border-bottom: 1px solid black;
  display: flex;
`;

export default function MainPanel({ children, responsiveControls }) {
  // console.log(">>>Main Panel props", children);

  const [headerCtrlGrpWidth, setHeaderCtrlGrpWidth] = useState(0);
  const [headerCtrlGroupEl, setHeaderCtrlGroupEl] = useState(null);
  const [mainPanelHeaderGrpWidth, setMainPanelHeaderGrpWidth] = useState(0);
  const [mainPanelHeaderCtrlGrpEl, setMainPanelHeaderCtrlGrpEl] = useState(
    null
  );

  let responsiveControlsContent = null;

  if (responsiveControls) {
    responsiveControlsContent = (
      <ResponsiveControlsContainer>
        <ResponsiveControlsWrapper mainPanelWidth={headerCtrlGrpWidth}>
          {responsiveControls}
        </ResponsiveControlsWrapper>
      </ResponsiveControlsContainer>
    );
  }

  return (
    <MainPanelContainer>
      {responsiveControlsContent}
      {children}
    </MainPanelContainer>
  );
}

// <div>
// <div
//   style={{
//     display:
//       showHideSupportPanel || props.showHideOverlayFromOverlayNew
//         ? "flex"
//         : "block",
//   }}
// >
//   <div
//     style={{
//       width:
//         showHideSupportPanel || props.showHideOverlayFromOverlayNew
//           ? "50%"
//           : "100%",
//       height: "100%",
//     }}
//   >
//     {props.responsiveControls ? (
//       <div
//         style={{
//           display: "flex",
//           height: "32px",
//           borderBottom: "1px solid black",
//         }}
//       >
//         {/* <ResponsiveControlsWrapper mainPanelWidth={mainPanelHeaderGrpWidth}>{props.responsiveControls}</ResponsiveControlsWrapper> */}
//         {props.responsiveControls}
//       </div>
//     ) : (
//       ""
//     )}

//     <div
//       style={{
//         height: props.responsiveControls
//           ? "calc(100vh - 82px)"
//           : "calc(100vh - 60px)",
//         overflow: "scroll",
//       }}
//     >
//       {props.children}
//     </div>
//   </div>
//   {showHideSupportPanel || props.showHideOverlayFromOverlayNew ? (
//     <div
//       style={{
//         borderLeft: "1px solid black",
//         width: "50%",
//         overflow: "scroll",
//       }}
//     >
//       {props.supportPanelObj}
//     </div>
//   ) : (
//     ""
//   )}
// </div>
// </div> */}
