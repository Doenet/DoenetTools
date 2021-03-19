import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { animated } from "react-spring";
import NavPanel from "./Panels/NavPanel";
import HeaderPanel from "./Panels/HeaderPanel";
import ContentPanel from "./Panels/ContentPanel";
import MainPanel from "./Panels/MainPanel";
import SupportPanel from "./Panels/SupportPanel";
import MenuPanel from "./Panels/MenuPanel";
import { useStackId } from "./ToolRoot";

const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    "navPanel headerPanel menuPanel" 60px
    "navPanel contentPanel menuPanel" 1fr
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #f6f8ff;
  position: fixed;
  top: 0;
  left: 0;
`;

const implementedToolParts = [
  "navPanel",
  "headerPanel",
  "mainPanel",
  "supportPanel",
  "menuPanel",
];

export default function Tool({ children }) {
  const stackId = useStackId();
  const [panels, setPanels] = useState({});

  useEffect(() => {
    //lowercase names logic
    var toolParts = {};

    if (children) {
      if (Array.isArray(children)) {
        //populate toolParts dictionary from the lowercase Tool children
        for (let child of children) {
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
        if (implementedToolParts.includes(children.type)) {
          let newProps = { ...children.props };
          delete newProps.children;
          toolParts[children.type] = {
            children: children.props.children,
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

    if (toolParts?.navPanel) {
      navPanel = (
        <NavPanel {...toolParts.navPanel.props} key={`Nav${stackId}`}>
          {toolParts.navPanel.children}
        </NavPanel>
      );
    }

    if (toolParts?.headerPanel) {
      headerPanel = (
        <HeaderPanel {...toolParts.headerPanel.props} key={`Header${stackId}`}>
          {toolParts.headerPanel.children}
        </HeaderPanel>
      );
    }

    if (toolParts?.mainPanel) {
      mainPanel = (
        <MainPanel {...toolParts.mainPanel.props} key={`Main${stackId}`}>
          {toolParts.mainPanel.children}
        </MainPanel>
      );
    }

    if (toolParts?.supportPanel) {
      supportPanel = (
        <SupportPanel
          {...toolParts.supportPanel.props}
          key={`Suppoort${stackId}`}
        >
          {toolParts.supportPanel.children}
        </SupportPanel>
      );
    }

    if (toolParts?.menuPanel) {
      menuPanel = (
        <MenuPanel {...toolParts.menuPanel.props} key={`Menu${stackId}`}>
          {toolParts.menuPanel}
        </MenuPanel>
      );
    }
    setPanels({ headerPanel, navPanel, mainPanel, supportPanel, menuPanel });
  }, [children, stackId]);

  return (
    <ToolContainer $isOverlay={stackId > 0}>
      {panels.navPanel}
      {panels.headerPanel}
      <ContentPanel main={panels.mainPanel} support={panels.supportPanel} />
      {panels.menuPanel}
      {/* <ReactQueryDevtools /> */}
    </ToolContainer>
  );
}
