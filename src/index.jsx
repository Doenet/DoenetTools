import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';

import ToolRoot from './Tools/_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from './Core/utils/math';
import DarkmodeController from './Tools/_framework/DarkmodeController';
import {
  loader as communityLoader,
  Community,
} from './Tools/_framework/Paths/Community';
import {
  loader as siteLoader,
  SiteHeader,
} from './Tools/_framework/Paths/SiteHeader';
import { loader as caroselLoader, Home } from './Tools/_framework/Paths/Home';
import {
  loader as portfolioActivitySettingsLoader,
  action as portfolioActivitySettingsAction,
  ErrorBoundry as portfolioActivitySettingsError,
  PortfolioActivitySettings,
} from './Tools/_framework/Paths/PortfolioActivitySettings';
import {
  loader as portfolioLoader,
  action as portfolioAction,
  Portfolio,
} from './Tools/_framework/Paths/Portfolio';
import { loader as portfolioEditorMenuCapLoader } from './Tools/_framework/MenuPanelCaps/PortfilioEditorInfoCap';
import {
  loader as publicPortfolioLoader,
  PublicPortfolio,
} from './Tools/_framework/Paths/PublicPortfolio';
import {
  loader as portfolioActivityViewerLoader,
  action as portfolioActivityViewerAction,
  PortfolioActivityViewer,
} from './Tools/_framework/Paths/PortfolioActivityViewer';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
  action as editorSupportPanelAction,
  loader as editorSupportPanelLoader,
} from './Tools/_framework/Panels/NewSupportPanel';

import '@fontsource/jost';

const theme = extendTheme({
  fonts: {
    body: 'Jost',
  },
  textStyles: {
    primary: {
      fontFamily: 'Jost',
    },
  },
  colors: {
    doenet: {
      mainBlue: '#1a5a99',
      lightBlue: '#b8d2ea',
      solidLightBlue: '#8fb8de',
      mainGrey: '#e3e3e3',
      donutBody: '#eea177',
      donutTopping: '#6d4445',
      mainRed: '#c1292e',
      lightRed: '#eab8b8',
      mainGreen: '#459152',
      canvas: '#ffffff',
      canvastext: '#000000',
      lightGreen: '#a6f19f',
      lightYellow: '#f5ed85',
      whiteBlankLink: '#6d4445',
      mainYellow: '#94610a',
      mainPurple: '#4a03d9',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        letterSpacing: '.5px',
        _focus: {
          outline: '2px solid #2D5994',
          outlineOffset: '2px',
        },
        _disabled: {
          bg: '#E2E2E2',
          color: 'black',
        },
      },
      variants: {
        // We can override existing variants
        solid: {
          bg: 'doenet.mainBlue',
          color: 'white',
          _hover: {
            bg: 'doenet.solidLightBlue',
            color: 'black',
            // _disabled: { bg: "doenet.mainGrey"}
          },
        },
        outline: {
          borderColor: '#2D5994',
          _hover: {
            bg: 'solidLightBlue',
            // _disabled: { bg: "#E2E2E2" }
          },
        },
        ghost: {
          _hover: {
            bg: 'solidLightBlue',
            // _disabled: { bg: "#E2E2E2" }
          },
        },
        link: {
          color: 'solidLightBlue',
          // _disabled: { bg: "white" }
        },
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    loader: siteLoader,
    element: (
      <ChakraProvider theme={theme}>
        <SiteHeader />
      </ChakraProvider>
    ),
    children: [
      {
        path: '/',
        loader: caroselLoader,
        element: (
          <DarkmodeController>
            <MathJaxContext
              version={2}
              config={mathjaxConfig}
              onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
            >
              <ChakraProvider theme={theme}>
                <Home />
              </ChakraProvider>
            </MathJaxContext>
          </DarkmodeController>
        ),
      },
      {
        path: 'community',
        loader: communityLoader,
        // action: communitySearchAction,
        element: (
          <ChakraProvider theme={theme}>
            <Community />
          </ChakraProvider>
        ),
      },
      {
        path: 'portfolio/:courseId',
        loader: portfolioLoader,
        action: portfolioAction,
        element: (
          <ChakraProvider theme={theme}>
            <Portfolio />
          </ChakraProvider>
        ),
      },
      {
        path: 'publicportfolio/:courseId',
        loader: publicPortfolioLoader,
        element: (
          <ChakraProvider theme={theme}>
            <PublicPortfolio />
          </ChakraProvider>
        ),
      },
      {
        path: '/portfolioviewer/:doenetId',
        loader: portfolioActivityViewerLoader,
        action: portfolioActivityViewerAction,
        element: (
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
        ),
      },
    ],
  },

  {
    path: '/portfolio/:doenetId/settings',
    loader: portfolioActivitySettingsLoader,
    action: portfolioActivitySettingsAction,
    ErrorBoundary: portfolioActivitySettingsError,
    element: (
      <ChakraProvider theme={theme}>
        <PortfolioActivitySettings />
      </ChakraProvider>
    ),
  },
  {
    path: '/portfolioeditor/:doenetId',
    loader: portfolioEditorMenuCapLoader,
    // action: portfolioEditorSupportPanelAction,
    // errorElement: <div>Error!</div>,
    element: (
      <DarkmodeController>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <ToolRoot />
        </MathJaxContext>
      </DarkmodeController>
    ),
  },
  {
    path: '/public',
    loader: editorSupportPanelLoader,
    action: editorSupportPanelAction,
    // errorElement: <div>Error!</div>,
    element: (
      <DarkmodeController>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <ToolRoot />
        </MathJaxContext>
      </DarkmodeController>
    ),
  },
  {
    path: '*',
    // errorElement: <div>Error!</div>,
    element: (
      <DarkmodeController>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <ToolRoot />
        </MathJaxContext>
      </DarkmodeController>
    ),
  },
]);

const root = createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>,
);
