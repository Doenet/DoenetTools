import React from 'react';
import ReactDOM from 'react-dom';
import RecoilRoot from 'recoil';

import DoenetEditor from "../Tools/DoenetEditor-Mirror";

    ReactDOM.render(
      <RecoilRoot>
        <DoenetEditor/>
      </RecoilRoot>
  ,document.getElementById('root'));
