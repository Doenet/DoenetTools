import React from "react";
import styled from "styled-components";
import { RecoilRoot } from "recoil";
import NavPanel from "./NavPanel";
import ContentPanel from "./Contentpanel";
import MenuPanel from "./MenuPanel";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { DropTargetsProvider } from "../DropTarget";

import { ReactQueryDevtools } from "react-query-devtools";

const queryCache = new QueryCache();

const ToolContainer = styled.div`
  display: grid;
  grid-template:
    "navPanel headerPanel menuPanel" 60px
    "navPanel contentPanel menuPanel" 1fr
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
`;

export default function Tool(props) {
  console.log("=== Tool (only once)");

  var toolParts = {};

  const implementedToolParts = [
    "navPanel",
    "headerPanel",
    "mainPanel",
    "supportPanel",
    "menuPanel",
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
        let newProps = { ...child.props };
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

  if (toolParts.navPanel) {
    navPanel = <NavPanel>{toolParts.navPanel.children}</NavPanel>;
  }

  if (toolParts.headerPanel) {
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
        {toolParts.headerPanel.children}
      </div>
    );
  }

  if (toolParts.mainPanel) {
    mainPanel = (
      <div style={{ boxSizing: "border-box", overflow: "clip" }}>
        <h2>Main Panel</h2>
        {toolParts.mainPanel.children}
      </div>
    );
  }

  if (toolParts.supportPanel) {
    supportPanel = (
      <div style={{ boxSizing: "border-box", overflow: "clip" }}>
        <h2>Support Panel</h2>
        {toolParts.supportPanel.children}
      </div>
    );
  }

  if (toolParts.menuPanel) {
    menuPanel = <MenuPanel>{toolParts.menuPanel}</MenuPanel>;
  }

  return (
      <ReactQueryCacheProvider queryCache={queryCache}>
          <ToolContainer>
            {navPanel}
            {headerPanel}
            <ContentPanel main={mainPanel} support={supportPanel} /> {menuPanel}
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
