import React, {useState, lazy, Suspense, useRef, useEffect} from "../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  useRecoilValue,
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
} from "../_snowpack/pkg/recoil.js";
import styled, {keyframes} from "../_snowpack/pkg/styled-components.js";
import Toast from "./Toast.js";
import ContentPanel from "./Panels/NewContentPanel.js";
import axios from "../_snowpack/pkg/axios.js";
import MainPanel from "./Panels/NewMainPanel.js";
import SupportPanel from "./Panels/NewSupportPanel.js";
import MenuPanel from "./Panels/NewMenuPanel.js";
import FooterPanel from "./Panels/FooterPanel.js";
import {animated} from "../_snowpack/pkg/@react-spring/web.js";
import {darkModeAtom} from "./Panels/NewMenuPanel.js";
import {useNavigate, useLocation} from "../_snowpack/pkg/react-router.js";
const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'menuPanel contentPanel ' 1fr
    'menuPanel footerPanel ' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: var(--mainGray);
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  gap: 0px;
  box-sizing: border-box;
  border: var(--canvastext);
  color: var(--canvastext);
`;
export const profileAtom = atom({
  key: "profileAtom",
  default: selector({
    key: "profileAtom/Default",
    get: async () => {
      try {
        const {data} = await axios.get("/api/loadProfile.php");
        return data.profile;
      } catch (error) {
        console.error("Error loading user profile", error.message);
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
  const darkModeToggle = useRecoilValue(darkModeAtom);
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
    hasNoHeaderPanel: false,
    headerControls: [],
    displaySettings: true,
    footer: null
  });
  let mainPanel = null;
  let supportPanel = /* @__PURE__ */ React.createElement(SupportPanel, {
    hide: true
  }, "null");
  const [menusOpen, setMenusOpen] = useState(true);
  const LazyPanelObj = useRef({
    Empty: lazy(() => import("./ToolPanels/Empty.js")),
    NotFound: lazy(() => import("./ToolPanels/NotFound.js")),
    AccountSettings: lazy(() => import("./ToolPanels/AccountSettings.js")),
    HomePanel: lazy(() => import("./ToolPanels/HomePanel.js")),
    PublicActivityViewer: lazy(() => import("./ToolPanels/PublicActivityViewer.js")),
    DriveCards: lazy(() => import("./ToolPanels/DriveCards.js")),
    SignIn: lazy(() => import("./ToolPanels/SignIn.js")),
    SignOut: lazy(() => import("./ToolPanels/SignOut.js")),
    NavigationPanel: lazy(() => import("./ToolPanels/NavigationPanel.js")),
    Dashboard: lazy(() => import("./ToolPanels/Dashboard.js")),
    Gradebook: lazy(() => import("./ToolPanels/Gradebook.js")),
    GradebookAssignment: lazy(() => import("./ToolPanels/GradebookAssignment.js")),
    GradebookStudent: lazy(() => import("./ToolPanels/GradebookStudent.js")),
    GradebookStudentAssignment: lazy(() => import("./ToolPanels/GradebookStudentAssignment.js")),
    GradebookAttempt: lazy(() => import("./ToolPanels/GradebookAttempt.js")),
    EditorViewer: lazy(() => import("./ToolPanels/EditorViewer.js")),
    AssignmentViewer: lazy(() => import("./ToolPanels/AssignmentViewer.js")),
    DraftAssignmentViewer: lazy(() => import("./ToolPanels/DraftAssignmentViewer.js")),
    DataPanel: lazy(() => import("./ToolPanels/DataPanel.js")),
    SurveyDataViewer: lazy(() => import("./ToolPanels/SurveyDataViewer.js")),
    DoenetMLEditor: lazy(() => import("./ToolPanels/DoenetMLEditor.js")),
    Enrollment: lazy(() => import("./ToolPanels/Enrollment.js")),
    ChooseLearnerPanel: lazy(() => import("./ToolPanels/ChooseLearnerPanel.js")),
    EndExamPanel: lazy(() => import("./ToolPanels/EndExamPanel.js")),
    GuestDoenetMLEditor: lazy(() => import("./ToolPanels/GuestDoenetMLEditor.js")),
    GuestEditorViewer: lazy(() => import("./ToolPanels/GuestEditorViewer.js"))
  }).current;
  const LazyControlObj = useRef({
    BackButton: lazy(() => import("./HeaderControls/BackButton.js")),
    ViewerUpdateButton: lazy(() => import("./HeaderControls/ViewerUpdateButton.js")),
    NavigationBreadCrumb: lazy(() => import("./HeaderControls/NavigationBreadCrumb.js")),
    ChooserBreadCrumb: lazy(() => import("./HeaderControls/ChooserBreadCrumb.js")),
    DashboardBreadCrumb: lazy(() => import("./HeaderControls/DashboardBreadCrumb.js")),
    EnrollmentBreadCrumb: lazy(() => import("./HeaderControls/EnrollmentBreadCrumb.js")),
    DataBreadCrumb: lazy(() => import("./HeaderControls/DataBreadCrumb.js")),
    EditorBreadCrumb: lazy(() => import("./HeaderControls/EditorBreadCrumb.js")),
    GradebookBreadCrumb: lazy(() => import("./HeaderControls/GradebookBreadCrumb.js")),
    AssignmentBreadCrumb: lazy(() => import("./HeaderControls/AssignmentBreadCrumb.js")),
    AssignmentNewAttempt: lazy(() => import("./HeaderControls/AssignmentNewAttempt.js"))
  }).current;
  const LazyFooterObj = useRef({
    MathInputKeyboard: lazy(() => import("./Footers/MathInputKeyboard.js"))
  }).current;
  let MainPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.currentMainPanel}`;
  mainPanel = /* @__PURE__ */ React.createElement(Suspense, {
    key: MainPanelKey,
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, /* @__PURE__ */ React.createElement(Svg, null, /* @__PURE__ */ React.createElement(DonutG1, null, /* @__PURE__ */ React.createElement(Circle, {
      id: "donut",
      fill: "var(--donutBody)",
      r: "60"
    }), /* @__PURE__ */ React.createElement(Circle, {
      id: "donut-topping",
      fill: "var(--donutTopping)",
      r: "48"
    }), /* @__PURE__ */ React.createElement(Circle, {
      id: "donut-hole",
      fill: "var(--canvas)",
      r: "19"
    }))), /* @__PURE__ */ React.createElement(Svg, null, /* @__PURE__ */ React.createElement(DonutG2, null, /* @__PURE__ */ React.createElement(Circle, {
      id: "donut",
      fill: "var(--donutBody)",
      r: "60"
    }), /* @__PURE__ */ React.createElement(Circle, {
      id: "donut-topping",
      fill: "var(--donutTopping)",
      r: "48"
    }), /* @__PURE__ */ React.createElement(Circle, {
      id: "donut-hole",
      fill: "var(--canvas)",
      r: "19"
    }))), /* @__PURE__ */ React.createElement(Svg, null, /* @__PURE__ */ React.createElement(DonutG3, null, /* @__PURE__ */ React.createElement(Circle, {
      id: "donut",
      fill: "var(--donutBody)",
      r: "60"
    }), /* @__PURE__ */ React.createElement(Circle, {
      id: "donut-topping",
      fill: "var(--donutTopping)",
      r: "48"
    }), /* @__PURE__ */ React.createElement(Circle, {
      id: "donut-hole",
      fill: "var(--canvas)",
      r: "19"
    }))))
  }, React.createElement(LazyPanelObj[toolRootMenusAndPanels.currentMainPanel], {MainPanelKey}));
  if (toolRootMenusAndPanels?.supportPanelOptions && toolRootMenusAndPanels?.supportPanelOptions.length > 0) {
    const spType = toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex];
    const SupportPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.supportPanelOptions[toolRootMenusAndPanels.supportPanelIndex]}-${toolRootMenusAndPanels.supportPanelIndex}`;
    supportPanel = /* @__PURE__ */ React.createElement(SupportPanel, {
      hide: false,
      panelTitles: toolRootMenusAndPanels.supportPanelTitles,
      panelIndex: toolRootMenusAndPanels.supportPanelIndex
    }, /* @__PURE__ */ React.createElement(Suspense, {
      key: SupportPanelKey,
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, {
        display: "static"
      }, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TBody, null, /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
        className: "Td2"
      }), /* @__PURE__ */ React.createElement(Td, {
        className: "Td3"
      }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
        className: "Td2"
      }), /* @__PURE__ */ React.createElement(Td, {
        className: "Td3"
      }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
        className: "Td2"
      }), /* @__PURE__ */ React.createElement(Td, {
        className: "Td3"
      }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
        className: "Td2"
      }), /* @__PURE__ */ React.createElement(Td, {
        className: "Td3"
      }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
        className: "Td2"
      }), /* @__PURE__ */ React.createElement(Td, {
        className: "Td3"
      }, /* @__PURE__ */ React.createElement(Td3Span, null))))))
    }, React.createElement(LazyPanelObj[spType], {SupportPanelKey})));
  }
  let headerControls = null;
  if (toolRootMenusAndPanels.headerControls) {
    headerControls = [];
    for (const [, controlName] of Object.entries(toolRootMenusAndPanels.headerControls)) {
      const controlObj = LazyControlObj[controlName];
      if (controlObj) {
        const key = `headerControls${MainPanelKey}`;
        headerControls.push(/* @__PURE__ */ React.createElement(Suspense, {
          key,
          fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, /* @__PURE__ */ React.createElement(BreadcrumbContainer, null, /* @__PURE__ */ React.createElement(BreadcrumbOutline, null)))
        }, React.createElement(controlObj, {key: {key}})));
      }
    }
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
      initOpen: toolRootMenusAndPanels.menusInitOpen,
      displaySettings: toolRootMenusAndPanels.displaySettings
    });
  }
  let openMenuButton = !menusOpen;
  if (toolRootMenusAndPanels.hasNoMenuPanel) {
    openMenuButton = false;
  }
  let footer = null;
  if (toolRootMenusAndPanels.footer) {
    let footerKey = `footer`;
    footer = /* @__PURE__ */ React.createElement(FooterPanel, {
      id: "keyboard",
      isInitOpen: toolRootMenusAndPanels.footer.open,
      height: toolRootMenusAndPanels.footer.height,
      "aria-label": "keyboard"
    }, /* @__PURE__ */ React.createElement(Suspense, {
      key: footerKey,
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyFooterObj[toolRootMenusAndPanels.footer.component], {
      key: {footerKey}
    })));
  }
  return /* @__PURE__ */ React.createElement("html", {
    dark: darkModeToggle === true ? "true" : null
  }, /* @__PURE__ */ React.createElement(ToolContainer, null, menus, /* @__PURE__ */ React.createElement(ContentPanel, {
    main: /* @__PURE__ */ React.createElement(MainPanel, {
      headerControls,
      setMenusOpen,
      openMenuButton,
      displaySettings: toolRootMenusAndPanels.displaySettings,
      hasNoHeaderPanel: toolRootMenusAndPanels.hasNoHeaderPanel
    }, mainPanel),
    hasNoHeaderPanel: toolRootMenusAndPanels.hasNoHeaderPanel,
    support: supportPanel
  }), footer), /* @__PURE__ */ React.createElement(Toast, null), /* @__PURE__ */ React.createElement(MemoizedRootController, {
    key: "root_controller",
    setToolRootMenusAndPanels
  }), /* @__PURE__ */ React.createElement(MemoizedOnLeave, {
    key: "MemoizedOnLeave"
  }));
}
let navigationObj = {
  exam: {
    default: {
      defaultTool: "chooseLearner"
    },
    chooseLearner: {
      pageName: "chooseLearner",
      currentMainPanel: "ChooseLearnerPanel",
      displaySettings: false
    },
    assessment: {
      pageName: "Assessment",
      menuPanelCap: "AssignmentInfoCap",
      currentMainPanel: "AssignmentViewer",
      currentMenus: ["TimerMenu"],
      menusTitles: ["Time Remaining"],
      menusInitOpen: [true],
      headerControls: [],
      displaySettings: false,
      waitForMenuSuppression: true,
      footer: {height: 250, open: false, component: "MathInputKeyboard"}
    },
    endExam: {
      pageName: "endExam",
      currentMainPanel: "EndExamPanel",
      displaySettings: false,
      hasNoMenuPanel: true
    }
  },
  course: {
    default: {
      defaultTool: "courseChooser"
    },
    assignment: {
      pageName: "Assignment",
      menuPanelCap: "AssignmentInfoCap",
      currentMainPanel: "AssignmentViewer",
      currentMenus: ["CreditAchieved", "TimerMenu"],
      menusTitles: ["Credit Achieved", "Time Remaining"],
      menusInitOpen: [true, true],
      headerControls: ["AssignmentBreadCrumb", "AssignmentNewAttempt"],
      waitForMenuSuppression: true,
      footer: {height: 250, open: false, component: "MathInputKeyboard"}
    },
    courseChooser: {
      pageName: "Course",
      currentMainPanel: "DriveCards",
      currentMenus: ["CreateCourse"],
      menusTitles: ["Create Course"],
      menusInitOpen: [true],
      headerControls: ["ChooserBreadCrumb"],
      onLeave: "CourseChooserLeave"
    },
    dashboard: {
      pageName: "Dashboards",
      currentMainPanel: "Dashboard",
      menuPanelCap: "DriveInfoCap",
      currentMenus: ["ClassTimes", "CurrentContent"],
      menusTitles: ["Class Times", "Current Content"],
      menusInitOpen: [false, false],
      headerControls: ["DashboardBreadCrumb"],
      onLeave: "DashboardLeave",
      waitForMenuSuppression: true,
      color: "var(--canvastext)"
    },
    draftactivity: {
      pageName: "DraftActivity",
      menuPanelCap: "DraftActivityCap",
      currentMainPanel: "DraftAssignmentViewer",
      currentMenus: ["ActivityVariant"],
      menusTitles: ["Activity Variant"],
      menusInitOpen: [],
      headerControls: ["AssignmentBreadCrumb"],
      footer: {height: 250, open: false, component: "MathInputKeyboard"}
    },
    gradebook: {
      pageName: "Gradebook",
      currentMainPanel: "Gradebook",
      menuPanelCap: "DriveInfoCap",
      currentMenus: ["GradeDownload"],
      menusTitles: ["Download"],
      menusInitOpen: [false],
      headerControls: ["GradebookBreadCrumb"],
      waitForMenuSuppression: true
    },
    gradebookAssignment: {
      pageName: "Gradebook",
      currentMainPanel: "GradebookAssignment",
      currentMenus: ["GradeUpload"],
      menusTitles: ["Upload"],
      menusInitOpen: [false],
      menuPanelCap: "DriveInfoCap",
      headerControls: ["GradebookBreadCrumb"],
      waitForMenuSuppression: true,
      onLeave: "GradebookAssignmentLeave"
    },
    gradebookStudent: {
      pageName: "Gradebook",
      currentMainPanel: "GradebookStudent",
      currentMenus: [],
      menuPanelCap: "DriveInfoCap",
      menusTitles: [],
      menusInitOpen: [],
      headerControls: ["GradebookBreadCrumb"]
    },
    gradebookStudentAssignment: {
      pageName: "Gradebook",
      currentMainPanel: "GradebookStudentAssignment",
      menuPanelCap: "DriveInfoCap",
      currentMenus: ["CreditAchieved", "GradeSettings"],
      menusTitles: ["Credit Achieved", "Settings"],
      menusInitOpen: [true, false],
      headerControls: ["GradebookBreadCrumb"],
      waitForMenuSuppression: true
    },
    navigation: {
      pageName: "Course",
      currentMainPanel: "NavigationPanel",
      menuPanelCap: "DriveInfoCap",
      currentMenus: ["CutCopyPasteMenu", "AddDriveItems"],
      menusTitles: ["Cut, Copy and Paste", "Add Items"],
      menusInitOpen: [true, true],
      headerControls: ["NavigationBreadCrumb"],
      onLeave: "NavigationLeave",
      waitForMenuSuppression: true
    },
    editor: {
      pageName: "Course",
      menuPanelCap: "EditorInfoCap",
      currentMainPanel: "EditorViewer",
      currentMenus: [
        "PageVariant",
        "AssignmentSettingsMenu",
        "SupportingFilesMenu"
      ],
      menusTitles: [
        "Page Variant",
        "Assignment Settings",
        "Supporting Files"
      ],
      menusInitOpen: [false, false],
      supportPanelOptions: ["DoenetMLEditor"],
      supportPanelTitles: ["DoenetML Editor"],
      supportPanelIndex: 0,
      headerControls: ["EditorBreadCrumb", "ViewerUpdateButton"],
      footer: {height: 250, open: false, component: "MathInputKeyboard"},
      waitForMenuSuppression: true
    },
    enrollment: {
      pageName: "Enrollment",
      menuPanelCap: "DriveInfoCap",
      currentMenus: ["LoadEnrollment"],
      menusTitles: ["Import Learners"],
      menusInitOpen: [false],
      currentMainPanel: "Enrollment",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      headerControls: ["EnrollmentBreadCrumb"]
    },
    data: {
      pageName: "data",
      menuPanelCap: "DataCap",
      currentMainPanel: "DataPanel",
      headerControls: ["DataBreadCrumb"]
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
      hasNoMenuPanel: true,
      hasNoHeaderPanel: true,
      displaySettings: false
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
  public: {
    default: {
      pageName: "PublicActivityViewer",
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: "PublicActivityViewer",
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true
    },
    editor: {
      pageName: "GuestEditor",
      currentMainPanel: "GuestEditorViewer",
      currentMenus: [
        "PageVariant"
      ],
      menusTitles: [
        "Page Variant"
      ],
      menusInitOpen: [false],
      supportPanelOptions: ["GuestDoenetMLEditor"],
      supportPanelTitles: ["DoenetML Editor"],
      supportPanelIndex: 0,
      headerControls: ["ViewerUpdateButton"],
      footer: {height: 250, open: false, component: "MathInputKeyboard"}
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
      displaySettings: false
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
      hasNoMenuPanel: true,
      displaySettings: false
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
      hasNoMenuPanel: true,
      displaySettings: false
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
    CourseChooserLeave: lazy(() => import("./EnterLeave/CourseChooserLeave.js")),
    DashboardLeave: lazy(() => import("./EnterLeave/DashboardLeave.js")),
    GradebookAssignmentLeave: lazy(() => import("./EnterLeave/GradebookAssignmentLeave.js"))
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
export const suppressMenusAtom = atom({
  key: "suppressMenusAtom",
  default: null
});
function arraysEqual(a, b) {
  if (a === b)
    return true;
  if (a == null || b == null)
    return false;
  if (a.length !== b.length)
    return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i])
      return false;
  }
  return true;
}
const MemoizedRootController = React.memo(RootController);
function RootController(props) {
  const [recoilPageToolView, setRecoilPageToolView] = useRecoilState(pageToolViewAtom);
  const setOnLeaveStr = useSetRecoilState(onLeaveComponentStr);
  const [suppressMenus, setSuppressMenus] = useRecoilState(suppressMenusAtom);
  let lastPageToolView = useRef({page: "init", tool: "", view: ""});
  let backPageToolView = useRef({page: "init", tool: "", view: ""});
  let backParams = useRef({});
  let currentParams = useRef({});
  let lastLocationStr = useRef("");
  let location = useLocation();
  let navigate = useNavigate();
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
  let lastSuppressMenu = useRef([]);
  let locationStr = `${location.pathname}${location.search}`;
  let nextPageToolView = {page: "", tool: "", view: ""};
  let nextMenusAndPanels = null;
  let isSuppressMenuChange = !arraysEqual(suppressMenus, lastSuppressMenu.current);
  lastSuppressMenu.current = suppressMenus;
  if (isSuppressMenuChange && suppressMenus !== null) {
    nextMenusAndPanels = {
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool]
    };
    nextMenusAndPanels.currentMenus = [
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool].currentMenus
    ];
    nextMenusAndPanels.menusTitles = [
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool].menusTitles
    ];
    nextMenusAndPanels.menusInitOpen = [
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool].menusInitOpen
    ];
    if (suppressMenus.length > 0) {
      for (let suppressMenu of suppressMenus) {
        for (let [i, menu] of Object.entries(nextMenusAndPanels.currentMenus)) {
          if (menu === suppressMenu) {
            nextMenusAndPanels.currentMenus.splice(i, 1);
            nextMenusAndPanels.menusTitles.splice(i, 1);
            nextMenusAndPanels.menusInitOpen.splice(i, 1);
          }
        }
      }
    }
    props.setToolRootMenusAndPanels(nextMenusAndPanels);
    return null;
  }
  let isURLChange = false;
  if (locationStr !== lastLocationStr.current) {
    isURLChange = true;
    nextPageToolView.page = location.pathname.replaceAll("/", "").toLowerCase();
    if (nextPageToolView.page === "") {
      nextPageToolView.page = "home";
      const url = window.location.origin + window.location.pathname + "home";
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
      let pageToolViewParams = {
        ...backPageToolView.current,
        params: backParams.current
      };
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
        const url = window.location.pathname + location.pathname + "?" + encodeParams({tool: nextMenusAndPanels.defaultTool});
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
    nextMenusAndPanels = {
      ...navigationObj[nextPageToolView.page][nextPageToolView.tool]
    };
  }
  let searchObj = {};
  if (isURLChange) {
    searchObj = Object.fromEntries(new URLSearchParams(location.search));
    setSearchParamAtom(searchObj);
    nextPageToolView["params"] = {...searchObj};
    delete nextPageToolView["params"].tool;
    setRecoilPageToolView(nextPageToolView);
  }
  if (isPageChange || isToolChange) {
    if (leaveComponentName.current) {
      setOnLeaveStr((was) => ({
        str: leaveComponentName.current,
        updateNum: was.updateNum + 1
      }));
    }
    leaveComponentName.current = null;
    if (nextMenusAndPanels && nextMenusAndPanels.onLeave) {
      leaveComponentName.current = nextMenusAndPanels.onLeave;
    }
    setSuppressMenus(null);
  }
  if (nextMenusAndPanels && nextMenusAndPanels.displaySettings === void 0) {
    nextMenusAndPanels.displaySettings = true;
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
    if (nextMenusAndPanels.waitForMenuSuppression) {
      let reducedSetMenusAndPanels = {...nextMenusAndPanels};
      reducedSetMenusAndPanels.currentMenus = [];
      reducedSetMenusAndPanels.menusInitOpen = [];
      reducedSetMenusAndPanels.menusTitles = [];
      reducedSetMenusAndPanels.headerControls = [];
      props.setToolRootMenusAndPanels(reducedSetMenusAndPanels);
    } else {
      props.setToolRootMenusAndPanels(nextMenusAndPanels);
    }
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
      console.log("urlpush:", urlPush);
      navigate(urlPush);
    }
  }
  lastSearchObj.current = searchObj;
  lastLocationStr.current = locationStr;
  lastPageToolView.current = nextPageToolView;
  return null;
}
const LoadingFallback = styled.div`
  background-color: var(--canvas);
  border-radius: 4px;
  display: ${(props) => props.display ? props.display : "flex"};
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100%;
  height: 100%;
