
import React from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from 'react-dom';

import {
  createBrowserRouter,
  // BrowserRouter as Router,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { RecoilRoot } from 'recoil';
import HomePage from "../_framework/Pages/HomePage";
import CommunityPage from "../_framework/Pages/CommunityPage";
import PortfolioPage from "../_framework/Pages/PortfolioPage";
import PortfolioAddActivityPage from "../_framework/Pages/PortfolioAddActivityPage";

import ToolRoot from '../_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math';
import DarkmodeController from '../_framework/DarkmodeController';
import SiteHeader from "../_framework/Paths/SiteHeader";
import Community from "../_framework/Paths/Community";
import Portfolio from "../_framework/Paths/Portfolio";
import Home from "../_framework/Paths/Home";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
{/* <div>
<h1>Home</h1>
<div style={{display:"flex", flexDirection:"column"}}>

<Link to="profile">profile</Link>
<Link to="homepanel">homepanel</Link>
<Link to="community">community</Link>
<Link to="course">course</Link>
<Link to="other2">other2</Link>
</div>
</div> */}
//Future Routes:
// doenet.org/ REDIRECT TO HOME
// doenet.org/public/home  
// doenet.org/public/community
// doenet.org/public/portfolio
// doenet.org/*
// Subpath so loader is directly on the carousel subpath.  
//The rest of the page works, just not that part.

const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteHeader />,
    children: [
      {
        index:true,
        element:<Home />,

      },
      {
        children: [ {
        path: "community",
        element: <Community />
      },
      {
        path: "portfolio",
        element: <Portfolio />
      },
    ],
      }
      
    ]
  },
  // {
  //   path: "/",
  //   loader: async ({request}) => {
  //     const resp = await fetch('/api/getHPCarouselData.php',{signal: request.signal});
  //     const dataArray = await resp.json();
  //     return dataArray;
  //   },
  //   element: (<RecoilRoot>
  //     <DarkmodeController>
  //       <MathJaxContext
  //         version={2}
  //         config={mathjaxConfig}
  //         onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
  //       >
  //         <HomePage />
  //       </MathJaxContext>
  //     </DarkmodeController>
  // </RecoilRoot>
  //   ),
  // },
  // {
  //   path: "community",
  //   loader: async ({request}) => {
  //     const resp = await fetch('/api/getHPCarouselData.php',{signal: request.signal});
  //     const dataArray = await resp.json();
  //     return dataArray;
  //   },
  //   element: (<RecoilRoot>
  //     <DarkmodeController>
  //       <MathJaxContext
  //         version={2}
  //         config={mathjaxConfig}
  //         onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
  //       >
  //         <CommunityPage />
  //       </MathJaxContext>
  //     </DarkmodeController>
  // </RecoilRoot>
  //   ),
  // },
  // {
  //   path: "portfolio",
  //   element: <PortfolioPage />,
  // },
  // {
  //   path: "portfolio/addActivity",
  //   element: <PortfolioAddActivityPage />,
  // },
  // {
  //   path: "portfolio/addActivity/submitAddActivity",
  //   element: <div>Submitting!</div>,
  // },
  {
    path: "*",
    errorElement: <div>Error!</div>,
    element: <RecoilRoot>
            <DarkmodeController>
              <MathJaxContext
                version={2}
                config={mathjaxConfig}
                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
              >
                <ToolRoot />
              </MathJaxContext>
            </DarkmodeController>
    </RecoilRoot>,
  },
]);

ReactDOM.render(<RouterProvider router={router} />,
  document.getElementById('root')
);

// createRoot(document.getElementById("root")).render(
//   <RouterProvider router={router} />
// );

// import React, { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
// import { RecoilRoot } from 'recoil';

// import ToolRoot from '../_framework/NewToolRoot';
// import { MathJaxContext } from 'better-react-mathjax';
// import { mathjaxConfig } from '../../Core/utils/math';
// import DarkmodeController from '../_framework/DarkmodeController';

// ReactDOM.render(
//   <RecoilRoot>
//     <Router>
//       <Routes>
//         <Route
//           path="*"
//           element={
//             <DarkmodeController>
//               <MathJaxContext
//                 version={2}
//                 config={mathjaxConfig}
//                 onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
//               >
//                 <ToolRoot />
//               </MathJaxContext>
//             </DarkmodeController>
//           }
//         />
//       </Routes>
//     </Router>
//   </RecoilRoot>,
//   document.getElementById('root'),
// );
