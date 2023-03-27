
import React from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil';
import { createRoot } from "react-dom/client";


import ToolRoot from './Tools/_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from './Core/utils/math';
import DarkmodeController from './Tools/_framework/DarkmodeController';
import Community from "./Tools/_framework/Paths/Community";
import {loader as siteLoader, SiteHeader} from "./Tools/_framework/Paths/SiteHeader";
import {loader as caroselLoader, Home} from "./Tools/_framework/Paths/Home";
import {loader as portfolioActivitySettingsLoader, 
  action as portfolioActivitySettingsAction, 
  ErrorBoundry as portfolioActivitySettingsError,
  PortfolioActivitySettings} from "./Tools/_framework/Paths/PortfolioActivitySettings";
import {loader as portfolioLoader, action as portfolioAction, Portfolio } from "./Tools/_framework/Paths/Portfolio";
import { loader as portfolioEditorMenuCapLoader } from "./Tools/_framework/MenuPanelCaps/PortfilioEditorInfoCap";
import { loader as publicPortfolioLoader, PublicPortfolio } from "./Tools/_framework/Paths/PublicPortfolio";
import { loader as portfolioActivityViewerLoader, PortfolioActivityViewer } from "./Tools/_framework/Paths/PortfolioActivityViewer";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import '@fontsource/jost';

const theme = extendTheme({
  fonts: {
    body: "Jost",
  },
  textStyles: {
    primary: {
      fontFamily: "Jost",
    },
  },
});


const router = createBrowserRouter([
  {
    path: "/",
    loader: siteLoader,
    element: <RecoilRoot><ChakraProvider theme={theme}><SiteHeader /></ChakraProvider></RecoilRoot>,
    children: [
      {
        path: "/",
        loader: caroselLoader,
        element: (<RecoilRoot>
        <DarkmodeController>
          <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            <Home />
          </MathJaxContext>
        </DarkmodeController>
      </RecoilRoot>),
      },
      {
        path: "community",
        loader: caroselLoader,
        element: <Community />,
      },
      {
        path: "portfolio/:courseId",
        loader: portfolioLoader,
        action: portfolioAction,
        element: (<ChakraProvider theme={theme}>
          <Portfolio />
        </ChakraProvider>),
      },
     
    ]
  },
  {
    path: "portfolio/:courseId/public",
    loader: publicPortfolioLoader,
    element: (<ChakraProvider theme={theme}>
      <PublicPortfolio />
    </ChakraProvider>),
  },
  {
    path: "/portfolio/:doenetId/viewer",
    loader: portfolioActivityViewerLoader,
    // action: portfolioActivitySettingsAction,
    element: (<RecoilRoot>
      <DarkmodeController>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <ChakraProvider theme={theme}>
          <PortfolioActivityViewer />
          </ChakraProvider>
        </MathJaxContext>
      </DarkmodeController>
</RecoilRoot>),
  },
  {
    path: "/portfolio/:doenetId/settings",
    loader: portfolioActivitySettingsLoader,
    action: portfolioActivitySettingsAction,
    ErrorBoundary: portfolioActivitySettingsError,
    element: <RecoilRoot><PortfolioActivitySettings /></RecoilRoot>,
  },
  {
    path: "/portfolioeditor",
    loader: portfolioEditorMenuCapLoader,
    // errorElement: <div>Error!</div>,
    element: (<RecoilRoot>
            <DarkmodeController>
              <MathJaxContext
                version={2}
                config={mathjaxConfig}
                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
              >
                <ToolRoot />
              </MathJaxContext>
            </DarkmodeController>
    </RecoilRoot>),
  },
  {
    path: "*",
    // errorElement: <div>Error!</div>,
    element: (<RecoilRoot>
            <DarkmodeController>
              <MathJaxContext
                version={2}
                config={mathjaxConfig}
                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
              >
                <ToolRoot />
              </MathJaxContext>
            </DarkmodeController>
    </RecoilRoot>),
  },

]);

const root = createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
