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

import DoenetExampleTool from '../Tools/DoenetExampleTool';

  //   ReactDOM.render(
  //     <DropTargetsProvider>
  //       <BreadcrumbProvider>
  //         <RecoilRoot>
  //           <Router >
  //             <Switch>
  //               <Route path="/" render={(routeprops)=>
  //                 <DoenetExampleTool route={{...routeprops}} />} />
  //             </Switch>
  //           </Router>
  //         </RecoilRoot>
  //       </BreadcrumbProvider>
  //     </DropTargetsProvider>
  // ,document.getElementById('root'));

  ReactDOM.render(
  <RecoilRoot>
    <DoenetExampleTool />
  </RecoilRoot>
  ,document.getElementById('root'));
