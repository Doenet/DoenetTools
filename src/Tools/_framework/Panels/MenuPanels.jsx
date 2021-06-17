import React, { useContext, useState, useEffect } from 'react';
import { atomFamily, useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
// import { useStackId } from '../ToolRoot';
import DragPanel, { handleDirection } from './Panel';
import { ProfileContext } from '../NewToolRoot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import logo from './src/Media/Doenet_Logo_cloud_only.png';

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
  // color: #333333;
  width: 30px;
  height: 30px;
  display: inline-block;
  // color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style: none;
  margin-left: 75px;
  margin-top: 4px
`;

const Logo = styled.div`
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/Doenet_Logo_cloud_only.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 50px 25px;
  transition: 300ms;
  // background-color: pink;
  width: 50px;
  height: 25px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  border-style: none;
  margin-top: 5px;
  margin-left: 2px
`

const CloseButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
display: inline-block;
`;

const EditMenuPanels = styled.button`
background-color: #1A5A99;
height: 35px;
width: 35px;
border: none;
color: white;
border-radius: 17.5px;
font-size: 24px
`;

const MenuPanelTitle = styled.button`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: center;
align-items: center;
border: 0px solid white;
// border-top: 1px solid black;
border-bottom: ${props => props.isOpen ? '2px solid black' : '0px solid black'} ;
margin-top: 2px;
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
    <div style={{
      // paddingTop: "0px", 
      paddingBottom: "4px", 
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor:"white"}}>{body}</div>
  </>
}

export default function MenuPanels({ panelNames=[] }) {
  const profile = useContext(ProfileContext)
  console.log(">>>profile",profile)

  //These maintain the panels' state
  const [viewPanels,setViewPanels] = useState([])
  const [userPanels,setUserPanels] = useState([])

  const profilePicName = profile.profilePicture;

  //Lasy load all the menu panels by name
  useEffect(()=>{
    console.log(">>>panelNames",panelNames)
      for (let [i,panelName] of Object.entries(panelNames)){
        console.log(">>>i,panelName",i,panelName)
    // panels.push(<MenuPanelInstance key={`menuPanel${i}`} {...child.props} >{child.children}</MenuPanelInstance>)
  }
  },panelNames)



  return (
    <MenuPanelsWrapper>
     <MenuPanelsCap>
        <span >
          <Logo/>
          {/* <img style={{height:"45px", width:"70px", objectFit: "scale-down"}} href="https://www.doenet.org/media/Doenet_Logo_cloud_only.png"/> */}
        </span>
        <span style={{marginBottom: '1px'}}>Doenet</span>
        <span >
          <ProfilePicture pic={profilePicName} onClick={()=>{location.href = '/accountSettings/'}}/>
        </span>
        <span >
          <CloseButton onClick={()=>console.log('>>>close menu panels')}><FontAwesomeIcon icon={faChevronLeft}/></CloseButton>
        </span>
        
          {/* {anchor} */}
      </MenuPanelsCap>
    {viewPanels}
    {userPanels}
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
