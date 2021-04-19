import React, {useState, useEffect, lazy, Suspense} from "../_snowpack/pkg/react.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {animated} from "../_snowpack/pkg/react-spring.js";
import ContentPanel from "./Panels/ContentPanel.js";
import {useStackId} from "./ToolRoot.js";
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
  "navPanel",
  "headerPanel",
  "mainPanel",
  "supportPanel",
  "menuPanel"
];
export default function Tool({children}) {
  const stackId = useStackId();
  const [panels, setPanels] = useState({});
  useEffect(() => {
    var toolParts = {};
    const NavPanel = lazy(() => import("./Panels/NavPanel.js"));
    const HeaderPanel = lazy(() => import("./Panels/HeaderPanel.js"));
    const MainPanel = lazy(() => import("./Panels/MainPanel.js"));
    const SupportPanel = lazy(() => import("./Panels/SupportPanel.js"));
    const MenuPanel = lazy(() => import("./Panels/MenuPanel.js"));
    if (children) {
      if (Array.isArray(children)) {
        for (let child of children) {
          if (implementedToolParts.includes(child.type)) {
            let newProps = {...child.props};
            delete newProps.children;
            if (child.type === "menuPanel") {
              if (!toolParts.menuPanel) {
                toolParts["menuPanel"] = [];
              }
              toolParts.menuPanel.push({
                children: child.props.children,
                props: newProps
              });
            } else {
              toolParts[child.type] = {
                children: child.props.children,
                props: newProps
              };
            }
          }
        }
      } else {
        if (implementedToolParts.includes(children.type)) {
          let newProps = {...children.props};
          delete newProps.children;
          toolParts[children.type] = {
            children: children.props.children,
            props: newProps
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
      navPanel = /* @__PURE__ */ React.createElement(NavPanel, {
        ...toolParts.navPanel.props,
        key: `Nav${stackId}`
      }, toolParts.navPanel.children);
    }
    if (toolParts?.headerPanel) {
      headerPanel = /* @__PURE__ */ React.createElement(HeaderPanel, {
        ...toolParts.headerPanel.props,
        key: `Header${stackId}`
      }, toolParts.headerPanel.children);
    }
    if (toolParts?.mainPanel) {
      mainPanel = /* @__PURE__ */ React.createElement(MainPanel, {
        ...toolParts.mainPanel.props,
        key: `Main${stackId}`
      }, toolParts.mainPanel.children);
    }
    if (toolParts?.supportPanel) {
      supportPanel = /* @__PURE__ */ React.createElement(SupportPanel, {
        ...toolParts.supportPanel.props,
        key: `Suppoort${stackId}`
      }, toolParts.supportPanel.children);
    }
    if (toolParts?.menuPanel) {
      menuPanel = /* @__PURE__ */ React.createElement(MenuPanel, {
        ...toolParts.menuPanel.props,
        key: `Menu${stackId}`
      }, toolParts.menuPanel);
    }
    setPanels({headerPanel, navPanel, mainPanel, supportPanel, menuPanel});
  }, [children, stackId]);
  return /* @__PURE__ */ React.createElement(ToolContainer, {
    $isOverlay: stackId > 0
  }, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFiller, null, "loading...")
  }, panels.navPanel), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFiller, null, "loading...")
  }, panels.headerPanel), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFiller, null, "loading...")
  }, /* @__PURE__ */ React.createElement(ContentPanel, {
    main: panels.mainPanel,
    support: panels.supportPanel
  })), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFiller, null, "loading...")
  }, panels.menuPanel));
}
