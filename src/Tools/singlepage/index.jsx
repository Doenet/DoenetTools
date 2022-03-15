import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from '../_framework/NewToolRoot';


ReactDOM.render(
  <RecoilRoot>
    <Router>
      <ToolRoot />
    </Router>
  </RecoilRoot>,
  document.getElementById('root'),
);
