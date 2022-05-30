import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router';
import { RecoilRoot } from 'recoil';
import ToolRoot from '@ToolRoot';

import Chat from './Chat';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math';

ReactDOM.render(
  <RecoilRoot>
    <MathJaxContext
      version={2}
      config={mathjaxConfig}
      onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
    >
      <ToolRoot tool={<Chat key={'BaseTool'} />} />
    </MathJaxContext>
  </RecoilRoot>,
  document.getElementById('root'),
);
