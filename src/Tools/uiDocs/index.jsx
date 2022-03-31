import { MathJaxContext } from 'better-react-mathjax';
import React from 'react';
import ReactDOM from 'react-dom';
import { mathjaxConfig } from '../../Core/utils/math.js';

import UIDocs from './uiDocs.jsx';

// import { initialize } from '../imports/courseInfo';
// initialize();

ReactDOM.render(
  <MathJaxContext
    version={2}
    config={mathjaxConfig}
    onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
  >
    <UIDocs />
  </MathJaxContext>
  , document.getElementById('root')); 