import React, {useState, lazy, Suspense, useRef} from "../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  useRecoilValue,
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
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
import {useHistory, useLocation} from "../_snowpack/pkg/react-router.js";
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
export default function ToolRoot() {
  console.log(">>>===ToolRoot ");
  const [toolRootMenusAndPanels, setToolRootMenusAndPanels] = useState({
    pageName: "init",
    menuPanelCap: "",
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: "Empty",
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: false,
    headerControls: [],
    headerControlsPositions: []
  });
  const mainPanelArray = useRef([]);
  const lastMainPanelKey = useRef(null);
  const mainPanelDictionary = useRef({});
  const supportPanelArray = useRef([]);
  const lastSupportPanelKey = useRef(null);
  const supportPanelDictionary = useRef({});
  const [menusOpen, setMenusOpen] = useState(true);
  const LazyPanelObj = useRef({
    Empty: lazy(() => import("./ToolPanels/Empty.js")),
    NotFound: lazy(() => import("./ToolPanels/NotFound.js")),
    AccountSettings: lazy(() => import("./ToolPanels/AccountSettings.js")),
    HomePanel: lazy(() => import("./ToolPanels/HomePanel.js")),
    Content: lazy(() => import("./ToolPanels/Content.js")),
    DriveCards: lazy(() => import("./ToolPanels/DriveCards.js")),
    SignIn: lazy(() => import("./ToolPanels/SignIn.js")),
    SignOut: lazy(() => import("./ToolPanels/SignOut.js")),
    NavigationPanel: lazy(() => import("./ToolPanels/NavigationPanel.js")),
    EditorViewer: lazy(() => import("./ToolPanels/EditorViewer.js")),
    DoenetMLEditor: lazy(() => import("./ToolPanels/DoenetMLEditor.js")),
    Enrollment: lazy(() => import("./ToolPanels/Enrollment.js"))
  }).current;
  const LazyControlObj = useRef({
    BackButton: lazy(() => import("./HeaderControls/BackButton.js")),
    ViewerUpdateButton: lazy(() => import("./HeaderControls/ViewerUpdateButton.js")),
    NavigationBreadCrumb: lazy(() => import("./HeaderControls/NavigationBreadCrumb.js")),
    RoleDropdown: lazy(() => import("./HeaderControls/RoleDropdown.js"))
  }).current;
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
  let MainPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.currentMainPanel}`;
  if (!mainPanelDictionary.current[MainPanelKey]) {
    let type = toolRootMenusAndPanels.currentMainPanel;
    console.log(">>>NEW MAIN PANEL!!!", type);
    mainPanelArray.current.push(buildPanel({key: MainPanelKey, type, visible: true}));
    mainPanelDictionary.current[MainPanelKey] = {index: mainPanelArray.current.length - 1, type, visible: true};
  }
  let headerControls = null;
  let headerControlsPositions = null;
  if (toolRootMenusAndPanels.headerControls) {
    headerControls = [];
    headerControlsPositions = [];
    for (const [i, controlName] of Object.entries(toolRootMenusAndPanels.headerControls)) {
      const controlObj = LazyControlObj[controlName];
      if (controlObj) {
        const key = `headerControls${MainPanelKey}`;
        headerControlsPositions.push(toolRootMenusAndPanels.headerControlsPositions[i]);
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
  if (toolRootMenusAndPanels.supportPanelOptions && toolRootMenusAndPanels.supportPanelOptions.length > 0) {
    const SupportPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex]}-${toolRootMenusAndPanels.supportPanelIndex}`;
    if (!supportPanelDictionary.current[SupportPanelKey]) {
      supportPanelArray.current.push(buildPanel({key: SupportPanelKey, type: toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex], visible: true}));
      supportPanelDictionary.current[SupportPanelKey] = {index: supportPanelArray.current.length - 1, type: toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex], visible: true};
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
      panelTitles: toolRootMenusAndPanels.supportPanelTitles,
      panelIndex: toolRootMenusAndPanels.supportPanelIndex
    }, supportPanelArray.current);
  }
  let menus = /* @__PURE__ */ React.createElement(MenuPanel, {
    key: "menuPanel",
    hide: true
  });
  if (menusOpen && !toolRootMenusAndPanels.hasNoMenuPanel) {
    menus = /* @__PURE__ */ React.createElement(MenuPanel, {
      key: "menuPanel",
      hide: false,
      setMenusOpen,
      menusOpen,
      menuPanelCap: toolRootMenusAndPanels.menuPanelCap,
      menusTitles: toolRootMenusAndPanels.menusTitles,
      currentMenus: toolRootMenusAndPanels.currentMenus,
      initOpen: toolRootMenusAndPanels.menusInitOpen
    });
  }
  let profileInMainPanel = !menusOpen;
  if (toolRootMenusAndPanels.hasNoMenuPanel) {
    profileInMainPanel = false;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ToolContainer, null, menus, /* @__PURE__ */ React.createElement(ContentPanel, {
    main: /* @__PURE__ */ React.createElement(MainPanel, {
      headerControlsPositions,
      headerControls,
      setMenusOpen,
      displayProfile: profileInMainPanel
    }, mainPanelArray.current),
    support: supportPanel
  })), /* @__PURE__ */ React.createElement(Toast, null), /* @__PURE__ */ React.createElement(MemoizedRootController, {
    key: "root_controller",
    setToolRootMenusAndPanels
  }), /* @__PURE__ */ React.createElement(MemoizedOnLeave, {
    key: "MemoizedOnLeave"
  }));
}
let navigationObj = {
  content: {
    default: {
      pageName: "Content",
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: "Content",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true
    }
  },
  course: {
    default: {
      defaultTool: "courseChooser"
    },
    courseChooser: {
      pageName: "Course",
      currentMainPanel: "DriveCards",
      currentMenus: ["CreateCourse"],
      menusTitles: ["Create Course"],
      menusInitOpen: [true, false],
      onLeave: "CourseChooserLeave"
    },
    navigation: {
      pageName: "Course",
      currentMainPanel: "NavigationPanel",
      menuPanelCap: "DriveInfoCap",
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      headerControls: ["NavigationBreadCrumb", "RoleDropdown"],
      headerControlsPositions: ["Left", "Right"],
      onLeave: "NavigationLeave",
      views: {
        instructor: {
          currentMenus: ["AddDriveItems", "EnrollStudents"],
          menusTitles: ["Add Items", "Enrollment"],
          menusInitOpen: [true, false]
        },
        student: {}
      }
    },
    editor: {
      pageName: "Course",
      menuPanelCap: "EditorInfoCap",
      currentMainPanel: "EditorViewer",
      currentMenus: ["VersionHistory", "DoenetMLSettings", "Variant"],
      menusTitles: ["Version History", "Document Settings", "Variant"],
      menusInitOpen: [true, false, false],
      supportPanelOptions: ["DoenetMLEditor"],
      supportPanelTitles: ["DoenetML Editor"],
      supportPanelIndex: 0,
      headerControls: ["BackButton", "ViewerUpdateButton"],
      headerControlsPositions: ["Left", "Left"]
    },
    enrollment: {
      pageName: "Enrollment",
      currentMenus: ["LoadEnrollment", "ManualEnrollment"],
      menusTitles: ["Load", "Manual"],
      menusInitOpen: [false, false],
      currentMainPanel: "Enrollment",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      headerControls: ["BackButton"],
      headerControlsPositions: ["Right"]
    }
  },
  home: {
    default: {
      pageName: "Home",
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: "HomePanel",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true
    }
  },
  notfound: {
    default: {
      pageName: "Notfound",
      currentMenus: [],
      menusInitOpen: [],
      currentMainPanel: "NotFound",
      supportPanelOptions: [],
      hasNoMenuPanel: true
    }
  },
  settings: {
    default: {
      pageName: "Settings",
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: "AccountSettings",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true,
      headerControls: ["BackButton"],
      headerControlsPositions: ["Right"]
    }
  },
  signin: {
    default: {
      pageName: "SignIn",
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: "SignIn",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true
    }
  },
  signout: {
    default: {
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
  }
};
let encodeParams = (p) => Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
export const pageToolViewAtom = atom({
  key: "pageToolViewAtom",
  default: {page: "init", tool: "", view: ""}
});
const onLeaveComponentStr = atom({
  key: "onLeaveComponentStr",
  default: {str: null, updateNum: 0}
});
export const finishedOnLeave = atom({
  key: "finishedOnLeave",
  default: null
});
const MemoizedOnLeave = React.memo(OnLeave);
function OnLeave() {
  const leaveComponentObj = useRecoilValue(onLeaveComponentStr);
  const leaveComponentStr = leaveComponentObj.str;
  let leaveComponent = null;
  const LazyEnterLeaveObj = useRef({
    NavigationLeave: lazy(() => import("./EnterLeave/NavigationLeave.js")),
    CourseChooserLeave: lazy(() => import("./EnterLeave/CourseChooserLeave.js"))
  }).current;
  if (leaveComponentStr) {
    const key = `leave${leaveComponentStr}`;
    leaveComponent = /* @__PURE__ */ React.createElement(Suspense, {
      key,
      fallback: null
    }, React.createElement(LazyEnterLeaveObj[leaveComponentStr]));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, leaveComponent);
}
const MemoizedRootController = React.memo(RootController);
function RootController(props) {
  const [recoilPageToolView, setRecoilPageToolView] = useRecoilState(pageToolViewAtom);
  const setOnLeaveStr = useSetRecoilState(onLeaveComponentStr);
  let lastPageToolView = useRef({page: "init", tool: "", view: ""});
  let backPageToolView = useRef({page: "init", tool: "", view: ""});
  let backParams = useRef({});
  let currentParams = useRef({});
  let lastLocationStr = useRef("");
  let location = useLocation();
  let history = useHistory();
  let lastSearchObj = useRef({});
  const setSearchParamAtom = useRecoilCallback(({set}) => (paramObj) => {
    for (const [key, value] of Object.entries(paramObj)) {
      if (lastSearchObj.current[key] !== value) {
        set(searchParamAtomFamily(key), value);
      }
    }
    for (const key of Object.keys(lastSearchObj.current)) {
      if (!paramObj[key]) {
        set(searchParamAtomFamily(key), "");
      }
    }
  });
  let leaveComponentName = useRef(null);
  let locationStr = `${location.pathname}${location.search}`;
  let nextPageToolView = {page: "", tool: "", view: ""};
  let nextMenusAndPanels = null;
  console.log("\n>>>===RootController");
  let isURLChange = false;
  if (locationStr !== lastLocationStr.current) {
    isURLChange = true;
    nextPageToolView.page = location.pathname.replaceAll("/", "").toLowerCase();
    if (nextPageToolView.page === "") {
      nextPageToolView.page = "home";
      const url = window.location.origin + window.location.pathname + "#home";
      ;
      window.history.replaceState("", "", url);
    }
    let searchParamObj = Object.fromEntries(new URLSearchParams(location.search));
    nextPageToolView.tool = searchParamObj["tool"];
    if (!nextPageToolView.tool) {
      nextPageToolView.tool = "";
    }
  }
  let isRecoilChange = false;
  if (JSON.stringify(lastPageToolView.current) !== JSON.stringify(recoilPageToolView)) {
    isRecoilChange = true;
    if (recoilPageToolView.back) {
      if (backPageToolView.current.page === "init") {
        backPageToolView.current.page = "home";
      }
      let pageToolViewParams = {...backPageToolView.current, params: backParams.current};
      setRecoilPageToolView(pageToolViewParams);
      return null;
    }
    nextPageToolView = {...recoilPageToolView};
  }
  if (!isURLChange && !isRecoilChange) {
    lastLocationStr.current = locationStr;
    return null;
  }
  let isPageChange = false;
  let isToolChange = false;
  let isViewChange = false;
  if (lastPageToolView.current.page !== nextPageToolView.page) {
    isPageChange = true;
    if (nextPageToolView.tool === "") {
      nextMenusAndPanels = navigationObj[nextPageToolView.page].default;
      if (Object.keys(nextMenusAndPanels).includes("defaultTool")) {
        const url = window.location.origin + window.location.pathname + "#" + location.pathname + "?" + encodeParams({tool: nextMenusAndPanels.defaultTool});
        window.history.replaceState("", "", url);
        nextMenusAndPanels = navigationObj[nextPageToolView.page][nextMenusAndPanels.defaultTool];
      }
    } else {
      nextMenusAndPanels = navigationObj[nextPageToolView.page][nextPageToolView.tool];
    }
  } else if (lastPageToolView.current.tool !== nextPageToolView.tool) {
    isToolChange = true;
    nextMenusAndPanels = navigationObj[nextPageToolView.page][nextPageToolView.tool];
  } else if (lastPageToolView.current.view !== nextPageToolView.view) {
    isViewChange = true;
    nextMenusAndPanels = {...navigationObj[nextPageToolView.page][nextPageToolView.tool]};
  }
  let viewOverrides = nextMenusAndPanels?.views?.[nextPageToolView.view];
  if (isViewChange && typeof viewOverrides === "object" && viewOverrides !== null) {
    for (let key of Object.keys(viewOverrides)) {
      nextMenusAndPanels[key] = viewOverrides[key];
    }
  }
  if (isPageChange || isToolChange) {
    if (leaveComponentName.current) {
      setOnLeaveStr((was) => ({str: leaveComponentName.current, updateNum: was.updateNum + 1}));
    }
    leaveComponentName.current = null;
    if (nextMenusAndPanels.onLeave) {
      leaveComponentName.current = nextMenusAndPanels.onLeave;
    }
  }
  let searchObj = {};
  if (isURLChange) {
    searchObj = Object.fromEntries(new URLSearchParams(location.search));
    setSearchParamAtom(searchObj);
    nextPageToolView["params"] = {...searchObj};
    delete nextPageToolView["params"].tool;
    setRecoilPageToolView(nextPageToolView);
  }
  if (nextMenusAndPanels && JSON.stringify(nextPageToolView) !== JSON.stringify(lastPageToolView.current)) {
    backPageToolView.current = lastPageToolView.current;
    let params = {};
    if (isURLChange) {
      params = searchObj;
    } else if (isRecoilChange) {
      params = recoilPageToolView.params;
    }
    backParams.current = currentParams.current;
    currentParams.current = params;
    props.setToolRootMenusAndPanels(nextMenusAndPanels);
  }
  if (isRecoilChange) {
    let tool = nextPageToolView.tool;
    let pathname = "/" + recoilPageToolView.page;
    searchObj = {...recoilPageToolView.params};
    if (tool !== "" && tool !== void 0) {
      searchObj = {tool, ...recoilPageToolView.params};
    }
    let search = "";
    if (Object.keys(searchObj).length > 0) {
      search = "?" + encodeParams(searchObj);
    }
    const urlPush = pathname + search;
    if (location.search !== search) {
      setSearchParamAtom(searchObj);
    }
    if (location.pathname !== pathname || location.search !== search) {
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
