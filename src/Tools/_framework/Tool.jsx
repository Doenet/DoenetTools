import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import ContentPanel from './Panels/ContentPanel';
import { useStackId } from './ToolRoot';

const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'navPanel headerPanel menuPanel' 60px
    'navPanel contentPanel menuPanel' 1fr
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: hsl(227, 22%, 80%);
  position: fixed;
  top: 0;
  left: 0;
  padding: 5px;
  gap: 5px;
  box-sizing: border-box;
`;

const LoadingFiller = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
`;

const implementedToolParts = [
  'navPanel',
  'headerPanel',
  'mainPanel',
  'supportPanel',
  'menuPanel',
];

export default function Tool({ children }) {
  const stackId = useStackId();
  const [panels, setPanels] = useState({});

  useEffect(() => {
    //lowercase names logic
    var toolParts = {};

    const NavPanel = lazy(() => import('./Panels/NavPanel'));
    const HeaderPanel = lazy(() => import('./Panels/HeaderPanel'));
    const MainPanel = lazy(() => import('./Panels/MainPanel'));
    const SupportPanel = lazy(() => import('./Panels/SupportPanel'));
    const MenuPanel = lazy(() => import('./Panels/MenuPanel'));

    if (children) {
      if (Array.isArray(children)) {
        //populate toolParts dictionary from the lowercase Tool children
        for (let child of children) {
          if (implementedToolParts.includes(child.type)) {
            let newProps = { ...child.props };
            delete newProps.children;
            if (child.type === 'menuPanel') {
              if (!toolParts.menuPanel) {
                toolParts['menuPanel'] = [];
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
      <Suspense fallback={<LoadingFiller>loading...</LoadingFiller>}>
        {panels.navPanel}
      </Suspense>
      <Suspense fallback={<LoadingFiller>loading...</LoadingFiller>}>
        {panels.headerPanel}
      </Suspense>
      <Suspense fallback={<LoadingFiller>loading...</LoadingFiller>}>
        <ContentPanel main={panels.mainPanel} support={panels.supportPanel} />
      </Suspense>
      <Suspense fallback={<LoadingFiller>loading...</LoadingFiller>}>
        {panels.menuPanel}
      </Suspense>
      {/* <ReactQueryDevtools /> */}
    </ToolContainer>
  );
}
