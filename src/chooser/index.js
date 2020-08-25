import React from 'react';
import ReactDOM from 'react-dom';

import DoenetChooser from '../Tools/DoenetChooser';
import { initialize } from '../imports/courseInfo';
import { CookiesProvider } from 'react-cookie';

initialize();
    ReactDOM.render(
      <CookiesProvider>
        <DoenetChooser/>
      </CookiesProvider>
  ,document.getElementById('root'));
