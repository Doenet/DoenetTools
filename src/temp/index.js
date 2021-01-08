import React from 'react';
import ReactDOM from 'react-dom';

import DoenetTemp from '../Tools/DoenetTemp';

import { initialize } from '../imports/courseInfo';
import { RecoilRoot } from 'recoil';
initialize();

    ReactDOM.render(
      <RecoilRoot>     
         <DoenetTemp/>
      </RecoilRoot>
  ,document.getElementById('root'));
