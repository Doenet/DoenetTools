import React from 'react';
import ReactDOM from 'react-dom';

import DoenetChooser from '../Tools/DoenetChooser';
import { CookiesProvider } from 'react-cookie';

import { initialize } from '../imports/courseInfo';
initialize();

    ReactDOM.render(
      <CookiesProvider>
        <DoenetChooser/>
      </CookiesProvider>
  ,document.getElementById('root'));
