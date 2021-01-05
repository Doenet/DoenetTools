import React from 'react';
import ReactDOM from 'react-dom';
import DoenetDashboard from '../Tools/DoenetDashboard';
import { initialize } from '../imports/courseInfo';

initialize();

    ReactDOM.render(
      <DoenetDashboard/>
  ,document.getElementById('root'));
