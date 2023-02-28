
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
import HomePage from "../_framework/ToolPanels/HomePage";

import ToolRoot from '../_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math';
import DarkmodeController from '../_framework/DarkmodeController';
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
const router = createBrowserRouter([
  {
    path: "/",
    loader: async ({request}) => {
      const resp = await fetch('/api/getHPCarouselData.php',{signal: request.signal});
      const dataArray = await resp.json();
      return dataArray;
    },
    element: (<RecoilRoot>
      <DarkmodeController>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <HomePage />
        </MathJaxContext>
      </DarkmodeController>
  </RecoilRoot>
     
    ),
  },
  {
    path: "community",
    element: <div>community</div>,
  },
  {
    path: "profile",
    element: <div>profile</div>,
  },
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
