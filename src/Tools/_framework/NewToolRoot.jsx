import React, { useState, lazy, Suspense, useRef } from 'react';
import {
  atom,
  selector,
  useRecoilValue,
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
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

import { useHistory, useLocation } from 'react-router';


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

export const paramObjAtom = atom({
  key:"paramObjAtom",
  default:{}
})

// **** ToolRoot ****
//Keep  as simple as we can
//Keep refreshes to a minimum 
//Don't use recoil in ToolRoot

export default function ToolRoot(){
  console.log(">>>===ToolRoot ") 

  const [toolRootMenusAndPanels,setToolRootMenusAndPanels] = useState({
    pageName:"init",
    currentMenus:[],
    menusTitles:[],
    menusInitOpen:[],
    currentMainPanel:"Empty",
    supportPanelOptions:[],
    supportPanelTitles:[],
    supportPanelIndex:0,
    hasNoMenuPanel: false,
    headerControls:[],
    headerControlsPositions:[]
  });
  const mainPanelArray = useRef([])
  const lastMainPanelKey = useRef(null)
  const mainPanelDictionary = useRef({}) //key -> {index, type}
  const supportPanelArray = useRef([])
  const lastSupportPanelKey = useRef(null)
  const supportPanelDictionary = useRef({}) //key -> {index, type}
  // const [supportContentObj,setSupportContentObj] = useState({})
  const [menusOpen,setMenusOpen] = useState(true)

  

  const LazyPanelObj = useRef({
    Empty:lazy(() => import('./ToolPanels/Empty')),
    NotFound:lazy(() => import('./ToolPanels/NotFound')),
    AccountSettings:lazy(() => import('./ToolPanels/AccountSettings')),
    HomePanel:lazy(() => import('./ToolPanels/HomePanel')),
    Content:lazy(() => import('./ToolPanels/Content')),
    DriveCards:lazy(() => import('./ToolPanels/DriveCards')),
    SignIn:lazy(() => import('./ToolPanels/SignIn')),
    SignOut:lazy(() => import('./ToolPanels/SignOut')),
    NavigationPanel:lazy(() => import('./ToolPanels/NavigationPanel')),
    EditorViewer:lazy(() => import('./ToolPanels/EditorViewer')),
    DoenetMLEditor:lazy(() => import('./ToolPanels/DoenetMLEditor')),
    Enrollment:lazy(() => import('./ToolPanels/Enrollment')),
  }).current;

  const LazyControlObj = useRef({
    BackButton:lazy(() => import('./HeaderControls/BackButton')),
    ViewerUpdateButton:lazy(() => import('./HeaderControls/ViewerUpdateButton')),
    NavigationBreadCrumb: lazy(() => import('./HeaderControls/NavigationBreadCrumb')),
  }).current;
 

  function buildPanel({key,type,visible}){
    let hideStyle = null;
    if (!visible){
      hideStyle = 'none';
    }
    
    return <Suspense key={key} fallback={<LoadingFallback>loading...</LoadingFallback>}>
    {React.createElement(LazyPanelObj[type],{key,style:{display:hideStyle}})}
    </Suspense>
  } 

   let MainPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.currentMainPanel}`;

   if (!mainPanelDictionary.current[MainPanelKey]){
     let type = toolRootMenusAndPanels.currentMainPanel;
     console.log(">>>NEW MAIN PANEL!!!",type)
    //Doesn't exist so make new Main Panel
    mainPanelArray.current.push(buildPanel({key:MainPanelKey,type,visible:true}))
    mainPanelDictionary.current[MainPanelKey] = {index:mainPanelArray.current.length - 1, type, visible:true}
  }

  let headerControls = null;
  let headerControlsPositions = null;
  if (toolRootMenusAndPanels.headerControls){
    headerControls = [];
    headerControlsPositions = [];
    for (const [i,controlName] of Object.entries(toolRootMenusAndPanels.headerControls)){
      const controlObj = LazyControlObj[controlName]
      if (controlObj){
        const key = `headerControls${MainPanelKey}`;
        headerControlsPositions.push(toolRootMenusAndPanels.headerControlsPositions[i])
        headerControls.push(
          <Suspense key={key} fallback={<LoadingFallback>loading...</LoadingFallback>}>
            {React.createElement(controlObj,{key:{key}})}
          </Suspense>
        )
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


   if (toolRootMenusAndPanels.supportPanelOptions && toolRootMenusAndPanels.supportPanelOptions.length > 0){
    const SupportPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex]}-${toolRootMenusAndPanels.supportPanelIndex}`;
    if (!supportPanelDictionary.current[SupportPanelKey]){
     //Doesn't exist so make new Support Panel
     supportPanelArray.current.push(buildPanel({key:SupportPanelKey,type:toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex],visible:true}))
     supportPanelDictionary.current[SupportPanelKey] = {index:supportPanelArray.current.length - 1, type:toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex], visible:true}
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
    
    supportPanel = <SupportPanel hide={false} panelTitles={toolRootMenusAndPanels.supportPanelTitles} panelIndex={toolRootMenusAndPanels.supportPanelIndex}>{supportPanelArray.current}</SupportPanel>
  }

  let menus = <MenuPanel key='menuPanel' hide={true} />;
  if (menusOpen && !toolRootMenusAndPanels.hasNoMenuPanel){
    menus = <MenuPanel key='menuPanel' hide={false} setMenusOpen={setMenusOpen} menusOpen={menusOpen} menusTitles={toolRootMenusAndPanels.menusTitles} currentMenus={toolRootMenusAndPanels.currentMenus} initOpen={toolRootMenusAndPanels.menusInitOpen}/>
  }

  let profileInMainPanel = !menusOpen;
  if (toolRootMenusAndPanels.hasNoMenuPanel){
    profileInMainPanel = false;
  }
  return <>
    <ToolContainer >
      {menus}
      <ContentPanel 
      main={<MainPanel headerControlsPositions={headerControlsPositions} headerControls={headerControls} setMenusOpen={setMenusOpen} displayProfile={profileInMainPanel}>{mainPanelArray.current}</MainPanel>} 
      support={supportPanel}
      />
    
      {/* <FooterPanel><button onClick={()=>props.route.history.push('/Test')}>test</button></FooterPanel> */}
    </ToolContainer>
    <Toast />
   
    {/* <RootController key='root_controller' setToolRootMenusAndPanels={setToolRootMenusAndPanels}/> */}
    <MemoizedRootController key='root_controller' setToolRootMenusAndPanels={setToolRootMenusAndPanels}/>
    <MemoizedOnLeave key='MemoizedOnLeave' />
  </>
} 

