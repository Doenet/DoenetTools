import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import {
  atom,
  selector,
  atomFamily,
  useRecoilValue,
  useRecoilCallback,
  useRecoilValueLoadable,
} from 'recoil';
import styled from 'styled-components';
import Toast from './Toast';
import ContentPanel from './Panels/NewContentPanel';
import axios from 'axios';
// import { GlobalStyle } from "../../Tools/DoenetStyle";
// import GlobalFont from '../../_utils/GlobalFont';
import MainPanel from './Panels/NewMainPanel';
import SupportPanel from './Panels/NewSupportPanel';
import MenuPanel from './Panels/NewMenuPanel';
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

export const searchParamAtomFamily = atomFamily({
  key: "searchParamAtomFamily",
  default: "",
})

export const toolViewAtom = atom({
  key: "toolViewAtom",
  default:{
    pageName:"Init",
  }
})
// currentMenus:[],
// menusTitles:[],
// menusInitOpen:[],
// currentMainPanel:"",
// supportPanelOptions:[],
// supportPanelTitles:[],
// supportPanelIndex:0,
// hasNoMenuPanel: true,
// headerControls:["CloseProfileButton"],
// headerControlsPositions:["Right"], 
// hasNoMenuPanel: true,
// toolHandler:"CourseToolHandler",

let toolsObj = {
  home:{
    pageName:"Home",
    currentMenus:[],
    menusTitles:[],
    menusInitOpen:[],
    currentMainPanel:"HomePanel",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
    hasNoMenuPanel: true,
  },
  course:{
    pageName:"Course",
    toolHandler:"CourseToolHandler",
  },
  content:{
    pageName:"Content",
    currentMenus:[],
    menusTitles:[],
    menusInitOpen:[],
    currentMainPanel:"Content",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
    hasNoMenuPanel: true,
  },
  notfound:{
    pageName:"Notfound",
    currentMenus:[],
    menusInitOpen:[],
    currentMainPanel:"NotFound",
    supportPanelOptions:[],
    hasNoMenuPanel: true,
  }
}

// function EmptyPanel(props){
//   return <div style={props.style}></div>
// }

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
  const [menusOpen,setMenusOpen] = useState(true)

  const setPage = useRecoilCallback(({set})=> (tool,origPath)=>{
    if (tool === ""){ 
      // location.href = `#home/`
      window.history.replaceState('','','/new#/home')

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

  const setSearchParam = useRecoilCallback(({set,snapshot})=>(paramObj)=>{
    //Track when tool isn't defined so the controlers get refreshed
    let clearTool = true;
    for (const [key,value] of Object.entries(paramObj)){
      if (key === 'tool'){clearTool = false;}
      set(searchParamAtomFamily(key),value)
    }
    if (clearTool){
      set(searchParamAtomFamily('tool'),'')
    }
  })

  const LazyPanelObj = useRef({
    Empty:lazy(() => import('./ToolPanels/Empty')),
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

  const LazyToolHandlerObj = useRef({
    CourseToolHandler:lazy(() => import('./ToolHandlers/CourseToolHandler')),
  }).current;

  // const LazyFooterObj = useRef({
  //   CourseToolHandler:lazy(() => import('./ToolHandlers/CourseToolHandler')),
  // }).current;

  if (profile.state === "loading"){ return null;}
    if (profile.state === "hasError"){ 
      console.error(profile.contents)
      return null;}
      // console.log(">>>===ToolRoot")
      console.log(">>>===ToolRoot toolViewInfo",toolViewInfo) 

  const searchParamObj = Object.fromEntries(new URLSearchParams(props.route.location.search))
  setSearchParam(searchParamObj);
  // console.log(">>>buildPanel searchParamObj",searchParamObj)
  //TODO: Send to recoilcallback set selectorFam

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
  if (toolViewInfo.pageName.toLowerCase() !== lcpath){
    console.log(">>>Changed Tool!!!!!!! toolViewInfo",toolViewInfo)

  //Need to update path
    setPage(lcpath,props.route.location.pathname)
    // return null; 
  }

  let toolHandler = null;
  if (toolViewInfo.toolHandler){
    const ToolHandlerKey = `${toolViewInfo.pageName}-${toolViewInfo.toolHandler}`;
    const handler = LazyToolHandlerObj[toolViewInfo.toolHandler];
    if (handler){
      toolHandler = <Suspense key={ToolHandlerKey} fallback={<LoadingFallback>loading...</LoadingFallback>}>
      {React.createElement(handler,{key:ToolHandlerKey})}
      </Suspense>
    }
   
  }

   let MainPanelKey = `${toolViewInfo.pageName}-${toolViewInfo.currentMainPanel}`;
   if (!toolViewInfo.currentMainPanel){
    MainPanelKey = 'Empty';
   }
   if (!mainPanelDictionary.current[MainPanelKey]){
     let type = toolViewInfo.currentMainPanel;
     if ( MainPanelKey === 'Empty'){type = 'Empty'}
    //Doesn't exist so make new Main Panel
    mainPanelArray.current.push(buildPanel({key:MainPanelKey,type,visible:true}))
    mainPanelDictionary.current[MainPanelKey] = {index:mainPanelArray.current.length - 1, type, visible:true}
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
    const SupportPanelKey = `${toolViewInfo.pageName}-${toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex]}-${toolViewInfo.supportPanelIndex}`;
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

  let menus = <MenuPanel key='menuPanel' hide={true} />;
  if (menusOpen && !toolViewInfo.hasNoMenuPanel){
    menus = <MenuPanel key='menuPanel' hide={false} setMenusOpen={setMenusOpen} menusOpen={menusOpen} menusTitles={toolViewInfo.menusTitles} currentMenus={toolViewInfo.currentMenus} initOpen={toolViewInfo.menusInitOpen}/>
  }

  let profileInMainPanel = !menusOpen;
  if (toolViewInfo.hasNoMenuPanel){
    profileInMainPanel = false;
  }
  return <ProfileContext.Provider value={profile.contents}>
    {/* <GlobalFont key='globalfont' /> */}
    <ToolContainer >
      {menus}
      <ContentPanel 
      main={<MainPanel headerControlsPositions={headerControlsPositions} headerControls={headerControls} setMenusOpen={setMenusOpen} displayProfile={profileInMainPanel}>{mainPanelArray.current}</MainPanel>} 
      support={supportPanel}
      />
    
      {/* <FooterPanel><button onClick={()=>props.route.history.push('/Test')}>test</button></FooterPanel> */}
    </ToolContainer>
    <Toast />
    {toolHandler}
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





