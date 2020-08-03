import React from 'react';
import ReactDOM from 'react-dom';
import DoenetCourse from '../Tools/DoenetCourse';
import { initialize } from '../imports/courseInfo';

initialize();

    ReactDOM.render(
      <DoenetCourse/>
  ,document.getElementById('root'));
