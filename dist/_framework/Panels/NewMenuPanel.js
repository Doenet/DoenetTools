import React, {useState, lazy, useRef, Suspense, useEffect} from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilState
} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faChevronLeft,
  faCog,
  faHome,
  faSun,
  faMoon
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import Logo from "../Logo.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
export const selectedMenuPanelAtom = atom({
  key: "selectedMenuPanelAtom",
  default: null
});
export const darkModeAtom = atom({
  key: "darkModeAtom",
  default: JSON.parse(localStorage.getItem("darkModeToggle"))
});
const MenuPanelsWrapper = styled.div`
  grid-area: menuPanel;
  display: flex;
  flex-direction: column;
  // overflow: auto;
  justify-content: flex-start;
  background: var(--mainGray);
  height: 100%;
  overflow-x: hidden;
  width: ${({hide}) => hide ? "0px" : "240px"};
`;
const MenuPanelsCap = styled.div`
  width: 240px;
  height: 35px;
  color:var(--canvastext);
  background: var(--canvas);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: ${(props) => props.fix ? "static" : "sticky"};
  border-bottom: 2px solid var(--mainGray);
  margin-bottom: -2px;
  top: 0;
  z-index: 2;
`;
const IconsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 50px;
  // width: 40px;
`;
const Branding = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-left: 95px;
  width: 110px;
  cursor: default;
  font-size: 16px;
`;
const MenuPanelsCapComponent = styled.div`
width: 240px;
background-color: var(--canvas);
color: var(--canvastext);
border-top: 1px solid #e2e2e2;
border-top: 1px solid #e2e2e2;
border-bottom: 2px solid #e2e2e2;
margin-bottom: -2px;
position: sticky;
top: 35;
z-index: 1;
`;
const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "8px solid var(--mainBlue)" : "none"};
  background-color: white;
  border-bottom: 2px solid
    ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "var(--canvas)" : "var(--canvastext)"};
  width: 100%;
  height: 100%;
