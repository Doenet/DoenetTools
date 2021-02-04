import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSpring, animated, useTransition } from "react-spring";
import { atom, selector, useRecoilValue, useRecoilCallback } from "recoil";
import NavPanel from "./NavPanel";
import HeaderPanel from "./HeaderPanel";
import ContentPanel from "./ContentPanel";
import MainPanel from "./MainPanel";
import SupportPanel, { supportVisible } from "./SupportPanel";
import MenuPanel from "./MenuPanel";

const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    "navPanel headerPanel menuPanel" 60px
    "navPanel contentPanel menuPanel" 1fr
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #f6f8ff;
  /* position: ${({ $isoverlay }) => ($isoverlay ? "fixed" : "static")}; */
  /* z-index: ${({ $isoverlay }) => ($isoverlay ? "3" : "auto")}; */
`;

export const overlayStack = atom({
  key: "activeOverlayNameAtom",
  default: [],
});

export const openOverlayByName = selector({
  key: "openOverlayByNameSelector",
  get: ({ get }) => {
    const currentElement = get(overlayStack);
    return currentElement.length === 0
      ? currentElement
      : currentElement[currentElement.length - 1];
  },

  set: ({ get, set }, newValue) => {
    if (newValue.instructions.action === "open") {
      const stackDepth = get(overlayStack).length + 1;
      set(overlayStack, (old) => [...old, newValue]);
      set(
        supportVisible(stackDepth),
        newValue?.instructions?.supportVisble ?? false
      );
    } else if (newValue.instructions.action === "close") {
      set(overlayStack, (old) => {
        let newArray = [...old];
        newArray.pop();
        return newArray;
      });
    }
  },
});

export const useStackId = () => {
  const getId = useRecoilCallback(({ snapshot }) => () => {
    const currentId = snapshot.getLoadable(overlayStack);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};

export default function Tool(props) {
  // console.log("=== Tool (only once)");
  const stackId = useStackId();
  const openOverlayObj = useRecoilValue(openOverlayByName);

  const transition = useTransition(openOverlayObj?.length != 0 ?? true, null, {
    from: { position: "fixed", zIndex: "3", top: 100 },
    enter: { top: 0 },
    leave: { top: 100 },
  });

  const spring = useSpring({
    value: 0,
    from: { value: 100 },
    delay: 50,
    immediate: !(stackId > 0 ?? false),
  });

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
            toolParts.overlay[child.props.name] = (
              <Tool key={child.props.name}>{child.props.children}</Tool>
            );
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

  if (toolParts?.navPanel) {
    navPanel = <NavPanel>{toolParts.navPanel.children}</NavPanel>;
  }

  if (toolParts?.headerPanel) {
    headerPanel = (
      <HeaderPanel props={toolParts.headerPanel.props}>
        {toolParts.headerPanel.children}
      </HeaderPanel>
    );
  }

  if (toolParts?.mainPanel) {
    mainPanel = <MainPanel>{toolParts.mainPanel.children}</MainPanel>;
  }

  if (toolParts?.supportPanel) {
    supportPanel = (
      <SupportPanel>{toolParts.supportPanel.children}</SupportPanel>
    );
  }

  if (toolParts?.menuPanel) {
    menuPanel = <MenuPanel>{toolParts.menuPanel}</MenuPanel>;
  }
  if (stackId === 0 && openOverlayObj?.name && toolParts?.overlay) {
    overlay = toolParts.overlay[openOverlayObj.name];
  }

  return (
    <>
      {transition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              key={key}
              style={{ ...props, top: props.top.interpolate((h) => `${h}vh`) }}
            >
              {overlay}
            </animated.div>
          )
      )}
      <ToolContainer
        // style={{ top: spring.value.interpolate((h) => `${h}vh`) }}
        $isoverlay={stackId > 0 ?? false}
      >
        {navPanel}
        {headerPanel}
        <ContentPanel main={mainPanel} support={supportPanel} />
        {menuPanel}
        {/* <ReactQueryDevtools /> */}
      </ToolContainer>
    </>
  );
}
