import React, {useState, lazy, useRef, Suspense} from "../../_snowpack/pkg/react.js";
import {atom, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faChevronLeft} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import Profile from "../Profile.js";
export const selectedMenuPanelAtom = atom({
  key: "selectedMenuPanelAtom",
  default: null
});
const MenuPanelsWrapper = styled.div`
  grid-area: menuPanel;
  display: flex;
  flex-direction: column;
 // overflow: auto;
  justify-content: flex-start;
  background: #e3e3e3;
  height: 100%;
  overflow: hidden;
  width: ${({hide}) => hide ? "0px" : "240px"};
`;
const MenuPanelsCap = styled.div`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: space-between;
align-items: center;
position: ${(props) => props.fix ? "sticky" : "static"};
border-bottom: 2px solid #e2e2e2;
margin-bottom: -2px;
top: 0;
`;
const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "8px solid #1A5A99" : "none"};
  background-color: hsl(0, 0%, 99%);
  border-bottom: 2px solid
    ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "#white" : "black"};
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
`;
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
border-bottom: ${(props) => props.isOpen ? "2px solid black" : "0px solid black"} ;
margin-top: 2px;
`;
function SelectionMenu(props) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {
      marginTop: "2px",
      paddingBottom: "4px",
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor: "white",
      borderLeft: "8px solid #1A5A99"
    }
  }, /* @__PURE__ */ React.createElement("h3", {
    style: {
      textAlign: "center",
      width: "240px",
      height: "35px",
      fontSize: "16px",
      marginTop: "5px",
      marginLeft: "-8px"
    }
  }, "Current Selection"), props.children));
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
    onClick: () => setIsOpen((was) => !was)
  }, /* @__PURE__ */ React.createElement("h3", null, props.title)), /* @__PURE__ */ React.createElement("div", {
    style: {
      display: hideShowStyle,
      paddingBottom: "4px",
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor: "white"
    }
  }, props.children));
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
export default function MenuPanel({hide, menusTitles = [], currentMenus = [], initOpen = [], setMenusOpen, menuPanelsOpen}) {
  const currentSelectionMenu = useRecoilValue(selectedMenuPanelAtom);
  let toolMenus = useRef([]);
  let lastToolMenus = useRef([]);
  let toolMenusDictionary = useRef({});
  const LazyObj = useRef({
    SelectedCourse: lazy(() => import("../Menus/SelectedCourse.js")),
    SelectedDoenetId: lazy(() => import("../Menus/SelectedDoenetId.js")),
    CreateCourse: lazy(() => import("../Menus/CreateCourse.js")),
    CourseEnroll: lazy(() => import("../Menus/CourseEnroll.js")),
    AddDriveItems: lazy(() => import("../Menus/AddDriveItems.js")),
    EnrollStudents: lazy(() => import("../Menus/EnrollStudents.js")),
    DoenetMLSettings: lazy(() => import("../Menus/DoenetMLSettings.js")),
    VersionHistory: lazy(() => import("../Menus/VersionHistory.js")),
    Variant: lazy(() => import("../Menus/Variant.js"))
  }).current;
  let selectionPanel = null;
  if (currentSelectionMenu) {
    const panelToUse = LazyObj[currentSelectionMenu];
    if (panelToUse) {
      const key = `SelectionMenu${currentSelectionMenu}`;
      selectionPanel = /* @__PURE__ */ React.createElement(SelectionMenu, {
        key
      }, /* @__PURE__ */ React.createElement(Suspense, {
        fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
      }, React.createElement(panelToUse, {key})));
    }
  }
  function buildMenu({key, type, title, visible, initOpen: initOpen2}) {
    let hideStyle = null;
    if (!visible) {
      hideStyle = "none";
    }
    return /* @__PURE__ */ React.createElement("div", {
      key,
      style: {display: hideStyle}
    }, /* @__PURE__ */ React.createElement(Menu, {
      title,
      isInitOpen: initOpen2
    }, /* @__PURE__ */ React.createElement(Suspense, {
      fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
    }, React.createElement(LazyObj[type], {key}))));
  }
  for (let [i, menuName] of Object.entries(currentMenus)) {
    if (!lastToolMenus.current.includes(menuName)) {
      const mKey = `${menuName}`;
      const isOpen = initOpen[i];
      const title = menusTitles[i];
      if (toolMenusDictionary.current[mKey]) {
        let menuIndex = toolMenusDictionary.current[mKey].index;
        toolMenus.current[menuIndex] = buildMenu({key: mKey, type: menuName, title, visible: true, initOpen: isOpen});
      } else {
        toolMenus.current.push(buildMenu({key: mKey, type: menuName, title, visible: true, initOpen: isOpen}));
        toolMenusDictionary.current[mKey] = {index: toolMenus.current.length - 1, title};
      }
    }
  }
  for (let menuName of lastToolMenus.current) {
    if (!currentMenus.includes(menuName)) {
      const mKey = `${menuName}`;
      let menuIndex = toolMenusDictionary.current[mKey].index;
      toolMenus.current[menuIndex] = buildMenu({key: mKey, type: menuName, title: "", visible: false, initOpen: false});
    }
  }
  lastToolMenus.current = currentMenus;
  return /* @__PURE__ */ React.createElement(MenuPanelsWrapper, {
    hide
  }, /* @__PURE__ */ React.createElement(MenuPanelsCap, {
    fix: menuPanelsOpen
  }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Logo, null)), /* @__PURE__ */ React.createElement("span", {
    style: {marginBottom: "1px"}
  }, "Doenet"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Profile, {
    margin: menuPanelsOpen
  })), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(CloseButton, {
    onClick: () => setMenusOpen(false)
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronLeft
  })))), selectionPanel, /* @__PURE__ */ React.createElement("div", null, toolMenus.current));
}