// currentMenus:[],
// menusTitles:[],
// menusInitOpen:[],
// currentMainPanel:"",
// supportPanelOptions:[],
// supportPanelTitles:[],
// supportPanelIndex:0,
// hasNoMenuPanel: true,
// headerControls:["BackButton"],
// headerControlsPositions:["Right"], 
// hasNoMenuPanel: true,


let navigationObj = {
  
  content:{
    default:{
      pageName:"Content",
      currentMenus:[],
      menusTitles:[],
      menusInitOpen:[],
      currentMainPanel:"Content",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      hasNoMenuPanel: true,
    }
  },
  course:{
    default:{
      defaultTool:'courseChooser'
    },
    courseChooser:{
      pageName:"Course",
      currentMainPanel:"DriveCards",
      currentMenus:["CreateCourse"],
      menusTitles:["Create Course"],
      // currentMenus:["CreateCourse","CourseEnroll"],
      // menusTitles:["Create Course","Enroll"],
      menusInitOpen:[true,false],
      onLeave:"CourseChooserLeave",
    },
    navigation:{
      pageName:"Course",
      currentMainPanel:"NavigationPanel",
      currentMenus:["AddDriveItems","EnrollStudents"],
      menusTitles:["Add Items","Enrollment"],
      // currentMenus:["AddDriveItems","EnrollStudents","gradebook"],
      // menusTitles:["Add Items","Enrollment","gradebook"],
      menusInitOpen:[true,false],
      headerControls: ["NavigationBreadCrumb"],
      headerControlsPositions: ["Left"],
      onLeave:"NavigationLeave",
    },
    editor:{
      pageName:"Course",
      currentMainPanel:"EditorViewer",
      currentMenus:["VersionHistory","DoenetMLSettings","Variant"], 
      menusTitles:["Version History","Document Settings","Variant"],
      menusInitOpen:[true,false,false],
      supportPanelOptions:["DoenetMLEditor"],
      supportPanelTitles:["DoenetML Editor"],
      supportPanelIndex:0,
      headerControls: ["BackButton","ViewerUpdateButton",],
      headerControlsPositions: ["Left","Left"],
    },
    enrollment:{
      pageName:"Enrollment",
      currentMenus:["LoadEnrollment","ManualEnrollment"],
      menusTitles:["Load","Manual"],
      menusInitOpen:[false,false],
      currentMainPanel:"Enrollment",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      headerControls: ["BackButton"],
      headerControlsPositions: ["Right"]
    }
  },
  home:{
    default:{
      pageName:"Home",
      currentMenus:[],
      menusTitles:[],
      menusInitOpen:[],
      currentMainPanel:"HomePanel",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      hasNoMenuPanel: true,
    }
  },
  notfound:{
    default:{
      pageName:"Notfound",
      currentMenus:[],
      menusInitOpen:[],
      currentMainPanel:"NotFound",
      supportPanelOptions:[],
      hasNoMenuPanel: true,
    }
  },
  settings:{
    default:{
      pageName:"Settings",
      currentMenus:[],
      menusTitles:[],
      menusInitOpen:[],
      currentMainPanel:"AccountSettings",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      hasNoMenuPanel: true,
      headerControls: ["BackButton"],
      headerControlsPositions: ["Right"]
    }
  },
  signin:{
    default:{
      pageName:"SignIn",
      currentMenus:[],
      menusTitles:[],
      menusInitOpen:[],
      currentMainPanel:"SignIn",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      hasNoMenuPanel: true,
    }
  },
  signout:{
    default:{
      pageName:"SignOut",
      currentMenus:[],
      menusTitles:[],
      menusInitOpen:[],
      currentMainPanel:"SignOut",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      hasNoMenuPanel: true,
    }
  },
  
}


