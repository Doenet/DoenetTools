import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";

import ToolRoot from "../_framework/NewToolRoot";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "doenetml";
import DarkmodeController from "../_framework/DarkmodeController";

const root = createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <DarkmodeController>
              <MathJaxContext
                version={2}
                config={mathjaxConfig}
                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
              >
                <ToolRoot />
              </MathJaxContext>
            </DarkmodeController>
          }
        />
      </Routes>
    </Router>
  </RecoilRoot>,
);
