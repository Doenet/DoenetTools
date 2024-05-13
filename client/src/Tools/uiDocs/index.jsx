import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import { createRoot } from "react-dom/client";

import UIDocs from "./uiDocs.jsx";
import { mathjaxConfig } from "@doenet/doenetml";

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
