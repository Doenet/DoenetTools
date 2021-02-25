
import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {
  DropTargetsProvider,
} from '../imports/DropTarget';
import { 
  BreadcrumbProvider 
} from '../imports/Breadcrumb';
import {
  RecoilRoot,
} from 'recoil';

import  DoenetDateTime from "../Tools/DoenetDateTime";
import App from '../Tools/DoenetTemp';

    ReactDOM.render(
      <DropTargetsProvider>
        <BreadcrumbProvider>
          <RecoilRoot>
            <Router >
              <Route path="/" render={()=>
              <App />
                // <DoenetDateTime  onDateChange = {(date) => console.log(date)} /> 
                }/>
            </Router>
          </RecoilRoot>
        </BreadcrumbProvider>
      </DropTargetsProvider>
  ,document.getElementById('root'));

