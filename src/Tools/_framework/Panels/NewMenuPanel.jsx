import React, { useState, lazy, useRef, Suspense } from 'react';
import { atom,  useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Profile from '../Profile';

export const selectedMenuPanelAtom = atom({
  key:"selectedMenuPanelAtom",
  default:null
}) 

const MenuPanelsWrapper = styled.div`
  grid-area: menuPanel;
  display: flex;
  flex-direction: column;
 // overflow: auto;
  justify-content: flex-start;
  background: #e3e3e3;
  height: 100%;
  overflow-x: hidden;
  width: ${({hide})=>hide ? '0px' : '240px'};
`;

const MenuPanelsCap = styled.div`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: space-between;
align-items: center;
position: ${(props) => props.fix ? 'static' : 'sticky'};
border-bottom: 2px solid #e2e2e2;
margin-bottom: -2px;
top: 0;
z-index: 2;
`;
const MenuPanelsCapComponent = styled.div`
width: 240px;
background: white;
border-top: 1px solid #e2e2e2;
border-top: 1px solid #e2e2e2;
border-bottom: 2px solid #e2e2e2;
margin-bottom: -2px;
position: sticky;
top: 35px;
z-index: 2;
`;

const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({ linkedPanel, activePanel }) =>
    linkedPanel === activePanel ? '8px solid #1A5A99' : 'none'};
  background-color: hsl(0, 0%, 100%);
  border-bottom: 2px solid
    ${({ linkedPanel, activePanel }) =>
      linkedPanel === activePanel ? '#white' : 'black'};
  width: 100%;
  height: 100%;

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

function SelectionMenu(props){
  console.log("child", props.children);
  return <>
    <div style={{
      // paddingTop: "4px", 
      // marginTop: "2px",
      paddingBottom: "8px", 
      paddingLeft: "4px",
      paddingRight: "4px",
      // backgroundColor:"hsl(209,54%,90%)"
      backgroundColor: 'white',
      borderLeft:"8px solid #1A5A99"
      }}>
        {/* <h3 style={{textAlign: "center", width: "240px", height: "35px",
 fontSize: "16px", marginTop: "5px", marginLeft: "-8px"}}>Current Selection</h3> */}
        {props.children}
        </div>
  </>
}

function Menu(props){
  let isInitOpen = props.isInitOpen;
  if (!isInitOpen){isInitOpen = false;}
  let [isOpen,setIsOpen] = useState(isInitOpen);

  let hideShowStyle = null;
  if (!isOpen){
    hideShowStyle = 'none'
  }

  return <>
    <MenuPanelTitle isOpen={isOpen} onClick={()=>setIsOpen(was=>!was)}><h3>{props.title}</h3></MenuPanelTitle>
    <div style={{
      display: hideShowStyle,
      paddingTop: "4px", 
      paddingBottom: "4px", 
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor:"white"}}>{props.children}</div>
  </>
}

const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 100%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100vw;
  height: 100vh;
