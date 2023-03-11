
import React from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from 'react-dom';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil';


import ToolRoot from '../_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math';
import DarkmodeController from '../_framework/DarkmodeController';
import SiteHeader from "../_framework/Paths/SiteHeader";
import Community from "../_framework/Paths/Community";
import Portfolio from "../_framework/Paths/Portfolio";
import {loader as caroselLoader, Home} from "../_framework/Paths/Home";
import PortfolioActivitySettings from "../_framework/Paths/PortfolioActivitySettings";

const router = createBrowserRouter([
  {
    path: "/",
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
        path: "portfolio",
        element: <Portfolio />,
      },
     
    ]
  },
  {
    path: "/portfolio/settings",
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

ReactDOM.render(<RouterProvider router={router} />,
  document.getElementById('root')
);