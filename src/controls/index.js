import React from 'react';
import ReactDOM from 'react-dom';

import DoenetControls from '../Tools/DoenetControls';

import { initialize } from '../imports/courseInfo';
initialize();

    ReactDOM.render(
      <DoenetControls/>
  ,document.getElementById('root'));