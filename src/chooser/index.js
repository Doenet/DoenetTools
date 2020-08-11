import React from 'react';
import ReactDOM from 'react-dom';

import DoenetChooser from '../Tools/DoenetChooser';
import ChooserManager from '../Tools/chooser/ChooserManager';
import { initialize } from '../imports/courseInfo';

initialize();
    ReactDOM.render(
      <DoenetChooser/>
      // <ChooserManager/>
  ,document.getElementById('root'));
