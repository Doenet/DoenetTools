import React from "react";
import styled from "styled-components";

const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  border-radius: 0 0 4px 4px;
`;
const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 89%);
  border-radius: 4px 4px 0 0;
`;

export default function MainPanel({ children, responsiveControls }) {
  return (
    <>
      <ControlsWrapper>{responsiveControls}</ControlsWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
