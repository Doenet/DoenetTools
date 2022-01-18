import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCog } from "@fortawesome/free-solid-svg-icons";
import { atom, useRecoilCallback, useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';


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
position: relative;
cursor: pointer;

`;

const SettingsButton = styled.button`
background-color: white;
height: 50px;
width: 50px;
color: black;
border: none;
position: absolute;
bottom: 0;
right: 0;
cursor: pointer;
font-size: 20px;
`

export default function MainPanel({ headerControls, children, setMenusOpen, openMenuButton, displaySettings }) {
  console.log(">>>===main panel")
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

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
  }
  if (headerControls){
    for (const [i,control] of Object.entries(headerControls)){
      controls.push(<span key={`headControl${i}`}>{control}</span>)
    }
  }

  const contents = [];

  if (displaySettings){
    contents.push(<SettingsButton onClick={()=>setPageToolView({page:'settings',tool:'',view:''})}><FontAwesomeIcon icon={faCog}/></SettingsButton>)
  }
  if (children) {
    contents.push(children)
  }

  return (
    <>
      <ControlsWrapper>
      {controls}
      </ControlsWrapper>
      <ContentWrapper onClick={mpOnClick}>
        {contents}
      </ContentWrapper>
    </>
  );
}
