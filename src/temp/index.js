import React from 'react';
import ReactDOM from 'react-dom';
import DoenetTool from '../Tools/DoenetTemp';
import { initialize } from '../imports/courseInfo';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {
  RecoilRoot
} from 'recoil';
import {
  DropTargetsProvider,
} from '../imports/DropTarget';

initialize();

    ReactDOM.render(
      <RecoilRoot>     
        <Router>
              <Switch>
                <Route path="/" render={(routeprops) => 
                <DoenetTool route={{ ...routeprops }}  />
                }></Route>
              </Switch> 
         </Router>
      </RecoilRoot>
  ,document.getElementById('root'));