`;

export default function MenuPanel({ hide, menuPanelCap="", menusTitles=[], currentMenus=[], initOpen=[], setMenusOpen, displayProfile }) {
console.log(">>>===MenuPanel", hide)
// console.log(">>>menuPanelCap",menuPanelCap)
// console.log(">>>currentMenus",currentMenus)

  //These maintain the panels' state
  const currentSelectionMenu = useRecoilValue(selectedMenuPanelAtom);
  let menusArray = [];

  // const profilePicName = profile.profilePicture;
  const LazyMenuPanelCapObj = useRef({
    DriveInfoCap:lazy(() => import('../MenuPanelCaps/DriveInfoCap')),
    EditorInfoCap:lazy(() => import('../MenuPanelCaps/EditorInfoCap')),
    AssignmentInfoCap:lazy(() => import('../MenuPanelCaps/AssignmentInfoCap')),
  }).current;

  const LazyMenuObj = useRef({
    SelectedCourse:lazy(() => import('../Menus/SelectedCourse')),
    SelectedDoenetML:lazy(() => import('../Menus/SelectedDoenetML')),
    SelectedFolder:lazy(() => import('../Menus/SelectedFolder')),
    SelectedCollection:lazy(() => import('../Menus/SelectedCollection')),
    SelectedMulti:lazy(() => import('../Menus/SelectedMulti.jsx')),
    CreateCourse:lazy(() => import('../Menus/CreateCourse')),
    CourseEnroll:lazy(() => import('../Menus/CourseEnroll')),
    AddDriveItems:lazy(() => import('../Menus/AddDriveItems')),
    EnrollStudents:lazy(() => import('../Menus/EnrollStudents')),
    DoenetMLSettings:lazy(() => import('../Menus/DoenetMLSettings')),
    VersionHistory:lazy(() => import('../Menus/VersionHistory')),
    Variant:lazy(() => import('../Menus/Variant')),
    AutoSaves:lazy(() => import('../Menus/AutoSaves')),
    LoadEnrollment:lazy(() => import('../Menus/LoadEnrollment')),
    GradeUpload:lazy(() => import('../Menus/GradeUpload')),
    ManualEnrollment:lazy(() => import('../Menus/ManualEnrollment')),
    AssignmentSettingsMenu:lazy(() => import('../Menus/AssignmentSettingsMenu')),
    GroupSettings:lazy(() => import('../Menus/GroupSettings')),
    TimerMenu:lazy(() => import('../Menus/TimerMenu')),
    CreditAchieved:lazy(() => import('../Menus/CreditAchieved')),
    ClassTimes:lazy(() => import('../Menus/ClassTimes')),
    CurrentContent:lazy(() => import('../Menus/CurrentContent')),
    
  }).current;

  let selectionPanel = null;
  if (currentSelectionMenu){
    const panelToUse = LazyMenuObj[currentSelectionMenu];
    //protect from typos
    if (panelToUse){
      const key = `SelectionMenu${currentSelectionMenu}`
      selectionPanel = <SelectionMenu key={key}>
        <Suspense fallback={<LoadingFallback>loading...</LoadingFallback>}>
        {React.createElement(panelToUse,{key})}
        </Suspense></SelectionMenu>
    }
  }

  let menuPanelCapComponent = null;
  if (menuPanelCap !== ""){
    menuPanelCapComponent = <MenuPanelsCapComponent>
      <Suspense fallback={<LoadingFallback>loading...</LoadingFallback>}>
      {React.createElement(LazyMenuPanelCapObj[menuPanelCap])}
        </Suspense>
    </MenuPanelsCapComponent>;
  }



  //TODO: 
  // handle more than one of the same panel type
  // match order of panel types 
  // toolMenus.current = []


  //Show menus
  for (let [i,type] of Object.entries(currentMenus)){
    console.log(">>>menu",type)
    const mKey = `${type}`;
    const title = menusTitles[i]
    let isOpen = initOpen[i]


     menusArray.push(<Menu key={mKey} title={title} isInitOpen={isOpen} >
      <Suspense fallback={<LoadingFallback>loading...</LoadingFallback>}>
    {React.createElement(LazyMenuObj[type],{mKey})}
    </Suspense></Menu>)

  }

  return (
    <MenuPanelsWrapper hide={hide}>
     <MenuPanelsCap fix={hide}>
        <span >
          <Logo/>
          {/* <img style={{height:"45px", width:"70px", objectFit: "scale-down"}} href="https://www.doenet.org/media/Doenet_Logo_cloud_only.png"/> */}
        </span>
        <span style={{marginBottom: '1px'}}>Doenet</span>
        <span >
          {displayProfile ? 
            <Profile 
            margin={hide}
            />
          : null }
        </span>
        <span >
          <CloseButton onClick={()=>setMenusOpen(false)}><FontAwesomeIcon icon={faChevronLeft}/></CloseButton>
        </span>
        
      </MenuPanelsCap>
      {menuPanelCapComponent}

      {selectionPanel}
      <div>{menusArray}</div>

    </MenuPanelsWrapper>
  );
}
