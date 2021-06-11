import React, {useState, useEffect, lazy, Suspense, useRef} from "../_snowpack/pkg/react.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {animated} from "../_snowpack/pkg/@react-spring/web.js";
import ContentPanel from "./Panels/ContentPanel.js";
import {useStackId} from "./ToolRoot.js";
const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'navPanel headerPanel menuPanel' auto
    'navPanel contentPanel menuPanel' 1fr
    'navPanel footerPanel menuPanel' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #e2e2e2;
  position: fixed;
  top: 0;
  left: 0;
  padding: 5px;
  gap: 5px;
  box-sizing: border-box;
`;
const LoadingFallback = styled.div`
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
  "menuPanel",
  "footerPanel"
];
export default function Tool({children}) {
  const [
    NavPanel,
    HeaderPanel,
    MainPanel,
    SupportPanel,
    MenuPanel,
    FooterPanel
  ] = useRef([
    lazy(() => import("./Panels/NavPanel.js")),
    lazy(() => import("./Panels/HeaderPanel.js")),
    lazy(() => import("./Panels/MainPanel.js")),
    lazy(() => import("./Panels/SupportPanel.js")),
    lazy(() => import("./Panels/MenuPanel.js")),
    lazy(() => import("./Panels/FooterPanel.js"))
  ]).current;
  const stackId = useStackId();
  const [panels, setPanels] = useState({});
  useEffect(() => {
    var toolParts = {};
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
    let footerPanel = null;
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
        ...toolParts.menuPanel[0].props,
        key: `Menu${stackId}`
      }, toolParts.menuPanel);
    }
    if (toolParts?.footerPanel) {
      footerPanel = /* @__PURE__ */ React.createElement(FooterPanel, {
        ...toolParts.footerPanel.props,
        key: `Footer${stackId}`
      }, toolParts.footerPanel.children);
    }
    setPanels({
      headerPanel,
      navPanel,
      mainPanel,
      supportPanel,
      menuPanel,
      footerPanel
    });
  }, [children, stackId]);
  return /* @__PURE__ */ React.createElement(ToolContainer, {
    $isOverlay: stackId > 0
  }, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
  }, panels.navPanel), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
  }, panels.headerPanel), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
  }, /* @__PURE__ */ React.createElement(ContentPanel, {
    main: panels.mainPanel,
    support: panels.supportPanel
  })), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
  }, panels.menuPanel), /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "loading...")
  }, panels.footerPanel));
}
