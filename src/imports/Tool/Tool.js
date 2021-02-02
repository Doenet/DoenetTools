import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { atom, selector, useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import NavPanel from "./NavPanel";
import HeaderPanel from "./HeaderPanel";
import ContentPanel from "./ContentPanel";
import MainPanel from "./MainPanel";
import SupportPanel, {
  supportVisibleAtom,
  SupportVisiblitySwitch,
} from "./SupportPanel";
import MenuPanel, { activeMenuPanelAtom } from "./MenuPanel";
import DoenetHeader from "../../Tools/DoenetHeader";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { useCookies } from "react-cookie";
import axios from "axios";

const queryCache = new QueryCache();

const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    "navPanel headerPanel menuPanel" 60px
    "navPanel contentPanel menuPanel" 1fr
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #f6f8ff;
  position: ${({ isoverlay }) => (isoverlay ? "fixed" : "static")};
  z-index: ${({ isoverlay }) => (isoverlay ? "3" : "auto")};
`;

const ExitOverlayButton = styled.button`
  width: 45px;
  height: 45px;
  font-size: 16px;
  color: #ffffff;
  background-color: #1a5a99;
  border: 1px solid #ffffff;
  border-radius: 50%;
  /* border-style: none; */
  cursor: pointer;
`;

export const activeOverlayName = atom({
  key: "activeOverlayNameAtom",
  default: [],
});

export const openOverlayByName = selector({
  key: "openOverlayByNameSelector",
  get: ({ get }) => {
    const currentElement = get(activeOverlayName);
    return currentElement.length === 0
      ? currentElement
      : currentElement[currentElement.length - 1];
  },

  set: ({ set }, newValue) => {
    if (newValue.instructions.action === "open") {
      set(activeOverlayName, (old) => [...old, newValue]);
      set(supportVisibleAtom, (old) => [
        ...old,
        newValue.instructions.supportVisble,
      ]);
      set(activeMenuPanelAtom, (old) => [...old, 0]);
    } else if (newValue.instructions.action === "close") {
      set(activeOverlayName, (old) => {
        let newArray = [...old];
        newArray.pop();
        return newArray;
      });
      set(supportVisibleAtom, (old) => {
        let newArray = [...old];
        newArray.pop();
        return newArray;
      });
      set(activeMenuPanelAtom, (old) => {
        let newArray = [...old];
        newArray.pop();
        return newArray;
      });
    }
  },
});

export default function Tool(props) {
  // console.log("=== Tool (only once)");
  const [openOverlayName, setOpenOverlayName] = useRecoilState(
    openOverlayByName
  );
  const spring = useSpring({
    value: 0,
    from: { value: 100 },
    delay: 100,
    immediate: !props.isoverlay,
  });

  //User profile logic
  const [profile, setProfile] = useState({});
  const [jwt] = useCookies("JWT_JS");

  let isSignedIn = false;
  if (Object.keys(jwt).includes("JWT_JS")) {
    isSignedIn = true;
  }

  useEffect(() => {
    //Fires each time you change the tool
    //Need to load profile from database each time
    const phpUrl = "/api/loadProfile.php";
    const data = {};
    const payload = {
      params: data,
    };
    axios
      .get(phpUrl, payload)
      .then((resp) => {
        if (resp.data.success === "1") {
          setProfile(resp.data.profile);
        }
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }, []);

  //should this be here??
  if (Object.keys(profile).length < 1) {
    return <h1>Loading...</h1>;
  }

  //lowercase names logic
  var toolParts = {};

  const implementedToolParts = [
    "navPanel",
    "headerPanel",
    "mainPanel",
    "supportPanel",
    "menuPanel",
    "overlay",
  ];

  if (props.children) {
    if (Array.isArray(props.children)) {
      //populate toolParts dictionary from the lowercase Tool children
      for (let child of props.children) {
        if (implementedToolParts.includes(child.type)) {
          let newProps = { ...child.props };
          delete newProps.children;
          if (child.type === "menuPanel") {
            if (!toolParts.menuPanel) {
              toolParts["menuPanel"] = [];
            }
            toolParts.menuPanel.push({
              children: child.props.children,
              props: newProps,
            });
          } else if (child.type === "overlay") {
            if (!toolParts.overlay) {
              toolParts["overlay"] = {};
            }
            toolParts.overlay[child.props.name] = child.props.children;
          } else {
            toolParts[child.type] = {
              children: child.props.children,
              props: newProps,
            };
          }
        }
      }
    } else {
      //Only one child
      if (implementedToolParts.includes(props.children.type)) {
        let newProps = { ...props.children.props };
        delete newProps.children;
        toolParts[props.children.type] = {
          children: props.children.props.children,
          props: newProps,
        };
      }
    }
  }

  let navPanel = null;
  let headerPanel = null;
  let mainPanel = null;
  let supportPanel = null;
  let menuPanel = null;
  let overlay = null;
  let toolContent = null;

  if (toolParts.navPanel) {
    navPanel = <NavPanel>{toolParts.navPanel.children}</NavPanel>;
  }

  if (toolParts.headerPanel) {
    headerPanel = (
      <HeaderPanel>
        {toolParts.headerPanel.children}
        <SupportVisiblitySwitch />
        {!props.isoverlay ? (
          <DoenetHeader
            profile={profile}
            cookies={jwt}
            isSignedIn={isSignedIn}
            showProfileOnly={true}
            // TODO: this needs review
            // headerRoleFromLayout={props.headerRoleFromLayout}
            // headerChangesFromLayout={props.headerChangesFromLayout}
            // guestUser={props.guestUser}
            // onChange={showCollapseMenu}
          />
        ) : (
          <ExitOverlayButton
            onClick={() =>
              setOpenOverlayName({ instructions: { action: "close" } })
            }
          >
            <FontAwesomeIcon icon={faTimes} />
          </ExitOverlayButton>
        )}
      </HeaderPanel>
    );
  }

  if (toolParts.mainPanel) {
    mainPanel = <MainPanel>{toolParts.mainPanel.children}</MainPanel>;
  }

  if (toolParts.supportPanel) {
    supportPanel = (
      <SupportPanel>{toolParts.supportPanel.children}</SupportPanel>
    );
  }

  if (toolParts.menuPanel) {
    menuPanel = <MenuPanel>{toolParts.menuPanel}</MenuPanel>;
  }

  if (openOverlayName?.name && toolParts.overlay) {
    overlay = toolParts.overlay[openOverlayName.name];
  }

  if (!props.isoverlay && openOverlayName?.name) {
    toolContent = <Tool isoverlay>{overlay}</Tool>;
  }

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      {toolContent}
      <ToolContainer
        style={{ top: spring.value.interpolate((h) => `${h}vh`) }}
        isoverlay={props.isoverlay}
      >
        {navPanel}
        {headerPanel}
        <ContentPanel main={mainPanel} support={supportPanel} />
        {menuPanel}
        {/* <ReactQueryDevtools /> */}
      </ToolContainer>
    </ReactQueryCacheProvider>
  );
}
