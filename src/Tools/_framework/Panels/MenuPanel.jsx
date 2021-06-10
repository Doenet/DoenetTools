import React, { useContext, useState, useEffect } from 'react';
import { atomFamily, useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { useStackId } from '../ToolRoot';
import DragPanel, { handleDirection } from './Panel';
import ProfileContext from '../ToolRoot';

const MenuPanelsWrapper = styled.div`
  grid-area: menuPanel;
  display: flex;
  flex-direction: column;
  overflow: auto;
  justify-content: flex-start;
  background: #e3e3e3;
  height: 100%;
  width: 240px;
`;

const MenuPanelsCap = styled.div`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: space-between;
align-items: center;
`;

const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({ linkedPanel, activePanel }) =>
    linkedPanel === activePanel ? '8px solid #1A5A99' : 'none'};
  background-color: hsl(0, 0%, 99%);
  border-bottom: 2px solid
    ${({ linkedPanel, activePanel }) =>
      linkedPanel === activePanel ? '#white' : 'black'};
  width: 100%;
  height: 100%;
`;

export const activeMenuPanel = atomFamily({
  key: 'activeMenuPanelAtom',
  default: 0,
});

export const useMenuPanelController = () => {
  const stackId = useStackId();
  const menuAtomControl = useSetRecoilState(activeMenuPanel(stackId));
  return menuAtomControl;
};

const ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/profile_pictures/${(props) => props.pic}.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width: 35px;
  height: 35px;
  display: inline;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
  margin: 3px;
`;
const CloseButton = styled.button`
background-color: blue;
height: 25px;
width: 20px;
`;

const EditMenuPanels = styled.button`
background-color: blue;
height: 35px;
width: 35px;
`;

const MenuPanelTitle = styled.button`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: center;
align-items: center;
border: 0px solid white;
border-top: 1px solid black;
border-bottom: ${props => props.isOpen ? '2px solid black' : '1px solid black'} ;
`

function MenuPanelInstance(props){
  let isInitOpen = props.isInitOpen;
  if (!isInitOpen){isInitOpen = false;}
  let [isOpen,setIsOpen] = useState(isInitOpen);

  let body = null;
  if (isOpen){
    body = <div>{props.children}</div>
  }
  return <>
    <MenuPanelTitle isOpen={isOpen} onClick={()=>setIsOpen(was=>!was)}>{props.title}</MenuPanelTitle>
    <div style={{padding:"4px", backgroundColor:"white"}}>{body}</div>
  </>
}

export default function MenuPanel({ children }) {
  const profile = useContext(ProfileContext)
  //WHY IS profile UNDEFINED???????
  console.log(">>>profile",profile)
  //USE profile TO DEFINE profilePicName
  let profilePicName = "quokka";

  let panels = [];

  for (let [i,child] of Object.entries(children)){
    panels.push(<MenuPanelInstance key={`menuPanel${i}`} {...child.props} >{child.children}</MenuPanelInstance>)
  }

  // const stackId = useStackId();

  return (
    <MenuPanelsWrapper>
      <MenuPanelsCap>
        <span>
        <span style={{marginLeft:'6px',marginRight:'6px'}}>Logo</span>
        <span>Doenet</span>
        </span>
        <span>
          <ProfilePicture pic={profilePicName} onClick={()=>{location.href = '/accountSettings/'}}/>
          <CloseButton onClick={()=>console.log('>>>close menu panels')}>x</CloseButton>
          </span>
      </MenuPanelsCap>
    {panels}
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"240px",paddingTop:"8px"}}>
      <EditMenuPanels onClick={()=>console.log('>>>edit menu panels')}>+</EditMenuPanels>
    </div>

    </MenuPanelsWrapper>
    // <DragPanel
    //   gridArea={'menuPanel'}
    //   direction={handleDirection.LEFT}
    //   id={`menuPanel${stackId}`}
    //   isInitOpen={isInitOpen}
    // >
    //   <Wrapper>
    //     <ButtonsWrapper>
    //       {panels.map((panel, idx) => {
    //         return (
    //           <MenuHeaderButton
    //             key={`headerB${idx}`}
    //             onClick={() => {
    //               activePanel !== idx ? setActivePanel(idx) : null;
    //             }}
    //             linkedPanel={idx}
    //             activePanel={activePanel}
    //           >
    //             {panel.props.title}
    //           </MenuHeaderButton>
    //         );
    //       })}
    //     </ButtonsWrapper>
    //     <PanelsWrapper>{panels[activePanel]?.children}</PanelsWrapper>
    //   </Wrapper>
    // </DragPanel>
  );
}
