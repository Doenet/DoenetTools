import React from "react";
import styled from "styled-components";
import { RecoilRoot } from "recoil";
import NavPanel from "./NavPanel";
import ContentPanel from "./Contentpanel";
import Drive from "../Drive";

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

  console.log(">>>toolParts:", toolParts);
  let navPanel = null;
  let headerPanel = null;
  let mainPanel = null;
  let supportPanel = null;
  let menuPanel = null;

  if (toolParts.navPanel) {
    navPanel = (
      <NavPanel>
        {toolParts.navPanel.children}
      </NavPanel>
    );
  }

  if (toolParts.headerPanel) {
    headerPanel = (
      <div style={{ gridArea: "headerPanel", display: "flex" }}>
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
    const panels = [];
    for (let [i, menuPanelToolPart] of Object.entries(toolParts.menuPanel)) {
      panels.push(
        <React.Fragment key={`menuPanel${i}`}>
          <div>
            <h2>Menu Panel</h2>
            {menuPanelToolPart.children}
          </div>
        </React.Fragment>
      );
      menuPanel = <div style={{ gridArea: "menuPanel" }}>{panels}</div>;
    }
  }

  return (
    <RecoilRoot>
      <ToolContainer>
        {navPanel}
        {headerPanel}
        <ContentPanel main={mainPanel} support={supportPanel} />{" "}
        {/* TODO: solve the resizing controller */}
        {menuPanel}
      </ToolContainer>
    </RecoilRoot>
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
