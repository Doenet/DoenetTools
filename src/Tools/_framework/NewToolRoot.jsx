import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import {
  atom,
  selector,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useRecoilValueLoadable,
} from 'recoil';
import styled from 'styled-components';
import Toast from './Toast';
// import { useMenuPanelController } from './Panels/MenuPanel';
import ContentPanel from './Panels/NewContentPanel';
import axios from 'axios';
// import { GlobalStyle } from "../../Tools/DoenetStyle";
import GlobalFont from '../../_utils/GlobalFont';

import MainPanel from './Panels/NewMainPanel';
import SupportPanel from './Panels/NewSupportPanel';
import MenuPanels from './Panels/MenuPanels';
import FooterPanel from './Panels/FooterPanel';
import { animated } from '@react-spring/web';


const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'menuPanel contentPanel ' 1fr
    'menuPanel footerPanel ' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #e2e2e2;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  gap: 0px;
  box-sizing: border-box;
`;

export const ProfileContext = React.createContext({});

export const profileAtom = atom({
  key: "profileAtom",
  default: selector({
      key: "profileAtom/Default",
      get: async () => {
          try{
              const profile = JSON.parse(localStorage.getItem('Profile'));
              if (profile){
                return profile;
              }
              //It wasn't stored in local storage so load it from server
              const { data } = await axios.get('/api/loadProfile.php')
              localStorage.setItem('Profile', JSON.stringify(data.profile));
              return data.profile
          }catch(error){
              console.log("Error loading user profile", error.message);                
              return {}
          }
      }
  })
})

export const toolViewAtom = atom({
  key: "toolViewAtom",
  default:{
    toolName:"Home",
    curentMenuPanels:[],
    menuPanelsTitles:[],
    menuPanelsInitOpen:[],
    currentMainPanel:"HomePanel",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
    hasNoMenuPanels: true,

   
  }
})

 // headerControls:["CloseProfileButton"],
// headerControlsPositions:["Right"], 
// hasNoMenuPanels: true,
//

let toolsObj = {
  home:{
    toolName:"Home",
    curentMenuPanels:[],
    menuPanelsTitles:[],
    menuPanelsInitOpen:[],
    currentMainPanel:"HomePanel",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
    hasNoMenuPanels: true,
  },
  course:{
    toolName:"Course",
    curentMenuPanels:[],
    menuPanelsTitles:[],
    menuPanelsInitOpen:[],
    currentMainPanel:"DriveCards",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
  },
  content:{
    toolName:"Content",
    curentMenuPanels:[],
    menuPanelsTitles:[],
    menuPanelsInitOpen:[],
    currentMainPanel:"Content",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
    hasNoMenuPanels: true,
  },
  notfound:{
    toolName:"Notfound",
    curentMenuPanels:[],
    menuPanelsInitOpen:[],
    currentMainPanel:"NotFound",
    supportPanelOptions:[],
    hasNoMenuPanels: true,
  }
}

let encodeParams = p => Object.entries(p).map(kv => 
  kv.map(encodeURIComponent).join("=")).join("&");

   
export default function ToolRoot(props){
  // console.log(">>>ToolRoot props",props) 

  const profile = useRecoilValueLoadable(profileAtom)
  const toolViewInfo = useRecoilValue(toolViewAtom);
  const mainPanelArray = useRef([])
  const lastMainPanelKey = useRef(null)
  const mainPanelDictionary = useRef({}) //key -> {index, type}
  const supportPanelArray = useRef([])
  const lastSupportPanelKey = useRef(null)
  const supportPanelDictionary = useRef({}) //key -> {index, type}
  // const [supportContentObj,setSupportContentObj] = useState({})
  const [menuPanelsOpen,setMenuPanelsOpen] = useState(true)

  const setTool = useRecoilCallback(({set})=> (tool,origPath)=>{
    if (tool === ""){ 
      location.href = `#home/`  
    }else{
      let newTool = toolsObj[tool];
  
      if (!newTool){ 
        let newParams = {};
        newParams["path"] = `${origPath}`;
        const ePath = encodeParams(newParams);
      location.href = `#/notfound?${ePath}`
      }else{
  
        set(toolViewAtom,newTool);
      }
    }
  })

  const LazyPanelObj = useRef({
    NotFound:lazy(() => import('./ToolPanels/NotFound')),
    AccountSettings:lazy(() => import('./ToolPanels/AccountSettings')),
    HomePanel:lazy(() => import('./ToolPanels/HomePanel')),
    Content:lazy(() => import('./ToolPanels/Content')),
    DriveCards:lazy(() => import('./ToolPanels/DriveCards')),
    SignIn:lazy(() => import('./ToolPanels/SignIn')),
  }).current;

  const LazyControlObj = useRef({
    CloseProfileButton:lazy(() => import('./HeaderControls/CloseProfileButton')),
  }).current;

  if (profile.state === "loading"){ return null;}
    if (profile.state === "hasError"){ 
      console.error(profile.contents)
      return null;}
      // console.log(">>>===ToolRoot")
      console.log(">>>===ToolRoot toolViewInfo",toolViewInfo) 


  function buildPanel({key,type,visible}){
    let hideStyle = null;
    if (!visible){
      hideStyle = 'none';
    }
    
    return <Suspense key={key} fallback={<LoadingFallback>loading...</LoadingFallback>}>
    {React.createElement(LazyPanelObj[type],{key,style:{display:hideStyle}})}
    </Suspense>
  } 

  const lcpath = props.route.location.pathname.replaceAll('/','').toLowerCase();
  if (toolViewInfo.toolName.toLowerCase() !== lcpath){
  //Need to update path
    setTool(lcpath,props.route.location.pathname)
    return null;
  }

   const MainPanelKey = `${toolViewInfo.toolName}-${toolViewInfo.currentMainPanel}`;
   if (!mainPanelDictionary.current[MainPanelKey]){
    //Doesn't exist so make new Main Panel
    mainPanelArray.current.push(buildPanel({key:MainPanelKey,type:toolViewInfo.currentMainPanel,visible:true}))
    mainPanelDictionary.current[MainPanelKey] = {index:mainPanelArray.current.length - 1, type:toolViewInfo.currentMainPanel, visible:true}
   
  }

  let headerControls = null;
  let headerControlsPositions = null;
  if (toolViewInfo.headerControls){
    headerControls = [];
    headerControlsPositions = [];
    for (const [i,controlName] of Object.entries(toolViewInfo.headerControls)){
      const controlObj = LazyControlObj[controlName]
      if (controlObj){
        const key = `headerControls${MainPanelKey}`;
        headerControlsPositions.push(toolViewInfo.headerControlsPositions[i])
        headerControls.push(<Suspense key={key} fallback={<LoadingFallback>loading...</LoadingFallback>}>
        {React.createElement(controlObj,{key:{key}})}
        </Suspense>)
      }
    }
  }
   
   //Show current panel and hide last panel
   if (lastMainPanelKey.current !== null && lastMainPanelKey.current !== MainPanelKey){
    const mpObj = mainPanelDictionary.current[MainPanelKey];
    const lastObj = mainPanelDictionary.current[lastMainPanelKey.current];

    //Show current if not visible
    if (!mpObj.visible){
      mainPanelArray.current[mpObj.index] = buildPanel({key:MainPanelKey,type:mpObj.type,visible:true})
      mpObj.visible = true;
    }
    //Hide last if visible
    if (lastObj.visible){
      mainPanelArray.current[lastObj.index] = buildPanel({key:lastMainPanelKey.current,type:lastObj.type,visible:false})
      lastObj.visible = false;
    }
   }

   lastMainPanelKey.current = MainPanelKey;
    

  //  let supportPanel = <SupportPanel hide={false} />;
   let supportPanel = <SupportPanel hide={true} >{supportPanelArray.current}</SupportPanel>;


   if (toolViewInfo.supportPanelOptions && toolViewInfo.supportPanelOptions.length > 0){
    const SupportPanelKey = `${toolViewInfo.toolName}-${toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex]}-${toolViewInfo.supportPanelIndex}`;
    if (!supportPanelDictionary.current[SupportPanelKey]){
     //Doesn't exist so make new Support Panel
     supportPanelArray.current.push(buildPanel({key:SupportPanelKey,type:toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex],visible:true}))
     supportPanelDictionary.current[SupportPanelKey] = {index:supportPanelArray.current.length - 1, type:toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex], visible:true}
    }
    
    //Show current panel and hide last panel
    if (lastSupportPanelKey.current !== null && lastSupportPanelKey.current !== SupportPanelKey){
     const spObj = supportPanelDictionary.current[SupportPanelKey];
     const lastObj = supportPanelDictionary.current[lastSupportPanelKey.current];
 
     //Show current if not visible
     if (!spObj.visible){
       supportPanelArray.current[spObj.index] = buildPanel({key:SupportPanelKey,type:spObj.type,visible:true})
       spObj.visible = true;
     }
     //Hide last if visible
     if (lastObj.visible){
       supportPanelArray.current[lastObj.index] = buildPanel({key:lastSupportPanelKey.current,type:lastObj.type,visible:false})
       lastObj.visible = false;
     }
    }
 
    lastSupportPanelKey.current = SupportPanelKey;
    
    supportPanel = <SupportPanel hide={false} panelTitles={toolViewInfo.supportPanelTitles} panelIndex={toolViewInfo.supportPanelIndex}>{supportPanelArray.current}</SupportPanel>
  }

  let menuPanels = <MenuPanels hide={true} />;
  if (menuPanelsOpen && !toolViewInfo.hasNoMenuPanels){
    menuPanels = <MenuPanels hide={false} setMenuPanelsOpen={setMenuPanelsOpen} menuPanelsOpen={menuPanelsOpen} panelTitles={toolViewInfo.menuPanelsTitles} currentPanels={toolViewInfo.curentMenuPanels} initOpen={toolViewInfo.menuPanelsInitOpen}/>
  }

  let profileInMainPanel = !menuPanelsOpen;
  if (toolViewInfo.hasNoMenuPanels){
    profileInMainPanel = false;
  }
  return <ProfileContext.Provider value={profile.contents}>
    <GlobalFont key='globalfont' />
    <ToolContainer >
      {menuPanels}
      <ContentPanel 
      main={<MainPanel headerControlsPositions={headerControlsPositions} headerControls={headerControls} setMenuPanelsOpen={setMenuPanelsOpen} displayProfile={profileInMainPanel}>{mainPanelArray.current}</MainPanel>} 
      support={supportPanel}
      />
    
      {/* <FooterPanel><button onClick={()=>props.route.history.push('/Test')}>test</button></FooterPanel> */}
    </ToolContainer>
    <Toast />
 
  </ProfileContext.Provider>
} 

const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100vw;
  height: 100vh;
`;

const layerStackAtom = atom({
  key: 'layerStackAtom',
  default: [],
});


export const useStackId = () => {
  const getId = useRecoilCallback(({ snapshot }) => () => {
    const currentId = snapshot.getLoadable(layerStackAtom);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};


