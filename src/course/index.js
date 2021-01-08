import React from 'react';
import ReactDOM from 'react-dom';
import DoenetCourse from '../Tools/DoenetCourse';
import { initialize } from '../imports/courseInfo';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {
  RecoilRoot
} from 'recoil';

initialize();

    ReactDOM.render(
      <RecoilRoot>
        <Router>
              <Switch>
                <Route path="/" render={(routeprops) => 
                <DoenetCourse route={{ ...routeprops }}  />
                }></Route>
              </Switch> 
         </Router>
      </RecoilRoot>

           
     
  ,document.getElementById('root'));
