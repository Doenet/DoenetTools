import React from "react";
import styled from "styled-components";
import { atom, selector, useRecoilValue } from "recoil";
import NavPanel from "./NavPanel";
import HeaderPanel from "./HeaderPanel";
import ContentPanel from "./ContentPanel";
import SupportPanel from "./SupportPanel";
import MenuPanel from "./MenuPanel";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
// import { DropTargetsProvider } from "../DropTarget";

// import { ReactQueryDevtools } from "react-query-devtools";
// import crypto from "crypto";

// getContentId = ({ code }) => {
//   const hash = crypto.createHash("sha256");
//   if (code === undefined) {
//     return;
//   }

//   hash.update(code);
//   let contentId = hash.digest("hex");
//   return contentId;
// };

const queryCache = new QueryCache();

const ToolContainer = styled.div`
  display: grid;
  grid-template:
    "navPanel headerPanel menuPanel" 60px
    "navPanel contentPanel menuPanel" 1fr
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  z-index: ${({ isOverlay }) => (isOverlay ? "10" : "auto")};
`;

export const activeOverlayName = atom({
  key: "activeOverlayNameAtom",
  default: "",
});

export const openOverlayByName = selector({
  key: "openOverlayByNameSelector",
  get: ({ get }) => {
    return get(activeOverlayName);
  },

  set: ({ set }, newValue) => {
    set(activeOverlayName, newValue);
  },
});

export default function Tool(props) {
  const openOverlayName = useRecoilValue(openOverlayByName);
  // console.log("=== Tool (only once)");

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

  if (toolParts.navPanel) {
    navPanel = <NavPanel>{toolParts.navPanel.children}</NavPanel>;
  }

  if (toolParts.headerPanel) {
    headerPanel = <HeaderPanel>{toolParts.headerPanel.children}</HeaderPanel>;
  }

  if (toolParts.mainPanel) {
    mainPanel = (
      <div style={{ boxSizing: "border-box", overflow: "clip" }}>
        {toolParts.mainPanel.children}
      </div>
    );
  }

  if (toolParts.supportPanel) {
    supportPanel = (
      <SupportPanel>{toolParts.supportPanel.children}</SupportPanel>
    );
  }

  if (toolParts.menuPanel) {
    menuPanel = <MenuPanel>{toolParts.menuPanel}</MenuPanel>;
  }

  if (toolParts.overlay) {
    overlay = toolParts.overlay.children;
  }

  let toolContent = null;

  if (!props.isOverlay && openOverlayName !== "") {
    toolContent = <Tool isOverlay>{overlay}</Tool>;
  }

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      {toolContent}
      <ToolContainer style={props.style} isOverlay={props.isOverlay}>
        {navPanel}
        {headerPanel}
        <ContentPanel main={mainPanel} support={supportPanel} />
        {menuPanel}
        {/* <ReactQueryDevtools /> */}
      </ToolContainer>
    </ReactQueryCacheProvider>
  );
}
