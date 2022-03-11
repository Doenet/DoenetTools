import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from '../_framework/NewToolRoot';
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from '../../Core/utils/math';


ReactDOM.render(
  <RecoilRoot>
    <Router>
      <MathJaxContext
        version={2}
        config={mathjaxConfig}
        onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
      >
        <ToolRoot />
      </MathJaxContext>
    </Router>
  </RecoilRoot>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
