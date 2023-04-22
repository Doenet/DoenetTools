import React from 'react';

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';

import ToolRoot from './Tools/_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from './Core/utils/math';
import DarkmodeController from './Tools/_framework/DarkmodeController';
import {
  loader as communityLoader,
  action as communityAction,
  Community,
} from './Tools/_framework/Paths/Community';
import { loader as adminLoader, Admin } from './Tools/_framework/Paths/Admin';
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
import {
  PortfolioActivityEditor,
  loader as portfolioEditorLoader,
} from './Tools/_framework/Paths/PortfolioActivityEditor';
// import { loader as portfolioEditorMenuCapLoader } from './Tools/_framework/MenuPanelCaps/PortfolioEditorInfoCap';

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
      mainGray: '#e3e3e3',
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
          cursor: 'none',
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
          },
        },
        outline: {
          borderColor: '#2D5994',
          _hover: {
            bg: 'solidLightBlue',
          },
        },
        ghost: {
          _hover: {
            bg: 'solidLightBlue',
          },
        },
        link: {
          color: 'solidLightBlue',
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
        action: communityAction,
        // action: communitySearchAction,
        element: (
          <ChakraProvider theme={theme}>
            <Community />
          </ChakraProvider>
        ),
      },
      {
        path: 'admin',
        loader: adminLoader,
        // sharing an action with the community page is somewhat intentional
        // as it shows cards and admins have the same actions that they can perform
        // on cards as they can on the community page
        // TODO - determine if this is an okay way to share functionality across
        // pages or a bad idea
        action: communityAction,
        element: (
          <ChakraProvider theme={theme}>
            <Admin />
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
        path: 'portfolioviewer/:doenetId',
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
      {
        path: 'portfolioeditor/:doenetId',
        loader: async ({ params }) => {
          //Redirect as an activity can have no pageids
          return redirect(`/portfolioeditor/${params.doenetId}/noPageId/`);
        },
        element: <div>Loading...</div>,
      },
      {
        path: 'portfolioeditor/:doenetId/:pageId',
        loader: portfolioEditorLoader,
        // action: portfolioEditorSupportPanelAction,
        // errorElement: <div>Error!</div>,
        element: (
          <DarkmodeController>
            <MathJaxContext
              version={2}
              config={mathjaxConfig}
              onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
            >
              <PortfolioActivityEditor />
              {/* <ToolRoot /> */}
            </MathJaxContext>
          </DarkmodeController>
        ),
      },
    ],
  },

  {
    path: 'portfolio/:doenetId/settings',
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
    path: 'public',
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
