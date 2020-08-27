import React from 'react';
import ReactDOM from 'react-dom';

import DoenetTemp from '../Tools/DoenetTemp';

import { initialize } from '../imports/courseInfo';
initialize();

    ReactDOM.render(
      <DoenetTemp/>
  ,document.getElementById('root'));
