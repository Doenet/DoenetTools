import React from "react";
import styled from "styled-components";

const SupportPanelContainer = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  /* box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid #1a5a99; */
`;

export default function SupportPanel({ children }) {
  return <SupportPanelContainer>{children}</SupportPanelContainer>;
}
