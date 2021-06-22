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
    toolName:"Test",
    menuPanelTypes:["TestControl","ToastTest"], 
    menuPanelsTitles:["Test Control", "Toast"],
    menuPanelsInitOpen:[false,true],
    mainPanelType:"One", 
    supportPanelTypes:["Two","One","Count"], 
    supportPanelTitles:["Panel Two","Panel One","Count"], 
    supportPanelIndex:1, 
    // noMenuPanels: true,
  }
})


// {
//   toolName:"Test",
//   menuPanels:["TestControl"],
//   menuPanelsInitOpen:[true],
//   mainPanel:"One",
//   supportPanel:["Two","One"],
//   supportPanelTitles:["Panel Two","Panel One"],
//   supportPanelIndex:0,
// }
let toolsObj = {
  test:{
    toolName:"Test",
    menuPanelTypes:["TestControl","ToastTest"],
    menuPanelsTitles:["Test Control", "Toast"],
    menuPanelsInitOpen:[false,true],
    mainPanelType:"One",
    supportPanelTypes:["Two","One","Count"],
    supportPanelTitles:["Panel Two","Panel One","Count"],
    supportPanelIndex:1,
    // noMenuPanels: true,
  },
  count:{
    toolName:"Count",
    menuPanelTypes:["TestControl"],
    menuPanelsTitles:["Test Control"],
    menuPanelsInitOpen:[true],
    mainPanelType:"Count",
    supportPanelTypes:["Count2","Count"],
    supportPanelTitles:["Count Two","Count One"],
    supportPanelIndex:0,
  },
  notfound:{
    toolName:"Notfound",
    menuPanelTypes:[],
    menuPanelsInitOpen:[],
    mainPanelType:"NotFound",
    supportPanelTypes:[],
    noMenuPanels: true,
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

  const setView = useRecoilCallback(({set})=> (view,origPath)=>{
    if (view === ""){ 
      location.href = `#test/`  
    }else{
      let newView = toolsObj[view];
   
      console.log(">>>newView",newView)
  
      if (!newView){ 
        let newParams = {};
        newParams["path"] = `${origPath}`;
        const ePath = encodeParams(newParams);
      location.href = `#/notfound?${ePath}`
      }else{
  
        set(toolViewAtom,newView);
      }
    }
    

  })

  const LazyObj = useRef({
    One:lazy(() => import('./ToolPanels/One')),
    Two:lazy(() => import('./ToolPanels/Two')),
    Count:lazy(() => import('./ToolPanels/Count')),
    Count2:lazy(() => import('./ToolPanels/Count2')),
    NotFound:lazy(() => import('./ToolPanels/NotFound')),
  }).current;

  if (profile.state === "loading"){ return null;}
    if (profile.state === "hasError"){ 
      console.error(profile.contents)
      return null;}
      // console.log(">>>===ToolRoot")
      console.log(">>>===ToolRoot Route",props.route) 


  function buildPanel({key,type,visible}){
    // console.log(">>>build",{key,type,visible})
    let hideStyle = null;
    if (!visible){
      hideStyle = 'none';
    }
    
    // {React.createElement(LazyObj[type],{key,style:{color: "red", backgroundColor: "blue"}})}
    return <Suspense key={key} fallback={<LoadingFallback>loading...</LoadingFallback>}>
    {React.createElement(LazyObj[type],{key,style:{display:hideStyle}})}
    </Suspense>
  } 

  const lcpath = props.route.location.pathname.replaceAll('/','').toLowerCase();
  //Need to update path
  if (toolViewInfo.toolName.toLowerCase() !== lcpath){
    setView(lcpath,props.route.location.pathname)
    return null;
  }

   const MainPanelKey = `${toolViewInfo.toolName}-${toolViewInfo.mainPanelType}`;
   if (!mainPanelDictionary.current[MainPanelKey]){
    //Doesn't exist so make new Main Panel
    mainPanelArray.current.push(buildPanel({key:MainPanelKey,type:toolViewInfo.mainPanelType,visible:true}))
    mainPanelDictionary.current[MainPanelKey] = {index:mainPanelArray.current.length - 1, type:toolViewInfo.mainPanelType, visible:true}
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
    

   let supportPanel = null;


   if (toolViewInfo.supportPanelTypes && toolViewInfo.supportPanelTypes.length > 0){
    const SupportPanelKey = `${toolViewInfo.toolName}-${toolViewInfo.supportPanelTypes[toolViewInfo.supportPanelIndex]}-${toolViewInfo.supportPanelIndex}`;
    if (!supportPanelDictionary.current[SupportPanelKey]){
     //Doesn't exist so make new Support Panel
     supportPanelArray.current.push(buildPanel({key:SupportPanelKey,type:toolViewInfo.supportPanelTypes[toolViewInfo.supportPanelIndex],visible:true}))
     supportPanelDictionary.current[SupportPanelKey] = {index:supportPanelArray.current.length - 1, type:toolViewInfo.supportPanelTypes[toolViewInfo.supportPanelIndex], visible:true}
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
    
    supportPanel = <SupportPanel panelTitles={toolViewInfo.supportPanelTitles} panelIndex={toolViewInfo.supportPanelIndex}>{supportPanelArray.current}</SupportPanel>
  }

  let menuPanels = null;
  if (menuPanelsOpen && !toolViewInfo.noMenuPanels){
    menuPanels = <MenuPanels setMenuPanelsOpen={setMenuPanelsOpen} panelTitles={toolViewInfo.menuPanelsTitles} panelTypes={toolViewInfo.menuPanelTypes} initOpen={toolViewInfo.menuPanelsInitOpen}/>
  }

  let profileInMainPanel = !menuPanelsOpen;
  if (toolViewInfo.noMenuPanels){
    profileInMainPanel = false;
  }
  return <ProfileContext.Provider value={profile.contents}>
    <GlobalFont />
    <ToolContainer>
      {menuPanels}
      <ContentPanel 
      main={<MainPanel setMenuPanelsOpen={setMenuPanelsOpen} displayProfile={profileInMainPanel}>{mainPanelArray.current}</MainPanel>} 
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


