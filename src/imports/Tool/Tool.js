import React from "react";
import styled from "styled-components";
import { atom, selector, useRecoilValue } from "recoil";
import NavPanel from "./NavPanel";
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
        console.log("Child Name", child.type);
        if (implementedToolParts.includes(child.type.name)) {
          let newProps = { ...child.props };
          delete newProps.children;
          if (child.type.name === "menuPanel") {
            if (!toolParts.MenuPanel) {
              toolParts["menuPanel"] = [];
            }
            toolParts.MenuPanel.push({
              children: child.props.children,
              props: newProps,
            });
          } else {
            toolParts[child.type.name] = {
              children: child.props.children,
              props: newProps,
            };
          }
        }
      }
    } else {
      //Only one child
      if (implementedToolParts.includes(props.children.type.name)) {
        let newProps = { ...props.children.props };
        delete newProps.children;
        toolParts[props.children.type.name] = {
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

  console.log(toolParts);

  if (toolParts.NavPanel) {
    navPanel = <NavPanel>{toolParts.NavPanel.children}</NavPanel>;
  }

  if (toolParts.HeaderPanel) {
    headerPanel = (
      <div
        style={{
          gridArea: "headerPanel",
          display: "flex",
          borderLeft: "1px solid black",
          borderBottom: "1px solid black",
        }}
      >
        <h2>Tool</h2>
        {toolParts.HeaderPanel.children}
      </div>
    );
  }

  if (toolParts.MainPanel) {
    mainPanel = (
      <div style={{ boxSizing: "border-box", overflow: "clip" }}>
        <h2>Main Panel</h2>
        {toolParts.MainPanel.children}
      </div>
    );
  }

  if (toolParts.SupportPanel) {
    supportPanel = (
      <SupportPanel>
        <h2>Support Panel</h2>
        {toolParts.supportPanel.children}
      </SupportPanel>
    );
  }

  if (toolParts.MenuPanel) {
    menuPanel = <MenuPanel>{toolParts.MenuPanel}</MenuPanel>;
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

// {props.children &&
//   Array.isArray(props.children) &&
//   props.children.map((obj, index) => {
//     switch (obj?.type?.name) {
//       case "MainPanel":
//         return React.cloneElement(obj, {
//           onClick: () => {
//             props.setShowHideNewOverLay(true);
//           },
//           responsiveControlsFromTools: props.responsiveControls,
//           responsiveControls: obj.props.responsiveControls,
//           onUndo: props.onUndo,
//           onRedo: props.onRedo,
//           title: props.title,
//           supportPanelObj: supportPanelObj,
//           headerMenuPanels: props.headerMenuPanels,
//           initSupportPanelOpen: props.initSupportPanelOpen,
//           key: index,
//         });
//       case "SupportPanel":
//         return (null);
//       case "NavPanel":
//       case "MenuPanel":
//       default:
//         return React.cloneElement(obj, { key: index });
//     }
//   })}
