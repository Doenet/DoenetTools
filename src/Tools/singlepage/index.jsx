import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from '../_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math';

ReactDOM.render(
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <MathJaxContext
              version={2}
              config={mathjaxConfig}
              onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
            >
              <ToolRoot />
            </MathJaxContext>
          }
        />
      </Routes>
    </Router>
  </RecoilRoot>,
  document.getElementById('root'),
);
