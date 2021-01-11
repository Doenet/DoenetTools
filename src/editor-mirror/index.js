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

import DoenetEditor from "../Tools/DoenetEditor-Mirror";

{/* <Router >
            <Switch>
              <Route path="/" render={(routeprops)=>
                {return <DoenetEditor route={{...routeprops}} />}} />
            </Switch>
          </Router> */}

    ReactDOM.render(
        <RecoilRoot>
          <DoenetEditor/>
        </RecoilRoot>
  ,document.getElementById('root'));
