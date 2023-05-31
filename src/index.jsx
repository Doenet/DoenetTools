import React from "react";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";

import ToolRoot from "./Tools/_framework/NewToolRoot";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "./Core/utils/math";
// import DarkmodeController from "./Tools/_framework/DarkmodeController";
import {
  loader as communityLoader,
  action as communityAction,
  Community,
} from "./Tools/_framework/Paths/Community";
import { loader as adminLoader, Admin } from "./Tools/_framework/Paths/Admin";
import {
  loader as siteLoader,
  SiteHeader,
} from "./Tools/_framework/Paths/SiteHeader";
import { loader as caroselLoader, Home } from "./Tools/_framework/Paths/Home";

import {
  loader as portfolioLoader,
  action as portfolioAction,
  Portfolio,
} from "./Tools/_framework/Paths/Portfolio";
import {
  loader as publicPortfolioLoader,
  PublicPortfolio,
} from "./Tools/_framework/Paths/PublicPortfolio";
import {
  loader as portfolioActivityViewerLoader,
  action as portfolioActivityViewerAction,
  PortfolioActivityViewer,
} from "./Tools/_framework/Paths/PortfolioActivityViewer";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  action as editorSupportPanelAction,
  loader as editorSupportPanelLoader,
} from "./Tools/_framework/Panels/NewSupportPanel";
import ErrorPage from "./Tools/_framework/Paths/ErrorPage";

import "@fontsource/jost";
import {
  PortfolioActivityEditor,
  loader as portfolioEditorLoader,
  action as portfolioEditorAction,
} from "./Tools/_framework/Paths/PortfolioActivityEditor";
import {
  PublicEditor,
  loader as publicEditorLoader,
  action as publicEditorAction,
} from "./Tools/_framework/Paths/PublicEditor";
// import { loader as portfolioEditorMenuCapLoader } from './Tools/_framework/MenuPanelCaps/PortfolioEditorInfoCap';

const theme = extendTheme({
  fonts: {
    body: "Jost",
  },
  textStyles: {
    primary: {
      fontFamily: "Jost",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
    // initialColorMode: "system",
    // useSystemColorMode: true,
  },
  colors: {
    doenet: {
      mainBlue: "#1a5a99",
      lightBlue: "#b8d2ea",
      solidLightBlue: "#8fb8de",
      mainGray: "#e3e3e3",
      mediumGray: "#949494",
      lightGray: "#e7e7e7",
      donutBody: "#eea177",
      donutTopping: "#6d4445",
      mainRed: "#c1292e",
      lightRed: "#eab8b8",
      mainGreen: "#459152",
      canvas: "#ffffff",
      canvastext: "#000000",
      lightGreen: "#a6f19f",
      lightYellow: "#f5ed85",
      whiteBlankLink: "#6d4445",
      mainYellow: "#94610a",
      mainPurple: "#4a03d9",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        letterSpacing: ".5px",
        _focus: {
          outline: "2px solid #2D5994",
          outlineOffset: "2px",
        },
        _disabled: {
          bg: "#E2E2E2",
          color: "black",
          pointerEvents: "none",
        },
      },
      variants: {
        // We can override existing variants
        solid: {
          bg: "doenet.mainBlue",
          color: "white",
          _hover: {
            bg: "doenet.solidLightBlue",
            color: "black",
          },
        },
        outline: {
          borderColor: "#2D5994",
          _hover: {
            bg: "doenet.solidLightBlue",
          },
        },
        ghost: {
          _hover: {
            bg: "doenet.solidLightBlue",
          },
        },
        link: {
          color: "doenet.mainBlue",
        },
      },
    },
  },
});

export default theme;

const router = createBrowserRouter([
  {
    path: "/",
    loader: siteLoader,
    element: (
      <>
        <ChakraProvider theme={theme}>
          <SiteHeader />
        </ChakraProvider>
      </>
    ),
    children: [
      {
        path: "/",
        loader: caroselLoader,
        element: (
          // <DarkmodeController>
          <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            {/* <ChakraProvider theme={theme}> */}
            <Home />
            {/* </ChakraProvider> */}
          </MathJaxContext>
          // </DarkmodeController>
        ),
      },
      {
        path: "community",
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
        path: "admin",
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
        path: "portfolio/:courseId",
        loader: portfolioLoader,
        action: portfolioAction,
        element: (
          <ChakraProvider theme={theme}>
            <Portfolio />
          </ChakraProvider>
        ),
      },
      {
        path: "publicportfolio/:courseId",
        loader: publicPortfolioLoader,
        element: (
          <ChakraProvider theme={theme}>
            <PublicPortfolio />
          </ChakraProvider>
        ),
      },
      {
        path: "portfolioviewer/:doenetId",
        loader: portfolioActivityViewerLoader,
        action: portfolioActivityViewerAction,
        element: (
          // <DarkmodeController>
          <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            <ChakraProvider theme={theme}>
              <PortfolioActivityViewer />
            </ChakraProvider>
          </MathJaxContext>
          // </DarkmodeController>
        ),
      },
      {
        path: "portfolioeditor/:doenetId",
        loader: async ({ params }) => {
          //This leaves a location in history
          //this is because redirect creates a standard Response object and
          //Response objects has no way to set replace: true

          //Redirect as an activity can have no pageids
          return redirect(`/portfolioeditor/${params.doenetId}/_`);
        },
        element: <div>Loading...</div>,
      },
      {
        path: "portfolioeditor/:doenetId/:pageId",
        loader: portfolioEditorLoader,
        action: portfolioEditorAction,
        // errorElement: <div>Error!</div>,
        element: (
          <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            <PortfolioActivityEditor />
            {/* <ToolRoot /> */}
          </MathJaxContext>
        ),
      },
      {
        path: "publiceditor/:doenetId",
        loader: async ({ params }) => {
          //This leaves a location in history
          //this is because redirect creates a standard Response object and
          //Response objects has no way to set replace: true

          //Redirect as an activity can have no pageids
          return redirect(`/publiceditor/${params.doenetId}/_`);
        },
        element: <div>Loading...</div>,
      },
      {
        path: "publiceditor/:doenetId/:pageId",
        loader: publicEditorLoader,
        action: publicEditorAction,
        // errorElement: <div>Error!</div>,
        element: (
          <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            <PublicEditor />
            {/* <ToolRoot /> */}
          </MathJaxContext>
        ),
      },
    ],
  },
  {
    path: "public",
    loader: editorSupportPanelLoader,
    action: editorSupportPanelAction,
    // errorElement: <div>Error!</div>,
    element: (
      <MathJaxContext
        version={2}
        config={mathjaxConfig}
        onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
      >
        <ToolRoot />
      </MathJaxContext>
    ),
  },
  // {
  //   path: "*",
  //   // errorElement: <div>Error!</div>,
  //   element: (
  //     <MathJaxContext
  //       version={2}
  //       config={mathjaxConfig}
  //       onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
  //     >
  //       <ToolRoot />
  //     </MathJaxContext>
  //   ),
  //   // TODO - probably not a good idea long term, this is to populate the site header
  //   // on the 404 page, but this results in extra network requests when loading
  //   // ToolRoot content
  //   loader: siteLoader,
  //   errorElement: (
  //     <ChakraProvider theme={theme}>
  //       <SiteHeader childComponent={<ErrorPage />} />
  //     </ChakraProvider>
  //   ),
  // },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}

    <RouterProvider router={router} />
  </RecoilRoot>,
);
