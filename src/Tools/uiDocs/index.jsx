import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import { createRoot } from "react-dom/client";
import { mathjaxConfig } from "doenetml";

import UIDocs from "./uiDocs.jsx";

// import { initialize } from '../imports/courseInfo';
// initialize();

const root = createRoot(document.getElementById("root"));
root.render(
  <MathJaxContext
    version={2}
    config={mathjaxConfig}
    onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
  >
    <UIDocs />
  </MathJaxContext>,
);
