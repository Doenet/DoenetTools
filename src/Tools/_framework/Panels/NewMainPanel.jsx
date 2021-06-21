import React from 'react';
import styled from 'styled-components';
import Profile from '../Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  // border-radius: 0 0 4px 4px;
  overflow: auto;
`;
const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 99%);
  // border-radius: 4px 4px 0 0;
  overflow: auto hidden;
  // border-bottom: 2px solid #e3e3e3;
`;

const OpenButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
display: inline-block;
`;

export default function MainPanel({ children, setMenuPanelsOpen, menuPanelsOpen }) {

  return (
    <>
      <ControlsWrapper>
        {!menuPanelsOpen ? <><OpenButton onClick={()=>setMenuPanelsOpen(true)}><FontAwesomeIcon icon={faChevronRight}/></OpenButton><Profile /></> : null} 
      </ControlsWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
