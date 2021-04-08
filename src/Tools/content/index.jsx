import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// import { DropTargetsProvider } from "../imports/DropTarget";
// import { BreadcrumbProvider } from "../imports/Breadcrumb";
import { RecoilRoot } from 'recoil';

import DoenetContent from './DoenetContent';
import ToolRoot from '../_framework/ToolRoot';

ReactDOM.render(
  // <DropTargetsProvider>
  // <BreadcrumbProvider>
  <RecoilRoot>
    <Router>
      <Switch>
        <Route
          path="/"
          render={(routeprops) => (
            <ToolRoot
              route={{ ...routeprops }}
              tool={<DoenetContent key={'BaseTool'} />}
            />
          )}
        />
      </Switch>
    </Router>
  </RecoilRoot>,
  // </BreadcrumbProvider>
  // </DropTargetsProvider>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}