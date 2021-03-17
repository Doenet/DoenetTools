import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  // Switch,
  Route,
} from "react-router-dom";
// import {
//   DropTargetsProvider,
// } from '../imports/DropTarget';
// import { 
//   BreadcrumbProvider 
// } from '../imports/Breadcrumb';
import {
  RecoilRoot,
} from 'recoil';

// eslint-disable-next-line import/no-unresolved
import  DoenetDateTime from "../Tools/DoenetDateTime";

    ReactDOM.render(
      <RecoilRoot>
        <Router >
          <Route path="/" render={()=>
            <DoenetDateTime  onDateChange = {(date) => console.log(date)} /> }/>
        </Router>
      </RecoilRoot>
  ,document.getElementById('root'));
