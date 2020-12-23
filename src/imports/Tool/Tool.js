import React from "react";
import styled from "styled-components";
import Drive from "../Drive";

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
          let newProps = {...child.props}
          delete newProps.children;
          if (child.type === "menuPanel") {
            if (!toolParts.menuPanel){
              toolParts['menuPanel'] = [];
            }
            toolParts.menuPanel.push({
              children: child.props.children,
              props:newProps
            });
          }else{
            toolParts[child.type] = {
              children: child.props.children,
              props:newProps
            };
          }
          
        }
      }
    } else {
      //Only one child
      if (implementedToolParts.includes(props.children.type)) {
        let newProps = {...child.props}
          delete newProps.children;
        toolParts[props.children.type] = {
          children: props.children.props.children,
          props:newProps
        };
      }
    }
  }

  console.log(">>>toolParts:",toolParts);
  let mainPanel = null;
  let menuPanel = null;
  let navPanel = null;

  if (toolParts.navPanel) {
    //Add isNav={true} to <Drive>
    let newChildren = [];
    if (Array.isArray(toolParts.navPanel.children)){
      for (let [i,child] of Object.entries(toolParts.navPanel.children)){
        if (child.type === Drive){
          newChildren.push(<Drive key={`navPanel${i}`} isNav={true} {...child.props} />)
        }else{
          newChildren.push(<React.Fragment key={`navPanel${i}`}>{child}</React.Fragment>)
        }
      }
    }else{
      if (toolParts.navPanel.children.type === Drive){
        newChildren.push(<Drive key={`navPanel0`} isNav={true} {...toolParts.navPanel.children.props} />)
      }else{
        newChildren.push(<React.Fragment key={`navPanel0`}>{toolParts.navPanel.children}</React.Fragment>)
      }
    }
    
    navPanel = (
      <div>
        <h2>Nav Panel</h2>
        <div>{newChildren}</div>
        {/* <div>{toolParts.navPanel.children}</div> */}
      </div>
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