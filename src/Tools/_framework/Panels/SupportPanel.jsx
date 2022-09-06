import React from 'react';
import styled from 'styled-components';

const SupportWapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: var(--canvas);
  height: 100%;
  border-radius: 0 0 4px 4px;
`;

const ControlsWrapper = styled.div`
  overflow: auto;
  grid-area: supportControls;
  display: flex;
  gap: 4px;
  background-color: var(--mainGray);
  border-radius: 4px 4px 0 0;
`;

export default function SupportPanel({ children, responsiveControls }) {
  return (
    <>
      <ControlsWrapper>{responsiveControls}</ControlsWrapper>
      <SupportWapper>{children}</SupportWapper>
    </>
  );
}
