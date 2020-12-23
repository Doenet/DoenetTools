import React from "react";
import styled from "styled-components";
import {
  RecoilRoot
} from 'recoil';
const ToolContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 60px 1fr auto;
  grid-template-areas: "navPanel header menuPanelHeader" "navPanel mainPanel menuPanel" "navPanel mainPanel menuPanelSecondary";
`;

export default function Tool(props) {
  console.log("=== Tool (only once)");

  var toolParts = {};
  
  const implementedToolParts = ["navPanel", "mainPanel", "menuPanel"];
  if (props.children) {
    if (Array.isArray(props.children)) {
      for (let child of props.children) {
        if (implementedToolParts.includes(child.type)) {
          if (child.type === "menuPanel") {
            if (!toolParts.menuPanel){
              toolParts['menuPanel'] = [];
            }
            toolParts.menuPanel.push({
              children: child.props.children
            });
          }else{
            toolParts[child.type] = {
              children: child.props.children
            };
          }
          
        }
      }
    } else {
      //Only one child
      if (implementedToolParts.includes(props.children.type)) {
        toolParts[props.children.type] = {
          children: props.children.props.children
        };
      }
    }
  }

  console.log(">>>toolParts:",toolParts);
  let mainPanel = null;
  let menuPanel = null;
  let navPanel = null;

  if (toolParts.navPanel) {
    navPanel = (
      <>
        <h2>Nav Panel</h2>
        <div>{toolParts.navPanel.children}</div>
      </>
    );
  }

  if (toolParts.mainPanel) {
    mainPanel = (
      <>
        <h2>Main Panel</h2>
        <div>{toolParts.mainPanel.children}</div>
      </>
    );
  }

  if (toolParts.menuPanel) {
    menuPanel = [];
    for (let [i,menuPanelToolPart] of Object.entries(toolParts.menuPanel)){
      menuPanel.push(<React.Fragment key={`menuPanel${i}`}>
        <h2>Menu Panel</h2>
        <div>{menuPanelToolPart.children}</div>
      </React.Fragment>)
    }

  }

  return (
    <RecoilRoot>
      <ToolContainer>
        <h1>Tool</h1>
        {navPanel}
        {mainPanel}
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