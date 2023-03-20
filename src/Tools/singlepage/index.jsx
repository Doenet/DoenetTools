
import React from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil';
import { createRoot } from "react-dom/client";


import ToolRoot from '../_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math';
import DarkmodeController from '../_framework/DarkmodeController';
import Community from "../_framework/Paths/Community";
import {loader as siteLoader, SiteHeader} from "../_framework/Paths/SiteHeader";
import {loader as caroselLoader, Home} from "../_framework/Paths/Home";
import {loader as portfolioActivitySettingsLoader, action as portfolioActivitySettingsAction, PortfolioActivitySettings} from "../_framework/Paths/PortfolioActivitySettings";
import {loader as portfolioLoader, action as portfolioAction, Portfolio } from "../_framework/Paths/Portfolio";

const router = createBrowserRouter([
  {
    path: "/",
    loader: siteLoader,
    element: <SiteHeader />,
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
        element: <Portfolio />,
      },
     
    ]
  },
  {
    path: "/portfolio/:doenetId/settings",
    loader: portfolioActivitySettingsLoader,
    action: portfolioActivitySettingsAction,
    element: <PortfolioActivitySettings />,
  },
  {
    path: "*",
    errorElement: <div>Error!</div>,
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