`;
const bouncingDonut = keyframes`
  from { transform: translate3d(0, 0px, 0);}
  to { transform: translate3d(0, 20px, 0);}
`;
const Svg = styled.svg`
  width: 130px;
  height: 140px;
  align-items: center;
  margin: 25px;
`;
const DonutG1 = styled.g`
  position: relative;
  animation: ${bouncingDonut} 0.5s ease 0s infinite;
  animation-direction: alternate;
  transform: translate(279, 394.5);
  &:after {
    position: absolute;
  }
`;
const DonutG2 = styled.g`
  position: relative;
  animation: ${bouncingDonut} 0.5s ease 0.15s infinite;
  animation-direction: alternate;
  transform: translate(279, 394.5);
  &:after {
    position: absolute;
  }
`;
const DonutG3 = styled.g`
  position: relative;
  animation: ${bouncingDonut} 0.5s ease 0.25s infinite;
  animation-direction: alternate;
  transform: translate(279, 394.5);
  &:after {
    position: absolute;
  }
`;
const Circle = styled.circle`
  cx: 65;
  cy: 60;
`;
const BreadcrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 21px;
  display: flex;
  margin-left: -35px;
  background-color: var(--canvas);
`;
const shimmerAnimation = keyframes`
  from {
    background-position: -468px 0
  }
  to {
    background-position: 468px 0
  }
`;
const BreadcrumbOutline = styled.li`
  float: left;
  border-radius: 15px;
  padding: 0px 30px 0px 30px;
  /* background: var(--mainGray); */
  /* background-color: var(--canvas); */
  color: black;

  animation-duration: 3s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmerAnimation};
  animation-timing-function: linear;
  background: var(--canvas);
  background: linear-gradient(to right, var(--mainGray) 8%, var(--mainGray) 18%, var(--mainGray) 33%);
  background-size: 1000px 640px;
  position: relative;
`;
const movingGradient = keyframes`
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;
const Table = styled.table`
  border-radius: 5px;
  margin: 8px;
`;
const Tr = styled.tr`
  /* border-bottom: 2px solid var(--canvastext); */
`;
const Td = styled.td`
  height: 40px;

  &.Td3 {
    width: 100%;
  }

`;
const TBody = styled.tbody``;
const Td3Span = styled.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, var(--mainGray) 20%, var(--mainGray) 50%, var(--mainGray) 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;
