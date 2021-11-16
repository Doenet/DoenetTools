import React from 'react';
import styled from 'styled-components';
import Profile from '../Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { atom, useRecoilCallback } from 'recoil';

export const mainPanelClickAtom = atom({
  key:"mainPanelClickAtom",
  default:[]
})

const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 100%);
  height: 100%;
  // border-radius: 0 0 4px 4px;
  overflow: auto;
`;

const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  flex-direction: row;
  gap: 4px;
  background-color: hsl(0, 0%, 100%);
  // border-radius: 4px 4px 0 0;
  overflow: auto hidden;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
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

export default function MainPanel({ headerControls, children, setMenusOpen, openMenuButton, displayProfile }) {
  console.log(">>>===main panel")

  const mpOnClick = useRecoilCallback(({set,snapshot})=> async ()=>{
    const atomArray = await snapshot.getPromise(mainPanelClickAtom)
    // console.log(">>>mpOnClick",atomArray)
    for (let obj of atomArray){
      set(obj.atom,obj.value)
      // console.log(">>>obj",obj)
    }
  })
  const controls = [];

  if (openMenuButton){
    controls.push(<OpenButton key='openbutton' onClick={()=>setMenusOpen(true)}><FontAwesomeIcon icon={faChevronRight}/></OpenButton>)
   if(displayProfile){controls.push(<Profile key='profile'/>)}
  }
  if (headerControls){
    for (const [i,control] of Object.entries(headerControls)){
      controls.push(<span key={`headControl${i}`}>{control}</span>)
    }
  }

  return (
    <>
      <ControlsWrapper>
      {controls}
      </ControlsWrapper>
      <ContentWrapper onClick={mpOnClick}>{children}</ContentWrapper>
    </>
  );
}
