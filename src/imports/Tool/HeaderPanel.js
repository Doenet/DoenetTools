import React from "react";
import styled from "styled-components";

const HeaderPanelContainer = styled.div`
  grid-area: headerPanel;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  border-left: 1px solid black;
  border-bottom: 2px solid black;
  padding: 4px;
`;

export default function HeaderPanel({ children }) {
  return <HeaderPanelContainer>{children}</HeaderPanelContainer>;
}
