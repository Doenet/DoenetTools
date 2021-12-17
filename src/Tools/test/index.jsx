import React from 'react';
import ReactDOM from 'react-dom';
import DoenetTest from './DoenetTest.jsx';
import {RecoilRoot} from 'recoil';

ReactDOM.render(
  <RecoilRoot>
    <DoenetTest />
  </RecoilRoot>,
  document.getElementById('root'),
);