let encodeParams = p => Object.entries(p).map(kv => 
  kv.map(encodeURIComponent).join("=")).join("&");

  export const pageToolViewAtom = atom({
    key:"pageToolViewAtom",
    default:{page:"init",tool:"",view:""}
  })

  const onLeaveComponentStr = atom({
    key:"onLeaveComponentStr",
    default:{str:null,updateNum:0}
  })

  export const finishedOnLeave = atom({
    key:"finishedOnLeave",
    default:null
  })

  const MemoizedOnLeave = React.memo(OnLeave)
  function OnLeave(){
    const leaveComponentObj = useRecoilValue(onLeaveComponentStr)
    const leaveComponentStr = leaveComponentObj.str;
    //TODO: make a queue of onLeaveStrings.  Remove from queue after component has finished.
    let leaveComponent = null;

    const LazyEnterLeaveObj = useRef({
      NavigationLeave:lazy(() => import('./EnterLeave/NavigationLeave')),
      CourseChooserLeave:lazy(() => import('./EnterLeave/CourseChooserLeave')),
    }).current;

    if (leaveComponentStr){
      const key = `leave${leaveComponentStr}`
      leaveComponent = <Suspense key={key} fallback={null}>
      {/* {React.createElement(LazyEnterLeaveObj[leaveComponentName.current],{key})} */}
      {React.createElement(LazyEnterLeaveObj[leaveComponentStr])}
      </Suspense>
    }

    return <>{leaveComponent}</>;
  }
  
  const MemoizedRootController = React.memo(RootController)
  function RootController(props){
    const [recoilPageToolView,setRecoilPageToolView ] = useRecoilState(pageToolViewAtom);
    const setOnLeaveStr = useSetRecoilState(onLeaveComponentStr);
    let lastPageToolView = useRef({page:"init",tool:"",view:""});
    let backPageToolView = useRef({page:"init",tool:"",view:""});
    let backParams = useRef({})
    let currentParams = useRef({})
    let lastLocationStr = useRef("");
    let location = useLocation();
    let history = useHistory();
    let lastSearchObj = useRef({});

     const setSearchParamAtom = useRecoilCallback(({set})=> (paramObj)=>{
    //Only set atom if parameter has changed
    for (const [key,value] of Object.entries(paramObj)){
      if (lastSearchObj.current[key] !== value){
        // console.log(`>>>CHANGED so SET key: ${key} value: ${value}  **********`)
        set(searchParamAtomFamily(key),value)
      }
    }
    //If not defined then clear atom
    for (const key of Object.keys(lastSearchObj.current)){
      if (!paramObj[key]){
        // console.log(`>>>clear!!!  -${key}- **********`)
        set(searchParamAtomFamily(key),"") 
      }
    }
  })

 
    // let enterComponent = null; //Lazy loaded entering component
    let leaveComponentName = useRef(null)
    let locationStr = `${location.pathname}${location.search}`;
    let nextPageToolView = {page:"",tool:"",view:""};
    let nextMenusAndPanels = null;
    console.log("\n>>>===RootController")


    //URL change test
    let isURLChange = false;
    if (locationStr !== lastLocationStr.current){
      isURLChange = true;
      nextPageToolView.page = location.pathname.replaceAll("/","").toLowerCase();
      if (nextPageToolView.page === ""){
        nextPageToolView.page = 'home';
        const url = window.location.origin + window.location.pathname + "#home";;
        //update url without pushing on to history
        window.history.replaceState('','',url)
      }
      let searchParamObj = Object.fromEntries(new URLSearchParams(location.search))
      nextPageToolView.tool = searchParamObj['tool'];
      if (!nextPageToolView.tool){
        //Check for a page's default tool
        nextPageToolView.tool = '';
      }
    }

    //Recoil change test
    let isRecoilChange = false;
    if (JSON.stringify(lastPageToolView.current) !== JSON.stringify(recoilPageToolView)){
      isRecoilChange = true;
      // console.log(">>>Recoil change nextPageToolView = recoilPageToolView",recoilPageToolView)
      if (recoilPageToolView.back){
        if (backPageToolView.current.page === "init"){
          backPageToolView.current.page = 'home'; //Go home if started with the page
        }
        // console.log(">>>User hit back button backParams.current",backParams.current)
        let pageToolViewParams = {...backPageToolView.current,params:backParams.current}

        setRecoilPageToolView(pageToolViewParams)
        return null;
      }
      nextPageToolView = {...recoilPageToolView}
      
    }
  
    // console.log(">>>location",location)
    // console.log(">>>isURLChange",isURLChange)
    // console.log(">>>isRecoilChange",isRecoilChange)

    if (!isURLChange && !isRecoilChange){
      //Just updating traking variables
      lastLocationStr.current = locationStr;
    return null;
    }

      //TODO: handle page == "" and tool changed
      //TODO: handle page == "" and tool == "" and view changed
    let isPageChange = false;
    let isToolChange = false;
    let isViewChange = false;
    if (lastPageToolView.current.page !== nextPageToolView.page){
      //Page changed!
      isPageChange = true;
      if (nextPageToolView.tool === ""){
        //Load default
        
        nextMenusAndPanels = navigationObj[nextPageToolView.page].default;
        if (Object.keys(nextMenusAndPanels).includes("defaultTool")){
           const url = window.location.origin + window.location.pathname + "#" + location.pathname + '?' + encodeParams({tool:nextMenusAndPanels.defaultTool});
          //update url without pushing on to history
          window.history.replaceState('','',url)
          nextMenusAndPanels = navigationObj[nextPageToolView.page][nextMenusAndPanels.defaultTool];
        }
      }else{
        nextMenusAndPanels = navigationObj[nextPageToolView.page][nextPageToolView.tool];
      }
     
    }else if (lastPageToolView.current.tool !== nextPageToolView.tool){
      //Tool Changed
      isToolChange = true;
      //TODO: Check for default view
      nextMenusAndPanels = navigationObj[nextPageToolView.page][nextPageToolView.tool];

    }else if (lastPageToolView.current.view !== nextPageToolView.view){
      //View changed!
      isViewChange = true;
    }

    //Update Navigation Leave
    if (isPageChange || isToolChange || isViewChange){
      if (leaveComponentName.current){
        setOnLeaveStr((was)=>({str:leaveComponentName.current,updateNum:was.updateNum+1})) 
      }
      leaveComponentName.current = null;
      if (nextMenusAndPanels.onLeave){
        leaveComponentName.current = nextMenusAndPanels.onLeave
      }
    }


    let searchObj = {}

    //Update recoil isURLChange
    if (isURLChange){
      setRecoilPageToolView(nextPageToolView);
      searchObj = Object.fromEntries(new URLSearchParams(location.search))
      setSearchParamAtom(searchObj)
    }

   

    // console.log(">>>nextMenusAndPanels",nextMenusAndPanels)
    //Only update ToolRoot if nextMenusAndPanels was indicated as a change
    if (nextMenusAndPanels && JSON.stringify(nextPageToolView) !== JSON.stringify(lastPageToolView.current) ){
      backPageToolView.current = lastPageToolView.current;  //Set PageToolView for back button
      let params = {};
      if (isURLChange){
        params = searchObj;
      }else if (isRecoilChange){
        params = recoilPageToolView.params;
      }

        backParams.current = currentParams.current; //Set params for back button
        currentParams.current = params; 

        props.setToolRootMenusAndPanels(nextMenusAndPanels)
      
    }


    if (isRecoilChange){
      //push url with no refresh
      let tool = nextPageToolView.tool;
      let pathname = '/' + recoilPageToolView.page;
      searchObj = {...recoilPageToolView.params}
      if (tool !== "" && tool !== undefined){
        searchObj = {tool,...recoilPageToolView.params};
      }

      let search = "";
      if (Object.keys(searchObj).length > 0){
        search = '?' + encodeParams(searchObj);
      }
      
      const urlPush = pathname + search;

      // console.log(">>>location.search !== search",location.search !== search)
      // console.log(">>>location.search ",location.search )
      // console.log(">>>search",search)

      if (location.search !== search){
        setSearchParamAtom(searchObj)
      }
        
      //Don't add to the url history if it's the same location the browser is at
      if (location.pathname !== pathname || location.search !== search){
        // console.log(">>>UPDATE URL!",urlPush)
        history.push(urlPush);
      }
    }
    lastSearchObj.current = searchObj;
    lastLocationStr.current = locationStr;
    lastPageToolView.current = nextPageToolView;
    return null; 
  }


const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100%;
  height: 100%;
`;