`;
const CloseButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
// display: inline-block;
position:  static;
left: 220px;
cursor: pointer;
z-index: 2;
`;
const EditMenuPanels = styled.button`
  background-color: var(--mainBlue);
  height: 35px;
  width: 35px;
  border: none;
  color: var(--canvas);
  border-radius: 17.5px;
  font-size: 24px;
`;
const MenuPanelTitle = styled.button`
  width: 240px;
  height: 35px;
  color:var(--canvastext);
  background: var(--canvas);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0px solid var(--canvas);
  // border-top: 1px solid var(--canvastext);
  border-bottom: ${(props) => props.isOpen ? "2px solid var(--canvastext)" : "0px solid var(--canvastext)"};
  margin-top: 2px;
`;
const SettingsButton = styled.button`
  background-color: var(--canvas);
  color: var(--canvastext);
  border: none;
  cursor: pointer;
  font-size: 20px;
`;
const HomeButton = styled.button`
  color: var(--canvastext);
  background-color: var(--canvas);
  border-style: none;
  cursor: pointer;
  font-size: 20px;
`;
function SelectionMenu(props) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {
      paddingBottom: "8px",
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor: "var(--canvas)",
      color: "var(--canvastext)",
      borderLeft: "8px solid var(--mainBlue)"
    }
  }, props.children));
}
function Menu(props) {
  let isInitOpen = props.isInitOpen;
  if (!isInitOpen) {
    isInitOpen = false;
  }
  let [isOpen, setIsOpen] = useState(isInitOpen);
  let hideShowStyle = null;
  if (!isOpen) {
    hideShowStyle = "none";
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MenuPanelTitle, {
    isOpen,
    onClick: () => setIsOpen((was) => !was),
    "data-test": `${props.type} Menu`
  }, /* @__PURE__ */ React.createElement("h3", null, props.title)), /* @__PURE__ */ React.createElement("div", {
    style: {
      display: hideShowStyle,
      paddingTop: "4px",
      paddingBottom: "4px",
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor: "var(--canvas)"
    }
  }, props.children));
}
const LoadingFallback = styled.div`
  background-color: var(--canvas);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100vw;
  height: 100vh;
`;
export default function MenuPanel({hide, menuPanelCap = "", menusTitles = [], currentMenus = [], initOpen = [], setMenusOpen, displayProfile}) {
  const [darkModeToggle, setDarkModeToggle] = useRecoilState(darkModeAtom);
  const currentSelectionMenu = useRecoilValue(selectedMenuPanelAtom);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let menusArray = [];
  const LazyMenuPanelCapObj = useRef({
    DriveInfoCap: lazy(() => import("../MenuPanelCaps/DriveInfoCap.js")),
    DataCap: lazy(() => import("../MenuPanelCaps/DataCap.js")),
    EditorInfoCap: lazy(() => import("../MenuPanelCaps/EditorInfoCap.js")),
    AssignmentInfoCap: lazy(() => import("../MenuPanelCaps/AssignmentInfoCap.js")),
    DraftActivityCap: lazy(() => import("../MenuPanelCaps/DraftActivityCap.js"))
  }).current;
  const LazyMenuObj = useRef({
    SelectedCourse: lazy(() => import("../Menus/SelectedCourse.js")),
    GradeSettings: lazy(() => import("../Menus/GradeSettings.js")),
    SelectedSection: lazy(() => import("../Menus/SelectedSection.js")),
    SelectedBank: lazy(() => import("../Menus/SelectedBank.js")),
    SelectedDataSources: lazy(() => import("../Menus/SelectedDataSources.js")),
    SelectedActivity: lazy(() => import("../Menus/SelectedActivity.js")),
    SelectedOrder: lazy(() => import("../Menus/SelectedOrder.js")),
    SelectedPage: lazy(() => import("../Menus/SelectedPage.js")),
    CreateCourse: lazy(() => import("../Menus/CreateCourse.js")),
    CourseEnroll: lazy(() => import("../Menus/CourseEnroll.js")),
    AddDriveItems: lazy(() => import("../Menus/AddDriveItems.js")),
    CutCopyPasteMenu: lazy(() => import("../Menus/CutCopyPasteMenu.js")),
    EnrollStudents: lazy(() => import("../Menus/EnrollStudents.js")),
    DoenetMLSettings: lazy(() => import("../Menus/DoenetMLSettings.js")),
    VersionHistory: lazy(() => import("../Menus/VersionHistory.js")),
    PageVariant: lazy(() => import("../Menus/PageVariant.js")),
    ActivityVariant: lazy(() => import("../Menus/ActivityVariant.js")),
    AutoSaves: lazy(() => import("../Menus/AutoSaves.js")),
    LoadEnrollment: lazy(() => import("../Menus/LoadEnrollment.js")),
    GradeUpload: lazy(() => import("../Menus/GradeUpload.js")),
    GradeDownload: lazy(() => import("../Menus/GradeDownload.js")),
    ManualEnrollment: lazy(() => import("../Menus/ManualEnrollment.js")),
    AssignmentSettingsMenu: lazy(() => import("../Menus/AssignmentSettingsMenu.js")),
    SupportingFilesMenu: lazy(() => import("../Menus/SupportingFilesMenu.js")),
    GroupSettings: lazy(() => import("../Menus/GroupSettings.js")),
    TimerMenu: lazy(() => import("../Menus/TimerMenu.js")),
    CreditAchieved: lazy(() => import("../Menus/CreditAchieved.js")),
    ClassTimes: lazy(() => import("../Menus/ClassTimes.js")),
    CurrentContent: lazy(() => import("../Menus/CurrentContent.js"))
  }).current;
  let selectionPanel = null;
  if (currentSelectionMenu) {
    const panelToUse = LazyMenuObj[currentSelectionMenu];
    if (panelToUse) {
      const key = `SelectionMenu${currentSelectionMenu}`;
      selectionPanel = /* @__PURE__ */ React.createElement(SelectionMenu, {
        key
      }, /* @__PURE__ */ React.createElement(Suspense, {
        fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
      }, React.createElement(panelToUse, {key})));
    }
  }
  let menuPanelCapComponent = null;
  if (menuPanelCap !== "") {
    menuPanelCapComponent = /* @__PURE__ */ React.createElement(MenuPanelsCapComponent, null, /* @__PURE__ */ React.createElement(Suspense, {
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyMenuPanelCapObj[menuPanelCap])));
  }
  for (let [i, type] of Object.entries(currentMenus)) {
    const mKey = `${type}`;
    const title = menusTitles[i];
    let isOpen = initOpen[i];
    menusArray.push(/* @__PURE__ */ React.createElement(Menu, {
      key: mKey,
      title,
      isInitOpen: isOpen,
      type
    }, /* @__PURE__ */ React.createElement(Suspense, {
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyMenuObj[type], {mKey}))));
  }
  return /* @__PURE__ */ React.createElement(MenuPanelsWrapper, {
    hide,
    "aria-label": "menus"
  }, /* @__PURE__ */ React.createElement(MenuPanelsCap, {
    fix: hide,
    role: "banner"
  }, /* @__PURE__ */ React.createElement(Branding, {
    style: {marginLeft: "5px"}
  }, /* @__PURE__ */ React.createElement(Logo, null), /* @__PURE__ */ React.createElement("p", null, "Doenet")), /* @__PURE__ */ React.createElement(IconsGroup, null, /* @__PURE__ */ React.createElement(Checkbox, {
    checked: darkModeToggle,
    onClick: (e) => setDarkModeToggle(!darkModeToggle),
    checkedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faSun
    }),
    uncheckedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faMoon
    })
  }), /* @__PURE__ */ React.createElement(SettingsButton, {
    onClick: () => setPageToolView({page: "settings", tool: "", view: ""})
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCog
  }))), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(CloseButton, {
    onClick: () => setMenusOpen(false)
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronLeft
  })))), menuPanelCapComponent, selectionPanel, /* @__PURE__ */ React.createElement("div", null, menusArray));
}
