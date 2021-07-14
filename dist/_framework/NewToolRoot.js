import React, {useState, lazy, Suspense, useRef, useEffect} from "../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  atomFamily,
  useRecoilValue,
  useRecoilCallback,
  useRecoilValueLoadable,
  useSetRecoilState,
  useRecoilState
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import Toast from "./Toast.js";
import ContentPanel from "./Panels/NewContentPanel.js";
import axios from "../_snowpack/pkg/axios.js";
import MainPanel from "./Panels/NewMainPanel.js";
import SupportPanel from "./Panels/NewSupportPanel.js";
import MenuPanel from "./Panels/NewMenuPanel.js";
import FooterPanel from "./Panels/FooterPanel.js";
import {animated} from "../_snowpack/pkg/@react-spring/web.js";
import {selectedMenuPanelAtom} from "./Panels/NewMenuPanel.js";
import {mainPanelClickAtom} from "./Panels/NewMainPanel.js";
import {useHistory} from "../_snowpack/pkg/react-router.js";
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
      try {
        const profile = JSON.parse(localStorage.getItem("Profile"));
        if (profile) {
          return profile;
        }
        const {data} = await axios.get("/api/loadProfile.php");
        localStorage.setItem("Profile", JSON.stringify(data.profile));
        return data.profile;
      } catch (error) {
        console.log("Error loading user profile", error.message);
        return {};
      }
    }
  })
});
export const searchParamAtomFamily = atomFamily({
  key: "searchParamAtomFamily",
  default: ""
});
export const paramObjAtom = atom({
  key: "paramObjAtom",
  default: {}
});
const urlChangeSourceParamObjAtom = atom({
  key: "urlChangeSourceParamObjAtom",
  default: {}
});
export const toolViewAtom = atom({
  key: "toolViewAtom",
  default: {
    pageName: "Init"
  }
});
let toolsObj = {
  content: {
    pageName: "Content",
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: "Content",
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: true
  },
  course: {
    pageName: "Course",
    toolHandler: "CourseToolHandler"
  },
  home: {
    pageName: "Home",
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: "HomePanel",
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: true
  },
  notfound: {
    pageName: "Notfound",
    currentMenus: [],
    menusInitOpen: [],
    currentMainPanel: "NotFound",
    supportPanelOptions: [],
    hasNoMenuPanel: true
  },
  settings: {
    pageName: "Settings",
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: "AccountSettings",
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: true,
    headerControls: ["CloseProfileButton"],
    headerControlsPositions: ["Right"]
  },
  signin: {
    pageName: "SignIn",
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: "SignIn",
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: true
  },
  signout: {
    pageName: "SignOut",
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: "SignOut",
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: true
  }
};
let encodeParams = (p) => Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
export default function ToolRoot(props) {
  const profile = useRecoilValueLoadable(profileAtom);
  const toolViewInfo = useRecoilValue(toolViewAtom);
  const mainPanelArray = useRef([]);
  const lastMainPanelKey = useRef(null);
  const mainPanelDictionary = useRef({});
  const supportPanelArray = useRef([]);
  const lastSupportPanelKey = useRef(null);
  const supportPanelDictionary = useRef({});
  const [menusOpen, setMenusOpen] = useState(true);
  const setPage = useRecoilCallback(({set}) => (tool, origPath) => {
    if (tool === "") {
      window.history.replaceState("", "", "/new#/home");
    } else {
      let newTool = toolsObj[tool];
      if (!newTool) {
        let newParams = {};
        newParams["path"] = `${origPath}`;
        const ePath = encodeParams(newParams);
        location.href = `#/notfound?${ePath}`;
      } else {
        set(toolViewAtom, newTool);
      }
    }
    set(selectedMenuPanelAtom, "");
    set(mainPanelClickAtom, []);
  });
  const LazyPanelObj = useRef({
    Empty: lazy(() => import("./ToolPanels/Empty.js")),
    NotFound: lazy(() => import("./ToolPanels/NotFound.js")),
    AccountSettings: lazy(() => import("./ToolPanels/AccountSettings.js")),
    HomePanel: lazy(() => import("./ToolPanels/HomePanel.js")),
    Content: lazy(() => import("./ToolPanels/Content.js")),
    DriveCards: lazy(() => import("./ToolPanels/DriveCards.js")),
    SignIn: lazy(() => import("./ToolPanels/SignIn.js")),
    SignOut: lazy(() => import("./ToolPanels/SignOut.js")),
    DrivePanel: lazy(() => import("./ToolPanels/DrivePanel.js")),
    EditorViewer: lazy(() => import("./ToolPanels/EditorViewer.js")),
    DoenetMLEditor: lazy(() => import("./ToolPanels/DoenetMLEditor.js"))
  }).current;
  const LazyControlObj = useRef({
    CloseProfileButton: lazy(() => import("./HeaderControls/CloseProfileButton.js")),
    ViewerUpdateButton: lazy(() => import("./HeaderControls/ViewerUpdateButton.js"))
  }).current;
  const LazyToolHandlerObj = useRef({
    CourseToolHandler: lazy(() => import("./ToolHandlers/CourseToolHandler.js"))
  }).current;
  const lastURL = useRef("");
  let setUrlChangeSourceParamObjAtom = useSetRecoilState(urlChangeSourceParamObjAtom);
  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile.contents);
    return null;
  }
  console.log(">>>===ToolRoot");
  const lastURLProp = lastURL.current;
  if (location.href !== lastURL.current) {
    let searchParamObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
    setUrlChangeSourceParamObjAtom(searchParamObj);
    lastURL.current = location.href;
  }
  function buildPanel({key, type, visible}) {
    let hideStyle = null;
    if (!visible) {
      hideStyle = "none";
    }
    return /* @__PURE__ */ React.createElement(Suspense, {
      key,
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyPanelObj[type], {key, style: {display: hideStyle}}));
  }
  const lcpath = props.route.location.pathname.replaceAll("/", "").toLowerCase();
  if (toolViewInfo.pageName.toLowerCase() !== lcpath) {
    setPage(lcpath, props.route.location.pathname);
    return null;
  }
  let toolHandler = null;
  if (toolViewInfo.toolHandler) {
    const ToolHandlerKey = `${toolViewInfo.pageName}-${toolViewInfo.toolHandler}`;
    const handler = LazyToolHandlerObj[toolViewInfo.toolHandler];
    if (handler) {
      toolHandler = /* @__PURE__ */ React.createElement(Suspense, {
        key: ToolHandlerKey,
        fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
      }, React.createElement(handler, {key: ToolHandlerKey}));
    }
  }
  let MainPanelKey = `${toolViewInfo.pageName}-${toolViewInfo.currentMainPanel}`;
  if (!toolViewInfo.currentMainPanel) {
    MainPanelKey = "Empty";
  }
  if (!mainPanelDictionary.current[MainPanelKey]) {
    let type = toolViewInfo.currentMainPanel;
    if (MainPanelKey === "Empty") {
      type = "Empty";
    }
    console.log(">>>NEW MAIN PANEL!!!", type);
    mainPanelArray.current.push(buildPanel({key: MainPanelKey, type, visible: true}));
    mainPanelDictionary.current[MainPanelKey] = {index: mainPanelArray.current.length - 1, type, visible: true};
  }
  let headerControls = null;
  let headerControlsPositions = null;
  if (toolViewInfo.headerControls) {
    headerControls = [];
    headerControlsPositions = [];
    for (const [i, controlName] of Object.entries(toolViewInfo.headerControls)) {
      const controlObj = LazyControlObj[controlName];
      if (controlObj) {
        const key = `headerControls${MainPanelKey}`;
        headerControlsPositions.push(toolViewInfo.headerControlsPositions[i]);
        headerControls.push(/* @__PURE__ */ React.createElement(Suspense, {
          key,
          fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
        }, React.createElement(controlObj, {key: {key}})));
      }
    }
  }
  if (lastMainPanelKey.current !== null && lastMainPanelKey.current !== MainPanelKey) {
    const mpObj = mainPanelDictionary.current[MainPanelKey];
    const lastObj = mainPanelDictionary.current[lastMainPanelKey.current];
    if (!mpObj.visible) {
      mainPanelArray.current[mpObj.index] = buildPanel({key: MainPanelKey, type: mpObj.type, visible: true});
      mpObj.visible = true;
    }
    if (lastObj.visible) {
      mainPanelArray.current[lastObj.index] = buildPanel({key: lastMainPanelKey.current, type: lastObj.type, visible: false});
      lastObj.visible = false;
    }
  }
  lastMainPanelKey.current = MainPanelKey;
  let supportPanel = /* @__PURE__ */ React.createElement(SupportPanel, {
    hide: true
  }, supportPanelArray.current);
  if (toolViewInfo.supportPanelOptions && toolViewInfo.supportPanelOptions.length > 0) {
    const SupportPanelKey = `${toolViewInfo.pageName}-${toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex]}-${toolViewInfo.supportPanelIndex}`;
    if (!supportPanelDictionary.current[SupportPanelKey]) {
      supportPanelArray.current.push(buildPanel({key: SupportPanelKey, type: toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex], visible: true}));
      supportPanelDictionary.current[SupportPanelKey] = {index: supportPanelArray.current.length - 1, type: toolViewInfo.supportPanelOptions[toolViewInfo.supportPanelIndex], visible: true};
    }
    if (lastSupportPanelKey.current !== null && lastSupportPanelKey.current !== SupportPanelKey) {
      const spObj = supportPanelDictionary.current[SupportPanelKey];
      const lastObj = supportPanelDictionary.current[lastSupportPanelKey.current];
      if (!spObj.visible) {
        supportPanelArray.current[spObj.index] = buildPanel({key: SupportPanelKey, type: spObj.type, visible: true});
        spObj.visible = true;
      }
      if (lastObj.visible) {
        supportPanelArray.current[lastObj.index] = buildPanel({key: lastSupportPanelKey.current, type: lastObj.type, visible: false});
        lastObj.visible = false;
      }
    }
    lastSupportPanelKey.current = SupportPanelKey;
    supportPanel = /* @__PURE__ */ React.createElement(SupportPanel, {
      hide: false,
      panelTitles: toolViewInfo.supportPanelTitles,
      panelIndex: toolViewInfo.supportPanelIndex
    }, supportPanelArray.current);
  }
  let menus = /* @__PURE__ */ React.createElement(MenuPanel, {
    key: "menuPanel",
    hide: true
  });
  if (menusOpen && !toolViewInfo.hasNoMenuPanel) {
    menus = /* @__PURE__ */ React.createElement(MenuPanel, {
      key: "menuPanel",
      hide: false,
      setMenusOpen,
      menusOpen,
      menusTitles: toolViewInfo.menusTitles,
      currentMenus: toolViewInfo.currentMenus,
      initOpen: toolViewInfo.menusInitOpen
    });
  }
  let profileInMainPanel = !menusOpen;
  if (toolViewInfo.hasNoMenuPanel) {
    profileInMainPanel = false;
  }
  return /* @__PURE__ */ React.createElement(ProfileContext.Provider, {
    value: profile.contents
  }, /* @__PURE__ */ React.createElement(ToolContainer, null, menus, /* @__PURE__ */ React.createElement(ContentPanel, {
    main: /* @__PURE__ */ React.createElement(MainPanel, {
      headerControlsPositions,
      headerControls,
      setMenusOpen,
      displayProfile: profileInMainPanel
    }, mainPanelArray.current),
    support: supportPanel
  })), /* @__PURE__ */ React.createElement(Toast, null), toolHandler, /* @__PURE__ */ React.createElement(RecoilSearchParamUpdater, {
    lastURL: lastURLProp,
    setURL: (newURL) => {
      lastURL.current = newURL;
    }
  }));
}
function RecoilSearchParamUpdater(prop) {
  let [eventSourceParamObj, setEventSourceParamObj] = useRecoilState(paramObjAtom);
  let [urlSourceParamObj, setUrlSourceParamObj] = useRecoilState(urlChangeSourceParamObjAtom);
  let currentParamObj = useRef({});
  let lastPathName = useRef("");
  let history = useHistory();
  let isURLSourceFLAG = false;
  if (JSON.stringify(urlSourceParamObj) !== JSON.stringify(currentParamObj.current)) {
    isURLSourceFLAG = true;
  }
  let isEventSourceFLAG = false;
  if (JSON.stringify(eventSourceParamObj) !== JSON.stringify(currentParamObj.current)) {
    isEventSourceFLAG = true;
  }
  const setSearchParamAtom = useRecoilCallback(({set}) => (paramObj) => {
    for (const [key, value] of Object.entries(paramObj)) {
      if (currentParamObj.current[key] !== value) {
        set(searchParamAtomFamily(key), value);
      }
    }
    for (const key of Object.keys(currentParamObj.current)) {
      if (!paramObj[key]) {
        set(searchParamAtomFamily(key), "");
      }
    }
  });
  if (isURLSourceFLAG) {
    setSearchParamAtom(urlSourceParamObj);
  } else if (isEventSourceFLAG) {
    setSearchParamAtom(eventSourceParamObj);
  }
  let [pathname, urlSearchParams] = location.hash.split("?");
  pathname = pathname.replace("#", "");
  if (!urlSearchParams) {
    urlSearchParams = {};
  }
  if (isEventSourceFLAG) {
    const url = location.origin + location.pathname + "#" + pathname + "?" + encodeParams(eventSourceParamObj);
    if (!currentParamObj.current?.tool) {
      window.history.replaceState("", "", url);
    } else {
      const route = pathname + "?" + encodeParams(eventSourceParamObj);
      history.push(route);
    }
    prop.setURL(url);
  }
  lastPathName.current = pathname;
  if (isURLSourceFLAG) {
    currentParamObj.current = urlSourceParamObj;
    setEventSourceParamObj(urlSourceParamObj);
  } else if (isEventSourceFLAG) {
    currentParamObj.current = eventSourceParamObj;
    setUrlSourceParamObj(eventSourceParamObj);
  }
  return null;
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
