import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router';
import { RecoilRoot } from 'recoil';
import ToolRoot from '@ToolRoot';

import Chat from './Chat';

ReactDOM.render(
  <RecoilRoot>
    <ToolRoot tool={<Chat key={'BaseTool'} />} />
  </RecoilRoot>,
  document.getElementById('root'),
);
